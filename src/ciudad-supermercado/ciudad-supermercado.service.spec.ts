import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CiudadSupermercadoService } from './ciudad-supermercado.service';
import { faker } from '@faker-js/faker';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { SupermercadoEntity } from '../supermercado/supermercado.entity';

describe('CiudadSupermercadoService', () => {
  let service: CiudadSupermercadoService;
  let ciudadRepository: Repository<CiudadEntity>;
  let supermercadoRepository: Repository<SupermercadoEntity>;
  let ciudad: CiudadEntity;
  let supermercadosList : SupermercadoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CiudadSupermercadoService],
    }).compile();

    service = module.get<CiudadSupermercadoService>(CiudadSupermercadoService);
    ciudadRepository = module.get<Repository<CiudadEntity>>(getRepositoryToken(CiudadEntity));
    supermercadoRepository = module.get<Repository<SupermercadoEntity>>(getRepositoryToken(SupermercadoEntity));
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const seedDatabase = async () => {
    ciudadRepository.clear();
    supermercadoRepository.clear();
 
    supermercadosList = [];
    for (let i = 0; i < 5; i++) {
      const supermercado: SupermercadoEntity = await supermercadoRepository.save({
        nombre: faker.random.alphaNumeric(11),
        longitud: faker.datatype.number().toString(),
        latitud: faker.datatype.number().toString(),
        paginaWeb: faker.internet.url(), 
      });
      supermercadosList.push(supermercado);
    }
 
    ciudad = await ciudadRepository.save({
      nombre: faker.word.adjective(),
      pais: "Argentina",
      numHabitantes: faker.datatype.number().toString(),
      supermercados: supermercadosList,   
    });
  }

  it('addSupermarketToCity should add a supermarket to a city', async () => {
    const newSupermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: faker.random.alphaNumeric(11),
      longitud: faker.datatype.number().toString(),
      latitud: faker.datatype.number().toString(),
      paginaWeb: faker.internet.url(), 
    });

    const newCiudad: CiudadEntity = await ciudadRepository.save({
      nombre: faker.word.adjective(),
      pais: "Argentina",
      numHabitantes: faker.datatype.number().toString(),   
    });

    const result: CiudadEntity = await service.addSupermarketToCity(newCiudad.id, newSupermercado.id);
    expect(result.supermercados.length).toBe(1);
    expect(result.supermercados[0]).not.toBeNull();
    expect(result.supermercados[0].nombre).toBe(newSupermercado.nombre);
    expect(result.supermercados[0].longitud).toBe(newSupermercado.longitud);
    expect(result.supermercados[0].latitud).toBe(newSupermercado.latitud);
    expect(result.supermercados[0].paginaWeb).toBe(newSupermercado.paginaWeb);
    
  });

  it('addSupermarketToCity should thrown exception for an invalid supermarket', async () => {
    const newCiudad: CiudadEntity = await ciudadRepository.save({
      nombre: faker.word.adjective(),
      pais: "Argentina",
      numHabitantes: faker.datatype.number().toString(),   
    });

    await expect(() => service.addSupermarketToCity(newCiudad.id, "0")).rejects.toHaveProperty("message", "No se encontró un supermercado con ese id")
  });

  it('addSupermarketToCity should thrown exception for an invalid city', async () => {
    const newSupermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: faker.random.alphaNumeric(11),
      longitud: faker.datatype.number().toString(),
      latitud: faker.datatype.number().toString(),
      paginaWeb: faker.internet.url(), 
    });

    await expect(() => service.addSupermarketToCity("0", newSupermercado.id)).rejects.toHaveProperty("message", "No se encontró una ciudad con ese id")
  });

  it('findSupermarketsFromCity should return all supermarkets from a city', async () => {
    const supermarkets: SupermercadoEntity[] = await service.findSupermarketsFromCity(ciudad.id);
    expect(supermarkets.length).toBe(5)
  });

  it('findSupermarketsFromCity should thrown exception for an invalid city', async () => {
    await expect(() => service.findSupermarketsFromCity("0")).rejects.toHaveProperty("message", "No se encontró una ciudad con ese id")
  });

  it('findSupermarketFromCity should return a supermarket from a city', async () => {
    const supermercado: SupermercadoEntity = supermercadosList[0];
    const storedSupermercado: SupermercadoEntity = await service.findSupermarketFromCity(ciudad.id, supermercado.id);
    expect(storedSupermercado).not.toBeNull();
    expect(storedSupermercado.nombre).toEqual(supermercado.nombre)
    expect(storedSupermercado.longitud).toEqual(supermercado.longitud)
    expect(storedSupermercado.latitud).toEqual(supermercado.latitud)
    expect(storedSupermercado.paginaWeb).toEqual(supermercado.paginaWeb)
  });

  it('findSupermarketFromCity should thrown exception for an invalid supermarket', async () => {
    await expect(() => service.findSupermarketFromCity(ciudad.id, "0")).rejects.toHaveProperty("message", "No se encontró un supermercado con ese id")
  });

  it('findSupermarketFromCity should thrown exception for an invalid city', async () => {
    const supermercado: SupermercadoEntity = supermercadosList[0];
    await expect(() => service.findSupermarketFromCity("0", supermercado.id)).rejects.toHaveProperty("message", "No se encontró una ciudad con ese id")
  });

  it('findSupermarketFromCity should thrown exception for a supermarket not associated to a city', async () => {
    const newSupermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: faker.random.alphaNumeric(11),
      longitud: faker.datatype.number().toString(),
      latitud: faker.datatype.number().toString(),
      paginaWeb: faker.internet.url(), 
    });

    await expect(() => service.findSupermarketFromCity(ciudad.id, newSupermercado.id)).rejects.toHaveProperty("message", "El supermercado con ese id no está asociado a esa ciudad")
  });

  it('updateSupermarketsFromCity should update a supermarket from a city', async () => {
    const newSupermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: faker.random.alphaNumeric(11),
      longitud: faker.datatype.number().toString(),
      latitud: faker.datatype.number().toString(),
      paginaWeb: faker.internet.url(), 
    });

    const updatedCiudad: CiudadEntity = await service.updateSupermarketsFromCity(ciudad.id, [newSupermercado]);
    expect(updatedCiudad.supermercados.length).toBe(1);
    expect(updatedCiudad.supermercados[0]).not.toBeNull();
    expect(updatedCiudad.supermercados[0].nombre).toBe(newSupermercado.nombre);
    expect(updatedCiudad.supermercados[0].longitud).toBe(newSupermercado.longitud);
    expect(updatedCiudad.supermercados[0].latitud).toBe(newSupermercado.latitud);
    expect(updatedCiudad.supermercados[0].paginaWeb).toBe(newSupermercado.paginaWeb);

  });

  it('updateSupermarketsFromCity should thrown exception for an invalid city', async () => {
    const newSupermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: faker.random.alphaNumeric(11),
      longitud: faker.datatype.number().toString(),
      latitud: faker.datatype.number().toString(),
      paginaWeb: faker.internet.url(), 
    });
    await expect(() => service.updateSupermarketsFromCity("0", [newSupermercado])).rejects.toHaveProperty("message", "No se encontró una ciudad con ese id")
  });

  it('updateSupermarketsFromCity should thrown exception for an invalid supermarket', async () => {
    const newSupermercado: SupermercadoEntity = supermercadosList[0];
    newSupermercado.id = "0";
    await expect(() => service.updateSupermarketsFromCity(ciudad.id, [newSupermercado])).rejects.toHaveProperty("message", "No se encontró un supermercado con ese id")
  });

  it('deleteSupermarketFromCity should delete a supermarket from a city', async () => {
    const supermercado: SupermercadoEntity = supermercadosList[0];
    await service.deleteSupermarketFromCity(ciudad.id, supermercado.id);
    const storedCiudad: CiudadEntity = await ciudadRepository.findOne({where: {id: ciudad.id}, relations: ["supermercados"]});
    const deletedSupermercado: SupermercadoEntity = storedCiudad.supermercados.find(e => e.id === supermercado.id);
    expect(deletedSupermercado).toBeUndefined();
  });

  it('deleteSupermarketFromCity should thrown exception for an invalid supermarket', async () => {
    await expect(() => service.deleteSupermarketFromCity(ciudad.id, "0")).rejects.toHaveProperty("message", "No se encontró un supermercado con ese id")
  });

  it('deleteSupermarketFromCity should thrown exception for an invalid city', async () => {
    const supermercado: SupermercadoEntity = supermercadosList[0];
    await expect(() => service.deleteSupermarketFromCity("0", supermercado.id)).rejects.toHaveProperty("message", "No se encontró una ciudad con ese id")
  });

  it('deleteSupermarketFromCity should thrown exception for a supermarket not associated to a city', async () => {
    const newSupermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: faker.random.alphaNumeric(11),
      longitud: faker.datatype.number().toString(),
      latitud: faker.datatype.number().toString(),
      paginaWeb: faker.internet.url(), 
    });

    await expect(() => service.deleteSupermarketFromCity(ciudad.id, newSupermercado.id)).rejects.toHaveProperty("message", "El supermercado con ese id no está asociado a esa ciudad")
  });
});
