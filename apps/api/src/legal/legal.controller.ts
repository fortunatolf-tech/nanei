import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { DOCUMENTOS_LEGAIS_LISTA } from "@nanei/legal";
import { AuthRequest, JwtGuard } from "../auth/jwt.guard";
import { AceiteLegalDto } from "../auth/auth.dto";
import { LegalService } from "./legal.service";

@Controller("legal")
export class LegalController {
  constructor(private readonly legal: LegalService) {}

  /** Documentos vigentes (público) — usado como fallback pela web. */
  @Get("documentos")
  documentos() {
    return DOCUMENTOS_LEGAIS_LISTA.map((d) => ({
      id: d.id,
      titulo: d.titulo,
      versao: d.versao,
    }));
  }

  /** Documentos pendentes de re-aceite para o usuário logado (RF-ACC-08). */
  @UseGuards(JwtGuard)
  @Get("status")
  async status(@Req() req: AuthRequest) {
    return { pendencias: await this.legal.pendencias(req.userId) };
  }

  /** Registra o aceite da versão vigente dos documentos informados. */
  @UseGuards(JwtGuard)
  @Post("aceite")
  async aceite(@Body() dto: AceiteLegalDto, @Req() req: AuthRequest) {
    return { pendencias: await this.legal.aceitar(req.userId, dto.documentos, req) };
  }
}
