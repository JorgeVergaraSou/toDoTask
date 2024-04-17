import { Transform } from "class-transformer";
import { IsEmail, IsString, MinLength } from "class-validator";

export class RegisterDto {
  /** CLASS VALIDATOR INDICA COMO DEBE COMPORTARSE LA VARIABLE Y LO QUE DEBE RECIBIR */
 /** EL TRANSFORM RECIVE UNA FUNCION DE CALLBACK RECIVE EL VALOR Y LO REGRESA SIN ESPACIOS */
 
  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(5)
  name: string;

  @IsEmail()
  email: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(6)
  password: string;
}
 /* ESTE DTO SIRVE PARA ESTANDARIZAR LA INFO Y PODER REGISTRAR UN NUEVO USUARIO */