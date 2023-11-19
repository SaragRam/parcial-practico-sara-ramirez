import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CiudadSupermercadoService } from './ciudad-supermercado.service';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { SupermercadoEntity } from '../supermercado/supermercado.entity';

@Module({
  providers: [CiudadSupermercadoService],
  imports: [TypeOrmModule.forFeature([CiudadEntity, SupermercadoEntity])],

})
export class CiudadSupermercadoModule {}
