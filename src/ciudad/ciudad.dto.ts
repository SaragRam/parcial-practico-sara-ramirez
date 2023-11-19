import {IsNotEmpty, IsString, IsUrl} from 'class-validator';

export class CiudadDto {
@IsString()
 @IsNotEmpty()
 readonly nombre: string;
 
 @IsString()
 @IsNotEmpty()
 readonly pais: string;
 
 @IsString()
 @IsNotEmpty()
 readonly numHabitantes: string;

}
