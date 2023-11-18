import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { CiudadEntity } from '../ciudad/ciudad.entity';

@Entity()
export class SupermercadoEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
   
    @Column()
    nombre: string;
    
    @Column()
    longitud: string;
    
    @Column()
    latitud: string;
    
    @Column()
    paginaWeb: string;

    @ManyToMany(
        () => CiudadEntity, ciudad => ciudad.supermercados)
        @JoinTable()
        ciudades: CiudadEntity[];
}
