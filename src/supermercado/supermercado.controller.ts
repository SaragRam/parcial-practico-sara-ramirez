import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';
import { SupermercadoService } from './supermercado.service';
import { SupermercadoEntity } from './supermercado.entity';
import { SupermercadoDto } from './supermercado.dto';

@Controller('supermercado')
@UseInterceptors(BusinessErrorsInterceptor)
export class SupermercadoController {
    constructor(private readonly supermercadoService: SupermercadoService) {}

    @Get()
    async findAll() {
      return await this.supermercadoService.findAll();
    }

    @Get(':supermercadoId')
    async findOne(@Param('supermercadoId') ciudadId: string) {
      return await this.supermercadoService.findOne(ciudadId);
    }

    @Post()
    async create(@Body() supermercadoDto: SupermercadoDto) {
        const supermercado: SupermercadoEntity = plainToInstance(SupermercadoEntity, supermercadoDto);
        return await this.supermercadoService.create(supermercado);
    }

    @Put(':supermercadoId')
        async update(@Param('supermercadoId') supermercadoId: string, @Body() supermercadoDto: SupermercadoDto) {
        const supermercado: SupermercadoEntity = plainToInstance(SupermercadoEntity, supermercadoDto);
        return await this.supermercadoService.update(supermercadoId, supermercado);
  }

    @Delete(':supermercadoId')
    @HttpCode(204)
    async delete(@Param('supermercadoId') supermercadoId: string) {
        return await this.supermercadoService.delete(supermercadoId);
  }
}
