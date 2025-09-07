import { Body, Controller, Post, Req, UseGuards, BadRequestException } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { DecidePaymentDto, DecideResponse } from './dto';
import { ApiKeyGuard } from '../common/api-key.guard';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly service: PaymentsService) {}

  @UseGuards(ApiKeyGuard)
  @Post('decide')
  async decide(@Body() dto: DecidePaymentDto, @Req() req: any): Promise<DecideResponse> {
    if (!dto || !dto.customerId || !dto.payeeId || !dto.idempotencyKey) {
      throw new BadRequestException('missing required fields');
    }
    return this.service.decide(dto, req.requestId);
  }
}
