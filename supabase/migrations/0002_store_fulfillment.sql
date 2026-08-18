alter table public.orders add column if not exists phone text;
alter table public.orders add column if not exists cj_order_id text;

-- Order status lifecycle (informational, not enforced by a check constraint):
-- pending_payment          -> Stripe checkout session created, awaiting payment
-- paid                     -> Stripe webhook confirmed checkout.session.completed
-- sent_to_supplier         -> pushed to CJdropshipping, cj_order_id set
-- awaiting_supplier_mapping -> paid, but a product is missing its cjVariantId
-- supplier_push_failed     -> paid, CJ push attempted and failed — needs a manual order
-- paid_awaiting_manual_fulfillment -> paid, CJ_API_KEY not configured yet
-- test_order_no_payment    -> checkout ran with no Stripe key configured (dev/test mode)
