import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    return this.userRepository.save(createUserDto);
  }

  /* lo que hace es buscar un usuario por mail y saber si existe */
  findOneByEmail(email: string){
    return this.userRepository.findOneBy({ email })
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

  findAll() {
    return this.userRepository.find();
  }
/* POR EL MOMENTO NO SE USARAN ESTOS METODOS
  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
  */
}
