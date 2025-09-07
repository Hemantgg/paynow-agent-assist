import { Module } from '@nestjs/common';
import { PaymentsModule } from './payments/payments.module';
import { MetricsModule } from './metrics/metrics.service';
import { MetricsController } from './metrics/metrics.controller';

@Module({
  imports: [PaymentsModule],
  controllers: [MetricsController],
  providers: [MetricsModule]
})
export class AppModule {}
