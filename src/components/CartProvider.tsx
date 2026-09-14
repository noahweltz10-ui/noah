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

const STORAGE_KEY = "shiftculture_cart_id";

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

export function CartProvider({
  children,
  isConfigured,
}: {
  children: React.ReactNode;
  isConfigured: boolean;
}) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const persist = useCallback((next: Cart | null) => {
    setCart(next);
    if (next) window.localStorage.setItem(STORAGE_KEY, next.id);
  }, []);

  const addLine = useCallback(
    async (merchandiseId: string, quantity = 1) => {
      if (!isConfigured) return;
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
      if (!isConfigured || !cart) return;
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
      if (!isConfigured || !cart) return;
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

  const value = useMemo(
    () => ({
      cart,
      isOpen,
      isLoading,
      isConfigured,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addLine,
      updateLine,
      removeLine,
    }),
    [cart, isOpen, isLoading, isConfigured, addLine, updateLine, removeLine]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
