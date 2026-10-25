
import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Brain,
  Heart,
  Moon,
  Sun,
  Wind,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

const wellnessTips = [
  {
    icon: Moon,
    title: "नींद और आराम",
    description:
      "सोने और जागने का नियमित समय रखें। सोने से पहले स्क्रीन का उपयोग कम करें और शांत वातावरण बनाएँ।",
  },
  {
    icon: Wind,
    title: "श्वास और ध्यान",
    description:
      "कुछ मिनट आराम से साँस लेने, ध्यान करने या प्रार्थना करने के लिए निकालें। असहज महसूस हो तो रुक जाएँ।",
  },
  {
    icon: Activity,
    title: "दैनिक गतिविधि",
    description:
      "अपनी क्षमता के अनुसार हल्की सैर और नियमित शारीरिक गतिविधि को दिनचर्या में शामिल करें।",
  },
  {
    icon: Heart,
    title: "मन की देखभाल",
    description:
      "अपने प्रियजनों से बात करें, अपनी भावनाओं को समझें और जरूरत पड़ने पर किसी योग्य पेशेवर से सहायता लें।",
  },
];

export default function HealthPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl space-y-8 bg-night-900 px-4 py-6 text-violet-50 sm:px-6 sm:py-10">
      {/* Header */}
      <header className="flex items-center gap-3">
        <Link
          href="/"
          aria-label="होम पेज पर वापस जाएँ"
          className="rounded-lg p-2 text-violet-300 transition hover:bg-violet-500/10 hover:text-gold-300"
        >
          <ArrowLeft size={21} />
        </Link>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/15 text-gold-300 ring-1 ring-gold-400/25">
          <Heart size={23} />
        </div>

        <div>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">
            स्वास्थ्य और कल्याण
          </h1>
          <p className="mt-1 text-sm text-violet-300/80">
            Health & Wellness
          </p>
        </div>
      </header>

      {/* Intro */}
      <section className="card space-y-4 border border-gold-400/15 p-5 sm:p-8">
        <div className="flex items-center gap-2 text-gold-300">
          <Sparkles size={19} />
          <p className="text-xs font-bold uppercase tracking-[0.18em]">
            Gita AI · Daily Wellness
          </p>
        </div>

        <h2 className="font-display text-2xl leading-snug sm:text-3xl">
          अपने शरीर और मन का ध्यान रखें
        </h2>

        <p className="max-w-3xl text-sm leading-7 text-violet-200/85 sm:text-base">
          स्वस्थ दिनचर्या की शुरुआत छोटे कदमों से होती है। पर्याप्त आराम,
          संतुलित भोजन, नियमित गतिविधि और मानसिक शांति आपके समग्र कल्याण
          में मदद कर सकते हैं।
        </p>

        <Link
          href="/chat?topic=health"
          className="btn-gold inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold"
        >
          स्वास्थ्य से जुड़ा सवाल पूछें
          <ArrowRight size={17} />
        </Link>
      </section>

      {/* Wellness tips */}
      <section className="space-y-4">
        <div>
          <h2 className="font-display text-xl font-bold sm:text-2xl">
            रोज़मर्रा के लिए सुझाव
          </h2>
          <p className="mt-1 text-sm text-violet-300/80">
            अपनी जरूरत और क्षमता के अनुसार अपनाएँ।
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {wellnessTips.map((tip) => {
            const Icon = tip.icon;

            return (
              <article
                key={tip.title}
                className="card flex h-full gap-4 border border-gold-400/10 p-5"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-gold-300 ring-1 ring-gold-400/20">
                  <Icon size={21} />
                </div>

                <div className="min-w-0">
                  <h3 className="font-display text-lg font-semibold">
                    {tip.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-violet-200/80">
                    {tip.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Gentle daily routine */}
      <section className="card space-y-4 border border-gold-400/10 p-5 sm:p-7">
        <div className="flex items-center gap-3">
          <Sun className="text-gold-300" size={23} />
          <h2 className="font-display text-xl font-bold">
            एक सरल दैनिक दिनचर्या
          </h2>
        </div>

        <ul className="space-y-3 text-sm leading-6 text-violet-200/85">
          <li className="flex gap-3">
            <ShieldCheck className="mt-1 shrink-0 text-gold-300" size={17} />
            नियमित समय पर उठने और सोने की कोशिश करें।
          </li>
          <li className="flex gap-3">
            <ShieldCheck className="mt-1 shrink-0 text-gold-300" size={17} />
            अपनी जरूरत के अनुसार पानी पिएँ और संतुलित भोजन करें।
          </li>
          <li className="flex gap-3">
            <ShieldCheck className="mt-1 shrink-0 text-gold-300" size={17} />
            दिन में आराम, गतिविधि और अपने प्रियजनों के लिए समय निकालें।
          </li>
          <li className="flex gap-3">
            <ShieldCheck className="mt-1 shrink-0 text-gold-300" size={17} />
            तनाव महसूस होने पर शांत जगह पर बैठें और सहज गति से साँस लें।
          </li>
        </ul>
      </section>

      {/* Important note */}
      <section className="rounded-xl border border-violet-400/20 bg-violet-500/5 p-5">
        <div className="flex items-start gap-3">
          <Brain className="mt-0.5 shrink-0 text-gold-300" size={21} />
          <div>
            <h2 className="font-semibold text-violet-100">
              एक जरूरी बात
            </h2>
            <p className="mt-2 text-sm leading-6 text-violet-200/80">
              यह पेज सामान्य स्वास्थ्य और कल्याण संबंधी जानकारी देता है,
              बीमारी की जाँच या इलाज नहीं। कोई लक्षण लगातार बना रहे या
              चिंता का कारण हो तो योग्य स्वास्थ्य पेशेवर से सलाह लें।
              आपातकालीन स्थिति में तुरंत स्थानीय आपातकालीन सहायता लें।
            </p>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <footer className="border-t border-gold-400/10 pt-5">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-violet-300 transition hover:text-gold-300"
        >
          <ArrowLeft size={16} />
          Gita AI होम पेज पर वापस जाएँ
        </Link>
      </footer>
    </main>
  );
}