
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Camera,
  Check,
  ChevronRight,
  LogOut,
  Save,
  Settings,
  ShieldCheck,
  Sparkles,
  UserRound,
  Wallet,
  X,
} from "lucide-react";
import { useApp } from "../Providers";

const NAME_KEY = "gita_customer_profile_name";
const AVATAR_KEY = "gita_customer_profile_avatar";
const OLD_PHOTO_KEY = "gita_customer_profile_photo";

type AvatarOption = {
  id: string;
  sign: string;
  symbol: string;
  face: string;
  color: string;
};

const AVATARS: AvatarOption[] = [
  { id: "aries-f", sign: "Aries", symbol: "♈", face: "👩🏻‍🦰", color: "from-rose-500 to-orange-300" },
  { id: "aries-m", sign: "Aries", symbol: "♈", face: "🧑🏻‍🦱", color: "from-amber-300 to-yellow-500" },
  { id: "taurus-f", sign: "Taurus", symbol: "♉", face: "👩🏽", color: "from-emerald-500 to-lime-300" },
  { id: "taurus-m", sign: "Taurus", symbol: "♉", face: "👨🏻‍🦱", color: "from-yellow-300 to-amber-500" },
  { id: "gemini-f", sign: "Gemini", symbol: "♊", face: "👭🏻", color: "from-fuchsia-500 to-pink-300" },
  { id: "gemini-m", sign: "Gemini", symbol: "♊", face: "👬🏻", color: "from-sky-400 to-cyan-200" },
  { id: "cancer-f", sign: "Cancer", symbol: "♋", face: "👩🏻‍🦱", color: "from-indigo-500 to-violet-300" },
  { id: "cancer-m", sign: "Cancer", symbol: "♋", face: "🧑🏽", color: "from-blue-500 to-cyan-300" },
  { id: "leo-f", sign: "Leo", symbol: "♌", face: "👩🏼‍🦰", color: "from-orange-500 to-yellow-300" },
  { id: "leo-m", sign: "Leo", symbol: "♌", face: "👨🏼‍🦱", color: "from-amber-400 to-orange-500" },
  { id: "virgo-f", sign: "Virgo", symbol: "♍", face: "👩🏻", color: "from-teal-400 to-emerald-600" },
  { id: "virgo-m", sign: "Virgo", symbol: "♍", face: "🧑🏻‍🦳", color: "from-violet-400 to-fuchsia-400" },
  { id: "libra-f", sign: "Libra", symbol: "♎", face: "👩🏽‍🦱", color: "from-pink-400 to-rose-300" },
  { id: "libra-m", sign: "Libra", symbol: "♎", face: "👨🏽", color: "from-sky-400 to-indigo-400" },
  { id: "scorpio-f", sign: "Scorpio", symbol: "♏", face: "👩🏾", color: "from-red-600 to-fuchsia-500" },
  { id: "scorpio-m", sign: "Scorpio", symbol: "♏", face: "👨🏽‍🦱", color: "from-purple-600 to-pink-400" },
  { id: "sagittarius-f", sign: "Sagittarius", symbol: "♐", face: "👩🏻‍🦰", color: "from-violet-500 to-blue-400" },
  { id: "sagittarius-m", sign: "Sagittarius", symbol: "♐", face: "🏹", color: "from-indigo-500 to-sky-300" },
  { id: "capricorn-f", sign: "Capricorn", symbol: "♑", face: "👩🏼", color: "from-emerald-600 to-teal-300" },
  { id: "capricorn-m", sign: "Capricorn", symbol: "♑", face: "🧑🏻", color: "from-stone-400 to-amber-200" },
  { id: "aquarius-f", sign: "Aquarius", symbol: "♒", face: "👩🏽‍🦳", color: "from-cyan-400 to-blue-500" },
  { id: "aquarius-m", sign: "Aquarius", symbol: "♒", face: "👨🏻", color: "from-blue-500 to-violet-400" },
  { id: "pisces-f", sign: "Pisces", symbol: "♓", face: "👩🏻‍🦱", color: "from-violet-400 to-pink-300" },
  { id: "pisces-m", sign: "Pisces", symbol: "♓", face: "🧑🏼‍🦱", color: "from-cyan-400 to-teal-300" },
];

