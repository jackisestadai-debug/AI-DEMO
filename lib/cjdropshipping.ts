/**
 * CJdropshipping Open API v2.0 client — order push only.
 *
 * IMPORTANT: built from CJ's publicly documented API patterns (endpoint paths,
 * header names, request fields cross-checked across multiple independent
 * sources), NOT verified against a live CJ account — their docs domains
 * weren't reachable from this environment while building it. Rate limit per
 * CJ's docs is 1 request/second, which is a non-issue at our order volume.
 * Treat the first real order as a manual-verification test: watch it land in
 * the CJ dashboard and confirm the field mapping before trusting this fully.
 */

const CJ_BASE_URL = "https://developers.cjdropshipping.com/api2.0/v1";

export function isCJConfigured(): boolean {
  return Boolean(process.env.CJ_API_KEY);
}

interface CJTokenResponse {
  code: number;
  result: boolean;
  message: string;
  data?: { accessToken: string; accessTokenExpiryDate: string };
}

async function getCJAccessToken(): Promise<string> {
  const apiKey = process.env.CJ_API_KEY;
  if (!apiKey) throw new Error("CJ_API_KEY is not configured.");

  const res = await fetch(`${CJ_BASE_URL}/authentication/getAccessToken`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ apiKey }),
  });

  const data = (await res.json()) as CJTokenResponse;
  if (!res.ok || !data.result || !data.data?.accessToken) {
    throw new Error(`CJ auth failed: ${data.message || res.status}`);
  }
  // CJ caches tokens server-side and returns the same one for repeat calls
  // within its validity window, so we don't need our own token storage.
  return data.data.accessToken;
}

export interface CJOrderLine {
  cjVariantId: string;
  quantity: number;
}

export interface CJShippingAddress {
  name: string;
  countryCode: string;
  province: string;
  city: string;
  address: string;
  zip: string;
  phone: string;
  email: string;
}

interface CJCreateOrderResponse {
  code: number;
  result: boolean;
  message: string;
  data?: { orderId: string; cjOrderId?: string };
}

export async function createCJOrder(
  orderNumber: string,
  address: CJShippingAddress,
  lines: CJOrderLine[]
): Promise<{ orderId: string } | undefined> {
  const accessToken = await getCJAccessToken();

  const res = await fetch(`${CJ_BASE_URL}/shopping/order/createOrderV2`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "CJ-Access-Token": accessToken,
    },
    body: JSON.stringify({
      orderNumber,
      shippingCountryCode: address.countryCode,
      shippingProvince: address.province,
      shippingCity: address.city,
      shippingAddress: address.address,
      shippingZip: address.zip,
      shippingCustomerName: address.name,
      shippingPhone: address.phone,
      email: address.email,
      // 2 = pay from CJ wallet balance. Requires the CJ account to be
      // pre-funded — an empty wallet makes this call fail, which is caught
      // by the caller and surfaces as status "supplier_push_failed".
      payType: 2,
      products: lines.map((l) => ({ vid: l.cjVariantId, quantity: l.quantity })),
    }),
  });

  const data = (await res.json()) as CJCreateOrderResponse;
  if (!res.ok || !data.result) {
    throw new Error(`CJ order creation failed: ${data.message || res.status}`);
  }
  return data.data ? { orderId: data.data.cjOrderId || data.data.orderId } : undefined;
}
