"use client";

import type { ElementType, ReactNode } from "react";
import Link from "next/link";
import {
ArrowLeft,
CalendarDays,
ChevronRight,
CircleHelp,
Clock3,
Gem,
Gift,
Heart,
History,
House,
Languages,
LogIn,
Settings,
ShieldCheck,
ShoppingBag,
Sparkles,
UserRound,
Wallet,
Headset,
BookOpen,
} from "lucide-react";

import { useApp } from "../Providers";

type ProfileRowProps = {
href: string;
icon: ElementType;
title: string;
description?: string;
};

function ProfileRow({
href,
icon: Icon,
title,
description,
}: ProfileRowProps) {
return (
<Link  
href={href}  
className="flex items-center gap-3 border-b border-white/10 px-4 py-4 transition last:border-b-0 hover:bg-white/5"  
>
<Icon size={21} className="shrink-0 text-gold-300" />

<span className="min-w-0 flex-1">  
    <span className="block font-medium text-violet-50">  
      {title}  
    </span>  

    {description ? (  
      <span className="mt-1 block text-xs text-violet-300">  
        {description}  
      </span>  
    ) : null}  
  </span>  

  <ChevronRight  
    size={19}  
    className="shrink-0 text-violet-400"  
  />  
</Link>

);
}

function ProfileSection({
title,
children,
}: {
title: string;
children: ReactNode;
}) {
return (
<section className="mt-7">
<h2 className="mb-3 px-1 text-xs font-bold uppercase tracking-[0.18em] text-violet-300">
{title}
</h2>

<div className="overflow-hidden rounded-2xl border border-gold-400/10 bg-white/[0.04]">  
    {children}  
  </div>  
</section>

);
}

