"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Cart } from "@/lib/types";
import { FALLBACK_PRODUCTS } from "@/lib/shopify-fallback";

const STORAGE_KEY = "shiftculture_cart_id";
const DEMO_STORAGE_KEY = "shiftculture_demo_cart";

type CartContextValue = {
  cart: Cart | null;
  isOpen: boolean;
  isLoading: boolean;
  isConfigured: boolean;
  openCart: () => void;
  closeCart: () => void;
  addLine: (merchandiseId: string, quantity?: number) => Promise<void>;
  updateLine: (lineId: string, quantity: number) => Promise<void>;
  removeLine: (lineId: string) => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

type DemoLine = { id: string; variantId: string; quantity: number };

function findVariant(variantId: string) {
  for (const product of FALLBACK_PRODUCTS) {
    const variant = product.variants.find((v) => v.id === variantId);
    if (variant) return { product, variant };
  }
  return null;
}

function buildDemoCart(lines: DemoLine[]): Cart {
  const cartLines = lines.flatMap((line) => {
    const found = findVariant(line.variantId);
    if (!found) return [];
    return [
      {
        id: line.id,
        quantity: line.quantity,
        merchandise: {
          id: found.variant.id,
          title: found.product.title,
          product: { title: found.product.title, handle: found.product.handle },
          image: found.product.images[0] ?? null,
          price: found.variant.price,
        },
      },
    ];
  });

  const totalQuantity = cartLines.reduce((sum, l) => sum + l.quantity, 0);
  const subtotal = cartLines.reduce(
    (sum, l) => sum + Number(l.merchandise.price.amount) * l.quantity,
    0
  );

  return {
    id: "demo-cart",
    checkoutUrl: "",
    totalQuantity,
    cost: {
      subtotalAmount: { amount: subtotal.toFixed(2), currencyCode: "USD" },
      totalAmount: { amount: subtotal.toFixed(2), currencyCode: "USD" },
    },
    lines: cartLines,
  };
}

export function CartProvider({
  children,
  isConfigured,
}: {
  children: React.ReactNode;
  isConfigured: boolean;
}) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [demoLines, setDemoLines] = useState<DemoLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Real Shopify mode: restore a persisted cart id.
  useEffect(() => {
    if (!isConfigured) return;
    const id = window.localStorage.getItem(STORAGE_KEY);
    if (!id) return;
    fetch(`/api/cart?id=${encodeURIComponent(id)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.cart) setCart(data.cart);
        else window.localStorage.removeItem(STORAGE_KEY);
      })
      .catch(() => {});
  }, [isConfigured]);

  // Demo mode: restore locally-stored lines (no Shopify credentials needed).
  // Intentionally deferred to an effect (not a lazy useState initializer) so
  // the first client render matches the server-rendered empty cart — only
  // then does it sync in whatever localStorage has, post-hydration.
  useEffect(() => {
    if (isConfigured) return;
    try {
      const raw = window.localStorage.getItem(DEMO_STORAGE_KEY);
      if (raw) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- restoring browser-only state after hydration, deliberately not on first render
        setDemoLines(JSON.parse(raw));
      }
    } catch {
      // ignore malformed local state
    }
  }, [isConfigured]);

  useEffect(() => {
    if (isConfigured) return;
    window.localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(demoLines));
  }, [demoLines, isConfigured]);

  const persist = useCallback((next: Cart | null) => {
    setCart(next);
    if (next) window.localStorage.setItem(STORAGE_KEY, next.id);
  }, []);

  const addLine = useCallback(
    async (merchandiseId: string, quantity = 1) => {
      if (!isConfigured) {
        setDemoLines((prev) => {
          const existing = prev.find((l) => l.variantId === merchandiseId);
          if (existing) {
            return prev.map((l) =>
              l.variantId === merchandiseId
                ? { ...l, quantity: l.quantity + quantity }
                : l
            );
          }
          return [
            ...prev,
            { id: `demo-line-${merchandiseId}-${Date.now()}`, variantId: merchandiseId, quantity },
          ];
        });
        setIsOpen(true);
        return;
      }

      setIsLoading(true);
      try {
        const res = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cartId: cart?.id, merchandiseId, quantity }),
        });
        const data = await res.json();
        if (data.cart) {
          persist(data.cart);
          setIsOpen(true);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [cart?.id, isConfigured, persist]
  );

  const updateLine = useCallback(
    async (lineId: string, quantity: number) => {
      if (!isConfigured) {
        setDemoLines((prev) =>
          quantity <= 0
            ? prev.filter((l) => l.id !== lineId)
            : prev.map((l) => (l.id === lineId ? { ...l, quantity } : l))
        );
        return;
      }

      if (!cart) return;
      setIsLoading(true);
      try {
        const res = await fetch("/api/cart", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cartId: cart.id, lineId, quantity }),
        });
        const data = await res.json();
        if (data.cart) persist(data.cart);
      } finally {
        setIsLoading(false);
      }
    },
    [cart, isConfigured, persist]
  );

  const removeLine = useCallback(
    async (lineId: string) => {
      if (!isConfigured) {
        setDemoLines((prev) => prev.filter((l) => l.id !== lineId));
        return;
      }

      if (!cart) return;
      setIsLoading(true);
      try {
        const res = await fetch("/api/cart", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cartId: cart.id, lineId }),
        });
        const data = await res.json();
        if (data.cart) persist(data.cart);
      } finally {
        setIsLoading(false);
      }
    },
    [cart, isConfigured, persist]
  );

  const effectiveCart = isConfigured ? cart : buildDemoCart(demoLines);

  const value = useMemo(
    () => ({
      cart: effectiveCart,
      isOpen,
      isLoading,
      isConfigured,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addLine,
      updateLine,
      removeLine,
    }),
    [effectiveCart, isOpen, isLoading, isConfigured, addLine, updateLine, removeLine]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
