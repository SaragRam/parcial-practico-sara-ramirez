import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { SupermercadoEntity } from './supermercado.entity';
import { SupermercadoService } from './supermercado.service';

describe('SupermercadoService', () => {
  let service: SupermercadoService;
  let repository: Repository<SupermercadoEntity>;
  let supermercadosList: SupermercadoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SupermercadoService],
    }).compile();

    service = module.get<SupermercadoService>(SupermercadoService);
    repository = module.get<Repository<SupermercadoEntity>>(getRepositoryToken(SupermercadoEntity));
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const seedDatabase = async () => {
    repository.clear();
    supermercadosList = [];
    for (let i = 0; i < 5; i++) {
      const supermercado: SupermercadoEntity = await repository.save({
        nombre: faker.word.adjective(),
        longitud: faker.datatype.number().toString(),
        latitud: faker.datatype.number().toString(),
        paginaWeb: faker.internet.url(), 
      });
      supermercadosList.push(supermercado);
    }
  };

  it('findAll should return all supermarkets', async () => {
    const supermercados: SupermercadoEntity[] = await service.findAll();
    expect(supermercados).not.toBeNull();
    expect(supermercados).toHaveLength(supermercadosList.length);
  });

  it('findOne should return a supermarket by id', async () => {
    const storedSupermercado: SupermercadoEntity = supermercadosList[0];
    const supermercado: SupermercadoEntity = await service.findOne(storedSupermercado.id);
    expect(supermercado).not.toBeNull();
    expect(supermercado.nombre).toEqual(storedSupermercado.nombre)
    expect(supermercado.longitud).toEqual(storedSupermercado.longitud)
    expect(supermercado.latitud).toEqual(storedSupermercado.latitud)
    expect(supermercado.paginaWeb).toEqual(storedSupermercado.paginaWeb)
  });

  it('findOne should throw an exception for an invalid supermarket', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "No se encontró un supermercado con ese id")
  });

  it('create should create a new supermarket', async () => {
    const supermercado: SupermercadoEntity = await service.create({
      id:"",
      nombre: faker.random.alphaNumeric(11),
      longitud: faker.datatype.number().toString(),
      latitud: faker.datatype.number().toString(),
      paginaWeb: faker.internet.url(), 
      ciudades: []
    });
    const newSupermercado: SupermercadoEntity = await service.create(supermercado);
    expect(newSupermercado).not.toBeNull();

    const storedSupermercado: SupermercadoEntity = await repository.findOne({where: {id: newSupermercado.id}})
    expect(storedSupermercado).not.toBeNull();
    expect(storedSupermercado.nombre).toEqual(newSupermercado.nombre);
    expect(storedSupermercado.longitud).toEqual(newSupermercado.longitud);
    expect(storedSupermercado.latitud).toEqual(newSupermercado.latitud);
    expect(storedSupermercado.paginaWeb).toEqual(newSupermercado.paginaWeb);
  });

  it('create should throw an exception for a short name', async () => {
    await expect(() => service.create({
      id:"",
      nombre: faker.random.alphaNumeric(9),
      longitud: faker.datatype.number().toString(),
      latitud: faker.datatype.number().toString(),
      paginaWeb: faker.internet.url(), 
      ciudades: []
    })).rejects.toHaveProperty("message", "El nombre del supermercado debe tener más de 10 caracteres")
  });

  it('update should modify a supermarket', async () => {
    const supermercado: SupermercadoEntity = supermercadosList[0];
    supermercado.nombre = faker.random.alphaNumeric(11);
    const updatedSupermercado: SupermercadoEntity = await service.update(supermercado.id, supermercado);
    expect(updatedSupermercado).not.toBeNull();
    const storedSupermercado: SupermercadoEntity = await repository.findOne({where: {id: supermercado.id}})
    expect(storedSupermercado).not.toBeNull();
    expect(storedSupermercado.nombre).toEqual(supermercado.nombre)
  });

  it('update should throw an exception for a short name', async () => {
    const supermercado: SupermercadoEntity = supermercadosList[0];
    supermercado.nombre = faker.random.alphaNumeric(9);
    await expect(() => service.update(supermercado.id, supermercado)).rejects.toHaveProperty("message", "El nombre del supermercado debe tener más de 10 caracteres")
  });

  it('update should throw an exception for an invalid supermarket', async () => {
    const supermercado: SupermercadoEntity = supermercadosList[0];
    supermercado.paginaWeb = faker.internet.url();
    await expect(() => service.update("0", supermercado)).rejects.toHaveProperty("message", "No se encontró un supermercado con ese id")
  });

  it('delete should remove a supermarket', async () => {
    const supermercado: SupermercadoEntity = supermercadosList[0];
    await service.delete(supermercado.id);
    const deletedSupermercado: SupermercadoEntity = await repository.findOne({where: {id: supermercado.id}})
    expect(deletedSupermercado).toBeNull();
  });

  it('delete should throw an exception for an invalid supermarket id', async () => {
    const supermercado: SupermercadoEntity = supermercadosList[0];
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "No se encontró un supermercado con ese id")
  });


});
