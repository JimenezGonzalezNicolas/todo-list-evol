import { Table, Column, Model, DataType } from 'sequelize-typescript';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Table({ tableName: 'tasks', timestamps: true })
export class Task extends Model {
    @ApiProperty({
        description: 'ID único de la tarea',
        example: 1,
    })
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @ApiProperty({
        description: 'Título de la tarea',
        example: 'Comprar comida',
    })
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    title: string;

    @ApiPropertyOptional({
        description: 'Descripción detallada de la tarea',
        example: 'Ir al supermercado a comprar frutas y verduras',
    })
    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    description: string;

    @ApiProperty({
        description: 'Estado de la tarea (completada o no)',
        example: false,
    })
    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    })
    completed: boolean;

    @ApiPropertyOptional({
        description: 'Etiquetas asociadas a la tarea',
        example: ['supermercado', 'compras'],
    })
    @Column({
        type: DataType.ARRAY(DataType.STRING),
        allowNull: true,
        defaultValue: [],
    })
    tags: string[];

    @ApiPropertyOptional({
        description: 'Fecha límite para completar la tarea',
        example: '2025-01-20T00:00:00.000Z',
    })
    @Column({
        type: DataType.DATE,
        allowNull: true,
    })
    dueDate: Date;
}
