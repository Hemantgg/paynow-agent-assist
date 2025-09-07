import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { AgentService } from '../agent/agent.service';
import { ApiKeyGuard } from '../common/api-key.guard';
import { MetricsModule } from '../metrics/metrics.service';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService, AgentService, ApiKeyGuard, MetricsModule]
})
export class PaymentsModule {}
