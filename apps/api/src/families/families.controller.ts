import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import type { Request } from "express";
import { JwtGuard, type AuthRequest } from "../auth/jwt.guard";
import { FamiliesService } from "./families.service";
import { CriarConviteDto } from "./families.dto";

@Controller("families")
@UseGuards(JwtGuard)
export class FamiliesController {
  constructor(private readonly families: FamiliesService) {}

  @Get(":familyId")
  resumo(
    @Req() req: AuthRequest,
    @Param("familyId", ParseUUIDPipe) familyId: string,
  ) {
    return this.families.resumo(req.userId, familyId);
  }

  @Post(":familyId/invites")
  criarConvite(
    @Req() req: AuthRequest,
    @Param("familyId", ParseUUIDPipe) familyId: string,
    @Body() dto: CriarConviteDto,
  ) {
    return this.families.criarConvite(req.userId, familyId, dto, req);
  }

  @Delete(":familyId/invites/:id")
  revogarConvite(
    @Req() req: AuthRequest,
    @Param("familyId", ParseUUIDPipe) familyId: string,
    @Param("id", ParseUUIDPipe) id: string,
  ) {
    return this.families.revogarConvite(req.userId, familyId, id, req);
  }
}

/** Rotas do fluxo de aceite (fora de /families para permitir preview público). */
@Controller("invites")
export class InvitesController {
  constructor(private readonly families: FamiliesService) {}

  /** Preview público — a tela de aceite mostra família e papel antes de logar. */
  @Get(":token")
  info(@Param("token") token: string) {
    return this.families.info(token);
  }

  @Post(":token/accept")
  @UseGuards(JwtGuard)
  aceitar(@Req() req: AuthRequest & Request, @Param("token") token: string) {
    return this.families.aceitar(req.userId, token, req);
  }
}
