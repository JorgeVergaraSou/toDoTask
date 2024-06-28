import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException, } from "@nestjs/common";
import { RegisterDto } from "./dto/register.dto";
import { JwtService } from "@nestjs/jwt";
import * as bcryptjs from "bcryptjs";
import { UsersService } from "../users/users.service";
import { LoginDto } from "./dto/login.dto";
//import { UpdateUserDto } from "src/users/dto/update-user.dto";
import { UpdateDto } from "./dto/update.dto"
import { RecoveryDto } from "./dto/recovery.dto";
//import { User } from "src/users/entities/user.entity";
import { UserActiveInterface } from "src/common/interfaces/user-active.interface";
import { RequestResetPasswordDto } from "./dto/requestResetPassword.dto";
import { v4 as uuidv4 } from 'uuid';
import { UpdateUserDto } from "../users/dto/update-user.dto";
import { ResetPasswordDto } from "./dto/resetPassword.dto";
import { User } from "src/users/entities/user.entity";
/** EL AUTH SERVICE ES EL QUE SE CONECTARA CON EL USER-SERVICE DE OTRO MODULO,
 * DEBE TRAERSE TODAS LAS FUNCIONES
 */
@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService, /* PARA USAR EL SERVICIO DE USER DEBEMOS TRAERLO */
    /** CUANDO INYECTAMOS EL SERVICIO, ES ESE SERVICIO EL QUE SE CONECTA A LA "BD" */
    private readonly jwtService: JwtService /** inyectamos el servicio de JWT */
  ) { }

  /** LA INFO SE ENVIA A TRAVEZ DEL "BODY" */

  // REGISTER INICIO
  /** HACEMOS DESECTRUCTURACION PASANDO LAS VARIABLES POR SEPARADO */
  async register({ password, email, name, secretWord }: RegisterDto) {
    
      /** BUSCAMOS EN LA "BD" QUE NO EXISTA EL EMAIL */
      const user = await this.usersService.findOneByEmail(email);

      /** SI EXISTE LANZAMOS UN BADREQUEST */
      if (user) {
        throw new BadRequestException("Email already exists");
      }
      /** SI NO EXISTE SEGUIMOS CON EL REGISTRO */
      /** CIFRAMOS LA CONTRASEÑA */
      const hashedPassword = await bcryptjs.hash(password, 10);
      const hashedSecretWord = await bcryptjs.hash(secretWord, 10);

      /** LLAMAMOS AL SERVICIO PARA CREAR EL USUARIO */
      const newUser = await this.usersService.create({
        name,
        email,
        password: hashedPassword,
        secretWord: hashedSecretWord,
      });

      if (newUser) {
        return { message: 'Usuario creado exitosamente' };
      } else {
        throw new BadRequestException('Error en la creación del usuario');
      }

  }
  // --------------- REGISTER FIN ---------------

  /** ----------------- INICIO LOGIN ------------------- */
  async login({ email, password }: LoginDto) {
    /** BUSCA EL USUARIO EN LA BD */
    const user = await this.usersService.findByEmailWithPassword(email);

    /** SI NO EXISTE ENVIA UN MENSAJE DE ERROR */
    if (!user) {
      throw new UnauthorizedException("Invalid email");
    }

    /** SI EXISTE EL USUARIO SE COMPARAN LAS CLAVES */
    const isPasswordValid = await bcryptjs.compare(password, user.password);

    /** SI NO COINCIDEN LAS CLAVES SE ENVIA UN ERROR */
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid password");
    }
    /** el payload indica que informacion va a viajar en el JWT */
    const payload = { email: user.email, role: user.role, idUser: user.idUser }

    /** aca se crea el token y se le agrega el dato guardado en "payload" */
    const token = await this.jwtService.signAsync(payload);

    /** ahora retornamos el token y la info que queramos, cada vez que el usuario quiera aceder a una ruta
     * protegida va a tener que enviar el jwt para ser autorizado     */
    return { token };
  }

  /** INICIO RECUPERAR CLAVE */
  async passwordRecovery({ password, email, secretWord }: RecoveryDto) {

    const userData = await this.usersService.findOneByEmail(email);

    if (!userData) {
      throw new NotFoundException("No existe el Usuario");
    }
    const isSecretWordValid = await bcryptjs.compare(secretWord, userData.secretWord);

    if (!isSecretWordValid) {
      throw new UnauthorizedException("La palabra secreta no coincide");
    } else {
      const hashedPasswordRecovery = await bcryptjs.hash(password, 10);
      const updateUserAuth = this.usersService.updateUser(userData.idUser, { password: hashedPasswordRecovery });
      return updateUserAuth
    }
  }

  async requestResetPasswordByEmail(requestResetPassword: RequestResetPasswordDto){
    const {email} = requestResetPassword;
    const userData = await this.usersService.findOneByEmail(email);

    const updateUserDto: UpdateUserDto = {
      resetPasswordToken: uuidv4(),
    };

    await this.usersService.updateUser(userData.idUser, updateUserDto);
      // Send email (e.g. Dispatch an event so MailerModule can send the email)
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto){
    const { resetPasswordToken, password } = resetPasswordDto;
    const user: User = await this.usersService.findOneByResetPasswordToken(
      resetPasswordToken,
    );

    user.password = // await this.encoderService.encodePassword(password);
    user.resetPasswordToken = null;
    this.usersService.create(user);
  
  }
  /** FIN  RECUPERAR CLAVE*/

  /** INICIO UPDATE USER */
  async updateUser(id: number, updateUserDto: UpdateDto) {
/** busca si el email que se quiere cambiar, ya existe o no en la BD, si existe, no se puede usar */
    const existeEmail = await this.usersService.findOneByEmail(updateUserDto.email);
    if (existeEmail) {
      throw new NotFoundException('Ya se encuentra en uso este E-mail');
    }

    const userData = await this.usersService.findOneById(id);
    if (!userData) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const result = await this.usersService.updateUser(userData.idUser, updateUserDto);

    if (result) {
      return result;
    } else {
      throw new InternalServerErrorException('Error al actualizar el usuario');
    }
  }
  /*
  async updateUser(id: number, updateUser: UpdateDto) {
    try {
      const updateUserAuth = this.usersService.updateUser(id, updateUser)
      return updateUserAuth;
    } catch (error) {
      console.log(error);

    }
  }*/

  /** ===================== FIN LOGIN ===================== */

  async profile(user: UserActiveInterface) {
    const profile = await this.usersService.findOneByEmail(user.email);
    if (!profile) {
      throw new NotFoundException('Perfil no encontrado');
    }
    return profile;
  }


}