export default function ProfilePage() {
const { me, loading, lang } = useApp();
const user = me?.user;

const displayName =
user?.name?.trim() ||
(user?.isGuest ? "Guest User" : "Gita AI User");

const languageName =
lang === "hi"
? "हिंदी"
: lang === "hinglish"
? "Hinglish"
: "English";

return (
<main className="bg-celestial min-h-dvh px-4 pb-28 pt-4 text-violet-50">
<div className="mx-auto max-w-xl">
<header className="mb-5 flex items-center gap-3">
<Link  
href="/"  
aria-label="Back to home"  
className="rounded-full border border-white/10 p-2 hover:bg-white/10"  
>
<ArrowLeft size={20} />
</Link>

<div className="min-w-0 flex-1">  
        <h1 className="font-display text-2xl font-bold">  
          My Profile  
        </h1>  
        <p className="text-sm text-violet-300">  
          Your Gita AI account  
        </p>  
      </div>  

      <Link  
        href="/settings"  
        aria-label="Settings"  
        className="rounded-full border border-gold-400/20 p-2.5 text-gold-300 hover:bg-white/5"  
      >  
        <Settings size={21} />  
      </Link>  
    </header>  

    {/* Profile summary */}  
    <section className="rounded-3xl border border-gold-400/20 bg-white/[0.07] p-5 shadow-xl shadow-black/10">  
      <div className="flex items-center gap-4">  
        <div className="flex h-[68px] w-[68px] shrink-0 items-center justify-center rounded-full border-2 border-gold-300/50 bg-violet-950/70">  
          <UserRound size={34} className="text-gold-300" />  
        </div>  

        <div className="min-w-0 flex-1">  
          <h2 className="truncate text-lg font-bold">  
            {loading ? "Loading profile..." : displayName}  
          </h2>  

          <p className="mt-1 break-all text-sm text-violet-300">  
            {user?.email ||  
              (user?.isGuest  
                ? "Guest session"  
                : "Email not added")}  
          </p>  

          <span className="mt-2 inline-flex rounded-full border border-gold-300/20 bg-gold-400/10 px-2.5 py-1 text-xs text-gold-200">  
            {user?.isGuest ? "Guest Account" : "Gita AI Account"}  
          </span>  
        </div>  
      </div>  

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/10 pt-3 text-sm">  
        <span className="text-violet-300">  
          Preferred language  
        </span>  
        <span className="font-semibold text-gold-200">  
          {languageName}  
        </span>  
      </div>  

      {user?.isGuest ? (  
        <div className="mt-4 rounded-xl border border-gold-400/15 bg-black/10 p-3">  
          <p className="text-sm text-violet-200">  
            You are using a guest session. Account registration  
            can be added separately.  
          </p>  
        </div>  
      ) : null}  
    </section>  

    {/* Quick links */}  
    <div className="mt-4 grid grid-cols-3 gap-3">  
      <Link  
        href="/daily"  
        className="card card-hover flex min-h-28 flex-col justify-between gap-3 p-3"  
      >  
        <Clock3 size={23} className="text-gold-300" />  
        <span className="text-sm font-semibold">  
          Daily Astrology  
        </span>  
      </Link>  

      <Link  
        href="/kundli"  
        className="card card-hover flex min-h-28 flex-col justify-between gap-3 p-3"  
      >  
        <Gem size={23} className="text-gold-300" />  
        <span className="text-sm font-semibold">My Kundli</span>  
      </Link>  

      <Link  
        href="/settings"  
        className="card card-hover flex min-h-28 flex-col justify-between gap-3 p-3"  
      >  
        <Settings size={23} className="text-gold-300" />  
        <span className="text-sm font-semibold">Settings</span>  
      </Link>  
    </div>  

    <ProfileSection title="Explore">  
      <ProfileRow  
        href="/"  
        icon={House}  
        title="Home"  
        description="Return to the home page"  
      />  
      <ProfileRow  
        href="/chat"  
        icon={Sparkles}  
        title="Chat with AI"  
        description="Ask questions and get guidance"  
      />  
      <ProfileRow  
        href="/daily"  
        icon={CalendarDays}  
        title="Daily Astrology"  
        description="Daily guidance and astrology"  
      />  
      <ProfileRow  
        href="/kundli"  
        icon={Gem}  
        title="My Kundli"  
        description="Birth chart and chart details"  
      />  
      <ProfileRow  
        href="/chat?topic=remedies"  
        icon={Gift}  
        title="Free Services"  
        description="Explore available AI guidance"  
      />  
      <ProfileRow  
        href="/chat?topic=love"  
        icon={Heart}  
        title="Love & Relationships"  
      />  
      <ProfileRow  
        href="/chat?topic=career"  
        icon={BookOpen}  
        title="Career Guidance"  
      />  
      <ProfileRow  
        href="/chat?topic=money"  
        icon={Wallet}  
        title="Money Guidance"  
      />  
    </ProfileSection>  

    <ProfileSection title="Account">  
      <ProfileRow  
        href="/settings"  
        icon={Languages}  
        title="Language Preferences"  
        description={languageName}  
      />  
      <ProfileRow  
        href="/settings"  
        icon={ShieldCheck}  
        title="Privacy & Security"  
        description="Account and privacy information"  
      />  
      <ProfileRow  
        href="/settings"  
        icon={CircleHelp}  
        title="Help & App Information"  
      />  
      <ProfileRow  
        href="/settings"  
        icon={History}  
        title="Activity & Preferences"  
      />  
      <ProfileRow  
        href="/settings"  
        icon={LogIn}  
        title="Login & Registration"  
        description="Account access options"  
      />  
    </ProfileSection>  

    <ProfileSection title="Services">  
      <ProfileRow  
        href="/chat?topic=remedies"  
        icon={ShoppingBag}  
        title="AstroRemedy"  
        description="Explore spiritual guidance"  
      />  
      <ProfileRow  
        href="/daily"  
        icon={BookOpen}  
        title="Astrology & Daily Guidance"  
      />  
      <ProfileRow  
        href="/chat"  
        icon={Headset}  
        title="Chat with Astrologers"  
        description="Gita, Kriti, Devaki and Gargi"  
      />  
      <ProfileRow  
        href="/kundli"  
        icon={Gem}  
        title="Kundli & Birth Chart"  
      />  
    </ProfileSection>  

    <ProfileSection title="More Services">  
      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-4">  
        <Wallet size={21} className="shrink-0 text-gold-300" />  

        <div className="min-w-0 flex-1">  
          <p className="font-medium">Wallet & Transactions</p>  
          <p className="mt-1 text-xs text-violet-300">  
            Secure wallet service planned for a future update  
          </p>  
        </div>  

        <span className="rounded-full border border-gold-300/20 px-2 py-1 text-[10px] text-gold-200">  
          Soon  
        </span>  
      </div>  

      <div className="flex items-center gap-3 px-4 py-4">  
        <History size={21} className="shrink-0 text-gold-300" />  

        <div className="min-w-0 flex-1">  
          <p className="font-medium">Orders & Bookings</p>  
          <p className="mt-1 text-xs text-violet-300">  
            Booking history will be added with its backend  
          </p>  
        </div>  

        <span className="rounded-full border border-gold-300/20 px-2 py-1 text-[10px] text-gold-200">  
          Soon  
        </span>  
      </div>  
    </ProfileSection>  

    <footer className="pb-5 pt-8 text-center">  
      <p className="font-semibold text-violet-200">Gita AI</p>  
      <p className="mt-1 text-xs text-violet-400">  
        Your personal AI companion  
      </p>  

      <Link  
        href="/settings"  
        className="mt-4 inline-flex items-center gap-2 text-sm text-gold-200 hover:text-gold-100"  
      >  
        <Settings size={16} />  
        App Settings  
        <ChevronRight size={16} />  
      </Link>  
    </footer>  
  </div>  
</main>

);
}