function AvatarArt({
  avatarId,
  large = false,
}: {
  avatarId: string;
  large?: boolean;
}) {
  const avatar =
    AVATARS.find((item) => item.id === avatarId) ?? AVATARS[0];

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-amber-200/80 bg-gradient-to-br ${avatar.color} ${
        large
          ? "h-28 w-28 text-5xl"
          : "mx-auto h-[68px] w-[68px] text-3xl"
      }`}
    >
      <span aria-hidden="true" className="drop-shadow-sm">
        {avatar.face}
      </span>
      <span
        className={`absolute bottom-0 right-0 flex items-center justify-center rounded-full border border-amber-100/50 bg-[#24113f] font-semibold text-amber-200 ${
          large ? "h-7 w-7 text-sm" : "h-5 w-5 text-[10px]"
        }`}
      >
        {avatar.symbol}
      </span>
    </div>
  );
}

export default function ProfilePage() {
  const { me, loading } = useApp();

  const [name, setName] = useState("");
  const [avatarId, setAvatarId] = useState("aries-f");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    try {
      setName(
        localStorage.getItem(NAME_KEY) || me?.user?.name || ""
      );

      const savedAvatar = localStorage.getItem(AVATAR_KEY);

      if (
        savedAvatar &&
        AVATARS.some((item) => item.id === savedAvatar)
      ) {
        setAvatarId(savedAvatar);
      }

      // This version uses built-in avatars, not uploaded photos.
      localStorage.removeItem(OLD_PHOTO_KEY);
    } catch {
      setName(me?.user?.name || "");
    }
  }, [me?.user?.name]);

  function chooseAvatar(id: string) {
    setAvatarId(id);
    setPickerOpen(false);
    setMessage("");

    try {
      localStorage.setItem(AVATAR_KEY, id);
      localStorage.removeItem(OLD_PHOTO_KEY);
      setMessage("Avatar selected and saved on this device.");
    } catch {
      setMessage("Avatar selected for this session.");
    }
  }

  function saveProfile() {
    setSaving(true);
    setMessage("");

    try {
      const trimmedName = name.trim();

      if (!trimmedName) {
        setMessage("Please enter your name.");
        return;
      }

      localStorage.setItem(NAME_KEY, trimmedName);
      setName(trimmedName);
      setMessage("Profile saved on this device.");
    } catch {
      setMessage("Could not save your profile. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const displayName = name.trim() || "Your Profile";
  const selectedAvatar =
    AVATARS.find((item) => item.id === avatarId) ?? AVATARS[0];

  return (
    <main className="min-h-dvh bg-[#0b0615] px-4 pb-10 pt-4 text-white">
      <div className="mx-auto max-w-xl">
        <header className="mb-6 flex items-center gap-3">
          <Link
            href="/"
            aria-label="Back to home"
            className="rounded-full border border-white/10 bg-white/[0.04] p-2.5 transition hover:bg-white/10"
          >
            <ArrowLeft size={20} />
          </Link>

          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold tracking-tight">
              My Profile
            </h1>
            <p className="text-sm text-violet-300">
              Manage your personal details
            </p>
          </div>

          <Link
            href="/settings"
            aria-label="Settings"
            className="rounded-full border border-white/10 bg-white/[0.04] p-2.5 transition hover:bg-white/10"
          >
            <Settings size={21} />
          </Link>
        </header>

        <section className="relative mb-5 overflow-hidden rounded-[28px] border border-amber-300/25 bg-gradient-to-br from-[#351766] via-[#211137] to-[#130d20] p-6 shadow-[0_18px_55px_rgba(0,0,0,0.25)]">
          <div className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-fuchsia-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-8 h-36 w-36 rounded-full bg-amber-300/10 blur-3xl" />

          <div className="relative flex flex-col items-center text-center">
            <div className="relative mb-4">
              <AvatarArt avatarId={avatarId} large />

              <button
                type="button"
                onClick={() => setPickerOpen(true)}
                aria-label="Choose avatar"
                className="absolute bottom-0 right-0 rounded-full border-2 border-[#291345] bg-gradient-to-br from-amber-300 to-orange-400 p-2.5 text-[#24102d] shadow-lg transition hover:scale-105"
              >
                <Camera size={17} />
              </button>
            </div>

            <h2 className="text-xl font-semibold">{displayName}</h2>

            <p className="mt-1 break-all text-sm text-violet-200/90">
              {loading
                ? "Loading account..."
                : me?.user?.email || "Gita AI member"}
            </p>

            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-amber-200/40 bg-white/[0.04] px-4 py-2 text-sm font-medium text-amber-100 transition hover:bg-amber-200/10"
            >
              <Sparkles size={16} />
              Choose Avatar
            </button>

            <p className="mt-2 text-xs text-violet-200/70">
              Ready-made avatars · No photo upload needed
            </p>
          </div>
        </section>

        <section className="mb-5 rounded-2xl border border-white/10 bg-gradient-to-br from-[#1c1428] to-[#130e1d] p-5 shadow-lg shadow-black/10">
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-200/15 bg-amber-300/10">
              <UserRound size={18} className="text-amber-300" />
            </span>
            <h2 className="text-lg font-semibold">
              Personal Information
            </h2>
          </div>

          <label
            htmlFor="profile-name"
            className="mb-2 block text-sm font-medium text-violet-200"
          >
            Your name
          </label>

          <input
            id="profile-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Enter your name"
            maxLength={80}
            autoComplete="name"
            className="w-full rounded-xl border border-white/10 bg-[#0d0816] px-4 py-3 text-white outline-none placeholder:text-violet-400/70 focus:border-amber-300/70 focus:ring-2 focus:ring-amber-300/10"
          />

          <button
            type="button"
            onClick={saveProfile}
            disabled={saving}
            className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-300 via-amber-400 to-orange-500 px-4 py-3 font-semibold text-[#24102d] shadow-lg shadow-orange-950/20 transition hover:brightness-105 disabled:opacity-60"
          >
            <Save size={18} />
            {saving ? "Saving..." : "Save Profile"}
          </button>

          {message && (
            <p
              role="status"
              className="mt-3 text-center text-sm text-amber-200"
            >
              {message}
            </p>
          )}
        </section>

        <section className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#1b1426] to-[#120d1b] shadow-lg shadow-black/10">
          <Link
            href="/wallet"
            className="flex min-h-[76px] items-center gap-3 border-b border-white/[0.08] px-4 py-4 transition hover:bg-white/[0.04]"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-200/15 bg-amber-300/10">
              <Wallet className="text-amber-300" size={20} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold">My Wallet</p>
              <p className="mt-0.5 text-xs text-violet-200/75">
                Balance and transactions
              </p>
            </div>
            <ChevronRight size={19} className="text-violet-200/70" />
          </Link>

          <Link
            href="/settings"
            className="flex min-h-[76px] items-center gap-3 border-b border-white/[0.08] px-4 py-4 transition hover:bg-white/[0.04]"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-200/15 bg-amber-300/10">
              <Settings className="text-amber-300" size={20} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold">Settings</p>
              <p className="mt-0.5 text-xs text-violet-200/75">
                Language and appearance
              </p>
            </div>
            <ChevronRight size={19} className="text-violet-200/70" />
          </Link>

          <div className="flex min-h-[76px] items-center gap-3 px-4 py-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-200/15 bg-amber-300/10">
              <ShieldCheck className="text-amber-300" size={20} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold">Privacy</p>
              <p className="mt-0.5 text-xs text-violet-200/75">
                Keep your account details private
              </p>
            </div>
          </div>
        </section>

        <Link
          href="/"
          className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.025] py-3 text-sm font-medium text-violet-100 transition hover:bg-white/[0.06]"
        >
          <LogOut size={17} />
          Back to Home
        </Link>

        <p className="mt-5 text-center text-xs leading-relaxed text-violet-300/65">
          Your name and avatar choice are saved only in this browser on this device.
        </p>
      </div>

      {pickerOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 backdrop-blur-sm"
          role="presentation"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setPickerOpen(false);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="avatar-dialog-title"
            className="flex max-h-[88dvh] w-full max-w-lg flex-col overflow-hidden rounded-[26px] border border-amber-200/20 bg-[#181020] shadow-[0_24px_90px_rgba(0,0,0,0.6)]"
          >
            <header className="flex items-center gap-3 border-b border-white/10 bg-gradient-to-r from-[#38205a] to-[#21132f] px-4 py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-300/10 text-amber-200">
                <Sparkles size={21} />
              </div>

              <div className="min-w-0 flex-1">
                <h2
                  id="avatar-dialog-title"
                  className="font-semibold"
                >
                  Choose your avatar
                </h2>
                <p className="text-xs text-violet-200/75">
                  Zodiac-inspired avatar library
                </p>
              </div>

              <button
                type="button"
                onClick={() => setPickerOpen(false)}
                aria-label="Close avatar picker"
                className="rounded-full p-2 text-violet-100 hover:bg-white/10"
              >
                <X size={20} />
              </button>
            </header>

            <div className="overflow-y-auto p-3 sm:p-4">
              <div className="mb-3 flex items-center justify-between px-1">
                <p className="text-sm font-semibold text-violet-100">
                  Select from Library
                </p>
                <span className="text-xs text-violet-300">
                  {AVATARS.length} avatars
                </span>
              </div>

              <div className="grid grid-cols-3 gap-x-2 gap-y-4 sm:grid-cols-4 sm:gap-x-3">
                {AVATARS.map((avatar) => {
                  const selected = avatar.id === avatarId;

                  return (
                    <button
                      key={avatar.id}
                      type="button"
                      onClick={() => chooseAvatar(avatar.id)}
                      aria-pressed={selected}
                      aria-label={`Choose ${avatar.sign} avatar`}
                      className={`group relative rounded-2xl border p-2 text-center transition active:scale-[0.97] ${
                        selected
                          ? "border-amber-300 bg-amber-200/[0.09] shadow-[0_0_0_1px_rgba(252,211,77,0.12)]"
                          : "border-white/[0.07] bg-white/[0.025] hover:border-violet-300/40 hover:bg-white/[0.05]"
                      }`}
                    >
                      {selected && (
                        <span className="absolute right-1.5 top-1.5 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-amber-300 text-[#24102d]">
                          <Check size={12} />
                        </span>
                      )}

                      <AvatarArt avatarId={avatar.id} />

                      <span className="mt-2 block truncate text-xs font-medium text-violet-50">
                        {avatar.sign}
                      </span>

                      <span className="mt-0.5 block text-[10px] text-violet-300">
                        {avatar.symbol} Zodiac
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <footer className="border-t border-white/10 bg-[#130c1c] p-3">
              <button
                type="button"
                onClick={() => setPickerOpen(false)}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-300 to-orange-400 px-4 py-3 font-semibold text-[#24102d]"
              >
                <Check size={17} />
                Done
              </button>

              <p className="mt-2 text-center text-[11px] text-violet-300/70">
                Selected: {selectedAvatar.sign} · Avatar ID only
              </p>
            </footer>
          </section>
        </div>
      )}
    </main>
  );
}
