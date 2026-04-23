"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type CartItemType = "supplement" | "complement" | "material";

export interface CartItem {
  id: string;
  type: CartItemType;
  name: string;
  slug: string;
  image: string | null;
  price: number;
  quantity: number;
  category: string;
  detailPath: string;
}

export interface CompletedOrder {
  orderNumber: string;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  customerName: string;
  deliveryAddress: string;
  city: string;
  cardLast4: string;
  placedAt: string;
  estimatedDelivery: string;
  maxDeliveryDate: string;
}

interface AddCartItemInput {
  id: string;
  type: CartItemType;
  name: string;
  slug: string;
  image: string | null;
  price: number;
  category: string;
  detailPath: string;
}

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  lastOrder: CompletedOrder | null;
  orderHistory: CompletedOrder[];
  isOpen: boolean;
  setIsOpen: (nextOpen: boolean) => void;
  addItem: (item: AddCartItemInput) => void;
  removeItem: (id: string, type: CartItemType) => void;
  updateQuantity: (id: string, type: CartItemType, quantity: number) => void;
  clearCart: () => void;
  completeOrder: (order: CompletedOrder) => void;
}

const STORAGE_KEY = "groceryCart";
const ORDER_STORAGE_KEY = "lastCompletedOrder";
const ORDER_HISTORY_STORAGE_KEY = "orderHistory";

const CartContext = createContext<CartContextValue | undefined>(undefined);

const readStorageValue = <T,>(key: string, fallback: T): T => {
  if (typeof window === "undefined") {
    return fallback;
  }

  const storedValue = window.localStorage.getItem(key);
  if (!storedValue) {
    return fallback;
  }

  try {
    return JSON.parse(storedValue) as T;
  } catch {
    window.localStorage.removeItem(key);
    return fallback;
  }
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() =>
    readStorageValue<CartItem[]>(STORAGE_KEY, []),
  );
  const [lastOrder, setLastOrder] = useState<CompletedOrder | null>(() =>
    readStorageValue<CompletedOrder | null>(ORDER_STORAGE_KEY, null),
  );
  const [orderHistory, setOrderHistory] = useState<CompletedOrder[]>(() =>
    readStorageValue<CompletedOrder[]>(ORDER_HISTORY_STORAGE_KEY, []),
  );
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (!lastOrder) {
      window.localStorage.removeItem(ORDER_STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(lastOrder));
  }, [lastOrder]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(
      ORDER_HISTORY_STORAGE_KEY,
      JSON.stringify(orderHistory),
    );
  }, [orderHistory]);

  const addItem = useCallback((item: AddCartItemInput) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (currentItem) =>
          currentItem.id === item.id && currentItem.type === item.type,
      );

      if (existingItem) {
        return currentItems.map((currentItem) =>
          currentItem.id === item.id && currentItem.type === item.type
            ? { ...currentItem, quantity: currentItem.quantity + 1 }
            : currentItem,
        );
      }

      return [...currentItems, { ...item, quantity: 1 }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((id: string, type: CartItemType) => {
    setItems((currentItems) =>
      currentItems.filter(
        (currentItem) => !(currentItem.id === id && currentItem.type === type),
      ),
    );
  }, []);

  const updateQuantity = useCallback(
    (id: string, type: CartItemType, quantity: number) => {
      if (quantity <= 0) {
        removeItem(id, type);
        return;
      }

      setItems((currentItems) =>
        currentItems.map((currentItem) =>
          currentItem.id === id && currentItem.type === type
            ? { ...currentItem, quantity }
            : currentItem,
        ),
      );
    },
    [removeItem],
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const completeOrder = useCallback((order: CompletedOrder) => {
    setLastOrder(order);
    setOrderHistory((currentHistory) => [order, ...currentHistory]);
    setItems([]);
    setIsOpen(false);
  }, []);

  const itemCount = useMemo(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  const subtotal = useMemo(() => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [items]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      itemCount,
      subtotal,
      lastOrder,
      orderHistory,
      isOpen,
      setIsOpen,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      completeOrder,
    }),
    [
      items,
      itemCount,
      subtotal,
      lastOrder,
      orderHistory,
      isOpen,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      completeOrder,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextValue => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
};
