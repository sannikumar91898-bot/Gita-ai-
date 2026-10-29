
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Wallet as WalletIcon,
  Plus,
  History,
  ShieldCheck,
  ChevronRight,
  CreditCard,
  CircleHelp,
  Clock,
  Info,
} from "lucide-react";

export default function WalletPage() {
  const [showPaymentInfo, setShowPaymentInfo] = useState(false);

  // No real balance or transactions are fabricated.
  // Connect a verified payment backend before enabling payments.
  const walletBalance = 0;

  return (
    <main className="min-h-dvh bg-[#FFF9E6] px-4 pb-10 pt-4 text-gray-900">
      <div className="mx-auto max-w-xl">
        <header className="mb-6 flex items-center gap-3">
          <Link
            href="/"
            aria-label="Back to home"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-orange-100 bg-white shadow-sm"
          >
            <ArrowLeft size={20} />
          </Link>

          <div className="flex-1">
            <h1 className="text-xl font-bold">My Wallet</h1>
            <p className="text-xs text-gray-500">
              Manage your Gita AI wallet
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600">
            <WalletIcon size={21} />
          </div>
        </header>

        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 to-orange-600 p-6 text-white shadow-lg">
          <div className="absolute -right-8 -top-10 h-36 w-36 rounded-full bg-white/10" />
          <div className="absolute -bottom-12 right-16 h-28 w-28 rounded-full bg-white/10" />

          <div className="relative">
            <div className="flex items-center gap-2 text-sm text-white/90">
              <WalletIcon size={18} />
              Available Balance
            </div>

            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-4xl font-bold">
                ₹{walletBalance.toFixed(2)}
              </span>
              <span className="text-sm text-white/80">INR</span>
            </div>

            <p className="mt-2 text-xs text-white/80">
              Displayed balance will be connected to your verified wallet.
            </p>

            <button
              type="button"
              onClick={() => setShowPaymentInfo(true)}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-orange-600 shadow-sm transition active:scale-95"
            >
              <Plus size={18} />
              Add Money
            </button>
          </div>
        </section>

        <section className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-orange-100 bg-white p-4 shadow-sm">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
              <CreditCard size={20} />
            </div>
            <p className="text-sm font-semibold">Secure Payments</p>
            <p className="mt-1 text-xs leading-relaxed text-gray-500">
              Payment verification will be required.
            </p>
          </div>

          <div className="rounded-2xl border border-orange-100 bg-white p-4 shadow-sm">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
              <History size={20} />
            </div>
            <p className="text-sm font-semibold">Transactions</p>
            <p className="mt-1 text-xs leading-relaxed text-gray-500">
              Your verified wallet activity.
            </p>
          </div>
        </section>

        <section className="mt-6 overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm">
          <div className="flex items-center gap-3 border-b border-orange-50 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
              <History size={20} />
            </div>
            <div className="flex-1">
              <h2 className="font-semibold">Transaction History</h2>
              <p className="text-xs text-gray-500">
                Recent wallet activity
              </p>
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </div>

          <div className="px-5 py-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-orange-500">
              <History size={25} />
            </div>
            <h3 className="mt-4 font-semibold">No transactions yet</h3>
            <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-gray-500">
              Your verified deposits and wallet transactions will appear here
              once payment processing is connected.
            </p>
          </div>
        </section>

        <section className="mt-5 rounded-2xl border border-orange-100 bg-white p-4">
          <div className="flex items-start gap-3">
            <ShieldCheck
              size={22}
              className="mt-0.5 shrink-0 text-green-600"
            />
            <div>
              <h2 className="font-semibold">Payment Safety</h2>
              <p className="mt-1 text-sm leading-relaxed text-gray-500">
                Wallet credits should be added only after the payment
                provider confirms a successful payment on the server.
                Never share your UPI PIN or OTP.
              </p>
            </div>
          </div>
        </section>

        <Link
          href="/settings"
          className="mt-4 flex items-center gap-3 rounded-2xl border border-orange-100 bg-white p-4 shadow-sm"
        >
          <CircleHelp size={21} className="text-orange-600" />
          <span className="flex-1 text-sm font-medium">
            Help & Settings
          </span>
          <ChevronRight size={18} className="text-gray-400" />
        </Link>

        <Link
          href="/"
          className="mt-5 block rounded-full border border-orange-200 bg-white py-3 text-center text-sm font-semibold text-orange-700"
        >
          Back to Home
        </Link>
      </div>

      {showPaymentInfo && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowPaymentInfo(false)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="payment-info-title"
            className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-orange-600">
              <Clock size={27} />
            </div>

            <h2
              id="payment-info-title"
              className="mt-4 text-center text-xl font-bold"
            >
              Payments coming soon
            </h2>

            <p className="mt-3 text-center text-sm leading-relaxed text-gray-600">
              Adding money is not available yet. The secure payment gateway
              and server-side payment verification must be configured first.
              No money has been charged.
            </p>

            <div className="mt-4 flex items-start gap-2 rounded-xl bg-orange-50 p-3 text-xs leading-relaxed text-orange-900">
              <Info size={17} className="mt-0.5 shrink-0" />
              <p>
                Your wallet balance will update only after a verified
                payment. This screen does not process payments.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowPaymentInfo(false)}
              className="mt-5 w-full rounded-full bg-orange-500 py-3 font-semibold text-white"
            >
              Okay
            </button>
          </section>
        </div>
      )}
    </main>
  );
}
