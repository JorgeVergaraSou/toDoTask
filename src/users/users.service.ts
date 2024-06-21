import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { User } from './entities/user.entity';

/* aca se hacen las inserciones, actualizaciones etc. pero este servicio no lo va usar el user.controller  
este servicio sera llamado desde la carpeta "auth" que se encarga de las vadilaciones, este servicio hara
las peticiones a la BD. hay dos formas de hacerlo, importando el modulo auth y haciendo injectReposiroty o
importando el servicio user al module auth.  */

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User) // inject viene de typeOrm, le inyectamos la entidad.
    // privado, solo lectura para que no se pueda mutar, variable que se tiene que comportar como un
    // repositorio de la entidad User
    private readonly userRepository: Repository<User>,
  ) {}

  /* para crear un usuario, necesitamos un DTO */
  create(createUserDto: CreateUserDto) {
    try {
      return this.userRepository.save(createUserDto);
    } catch (error) {
      throw new BadRequestException(error, "Error al crear el Usuario");
    }
   
  }

  /* lo que hace es buscar un usuario por mail y saber si existe */
  findOneByEmail(email: string){
    return this.userRepository.findOneBy({ email })
  }
  findOneById(idUser: number) {
    return this.userRepository.findOneBy( {idUser} );
  }

  /** debido al cambio en la entidad del select false password, implementaremos este metodo
   * haciendo una consulta personalizada quenos traiga el password
   */
  findByEmailWithPassword(email: string){
    return this.userRepository.findOne({
      where: { email }, 
      select: ['idUser', 'name', 'email', 'role', 'password'],
    });
  }
/*
  findAll() {
    return this.userRepository.find();
  }
*/
 async updateUser(id: number, updateUserDto: UpdateUserDto) {
    try {
      const result: UpdateResult = await this.userRepository.update(id, updateUserDto);

      if (result.affected === 0) {
        throw new InternalServerErrorException('Update failed');
      }else{
        return { message: 'Datos actualizados con éxito' };
      }       
    } catch (error) {
      throw new InternalServerErrorException(error);      
    }   
  }


/* POR EL MOMENTO NO SE USARAN ESTOS METODOS


  remove(id: number) {
    return `This action removes a #${id} user`;
  }
  */
}
