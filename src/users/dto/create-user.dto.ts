import { Transform } from "class-transformer";
import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";

export class CreateUserDto {

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

    @IsString()
    @IsOptional()
    resetPasswordToken?: string;

}
