import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { CiudadEntity } from './ciudad.entity';

@Injectable()
export class CiudadService {
    constructor(
        @InjectRepository(CiudadEntity)
        private readonly ciudadRepository: Repository<CiudadEntity>
    ){}

    async findAll(): Promise<CiudadEntity[]> {
        return await this.ciudadRepository.find({ relations: ["supermercados"] });
    }

    async findOne(id: string): Promise<CiudadEntity> {
        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where: {id}, relations: ["supermercados"] } );
        if (!ciudad)
          throw new BusinessLogicException("No se encontró una ciudad con ese id", BusinessError.NOT_FOUND);
   
        return ciudad;
    }

    async create(ciudad: CiudadEntity): Promise<CiudadEntity> {

        if(ciudad.pais != "Argentina" && ciudad.pais != "Ecuador" && ciudad.pais != "Paraguay")
            throw new BusinessLogicException("El país solo puede tener los valores Argentina, Ecuador o Paraguay", BusinessError.BAD_REQUEST);
        
        return await this.ciudadRepository.save(ciudad);
    }

    async update(id: string, ciudad: CiudadEntity): Promise<CiudadEntity> {
        const persistedCiudad: CiudadEntity = await this.ciudadRepository.findOne({where: {id} } );
        if (!persistedCiudad)
            throw new BusinessLogicException("No se encontró una ciudad con ese id", BusinessError.NOT_FOUND);
    
        if(persistedCiudad.pais != "Argentina" && persistedCiudad.pais != "Ecuador" && persistedCiudad.pais != "Paraguay")
            throw new BusinessLogicException("El país solo puede tener los valores Argentina, Ecuador o Paraguay", BusinessError.BAD_REQUEST);
        
        return await this.ciudadRepository.save({...persistedCiudad, ...ciudad});
    }

    async delete(id: string): Promise<CiudadEntity> {
        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where: {id} } );
        if (!ciudad)
            throw new BusinessLogicException("No se encontró una ciudad con ese id", BusinessError.NOT_FOUND);
        
        return await this.ciudadRepository.remove(ciudad);
    }
}
