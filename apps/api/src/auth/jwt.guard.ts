import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import type { Request } from "express";

export interface AuthRequest extends Request {
  userId: string;
}

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<AuthRequest>();
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      throw new UnauthorizedException("token ausente");
    }
    try {
      const payload = await this.jwt.verifyAsync<{ sub: string }>(
        header.slice(7),
      );
      req.userId = payload.sub;
      return true;
    } catch {
      throw new UnauthorizedException("token inválido ou expirado");
    }
  }
}
