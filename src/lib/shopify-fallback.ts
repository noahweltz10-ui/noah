import type { Product } from "./types";

/**
 * Demo catalog mirroring drop 001 on the live shiftcultr.com Shopify store,
 * used only when NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN / STOREFRONT_TOKEN are not
 * configured. Real storefront data replaces this automatically once the env
 * vars are set — see src/lib/shopify.ts. Titles, prices, descriptions, and
 * per-size stock below are copied verbatim from the real product pages.
 */
function money(amount: string) {
  return { amount, currencyCode: "USD" };
}

const SIZES = ["S", "M", "L", "XL"] as const;
type Size = (typeof SIZES)[number];
type SizeAvailability = Record<Size, boolean>;

function productImages(id: string, frontSize: [number, number]) {
  return [
    {
      url: `/products/${id}-front.webp`,
      altText: null,
      width: frontSize[0],
      height: frontSize[1],
    },
    {
      url: `/products/${id}-back.webp`,
      altText: null,
      width: 832,
      height: 1248,
    },
  ];
}

function fallbackProduct(
  id: string,
  title: string,
  price: string,
  compareAt: string,
  description: string,
  sizes: SizeAvailability,
  frontSize: [number, number] = [832, 1248]
): Product {
  const variants = SIZES.map((size) => ({
    id: `fallback-variant-${id}-${size.toLowerCase()}`,
    title: size,
    availableForSale: sizes[size],
    price: money(price),
    compareAtPrice: compareAt ? money(compareAt) : null,
    selectedOptions: [{ name: "Size", value: size }],
  }));

  return {
    id: `fallback-${id}`,
    handle: id,
    title,
    description,
    availableForSale: variants.some((v) => v.availableForSale),
    images: productImages(id, frontSize),
    priceRange: { minVariantPrice: money(price) },
    compareAtPriceRange: compareAt
      ? { minVariantPrice: money(compareAt) }
      : null,
    variants,
  };
}

const PULLOVER_DESCRIPTION =
  "Crafted from premium heavyweight cotton fleece with a substantial, structured feel and an exceptionally soft interior. Cut in an oversized, boxy silhouette with dropped shoulders for a refined drape and elevated fit. Finished with a sculpted, drawstring-free hood, reinforced kangaroo pocket, durable ribbed cuffs and hem, and precise stitching throughout. A minimal black shift wordmark is centered on the chest. Built with an emphasis on fabric weight, construction, fit, and lasting quality.";

const SWEATPANTS_DESCRIPTION =
  "Crafted from premium heavyweight cotton fleece for a substantial, soft feel and structured drape. Designed with a relaxed silhouette that provides room through the leg while maintaining a clean, refined shape. Finished with a comfortable ribbed waistband, tonal drawcords, deep side pockets, and durable ribbed ankle cuffs. A minimal black shift wordmark sits subtly on the upper thigh. Precise stitching and elevated construction throughout make these an everyday essential built around comfort, durability, and premium quality.";

const CREAM_TSHIRT_DESCRIPTION =
  "The shift cream t-shirt is a wardrobe essential designed for everyday comfort and versatility. Crafted from soft, breathable fabric, this classic tee pairs effortlessly with jeans, shorts, or layered pieces for a polished look. The neutral cream tone complements any style, making it perfect for casual outings, work, or relaxed weekends. Whether worn solo or as a base layer, this timeless piece delivers quality and style that works as hard as you do.";

const MIDNIGHT_TSHIRT_DESCRIPTION =
  "The Shift Midnight T-Shirt brings understated style to your everyday rotation. Crafted for comfort and versatility, this essential tee pairs effortlessly with jeans, shorts, or layered pieces. Perfect for those who value quality basics that work as hard as you do. A wardrobe staple that never goes out of style.";

export const FALLBACK_PRODUCTS: Product[] = [
  fallbackProduct(
    "shift-cream-pullover",
    "shift cream pullover",
    "49.00",
    "69.99",
    PULLOVER_DESCRIPTION,
    { S: false, M: false, L: false, XL: false }
  ),
  fallbackProduct(
    "shift-cream-sweatpants",
    "shift cream sweatpants",
    "44.00",
    "69.99",
    SWEATPANTS_DESCRIPTION,
    { S: false, M: true, L: false, XL: false },
    [1024, 1536]
  ),
  fallbackProduct(
    "shift-cream-tshirt",
    "shift cream t-shirt",
    "35.00",
    "59.99",
    CREAM_TSHIRT_DESCRIPTION,
    { S: false, M: true, L: false, XL: false }
  ),
  fallbackProduct(
    "shift-midnight-pullover",
    "shift midnight pullover",
    "49.00",
    "69.99",
    PULLOVER_DESCRIPTION,
    { S: true, M: false, L: false, XL: false }
  ),
  fallbackProduct(
    "shift-midnight-sweatpants",
    "shift midnight sweatpants",
    "44.00",
    "69.99",
    SWEATPANTS_DESCRIPTION,
    { S: true, M: false, L: false, XL: false }
  ),
  fallbackProduct(
    "shift-midnight-tshirt",
    "shift midnight t-shirt",
    "35.00",
    "59.99",
    MIDNIGHT_TSHIRT_DESCRIPTION,
    { S: true, M: false, L: false, XL: false }
  ),
];

export const SHOPIFY_IS_CONFIGURED = Boolean(
  process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN &&
    process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN
);
