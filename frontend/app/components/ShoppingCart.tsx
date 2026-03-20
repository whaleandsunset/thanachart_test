"use client";

import { useState } from "react";
import { useCart } from "../context/CartContext";
import { checkout } from "../lib/api";
import { Product, CheckoutResult } from "../types";

interface Props {
  onCheckoutSuccess?: () => void;
}

export default function ShoppingCart({ onCheckoutSuccess }: Props) {
  const { items, removeFromCart, increaseQty, decreaseQty, clearCart, totalAmount, totalItems } = useCart();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CheckoutResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleIncrease = (product: Product) => {
    const cartItem = items.find((i) => i.product.id === product.id);
    if (!cartItem) return;
    if (product.stock - cartItem.quantity <= 0) return;
    increaseQty(product.id);
  };

  const handleDecrease = (product: Product) => {
    const cartItem = items.find((i) => i.product.id === product.id);
    if (!cartItem) return;
    if (cartItem.quantity <= 1) {
      removeFromCart(product.id);
      return;
    }
    decreaseQty(product.id);
  };

  const handleClear = () => {
    clearCart();
    setResult(null);
    setError(null);
  };

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      const res = await checkout(
        items.map((i) => ({ productId: i.product.id, quantity: i.quantity }))
      );
      setResult(res);
      clearCart();
      onCheckoutSuccess?.();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="bg-emerald-50 dark:bg-emerald-900/20 px-5 py-4 border-b border-emerald-100 dark:border-emerald-800/30 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">ชำระเงินสำเร็จ</p>
          </div>
        </div>

        <div className="px-5 py-4">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3">รายการสินค้า</p>
          <div className="flex flex-col gap-2">
            {result.items.map((item) => (
              <div key={item.productId} className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-zinc-800 dark:text-zinc-100">{item.name}</p>
                  <p className="text-[11px] text-slate-400">{item.price.toLocaleString()} × {item.quantity}</p>
                </div>
                <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 tabular-nums">
                  {item.subtotal.toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-zinc-800 flex justify-between items-center">
            <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">ยอดชำระรวม</span>
            <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
              {result.totalAmount.toLocaleString()}
            </span>
          </div>

          <button
            onClick={() => setResult(null)}
            className="mt-4 w-full py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-semibold hover:bg-zinc-700 dark:hover:bg-white transition-colors"
          >
            กลับหน้าเริ่มต้น
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden sticky top-20">
      {/* Cart Header */}
      <div className="px-5 py-4 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-zinc-600 dark:text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">ตะกร้าสินค้า</span>
        </div>
        {totalItems > 0 && (
          <span className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[11px] font-bold px-2 py-0.5 rounded-full min-w-5.5 text-center">
            {totalItems}
          </span>
        )}
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-5 gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-slate-200 dark:text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <p className="text-sm text-slate-400 dark:text-zinc-500">ยังไม่มีสินค้าในตะกร้า</p>
        </div>
      ) : (
        <>
          {/* Items */}
          <div className="flex flex-col divide-y divide-slate-50 dark:divide-zinc-800 max-h-80 overflow-y-auto">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex items-center gap-3 px-4 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-100 truncate">{product.name}</p>
                  <p className="text-[11px] text-slate-400 tabular-nums">{product.price.toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleDecrease(product)}
                    className="w-6 h-6 rounded-md bg-slate-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold text-sm hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors flex items-center justify-center leading-none"
                  >−</button>
                  <span className="w-6 text-center text-xs font-bold text-zinc-900 dark:text-zinc-50 tabular-nums">{quantity}</span>
                  <button
                    onClick={() => handleIncrease(product)}
                    className="w-6 h-6 rounded-md bg-slate-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold text-sm hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors flex items-center justify-center leading-none"
                  >+</button>
                </div>
                <div className="text-right shrink-0 min-w-15">
                  <p className="text-xs font-bold text-zinc-900 dark:text-zinc-50 tabular-nums">{(product.price * quantity).toLocaleString()}</p>
                  <button onClick={() => removeFromCart(product.id)} className="text-[10px] text-red-400 hover:text-red-600 transition-colors mt-0.5">ลบ</button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="px-5 py-4 border-t border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/30">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-slate-500 dark:text-zinc-400">รวมทั้งหมด ({totalItems} รายการ)</span>
              <span className="text-lg font-bold text-zinc-900 dark:text-zinc-50 tabular-nums">{totalAmount.toLocaleString()}</span>
            </div>

            {error && (
              <div className="mb-3 flex items-start gap-2 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 px-3 py-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
                {error}
              </div>
            )}

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  กำลังดำเนินการ...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  ชำระเงิน (Check out)
                </>
              )}
            </button>

            <button
              onClick={handleClear}
              className="mt-2 w-full py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
            >
              ล้างตะกร้า
            </button>
          </div>
        </>
      )}
    </div>
  );
}
