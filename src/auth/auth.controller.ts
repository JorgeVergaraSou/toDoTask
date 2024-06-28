import { Body, Controller, Get, HttpCode, HttpStatus, Post, /* UseGuards, Req, */ Patch, Param, UnauthorizedException, BadRequestException, NotFoundException } from "@nestjs/common";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { AuthService } from "./auth.service";
/*
import { AuthGuard } from "./guard/auth.guard";
import { Request } from "express";
import { Roles } from "./decorators/roles.decorator";
import { RolesGuard } from "./guard/roles.guard";
import { RequestWithUser } from "./interfaces/reqWithUser.interface";
*/
import { Role } from "../common/enums/role.enum";
import { Auth } from "./decorators/auth.decorator";
import { ActiveUser } from "../common/decorators/active-user.decorator";
import { UserActiveInterface } from "src/common/interfaces/user-active.interface";
import { UpdateDto } from "./dto/update.dto";
import { RecoveryDto } from "./dto/recovery.dto";
import { RequestResetPasswordDto } from "./dto/requestResetPassword.dto";
import { ResetPasswordDto } from "./dto/resetPassword.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  // TODOS NECESITAN UN VERBO PARA FUNCIONAR, PARA LOS LOGIN Y REGISTER USAMOS EL POST
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    try {
      const result = await this.authService.register(registerDto);
      if (result) {
        return result;
      } else {
        throw new BadRequestException('Error en el registro');
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      const result = await this.authService.login(loginDto);
      if (result) {
        return result;
      } else {
        throw new UnauthorizedException('Credenciales inválidas');
      }
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  @Patch('updateUser/:id')
  @Auth(Role.USER)
  async updateUser(@Param('id') id: number, @Body() updateUserDto: UpdateDto) {
    try {
      const result = await this.authService.updateUser(id, updateUserDto);
      if (result) {
        return { message: 'Usuario actualizado con éxito', user: result };
      } else {
        throw new NotFoundException('Usuario no encontrado o no actualizado');
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post("passwordRecovery")
  @Auth(Role.USER)
  async passwordRecovery(@Body() recoveryDto: RecoveryDto) {
    try {
      const result = await this.authService.passwordRecovery(recoveryDto);
      if (result) {
        return { message: 'Clave cambiada con éxito' };
      } else {
        throw new UnauthorizedException('Error al cambiar la clave');
      }
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  @Patch('requestResetPassword')
  requestResetPasswordByEmail(@Body() requestResetPasswordDto: RequestResetPasswordDto) {
    return this.authService.requestResetPasswordByEmail(requestResetPasswordDto);
  }

  @Patch('resetPassword')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto)
  }


  @Get('profile')
  @Auth(Role.USER)
  async profile(@ActiveUser() user: UserActiveInterface) {
    try {
      const result = await this.authService.profile(user);
      if (result) {
        return result;
      } else {
        throw new NotFoundException('Perfil no encontrado');
      }
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

} /** EL CONTROLADOR RECIBE UNA PETICION, VE A DONDE DEBE ENVIARLA Y REGRESAR UNA RESPUESTA AL USUARIO */