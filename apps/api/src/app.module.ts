import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { readFileSync } from "node:fs";
import { HealthController } from "./health.controller";
import { PrismaService } from "./prisma.service";
import { AuditService } from "./audit.service";
import { AuthService } from "./auth/auth.service";
import { AuthController } from "./auth/auth.controller";
import { JwtGuard } from "./auth/jwt.guard";
import { BabiesService } from "./babies/babies.service";
import { BabiesController } from "./babies/babies.controller";
import { LegalService } from "./legal/legal.service";
import { LegalController } from "./legal/legal.controller";

/**
 * Módulo raiz. Os módulos de domínio migram para /packages conforme as
 * equipes assumem cada um (§8.1); na fase solo vivem aqui.
 */
@Module({
  imports: [
    JwtModule.register({
      global: true,
      privateKey: readFileSync(process.env.JWT_PRIVATE_KEY_PATH!, "utf8"),
      publicKey: readFileSync(process.env.JWT_PUBLIC_KEY_PATH!, "utf8"),
      signOptions: { algorithm: "RS256" }, // RNF-06
      verifyOptions: { algorithms: ["RS256"] },
    }),
  ],
  controllers: [
    HealthController,
    AuthController,
    BabiesController,
    LegalController,
  ],
  providers: [
    PrismaService,
    AuditService,
    AuthService,
    JwtGuard,
    BabiesService,
    LegalService,
  ],
})
export class AppModule {}
