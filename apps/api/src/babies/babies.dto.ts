import {
  IsIn,
  IsISO8601,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";

export class CreateBabyDto {
  @IsString()
  @MaxLength(80)
  nome!: string;

  @IsISO8601()
  nascimento!: string;

  @IsOptional()
  @IsISO8601()
  dataPrevistaParto?: string;

  @IsOptional()
  @IsIn(["F", "M"])
  sexo?: string;
}

export const TIPOS_EVENTO = [
  "mamada",
  "mamadeira",
  "solido",
  "bombeamento",
  "fralda",
  "sono",
  "banho",
  "medicamento",
  "vacina",
  "temperatura",
  "crescimento",
  "humor",
  "atividade",
  "nota",
] as const;

export class CreateEventDto {
  @IsIn(TIPOS_EVENTO as readonly string[])
  tipo!: (typeof TIPOS_EVENTO)[number];

  @IsISO8601()
  inicio!: string;

  @IsOptional()
  @IsISO8601()
  fim?: string;

  @IsObject()
  payload!: Record<string, unknown>;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  local?: string;
}

/** Edição de evento — registro retroativo / correção de data-hora (RF-TRK-14). */
export class UpdateEventDto {
  @IsOptional()
  @IsISO8601()
  inicio?: string;

  @IsOptional()
  @IsISO8601()
  fim?: string;

  @IsOptional()
  @IsObject()
  payload?: Record<string, unknown>;
}
