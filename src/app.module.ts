import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { DB_TYPE, HOST, USER_DB_NAME, USER_DB_PASSWORD, PORT, DATABASE_NAME } from 'config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env'], // Puedes incluir otros archivos .env aquí si es necesario
      isGlobal: true, // Hace que el módulo de configuración esté disponible en toda la aplicación
    }),
    TypeOrmModule.forRoot({
    type: DB_TYPE,
    host: HOST,
    username: USER_DB_NAME,
    password: USER_DB_PASSWORD,
    port: PORT,
    database: DATABASE_NAME,
    autoLoadEntities: true, // CARGA LAS ENTITYS DE FORMA AUTOMATICA PARA NO HACERLO MANUAL
    synchronize: true, // TODO CAMBIO QUE SE GENERE ACA, SE SINCRONIZA CON LA "BD"
  }),AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
