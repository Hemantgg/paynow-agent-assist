import { Controller, Get, Req } from '@nestjs/common';
import { MetricsModule } from './metrics.service';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly m: MetricsModule) {}

  @Get()
  get(@Req() _req: any) {
    return this.m.snapshot();
  }
}
