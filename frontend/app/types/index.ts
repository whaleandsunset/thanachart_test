export interface Product {
  id: number;
  code: string;
  name: string;
  price: number;
  stock: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CheckoutResult {
  message: string;
  items: {
    productId: number;
    code: string;
    name: string;
    price: number;
    quantity: number;
    subtotal: number;
  }[];
  totalAmount: number;
}
