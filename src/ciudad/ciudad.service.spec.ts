import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { CiudadEntity } from './ciudad.entity';
import { CiudadService } from './ciudad.service';

describe('CiudadService', () => {
  let service: CiudadService;
  let repository: Repository<CiudadEntity>;
  let ciudadesList: CiudadEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CiudadService],
    }).compile();

    service = module.get<CiudadService>(CiudadService);
    repository = module.get<Repository<CiudadEntity>>(getRepositoryToken(CiudadEntity));
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const seedDatabase = async () => {
    repository.clear();
    ciudadesList = [];
    for (let i = 0; i < 5; i++) {
      const ciudad: CiudadEntity = await repository.save({
        nombre: faker.word.adjective(),
        pais: "Argentina",
        numHabitantes: faker.datatype.number().toString(),   
      });
      ciudadesList.push(ciudad);
    }
  };

  it('findAll should return all cities', async () => {
    const ciudades: CiudadEntity[] = await service.findAll();
    expect(ciudades).not.toBeNull();
    expect(ciudades).toHaveLength(ciudadesList.length);
  });

  it('findOne should return a city by id', async () => {
    const storedCiudad: CiudadEntity = ciudadesList[0];
    const ciudad: CiudadEntity = await service.findOne(storedCiudad.id);
    expect(ciudad).not.toBeNull();
    expect(ciudad.nombre).toEqual(storedCiudad.nombre)
    expect(ciudad.pais).toEqual(storedCiudad.pais)
    expect(ciudad.numHabitantes).toEqual(storedCiudad.numHabitantes)
  });

  it('findOne should throw an exception for an invalid city', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "No se encontró una ciudad con ese id")
  });

  it('create should return a new city', async () => {
    const ciudad: CiudadEntity = {
      id:"",
      nombre: faker.word.adjective(),
      pais: "Argentina",
      numHabitantes: faker.datatype.number().toString(), 
      supermercados: []
    }
 
    const newCiudad: CiudadEntity = await service.create(ciudad);
    expect(newCiudad).not.toBeNull();
 
    const storedCiudad: CiudadEntity = await repository.findOne({where: {id: newCiudad.id}})
    expect(storedCiudad).not.toBeNull();
    expect(storedCiudad.nombre).toEqual(newCiudad.nombre)
    expect(storedCiudad.pais).toEqual(newCiudad.pais)
    expect(storedCiudad.numHabitantes).toEqual(newCiudad.numHabitantes)

  });

  it('create should throw an exception for an invalid city', async () => {
    const ciudad: CiudadEntity = {
      id:"",
      nombre: faker.word.adjective(),
      pais: "Chile",
      numHabitantes: faker.datatype.number().toString(), 
      supermercados: []
    }
    await expect(() => service.create(ciudad)).rejects.toHaveProperty("message", "El país solo puede tener los valores Argentina, Ecuador o Paraguay")
  });

  it('update should modify a city', async () => {
    const ciudad: CiudadEntity = ciudadesList[0];
    ciudad.nombre = "nuevo nombre";
    const updatedCiudad: CiudadEntity = await service.update(ciudad.id, ciudad);
    expect(updatedCiudad).not.toBeNull();
    const storedCiudad: CiudadEntity = await repository.findOne({where: {id: ciudad.id}})
    expect(storedCiudad).not.toBeNull();
    expect(storedCiudad.nombre).toEqual(ciudad.nombre)
  });

  it('update should throw an exception for an invalid city country', async () => {
    const ciudad: CiudadEntity = ciudadesList[0];
    ciudad.pais = "Chile";
    await expect(() => service.update(ciudad.id, ciudad)).rejects.toHaveProperty("message", "El país solo puede tener los valores Argentina, Ecuador o Paraguay")
  });

  it('update should throw an exception for an invalid city id', async () => {
    const ciudad: CiudadEntity = ciudadesList[0];
    ciudad.nombre = "nuevo nombre 2";
    await expect(() => service.update("0", ciudad)).rejects.toHaveProperty("message", "No se encontró una ciudad con ese id")
  });

  it('delete should remove a city', async () => {
    const ciudad: CiudadEntity = ciudadesList[0];
    await service.delete(ciudad.id);
    const deletedCiudad: CiudadEntity = await repository.findOne({where: {id: ciudad.id}})
    expect(deletedCiudad).toBeNull();
  });

  it('delete should throw an exception for an invalid city id', async () => {
    const ciudad: CiudadEntity = ciudadesList[0];
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "No se encontró una ciudad con ese id")
  });

});
