import { Module } from "@nestjs/common";
import { HealthController } from "./health.controller";

/**
 * Módulo raiz. Os módulos de domínio (auth, families, tracking, ...) serão
 * registrados aqui a partir do S1, cada um importado do seu pacote em
 * /packages (propriedade por equipe — §8.1).
 */
@Module({
  controllers: [HealthController],
})
export class AppModule {}
