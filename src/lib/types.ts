export type ProductImage = {
  url: string;
  altText: string | null;
  width: number;
  height: number;
};

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: { amount: string; currencyCode: string };
  compareAtPrice: { amount: string; currencyCode: string } | null;
  selectedOptions: { name: string; value: string }[];
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  description: string;
  availableForSale: boolean;
  images: ProductImage[];
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  compareAtPriceRange: {
    minVariantPrice: { amount: string; currencyCode: string };
  } | null;
  variants: ProductVariant[];
};

export type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: { amount: string; currencyCode: string };
    totalAmount: { amount: string; currencyCode: string };
  };
  lines: {
    id: string;
    quantity: number;
    merchandise: {
      id: string;
      title: string;
      product: { title: string; handle: string };
      image: ProductImage | null;
      price: { amount: string; currencyCode: string };
    };
  }[];
};
