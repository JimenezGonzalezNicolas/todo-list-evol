import { QueryInterface } from 'sequelize';

export = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkInsert('tasks', [
      {
        title: 'Primera tarea',
        description: 'Descripción de la primera tarea',
        completed: false,
        tags: ['prioridad', 'importante'],
        dueDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Segunda tarea',
        description: 'Descripción de la segunda tarea',
        completed: true,
        tags: ['hecho'],
        dueDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete('tasks', {}, {});
  },
};
