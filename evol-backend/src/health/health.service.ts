import { Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class HealthService {
  constructor(private readonly sequelize: Sequelize) {}

  async checkHealth(): Promise<{ status: string; database: boolean }> {
    try {
      await this.sequelize.authenticate();
      return {
        status: 'UP',
        database: true,
      };
    } catch (error) {
      return {
        status: 'DOWN',
        database: false,
      };
    }
  }
}
