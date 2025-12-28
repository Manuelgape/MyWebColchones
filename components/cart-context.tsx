 "use client";

 import {
   createContext,
   useCallback,
   useContext,
   useEffect,
   useMemo,
   useState,
   type ReactNode,
 } from "react";

 type CartItem = {
   id: string;
   productSlug: string;
   name: string;
   variantName: string;
   size: string;
   price: number;
   image: string;
   quantity: number;
 };

 type CartContextValue = {
   items: CartItem[];
   addItem: (item: CartItem) => void;
   removeItem: (id: string) => void;
   updateQuantity: (id: string, quantity: number) => void;
   clear: () => void;
 };

 const CartContext = createContext<CartContextValue | undefined>(undefined);

 const STORAGE_KEY = "mywebcolchones-cart";

 function loadCart(): CartItem[] {
   if (typeof window === "undefined") {
     return [];
   }

   const raw = window.localStorage.getItem(STORAGE_KEY);
   if (!raw) {
     return [];
   }

   try {
     const parsed = JSON.parse(raw) as CartItem[];
     return Array.isArray(parsed) ? parsed : [];
   } catch {
     return [];
   }
 }

 function persistCart(items: CartItem[]) {
   if (typeof window === "undefined") {
     return;
   }

   window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
 }

 export function CartProvider({ children }: { children: ReactNode }) {
   const [items, setItems] = useState<CartItem[]>([]);

   useEffect(() => {
     setItems(loadCart());
   }, []);

   useEffect(() => {
     persistCart(items);
   }, [items]);

   const addItem = useCallback((item: CartItem) => {
     setItems((current) => {
       const existing = current.find((entry) => entry.id === item.id);
       if (!existing) {
         return [...current, item];
       }

       return current.map((entry) =>
         entry.id === item.id
           ? { ...entry, quantity: entry.quantity + item.quantity }
           : entry
       );
     });
   }, []);

   const removeItem = useCallback((id: string) => {
     setItems((current) => current.filter((entry) => entry.id !== id));
   }, []);

   const updateQuantity = useCallback((id: string, quantity: number) => {
     setItems((current) =>
       current.map((entry) =>
         entry.id === id ? { ...entry, quantity } : entry
       )
     );
   }, []);

   const clear = useCallback(() => {
     setItems([]);
   }, []);

   const value = useMemo(
     () => ({
       items,
       addItem,
       removeItem,
       updateQuantity,
       clear,
     }),
     [items, addItem, removeItem, updateQuantity, clear]
   );

   return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
 }

 export function useCart() {
   const context = useContext(CartContext);
   if (!context) {
     throw new Error("useCart must be used within CartProvider");
   }
   return context;
 }

 export type { CartItem };
