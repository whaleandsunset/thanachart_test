"use client";

import { useEffect, useState, useCallback } from "react";
import { fetchProducts } from "../lib/api";
import { Product } from "../types";
import ProductCard from "../components/ProductCard";
import ShoppingCart from "../components/ShoppingCart";
import { CartProvider } from "../context/CartContext";

function ShopContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await fetchProducts();
      setProducts(data);
    } catch {
      setError("ไม่สามารถโหลดข้อมูลสินค้าได้ กรุณาตรวจสอบ Backend");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 leading-none">ระบบ Stock สินค้า</h1>
              <p className="text-[11px] text-slate-400 leading-none mt-0.5">ระบบจัดการตะกร้าสินค้า</p>
            </div>
          </div>
          <button
            onClick={loadProducts}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-zinc-900 dark:hover:text-zinc-100 border border-slate-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 px-3 py-1.5 rounded-lg transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            รีเฟรช
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6">
        {error && (
          <div className="mb-4 flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product Table */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">รายการสินค้า</h2>
                {!loading && (
                  <p className="text-xs text-slate-400 mt-0.5">จำนวนสินค้าทั้งหมด {products.length} รายการ</p>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden">
              {loading ? (
                <div className="divide-y divide-slate-100 dark:divide-zinc-800">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4 px-4 py-3">
                      <div className="w-16 h-5 bg-slate-100 dark:bg-zinc-800 rounded animate-pulse" />
                      <div className="flex-1 h-4 bg-slate-100 dark:bg-zinc-800 rounded animate-pulse" />
                      <div className="w-20 h-4 bg-slate-100 dark:bg-zinc-800 rounded animate-pulse" />
                      <div className="w-10 h-4 bg-slate-100 dark:bg-zinc-800 rounded animate-pulse" />
                      <div className="w-20 h-7 bg-slate-100 dark:bg-zinc-800 rounded-lg animate-pulse" />
                    </div>
                  ))}
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-zinc-800">
                      <th className="py-3 px-4 text-left text-[11px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">รหัส</th>
                      <th className="py-3 px-4 text-left text-[11px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">ชื่อสินค้า</th>
                      <th className="py-3 px-4 text-right text-[11px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">ราคา/หน่วย</th>
                      <th className="py-3 px-4 text-center text-[11px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">คงเหลือ</th>
                      <th className="py-3 px-4 text-center text-[11px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">สั่งซื้อ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-zinc-800/60">
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Cart */}
          <div className="lg:col-span-1">
            <ShoppingCart onCheckoutSuccess={loadProducts} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ShopPage() {
  return (
    <CartProvider>
      <ShopContent />
    </CartProvider>
  );
}
