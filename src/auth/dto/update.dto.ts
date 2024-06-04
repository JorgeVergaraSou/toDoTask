import { Transform } from "class-transformer";
import { IsString, MinLength, IsEmail, IsOptional } from "class-validator";

export class UpdateDto {
    @Transform(({ value }) => value.trim())
    @IsString()
    @MinLength(5)
    @IsOptional()
    name: string;
  
    @IsEmail()
    @IsOptional()
    email: string;
  
    @Transform(({ value }) => value.trim())
    @IsString()
    @MinLength(6)
    @IsOptional()
    password: string;

    @IsString()
    @MinLength(10)
    @IsOptional()
    secretWord: string;
}
