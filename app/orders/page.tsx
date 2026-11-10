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
  AlertCircle,
  Home,
  MessageCircle,
  Sun,
  User
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
    // 🔥 Full Screen Background
    <main className="min-h-[100dvh] w-full bg-[#0A0F19] text-slate-100 font-sans pb-28">
      
      {/* 🔥 Container: Full Width (max-w-2xl se sirf desktop par limit lagegi) */}
      <div className="w-full max-w-2xl mx-auto px-3 pt-4 space-y-6">
        
        {/* HEADER */}
        <header className="bg-[#151d2c] rounded-2xl flex items-center p-4 border border-slate-800 shadow-md">
          <Link href="/profile" className="p-2.5 rounded-full bg-[#0A0F19] text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div className="ml-4">
            <h1 className="text-[17px] font-bold text-[#ff6b00] tracking-wide uppercase">
              My Orders
            </h1>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Your purchase history</p>
          </div>
        </header>

        {/* LOADING STATE */}
        {loading && (
          <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
            <Loader2 size={36} className="text-[#ff6b00] animate-spin" />
            <p className="text-[14px] text-slate-400 font-bold">Loading your orders...</p>
          </div>
        )}

        {/* ERROR STATE */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4 px-4">
            <div className="bg-rose-500/10 p-5 rounded-full border border-rose-500/30">
              <AlertCircle size={44} className="text-rose-500" />
            </div>
            <h2 className="text-xl font-bold text-white">Something went wrong</h2>
            <p className="text-[13px] text-slate-400 max-w-xs">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 bg-[#151d2c] border border-slate-700 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition"
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
                className="rounded-[1.2rem] border border-slate-800 bg-[#151d2c] p-5 shadow-lg hover:border-[#ff6b00]/50 transition-colors cursor-pointer group"
              >
                {/* Top Section */}
                <div className="flex justify-between items-start mb-4 border-b border-slate-800/80 pb-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-[#ff6b00]/10 p-3 rounded-2xl text-[#ff6b00] group-hover:bg-[#ff6b00] group-hover:text-white transition-colors">
                      <ShoppingBag size={22} />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-[15px]">Wallet Recharge</h3>
                      <p className="text-[12px] text-slate-400 font-mono mt-1">
                        ID: {order.orderId?.slice(-8).toUpperCase() || order.id.slice(0,8).toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-[#ff6b00] text-[20px]">₹{(order.amountPaise / 100).toFixed(0)}</p>
                    
                    {/* Status Badges */}
                    <div className="flex justify-end mt-1.5">
                      {order.status === 'paid' && (
                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                          <CheckCircle2 size={12} /> SUCCESS
                        </span>
                      )}
                      {order.status === 'created' && (
                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                          <Clock size={12} /> PENDING
                        </span>
                      )}
                      {order.status === 'failed' && (
                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20">
                          <XCircle size={12} /> FAILED
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Section */}
                <div className="flex justify-between items-center text-[12px] text-slate-400 font-medium">
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-slate-500" /> 
                    <span>{formatDate(order.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#ff6b00] font-bold text-[13px] opacity-0 group-hover:opacity-100 transition-opacity">
                    View Details <ChevronRight size={16} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* EMPTY STATE (No Orders) */}
        {!loading && !error && orders.length === 0 && (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-5 px-4">
            <div className="bg-[#151d2c] p-8 rounded-full border border-slate-800 shadow-xl">
              <ShoppingBag size={56} className="text-slate-600" />
            </div>
            <div>
              <h2 className="text-[22px] font-black text-white">No Orders Yet</h2>
              <p className="text-[14px] text-slate-400 max-w-[280px] mx-auto mt-2 leading-relaxed">
                Aapne abhi tak koi recharge ya consultation nahi kharidi hai. Jab aap kharidenge, wo yahan dikhega.
              </p>
            </div>
            <Link 
              href="/chat" 
              className="mt-2 bg-gradient-to-r from-[#FF6B00] to-[#FF8A00] text-white px-8 py-4 rounded-xl font-bold text-[15px] hover:scale-105 active:scale-95 transition-all shadow-lg shadow-orange-500/20"
            >
              Talk to Astrologer
            </Link>
          </div>
        )}

      </div>

      {/* 🔥 BOTTOM NAVIGATION BAR */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a0f19] border-t border-slate-800 flex justify-around items-center pt-2.5 pb-5 px-2 w-full">
        <Link href="/" className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors">
          <Home size={22} />
          <span className="text-[11px] font-medium">होम</span>
        </Link>
        <Link href="/chat" className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors">
          <MessageCircle size={22} />
          <span className="text-[11px] font-medium">चैट</span>
        </Link>
        <Link href="/daily" className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors">
          <Sun size={22} />
          <span className="text-[11px] font-medium">राशिफल</span>
        </Link>
        <Link href="/profile" className="flex flex-col items-center gap-1 text-[#ff6b00]">
          <User size={22} strokeWidth={2.5} />
          <span className="text-[11px] font-bold">प्रोफाइल</span>
        </Link>
      </nav>

    </main>
  );
}