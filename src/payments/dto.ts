import { IsNumber, IsPositive, IsString, IsUUID, IsOptional, IsIn } from 'class-validator';

export class DecidePaymentDto {
  @IsString() customerId!: string;
  @IsNumber() @IsPositive() amount!: number;
  @IsString() @IsIn(['USD', 'EUR', 'INR']) currency!: string;
  @IsString() payeeId!: string;
  @IsString() idempotencyKey!: string; // could be uuid but allow any stable id for demo
}

export type DecideResponse = {
  decision: 'allow' | 'review' | 'block';
  reasons: string[];
  agentTrace: { step: string; detail: string }[];
  requestId: string;
};
