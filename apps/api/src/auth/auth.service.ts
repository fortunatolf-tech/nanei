import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as argon2 from "argon2";
import { createHash, randomBytes, randomUUID } from "node:crypto";
import type { Request } from "express";
import { AuditService } from "../audit.service";
import { PrismaService } from "../prisma.service";
import type { LoginDto, RegisterDto } from "./auth.dto";

const ACCESS_TTL = "15m"; // RNF-06
const REFRESH_TTL_DIAS = 30;
const VERSAO_POLITICA = "2026-07-23";
const CATEGORIA_OBRIGATORIA = "dados_bebe";

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly audit: AuditService,
  ) {}

  async register(dto: RegisterDto, req: Request): Promise<Tokens> {
    // Regra do fluxo F1: sem consentimento "dados_bebe" o cadastro não prossegue
    if (!dto.consentimentos.includes(CATEGORIA_OBRIGATORIA)) {
      throw new BadRequestException(
        `consentimento da categoria "${CATEGORIA_OBRIGATORIA}" é obrigatório`,
      );
    }
    const existente = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existente) throw new BadRequestException("e-mail já cadastrado");

    const senhaHash = await argon2.hash(dto.senha, { type: argon2.argon2id });

    const user = await this.prisma.$transaction(async (tx) => {
      const u = await tx.user.create({
        data: { email: dto.email, senhaHash },
      });
      const family = await tx.family.create({
        data: {
          nome: "Minha família",
          membros: { create: { userId: u.id, papel: "admin" } },
        },
      });
      await tx.consent.createMany({
        data: dto.consentimentos.map((categoria) => ({
          userId: u.id,
          categoria,
          finalidade: "uso do aplicativo Nanei",
          versaoPolitica: VERSAO_POLITICA,
        })),
      });
      if (dto.nomeBebe && dto.nascimentoBebe) {
        await tx.baby.create({
          data: {
            familyId: family.id,
            nome: dto.nomeBebe,
            nascimento: new Date(dto.nascimentoBebe),
          },
        });
      }
      return u;
    });

    await this.audit.log("register", "User", {
      entidadeId: user.id,
      userId: user.id,
      req,
    });
    return this.emitirTokens(user.id, randomUUID());
  }

  async login(dto: LoginDto, req: Request): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    const ok = user && (await argon2.verify(user.senhaHash, dto.senha));
    if (!ok) throw new UnauthorizedException("credenciais inválidas");

    await this.audit.log("login", "User", {
      entidadeId: user.id,
      userId: user.id,
      req,
    });
    return this.emitirTokens(user.id, randomUUID());
  }

  /**
   * Rotação de refresh token com detecção de reuso (RNF-06/§7.1):
   * reutilizar um token já rotacionado revoga a família inteira.
   */
  async refresh(refreshToken: string): Promise<Tokens> {
    const tokenHash = this.hash(refreshToken);
    const salvo = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
    });
    if (!salvo || salvo.revogado || salvo.expiraEm < new Date()) {
      throw new UnauthorizedException("refresh token inválido");
    }
    if (salvo.usadoEm) {
      await this.prisma.refreshToken.updateMany({
        where: { familia: salvo.familia },
        data: { revogado: true },
      });
      await this.audit.log("refresh_reuse_detected", "RefreshToken", {
        entidadeId: salvo.id,
        userId: salvo.userId,
      });
      throw new UnauthorizedException("reuso de token detectado");
    }
    await this.prisma.refreshToken.update({
      where: { id: salvo.id },
      data: { usadoEm: new Date() },
    });
    return this.emitirTokens(salvo.userId, salvo.familia);
  }

  private async emitirTokens(userId: string, familia: string): Promise<Tokens> {
    const accessToken = await this.jwt.signAsync(
      { sub: userId },
      { expiresIn: ACCESS_TTL },
    );
    const refreshToken = randomBytes(32).toString("base64url");
    await this.prisma.refreshToken.create({
      data: {
        userId,
        familia,
        tokenHash: this.hash(refreshToken),
        expiraEm: new Date(Date.now() + REFRESH_TTL_DIAS * 86_400_000),
      },
    });
    return { accessToken, refreshToken };
  }

  private hash(token: string): string {
    return createHash("sha256").update(token).digest("hex");
  }
}
