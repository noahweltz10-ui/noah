import { NextRequest, NextResponse } from "next/server";
import {
  addCartLine,
  createCart,
  getCart,
  isShopifyConfigured,
  removeCartLine,
  updateCartLine,
} from "@/lib/shopify";

function notConfigured() {
  return NextResponse.json(
    {
      error:
        "Shopify Storefront API is not configured. Add NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN and NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN to enable real checkout.",
    },
    { status: 503 }
  );
}

export async function GET(req: NextRequest) {
  if (!isShopifyConfigured) return notConfigured();
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ cart: null });
  const cart = await getCart(id);
  return NextResponse.json({ cart });
}

export async function POST(req: NextRequest) {
  if (!isShopifyConfigured) return notConfigured();
  const body = await req.json().catch(() => ({}));
  const { cartId, merchandiseId, quantity } = body as {
    cartId?: string;
    merchandiseId?: string;
    quantity?: number;
  };

  if (!merchandiseId) {
    const cart = await createCart();
    return NextResponse.json({ cart });
  }

  let id = cartId;
  if (!id) {
    const fresh = await createCart();
    if (!fresh) return NextResponse.json({ cart: null }, { status: 502 });
    id = fresh.id;
  }

  const cart = await addCartLine(id, merchandiseId, quantity ?? 1);
  return NextResponse.json({ cart });
}

export async function PATCH(req: NextRequest) {
  if (!isShopifyConfigured) return notConfigured();
  const { cartId, lineId, quantity } = (await req.json()) as {
    cartId: string;
    lineId: string;
    quantity: number;
  };
  const cart = await updateCartLine(cartId, lineId, quantity);
  return NextResponse.json({ cart });
}

export async function DELETE(req: NextRequest) {
  if (!isShopifyConfigured) return notConfigured();
  const { cartId, lineId } = (await req.json()) as {
    cartId: string;
    lineId: string;
  };
  const cart = await removeCartLine(cartId, lineId);
  return NextResponse.json({ cart });
}
