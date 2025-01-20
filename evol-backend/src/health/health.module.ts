import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { HealthService } from './health.service';
import { HealthController } from './health.controller';

@Module({
  imports: [SequelizeModule],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
