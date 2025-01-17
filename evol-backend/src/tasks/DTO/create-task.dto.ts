import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsBoolean, IsOptional, IsArray, IsDate } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({ description: 'Título de la tarea', example: 'Comprar comida' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ description: 'Descripción sencilla de la tarea', example: 'Ir de compras al supermercado' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Estado de finalización de la tarea', example: false })
  @IsBoolean()
  @IsOptional()
  completed?: boolean;

  @ApiPropertyOptional({ description: 'Etiquetas relacionadas a la tarea', example: ['supermercado', 'compras'] })
  @IsArray()
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({ description: 'Fecha límite para finalizar', example: '2025-01-20' })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  dueDate?: Date;
}
