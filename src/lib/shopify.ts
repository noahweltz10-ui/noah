import "server-only";
import type { Cart, Product } from "./types";
import { FALLBACK_PRODUCTS, SHOPIFY_IS_CONFIGURED } from "./shopify-fallback";

const DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN;
const API_VERSION = "2025-01";

async function shopifyFetch<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T | null> {
  if (!DOMAIN || !TOKEN) return null;

  const res = await fetch(
    `https://${DOMAIN}/api/${API_VERSION}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": TOKEN,
      },
      body: JSON.stringify({ query, variables }),
      next: { revalidate: 60 },
    }
  );

  if (!res.ok) {
    console.error("Shopify Storefront API error", res.status, await res.text());
    return null;
  }

  const json = await res.json();
  if (json.errors) {
    console.error("Shopify Storefront API GraphQL error", json.errors);
    return null;
  }
  return json.data as T;
}

const PRODUCT_FIELDS = `
  id
  handle
  title
  description
  availableForSale
  images(first: 6) {
    nodes { url altText width height }
  }
  priceRange { minVariantPrice { amount currencyCode } }
  compareAtPriceRange { minVariantPrice { amount currencyCode } }
  variants(first: 10) {
    nodes {
      id
      title
      availableForSale
      price { amount currencyCode }
      compareAtPrice { amount currencyCode }
      selectedOptions { name value }
    }
  }
`;

type ProductsResponse = {
  products: { nodes: (Omit<Product, "images" | "variants"> & {
    images: { nodes: Product["images"] };
    variants: { nodes: Product["variants"] };
  })[] };
};

export async function getProducts(): Promise<{
  products: Product[];
  live: boolean;
}> {
  const data = await shopifyFetch<ProductsResponse>(`
    query Products {
      products(first: 12, sortKey: CREATED_AT, reverse: true) {
        nodes { ${PRODUCT_FIELDS} }
      }
    }
  `);

  if (!data) {
    return { products: FALLBACK_PRODUCTS, live: false };
  }

  const products = data.products.nodes.map((p) => ({
    ...p,
    images: p.images.nodes,
    variants: p.variants.nodes,
  }));

  return { products, live: true };
}

type ProductResponse = {
  product:
    | (Omit<Product, "images" | "variants"> & {
        images: { nodes: Product["images"] };
        variants: { nodes: Product["variants"] };
      })
    | null;
};

export async function getProduct(
  handle: string
): Promise<{ product: Product | null; live: boolean }> {
  const data = await shopifyFetch<ProductResponse>(
    `query ProductByHandle($handle: String!) {
      product(handle: $handle) { ${PRODUCT_FIELDS} }
    }`,
    { handle }
  );

  if (!data) {
    const fallback = FALLBACK_PRODUCTS.find((p) => p.handle === handle) ?? null;
    return { product: fallback, live: false };
  }

  if (!data.product) return { product: null, live: true };

  return {
    product: {
      ...data.product,
      images: data.product.images.nodes,
      variants: data.product.variants.nodes,
    },
    live: true,
  };
}

export const isShopifyConfigured = SHOPIFY_IS_CONFIGURED;

const CART_FIELDS = `
  id
  checkoutUrl
  totalQuantity
  cost {
    subtotalAmount { amount currencyCode }
    totalAmount { amount currencyCode }
  }
  lines(first: 50) {
    nodes {
      id
      quantity
      merchandise {
        ... on ProductVariant {
          id
          title
          product { title handle }
          image { url altText width height }
          price { amount currencyCode }
        }
      }
    }
  }
`;

export async function createCart(): Promise<Cart | null> {
  const data = await shopifyFetch<{ cartCreate: { cart: Cart } }>(
    `mutation CartCreate {
      cartCreate {
        cart { ${CART_FIELDS} }
      }
    }`
  );
  return data?.cartCreate.cart ?? null;
}

export async function getCart(cartId: string): Promise<Cart | null> {
  const data = await shopifyFetch<{ cart: Cart | null }>(
    `query GetCart($id: ID!) {
      cart(id: $id) { ${CART_FIELDS} }
    }`,
    { id: cartId }
  );
  return data?.cart ?? null;
}

export async function addCartLine(
  cartId: string,
  merchandiseId: string,
  quantity = 1
): Promise<Cart | null> {
  const data = await shopifyFetch<{ cartLinesAdd: { cart: Cart } }>(
    `mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart { ${CART_FIELDS} }
      }
    }`,
    { cartId, lines: [{ merchandiseId, quantity }] }
  );
  return data?.cartLinesAdd.cart ?? null;
}

export async function updateCartLine(
  cartId: string,
  lineId: string,
  quantity: number
): Promise<Cart | null> {
  const data = await shopifyFetch<{ cartLinesUpdate: { cart: Cart } }>(
    `mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart { ${CART_FIELDS} }
      }
    }`,
    { cartId, lines: [{ id: lineId, quantity }] }
  );
  return data?.cartLinesUpdate.cart ?? null;
}

export async function removeCartLine(
  cartId: string,
  lineId: string
): Promise<Cart | null> {
  const data = await shopifyFetch<{ cartLinesRemove: { cart: Cart } }>(
    `mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart { ${CART_FIELDS} }
      }
    }`,
    { cartId, lineIds: [lineId] }
  );
  return data?.cartLinesRemove.cart ?? null;
}
