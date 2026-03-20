"use client";

import { Product } from "../types";
import { useCart } from "../context/CartContext";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { items, addToCart } = useCart();

  const cartItem = items.find((i) => i.product.id === product.id);
  const reservedQty = cartItem?.quantity ?? 0;
  const availableStock = product.stock - reservedQty;

  const handleAdd = () => {
    if (availableStock <= 0) return;
    addToCart(product);
  };

  return (
    <tr className="group hover:bg-slate-50 dark:hover:bg-zinc-800/40 transition-colors">
      <td className="py-3 px-4">
        <span className="font-mono text-[11px] font-semibold text-slate-500 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-800 px-2 py-1 rounded-md tracking-wide">
          {product.code}
        </span>
      </td>
      <td className="py-3 px-4">
        <span className="text-sm text-zinc-800 dark:text-zinc-100">
          {product.name}
        </span>
      </td>
      <td className="py-3 px-4 text-right">
        <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 tabular-nums">
          {product.price.toLocaleString()}
        </span>
      </td>
      <td className="py-3 px-4 text-center">
        {availableStock > 5 ? (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            {availableStock}
          </span>
        ) : availableStock > 0 ? (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
            {availableStock}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
            หมด
          </span>
        )}
      </td>
      <td className="py-3 px-4 text-center">
        <button
          onClick={handleAdd}
          disabled={availableStock <= 0}
          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all
            disabled:bg-slate-100 disabled:text-slate-300 disabled:cursor-not-allowed
            dark:disabled:bg-zinc-800 dark:disabled:text-zinc-600
            bg-zinc-900 text-white hover:bg-zinc-700 active:scale-95
            dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
        >
          {availableStock <= 0 ? "หมด" : "+ ใส่ตะกร้า"}
        </button>
      </td>
    </tr>
  );
}
