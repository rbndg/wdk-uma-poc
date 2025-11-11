import { paymentQueries, PaymentRequest } from '../db/database';

export class PaymentService {
  createPaymentRequest(
    userId: number,
    nonce: string,
    amountMsats: number,
    currency?: string,
    invoice?: string
  ): number {
    const result = paymentQueries.create.run(
      userId,
      nonce,
      amountMsats,
      currency,
      invoice
    );
    return result.lastInsertRowid as number;
  }

  getPaymentRequestByNonce(nonce: string): PaymentRequest | undefined {
    return paymentQueries.findByNonce.get(nonce) as PaymentRequest | undefined;
  }
}

export const paymentService = new PaymentService();

