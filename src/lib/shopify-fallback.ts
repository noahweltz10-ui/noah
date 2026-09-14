import type { Product } from "./types";

/**
 * Demo catalog mirroring drop 001 on the live shiftcultr.com Shopify store,
 * used only when NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN / STOREFRONT_TOKEN are not
 * configured. Real storefront data replaces this automatically once the env
 * vars are set — see src/lib/shopify.ts.
 */
function money(amount: string) {
  return { amount, currencyCode: "USD" };
}

function fallbackProduct(
  id: string,
  title: string,
  price: string,
  compareAt: string,
  soldOut = false
): Product {
  return {
    id: `fallback-${id}`,
    handle: id,
    title,
    description: "",
    availableForSale: !soldOut,
    images: [],
    priceRange: { minVariantPrice: money(price) },
    compareAtPriceRange: compareAt
      ? { minVariantPrice: money(compareAt) }
      : null,
    variants: [
      {
        id: `fallback-variant-${id}`,
        title: "Default",
        availableForSale: !soldOut,
        price: money(price),
        compareAtPrice: compareAt ? money(compareAt) : null,
        selectedOptions: [],
      },
    ],
  };
}

export const FALLBACK_PRODUCTS: Product[] = [
  fallbackProduct("shift-cream-pullover", "shift cream pullover", "49.00", "69.99", true),
  fallbackProduct("shift-cream-sweatpants", "shift cream sweatpants", "44.00", "69.99"),
  fallbackProduct("shift-cream-tshirt", "shift cream t-shirt", "35.00", "59.99"),
  fallbackProduct("shift-midnight-pullover", "shift midnight pullover", "49.00", "69.99"),
  fallbackProduct("shift-midnight-sweatpants", "shift midnight sweatpants", "44.00", "69.99"),
  fallbackProduct("shift-midnight-tshirt", "shift midnight t-shirt", "35.00", "59.99"),
];

export const SHOPIFY_IS_CONFIGURED = Boolean(
  process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN &&
    process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN
);
