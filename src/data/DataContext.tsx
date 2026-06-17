import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { api } from "../lib/api";
import { discountedPrice } from "../lib/format";
import { BRAND } from "../lib/brand";
import type {
  Category,
  CartItem,
  Fulfilment,
  Order,
  OrderStatus,
  PaymentMethod,
  Product,
} from "./types";

// ---------------------------------------------------------------------------
// DataContext — the app's view of server data + the client-side cart.
// Catalog (categories/products) loads from the API on mount. Orders load on
// demand for the admin. Every write hits the API then refetches so the
// storefront and admin stay in sync. Components never call the API directly.
// ---------------------------------------------------------------------------

const CART_KEY = "mamas-cookies:cart:v1";

function loadCart(): CartItem[] {
  if (typeof localStorage === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) ?? "[]");
  } catch {
    return [];
  }
}

type CheckoutInput = {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  address?: string;
  fulfilment: Fulfilment;
  paymentMethod: PaymentMethod;
};

type DataContextValue = {
  categories: Category[];
  products: Product[];
  orders: Order[];
  catalogLoading: boolean;

  // cart
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  deliveryFee: number;
  cartTotal: number;
  addToCart: (productId: string, quantity?: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;

  // lookups
  getProduct: (id: string) => Product | undefined;
  getCategory: (id: string) => Category | undefined;
  countProductsInCategory: (id: string) => number;

  // catalog admin
  addProduct: (input: Omit<Product, "id">) => Promise<void>;
  updateProduct: (id: string, patch: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addCategory: (input: Omit<Category, "id">) => Promise<void>;
  updateCategory: (id: string, patch: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<boolean>;

  // orders
  refreshOrders: () => Promise<void>;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;

  // checkout -> returns the gateway URL to redirect the browser to
  checkout: (input: CheckoutInput) => Promise<{ redirectUrl: string }>;
};

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>(loadCart);

  const refreshCatalog = useCallback(async () => {
    const [cats, prods] = await Promise.all([
      api.categories(),
      api.products(),
    ]);
    setCategories(cats);
    setProducts(prods);
  }, []);

  const refreshOrders = useCallback(async () => {
    setOrders(await api.adminOrders());
  }, []);

  useEffect(() => {
    refreshCatalog().finally(() => setCatalogLoading(false));
  }, [refreshCatalog]);

  // Persist the cart whenever it changes.
  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  const getProduct = useCallback(
    (id: string) => products.find((p) => p.id === id),
    [products],
  );
  const getCategory = useCallback(
    (id: string) => categories.find((c) => c.id === id),
    [categories],
  );
  const countProductsInCategory = useCallback(
    (id: string) => products.filter((p) => p.categoryId === id).length,
    [products],
  );

  // ---- cart actions ----
  const addToCart = useCallback((productId: string, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === productId
            ? { ...i, quantity: i.quantity + quantity }
            : i,
        );
      }
      return [...prev, { productId, quantity }];
    });
  }, []);

  const setQuantity = useCallback((productId: string, quantity: number) => {
    setCart((prev) =>
      quantity <= 0
        ? prev.filter((i) => i.productId !== productId)
        : prev.map((i) => (i.productId === productId ? { ...i, quantity } : i)),
    );
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  // ---- derived cart numbers ----
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const cartSubtotal = cart.reduce((sum, i) => {
    const p = products.find((pr) => pr.id === i.productId);
    if (!p) return sum;
    return sum + discountedPrice(p.price, p.discountPercent) * i.quantity;
  }, 0);
  const deliveryFee =
    cartSubtotal === 0 || cartSubtotal >= BRAND.freeDeliveryOver
      ? 0
      : BRAND.deliveryFee;
  const cartTotal = cartSubtotal + deliveryFee;

  const value: DataContextValue = useMemo(
    () => ({
      categories,
      products,
      orders,
      catalogLoading,

      cart,
      cartCount,
      cartSubtotal,
      deliveryFee,
      cartTotal,
      addToCart,
      setQuantity,
      removeFromCart,
      clearCart,

      getProduct,
      getCategory,
      countProductsInCategory,

      addProduct: async (input) => {
        await api.addProduct(input);
        await refreshCatalog();
      },
      updateProduct: async (id, patch) => {
        await api.updateProduct(id, patch);
        await refreshCatalog();
      },
      deleteProduct: async (id) => {
        await api.deleteProduct(id);
        await refreshCatalog();
      },
      addCategory: async (input) => {
        await api.addCategory(input);
        await refreshCatalog();
      },
      updateCategory: async (id, patch) => {
        await api.updateCategory(id, patch);
        await refreshCatalog();
      },
      deleteCategory: async (id) => {
        try {
          await api.deleteCategory(id);
          await refreshCatalog();
          return true;
        } catch {
          return false;
        }
      },

      refreshOrders,
      updateOrderStatus: async (id, status) => {
        await api.setOrderStatus(id, status);
        await refreshOrders();
      },

      checkout: async (input) => {
        const { redirectUrl } = await api.checkout({ ...input, items: cart });
        return { redirectUrl };
      },
    }),
    [
      categories,
      products,
      orders,
      catalogLoading,
      cart,
      cartCount,
      cartSubtotal,
      deliveryFee,
      cartTotal,
      addToCart,
      setQuantity,
      removeFromCart,
      clearCart,
      getProduct,
      getCategory,
      countProductsInCategory,
      refreshCatalog,
      refreshOrders,
    ],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useData(): DataContextValue {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within a DataProvider");
  return ctx;
}
