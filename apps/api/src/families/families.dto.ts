import { IsEmail, IsEnum } from "class-validator";
import { Papel } from "@prisma/client";

/** Convite de cuidador (RF-FAM-02). O papel segue a matriz §7.3. */
export class CriarConviteDto {
  @IsEmail()
  email!: string;

  @IsEnum(Papel)
  papel!: Papel;
}
