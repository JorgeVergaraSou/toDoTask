import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards, Req, Patch, Param } from "@nestjs/common";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { AuthService } from "./auth.service";
import { AuthGuard } from "./guard/auth.guard";
import { Request } from "express";
import { Roles } from "./decorators/roles.decorator";
import { RolesGuard } from "./guard/roles.guard";
import { RequestWithUser } from "./interfaces/reqWithUser.interface";
import { Role } from "../common/enums/role.enum";
import { Auth } from "./decorators/auth.decorator";
import { ActiveUser } from "../common/decorators/active-user.decorator";
import { UserActiveInterface } from "src/common/interfaces/user-active.interface";
import { UpdateDto } from "./dto/update.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  // TODOS NECESITAN UN VERBO PARA FUNCIONAR, PARA LOS LOGIN Y REGISTER USAMOS EL POST
  @Post("register")
  register(@Body()
  registerDto: RegisterDto) { /** PARA ESTANDARIZAR LA INFO QUE LLEGA POR EL BODY, USAMOS LOS DTO */
    try {
      return this.authService.register(registerDto);
    } catch (error) {
      console.log(error);
      
    }
    
  }


  @HttpCode(HttpStatus.OK)
  @Post("login")
  login(@Body() /** SE RECIVE UN BODY */
  loginDto: LoginDto) { /** VARIABLE QUE DEBE COMPORTARSE COMO EL DTO */
   try {
    return this.authService.login(loginDto);
   } catch (error) {
    console.log(error);
    
   }
    
  }

  @Patch('updateUser/:id')
  @Auth(Role.USER)
  updateUser(@Param('id') id: number, @Body() updateUserDto: UpdateDto ){
    try {
      return this.authService.updateUser(id, updateUserDto)
    } catch (error) {
      console.log(error);
      
    }
  }

  @Get('profile')
  @Auth(Role.USER) /** decorador personalizado que une varios decoradores */
  profile(@ActiveUser() user: UserActiveInterface) { /** este request es el que tiene el payload */
    return this.authService.profile(user);
  }

} /** EL CONTROLADOR RECIBE UNA PETICION, VE A DONDE DEBE ENVIARLA Y REGRESAR UNA RESPUESTA AL USUARIO */