import {
  ArrayNotEmpty,
  Equals,
  IsArray,
  IsBoolean,
  IsEmail,
  IsISO8601,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8, { message: "senha deve ter no mínimo 8 caracteres" })
  @MaxLength(128)
  senha!: string;

  /**
   * Consentimentos granulares aceitos no cadastro (RF-ACC-04, fluxo F1).
   * A categoria "dados_bebe" é obrigatória (LGPD art. 14 §1º).
   */
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  consentimentos!: string[];

  /** Aceite dos Termos de Uso (RF-ACC-09) — obrigatório no cadastro. */
  @IsBoolean()
  @Equals(true, { message: "é obrigatório aceitar os Termos de Uso" })
  aceiteTermos!: boolean;

  /** Aceite da Política de Privacidade (RF-ACC-08) — obrigatório. */
  @IsBoolean()
  @Equals(true, { message: "é obrigatório aceitar a Política de Privacidade" })
  aceitePolitica!: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  nomeBebe?: string;

  @IsOptional()
  @IsISO8601()
  nascimentoBebe?: string;
}

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  senha!: string;
}

export class RefreshDto {
  @IsString()
  refreshToken!: string;
}

/** Re-aceite de documentos legais atualizados (RF-ACC-08). */
export class AceiteLegalDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  documentos!: string[];
}
