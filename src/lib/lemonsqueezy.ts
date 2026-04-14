import {
  lemonSqueezySetup,
  getSubscription,
  cancelSubscription,
  type Subscription,
} from '@lemonsqueezy/lemonsqueezy.js';

export { getSubscription, cancelSubscription };
export type { Subscription };

export function initLemonSqueezy() {
  lemonSqueezySetup({
    apiKey: process.env.LEMONSQUEEZY_API_KEY ?? '',
    onError: (error) => console.error('[lemonsqueezy]', error),
  });
}

export function verifyWebhookSignature(
  rawBody: string,
  signature: string,
  secret: string,
): boolean {
  const { createHmac } = require('crypto') as typeof import('crypto');
  const hmac = createHmac('sha256', secret);
  hmac.update(rawBody);
  const digest = hmac.digest('hex');
  return digest === signature;
}

export function getCheckoutUrl(variantId: string, userEmail: string, userId: string): string {
  const base = `https://checkout.lemonsqueezy.com/buy/${variantId}`;
  const params = new URLSearchParams({
    'checkout[email]': userEmail,
    'checkout[custom][user_id]': userId,
  });
  return `${base}?${params.toString()}`;
}
