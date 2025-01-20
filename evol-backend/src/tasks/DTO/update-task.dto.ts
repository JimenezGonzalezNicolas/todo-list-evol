import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsBoolean, IsOptional, IsArray, IsDate } from 'class-validator';

export class UpdateTaskDto {
  @ApiPropertyOptional({ description: 'Nuevo título de la tarea', example: 'Alimentar a las mascotas' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ description: 'Nueva descripción de la tarea', example: 'Los nuevos detalles de la tarea' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Nuevo estado de la tarea', example: true })
  @IsBoolean()
  @IsOptional()
  completed?: boolean;

  @ApiPropertyOptional({ description: 'Nuevas etiquetas asociadas a la tarea', example: ['mascotas', 'importante'] })
  @IsArray()
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({ description: 'Nueva fecha límite para completar la tarea', example: '2025-02-01' })
  @IsDate()
  @Type(() => Date) 
  @IsOptional()
  dueDate?: Date;
}
