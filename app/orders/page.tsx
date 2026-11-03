// app/orders/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  Loader2, 
  XCircle,
  AlertCircle
} from "lucide-react";

// 🔥 Type define kiya taaki TypeScript koi error na de
type Order = {
  id: string;
  orderId: string;
  amountPaise: number;
  status: "created" | "paid" | "failed";
  createdAt: string;
  paymentId?: string;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders");
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || "Failed to load orders");
        }
        
        setOrders(data.orders || []);
      } catch (err: any) {
        console.error("Failed to load orders:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, []);

  // Date format karne ke liye function
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <main className="min-h-screen bg-[#0B1120] text-gray-200 px-4 py-5 pb-24">
      <div className="mx-auto max-w-md space-y-4">
        
        {/* HEADER */}
        <header className="flex items-center gap-3 rounded-2xl border border-slate-700 bg-[#131C2E] p-4 shadow-lg mb-6">
          <Link href="/settings" className="rounded-xl bg-slate-800 p-2 text-orange-400 hover:bg-slate-700 transition">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-base font-black uppercase tracking-tight text-orange-500">
              My Orders
            </h1>
            <p className="text-xs text-slate-400">Your purchase history</p>
          </div>
        </header>

        {/* LOADING STATE */}
        {loading && (
          <div className="flex flex-col items-center justify-center h-[50vh] space-y-3">
            <Loader2 size={32} className="text-orange-500 animate-spin" />
            <p className="text-sm text-slate-400 font-medium">Loading your orders...</p>
          </div>
        )}

        {/* ERROR STATE */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-3">
            <div className="bg-red-500/10 p-4 rounded-full border border-red-500/30">
              <AlertCircle size={40} className="text-red-400" />
            </div>
            <h2 className="text-lg font-bold text-white">Something went wrong</h2>
            <p className="text-sm text-slate-400 max-w-xs">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 bg-slate-800 text-white px-6 py-2 rounded-xl font-bold hover:bg-slate-700 transition"
            >
              Try Again
            </button>
          </div>
        )}

        {/* ORDERS LIST */}
        {!loading && !error && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => (
              <div 
                key={order.id} 
                className="rounded-2xl border border-slate-700 bg-[#131C2E] p-4 shadow-sm hover:border-orange-500/50 transition-colors cursor-pointer group"
              >
                {/* Top Section */}
                <div className="flex justify-between items-start mb-3 border-b border-slate-700/50 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-orange-500/10 p-2.5 rounded-xl text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                      <ShoppingBag size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">Wallet Recharge</h3>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">
                        ID: {order.orderId?.slice(-8).toUpperCase() || order.id.slice(0,8).toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-orange-400 text-lg">₹{(order.amountPaise / 100).toFixed(0)}</p>
                    
                    {/* Status Badges */}
                    <div className="flex justify-end mt-1">
                      {order.status === 'paid' && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">
                          <CheckCircle2 size={10} /> SUCCESS
                        </span>
                      )}
                      {order.status === 'created' && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded-full border border-yellow-500/20">
                          <Clock size={10} /> PENDING
                        </span>
                      )}
                      {order.status === 'failed' && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">
                          <XCircle size={10} /> FAILED
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Section */}
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} className="text-slate-500" /> 
                    <span>{formatDate(order.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-orange-500 font-semibold text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    View Details <ChevronRight size={16} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* EMPTY STATE (No Orders) */}
        {!loading && !error && orders.length === 0 && (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
            <div className="bg-[#131C2E] p-6 rounded-full border border-slate-700 shadow-xl">
              <ShoppingBag size={48} className="text-slate-500" />
            </div>
            <h2 className="text-xl font-bold text-white mt-2">No Orders Yet</h2>
            <p className="text-sm text-slate-400 max-w-[280px]">
              Aapne abhi tak koi recharge ya consultation nahi kharidi hai. Jab aap kharidenge, wo yahan dikhega.
            </p>
            <Link 
              href="/chat" 
              className="mt-6 bg-orange-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-700 transition shadow-lg shadow-orange-600/20"
            >
              Talk to Astrologer
            </Link>
          </div>
        )}

      </div>
    </main>
  );
}