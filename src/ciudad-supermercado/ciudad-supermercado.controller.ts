import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';
import { CiudadSupermercadoService } from './ciudad-supermercado.service';
import { SupermercadoEntity } from '../supermercado/supermercado.entity';
import { SupermercadoDto } from 'src/supermercado/supermercado.dto';


@Controller('cities')
@UseInterceptors(BusinessErrorsInterceptor)
export class CiudadSupermercadoController {
    constructor(private readonly ciudadSupermercadoService: CiudadSupermercadoService) {}

    @Post(':ciudadId/supermarkets/:supermercadoId')
    async addSupermarketToCity(@Param('ciudadId') ciudadId: string, @Param('supermercadoId') supermercadoId: string){
        return await this.ciudadSupermercadoService.addSupermarketToCity(ciudadId, supermercadoId);
    }

    @Get(':ciudadId/supermarkets/:supermercadoId')
    async findSupermarketFromCity(@Param('ciudadId') ciudadId: string, @Param('supermercadoId') supermercadoId: string){
        return await this.ciudadSupermercadoService.findSupermarketFromCity(ciudadId, supermercadoId);
    }

    @Get(':ciudadId/supermarkets')
    async findSupermarketsFromCity(@Param('ciudadId') ciudadId: string){
        return await this.ciudadSupermercadoService.findSupermarketsFromCity(ciudadId);
    }

    @Put(':ciudadId/supermarkets/:supermercadoId')
    async updateSupermarketsFromCity(@Body() supermercadoDto: SupermercadoDto, @Param('ciudadId') ciudadId: string, @Param('supermercadoId') supermercadoId: string){
        const supermercado = plainToInstance(SupermercadoEntity, supermercadoDto)
        return await this.ciudadSupermercadoService.updateSupermarketsFromCity(ciudadId, supermercadoId, supermercado);
    }

    @Delete(':ciudadId/supermarkets/:supermercadoId')
    @HttpCode(204)
    async deleteSupermarketFromCity(@Param('ciudadId') ciudadId: string, @Param('supermercadoId') supermercadoId: string){
        return await this.ciudadSupermercadoService.deleteSupermarketFromCity(ciudadId, supermercadoId);
    }

}
