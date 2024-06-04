import {   BadRequestException, Injectable, UnauthorizedException, } from "@nestjs/common";
import { RegisterDto } from "./dto/register.dto";
import { JwtService } from "@nestjs/jwt";
import * as bcryptjs from "bcryptjs";
import { UsersService } from "../users/users.service";
import { LoginDto } from "./dto/login.dto";
/** EL AUTH SERVICE ES EL QUE SE CONECTARA CON EL USER-SERVICE DE OTRO MODULO,
 * DEBE TRAERSE TODAS LAS FUNCIONES
 */
@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService, /* PARA USAR EL SERVICIO DE USER DEBEMOS TRAERLO */
  /** CUANDO INYECTAMOS EL SERVICIO, ES ESE SERVICIO EL QUE SE CONECTA A LA "BD" */
  private readonly jwtService: JwtService /** inyectamos el servicio de JWT */
    ) {} 
  
/** LA INFO SE ENVIA A TRAVEZ DEL "BODY" */

// REGISTER INICIO
/** HACEMOS DESECTRUCTURACION PASANDO LAS VARIABLES POR SEPARADO */
async register({ password, email, name, secretWord }: RegisterDto) {

  try {
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
        
          console.log(newUser);
          
          if (newUser){
            return {
              message: "User created successfully",
            };
          } else{
            throw new BadRequestException("En la creación");
          }        
    
  } catch (error) {
    throw new BadRequestException(error, "Error de conexión");
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
    const payload = {email: user.email, role: user.role, idUser: user.idUser}

    /** aca se crea el token y se le agrega el dato guardado en "payload" */
    const token = await this.jwtService.signAsync(payload);
 
    /** ahora retornamos el token y la info que queramos, cada vez que el usuario quiera aceder a una ruta
     * protegida va a tener que enviar el jwt para ser autorizado     */
    return {
      token,
    };
  }
  /** ===================== FIN LOGIN ===================== */

  async profile({email, role}: {email: string, role: string}) {

    return await this.usersService.findOneByEmail(email);
  }

}
