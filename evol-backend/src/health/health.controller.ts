import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @ApiOperation({ summary: 'Verifica la salud del sistema.' })
  @Get()
  async checkHealth(): Promise<{ status: string; database: boolean }> {
    return this.healthService.checkHealth();
  }
}
