import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem } from "@/types";

interface CartState {
  items: CartItem[];
  totalPrice: number;
}

const initialState: CartState = {
  items: [],
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existing = state.items.find(
        (item) => item.product === action.payload.product
      );
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push(action.payload);
      }
      state.totalPrice += action.payload.price;
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      const item = state.items.find((i) => i.product === action.payload);
      if (item) {
        state.totalPrice -= item.price * item.quantity;
        state.items = state.items.filter((i) => i.product !== action.payload);
      }
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>
    ) => {
      const item = state.items.find(
        (i) => i.product === action.payload.productId
      );
      if (item) {
        state.totalPrice -= item.price * item.quantity;
        item.quantity = action.payload.quantity;
        state.totalPrice += item.price * item.quantity;
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.totalPrice = 0;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;