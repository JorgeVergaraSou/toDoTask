import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants/jwt.constant';

@Module({
  imports: [
    UsersModule, /* IMPORTAMOS EL MODULO DE USUARIO PARA QUE SE PUEDA USAR EN LA AUTENTICACION */
    JwtModule.register({ /** PARA USAR EL JWT EL SERVICE, DEBEMOS IMPORTARLO ACA EN EL MODULO */
      global: true, /** AL HACERLO GLOBAL, PERMITE QUE CUALQUIER SERVICIO USE JWT */
      secret: jwtConstants.secret, /** PALABRA SECRETA QUE SE USA PARA VERIFICAR QUE EL JWT ES VALIDO */
      signOptions: { expiresIn: "1d" }, /** TIEMPO DE DURACION DE LA SESION*/
    }),], 
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
/* con el comando "nest g res auth --no-spec" creamos el crud de autenticacion
que nos va servir para la autenticacion del usuario */

/* PARA ENCRIPTAR LA PASSWORD USAREMOS bcryptjs */
/** JWT SE INSTALA npm install --save @nestjs/jwt PARA PROTEGER LA AUTENTICACION */