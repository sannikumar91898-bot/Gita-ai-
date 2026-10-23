

import type { Lang } from "./i18n";
import { RASHIS, RASHIS_HI } from "./vedic";

const COLOURS = [
  { hex: "#F5C542", en: "Gold", hi: "सुनहरा", hinglish: "Golden" },
  { hex: "#7C3AED", en: "Violet", hi: "बैंगनी", hinglish: "Violet" },
  { hex: "#F8F5EF", en: "Ivory", hi: "हाथीदांत", hinglish: "Ivory" },
  { hex: "#2E7D32", en: "Green", hi: "हरा", hinglish: "Hara" },
  { hex: "#C62828", en: "Crimson", hi: "लाल", hinglish: "Laal" },
  { hex: "#1565C0", en: "Royal Blue", hi: "नीला", hinglish: "Neela" },
  { hex: "#EF6C00", en: "Saffron", hi: "केसरिया", hinglish: "Kesariya" },
  { hex: "#F48FB1", en: "Rose", hi: "गुलाबी", hinglish: "Gulabi" },
  { hex: "#9E9E9E", en: "Silver", hi: "चाँदी", hinglish: "Silver" },
];

const FOCUS: Record<Lang, string[]> = {
  en: [
    "Energy runs high today — begin what you've been postponing, but pace yourself.",
    "Steadiness is your strength. Financial and family matters favour patient decisions.",
    "Conversations open doors. Share an idea; the right listener is near.",
    "Emotions run deep. Nurture your home and let intuition guide small choices.",
    "Your presence is noticed. Lead with generosity and avoid unnecessary pride.",
    "Details matter today. Organise, refine and finish one pending task beautifully.",
    "Partnerships shine. Seek balance, compromise gracefully and celebrate togetherness.",
    "Transformation whispers. Release one old habit that no longer serves you.",
    "Learning and travel are favoured. Expand your horizon with one new insight.",
    "Discipline pays. A structured effort today becomes recognition tomorrow.",
    "Community brings luck. A friend's suggestion may spark an opportunity.",
    "Compassion is your compass. Rest, reflect and let creativity flow gently.",
  ],
  hi: [
    "आज ऊर्जा प्रबल है — जिसे टालते आए हैं उसे शुरू करें, पर गति संतुलित रखें।",
    "स्थिरता आपकी शक्ति है। धन और परिवार के मामले धैर्यपूर्ण निर्णय चाहते हैं।",
    "बातचीत द्वार खोलेगी। अपना विचार साझा करें; सही श्रोता निकट है।",
    "भावनाएँ गहरी हैं। घर को सँवारें और छोटे निर्णय अंतर्ज्ञान से लें।",
    "आपकी उपस्थिति दिखेगी। उदारता से नेतृत्व करें, अहंकार से बचें।",
    "आज विवरण महत्वपूर्ण हैं। एक लंबित कार्य को सुंदरता से पूर्ण करें।",
    "साझेदारी चमकेगी। संतुलन खोजें और साथ का उत्सव मनाएँ।",
    "परिवर्तन की आहट है। एक पुरानी आदत छोड़ें जो अब उपयोगी नहीं।",
    "सीखना और यात्रा शुभ है। एक नई दृष्टि से क्षितिज बढ़ाएँ।",
    "अनुशासन फल देगा। आज का व्यवस्थित प्रयास कल पहचान बनेगा।",
    "समुदाय सौभाग्य लाएगा। मित्र का सुझाव अवसर बन सकता है।",
    "करुणा आपका मार्गदर्शक है। विश्राम करें और रचनात्मकता बहने दें।",
  ],
  hinglish: [
    "Aaj energy high hai — jo postpone kar rahe the woh shuru karein, bas pace balanced rakhein.",
    "Steadiness aapki strength hai. Paisa aur family ke faisle patience maangte hain.",
    "Baat-cheet darwaze kholegi. Apna idea share karein; sahi listener paas hai.",
    "Emotions gehri hain. Ghar ko sanwariye aur chhote decisions intuition se lijiye.",
    "Aapki presence notice hogi. Generosity se lead karein, pride se bachein.",
    "Aaj details matter karti hain. Ek pending task ko beautifully complete karein.",
    "Partnerships chamkengi. Balance banaiye aur togetherness celebrate karein.",
    "Transformation ki aahat hai. Ek purani habit chhodiye jo ab kaam ki nahi.",
    "Learning aur travel favourable hai. Ek nayi insight se horizon badhaiye.",
    "Discipline pay karega. Aaj ki structured effort kal recognition banegi.",
    "Community luck laayegi. Dost ka suggestion opportunity ban sakta hai.",
    "Compassion aapka compass hai. Rest karein aur creativity flow hone dein.",
  ],
};

const AFFIRMATIONS: Record<Lang, string[]> = {
  en: [
    "I move at the pace of my own becoming.",
    "Clarity finds me when I breathe and begin.",
    "I am worthy of the abundance I am building.",
    "My calm is stronger than any storm.",
    "I attract kind people and honest conversations.",
    "Every small step I take is sacred progress.",
    "I release what I cannot control.",
    "My heart knows the way; I trust it today.",
    "The universe conspires gently in my favour.",
  ],
  hi: [
    "मैं अपने विकास की गति से चलता/चलती हूँ।",
    "श्वास लेते ही स्पष्टता मुझे मिलती है।",
    "मैं उस समृद्धि के योग्य हूँ जो मैं बना रहा/रही हूँ।",
    "मेरी शांति हर तूफ़ान से प्रबल है।",
    "मैं अच्छे लोगों और ईमानदार संवादों को आकर्षित करता/करती हूँ।",
    "मेरा हर छोटा कदम पवित्र प्रगति है।",
    "जो मेरे वश में नहीं, मैं उसे छोड़ता/छोड़ती हूँ।",
    "मेरा हृदय मार्ग जानता है; आज मैं उस पर भरोसा करता/करती हूँ।",
    "ब्रह्मांड कोमलता से मेरे पक्ष में है।",
  ],
  hinglish: [
    "Main apni growth ki speed se chalta/chalti hoon.",
    "Saans lete hi clarity mujhe milti hai.",
    "Main us abundance ke worthy hoon jo main bana raha/rahi hoon.",
    "Meri calmness har storm se strong hai.",
    "Main acche log aur honest conversations attract karta/karti hoon.",
    "Mera har chhota step sacred progress hai.",
    "Jo mere control mein nahi, main use release karta/karti hoon.",
    "Mera dil raasta jaanta hai; aaj main us par trust karta/karti hoon.",
    "Universe gently mere favour mein hai.",
  ],
};

export const REMEDY_LIBRARY: Record<
  Lang,
  { title: string; description: string }[]
> = {
  en: [
    { title: "Morning Surya Namaskar", description: "Offer water to the rising sun and take 5 slow breaths. A gentle ritual for confidence and vitality." },
    { title: "Chandra Shanti", description: "On a calm evening, sip warm milk mindfully and write one gratitude. Supports emotional balance." },
    { title: "Guru Daan", description: "Share a small act of teaching or donate a book on Thursday. Traditionally linked with wisdom and growth." },
    { title: "Shukra Ritual", description: "Wear something clean and fragrant on Friday and compliment someone sincerely. Invites harmony." },
    { title: "Budh Clarity", description: "Write tomorrow's three priorities on Wednesday night. A mindful practice for focus and communication." },
    { title: "Mangal Discipline", description: "Begin Tuesday with 10 minutes of movement. Traditionally channels courage constructively." },
    { title: "Shani Seva", description: "On Saturday, help someone with a small chore without being asked. A practice of patience and humility." },
    { title: "Mantra Meditation", description: "Sit quietly for 5 minutes repeating 'Om Shanti'. No outcome is guaranteed — the calm itself is the gift." },
  ],
  hi: [
    { title: "प्रातः सूर्य नमस्कार", description: "उगते सूर्य को जल अर्पित करें और 5 गहरी श्वास लें। आत्मविश्वास और ऊर्जा हेतु कोमल अनुष्ठान।" },
    { title: "चंद्र शांति", description: "शांत संध्या में गर्म दूध लें और एक कृतज्ञता लिखें। भावनात्मक संतुलन में सहायक।" },
    { title: "गुरु दान", description: "गुरुवार को किसी को कुछ सिखाएँ या पुस्तक दान करें। परंपरागत रूप से ज्ञान और विकास से जुड़ा।" },
    { title: "शुक्र अनुष्ठान", description: "शुक्रवार को स्वच्छ सुगंधित वस्त्र पहनें और किसी की सच्ची प्रशंसा करें। सामंजस्य का निमंत्रण।" },
    { title: "बुध स्पष्टता", description: "बुधवार रात कल की तीन प्राथमिकताएँ लिखें। एकाग्रता और संवाद हेतु सचेत अभ्यास।" },
    { title: "मंगल अनुशासन", description: "मंगलवार की शुरुआत 10 मिनट की शारीरिक गति से करें। साहस को सकारात्मक दिशा देता है।" },
    { title: "शनि सेवा", description: "शनिवार को बिना कहे किसी का छोटा काम करें। धैर्य और विनम्रता का अभ्यास।" },
    { title: "मंत्र ध्यान", description: "5 मिनट शांत बैठकर 'ॐ शांति' दोहराएँ। किसी परिणाम की गारंटी नहीं — शांति ही उपहार है।" },
  ],
  hinglish: [
    { title: "Morning Surya Namaskar", description: "Ugte suraj ko jal arpit karein aur 5 gehri saansein lein. Confidence aur energy ke liye gentle ritual." },
    { title: "Chandra Shanti", description: "Shaant shaam mein garam doodh lijiye aur ek gratitude likhiye. Emotional balance mein helpful." },
    { title: "Guru Daan", description: "Thursday ko kisi ko kuch sikhaiye ya book daan karein. Traditionally wisdom aur growth se juda." },
    { title: "Shukra Ritual", description: "Friday ko clean, fragrant kapde pehniye aur kisi ki sincere tareef karein. Harmony ka invite." },
    { title: "Budh Clarity", description: "Wednesday raat kal ki teen priorities likhiye. Focus aur communication ke liye mindful practice." },
    { title: "Mangal Discipline", description: "Tuesday ki shuruaat 10 minute movement se karein. Courage ko positive direction deta hai." },
    { title: "Shani Seva", description: "Saturday ko bina kahe kisi ka chhota kaam karein. Patience aur humility ki practice." },
    { title: "Mantra Meditation", description: "5 minute shaant baithkar 'Om Shanti' repeat karein. Koi guarantee nahi — calmness hi gift hai." },
  ],
};

function seedFrom(str: string): number {
  let h = 2166136261;

  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }

  return Math.abs(h);
}

export type DailyReading = {
  date: string;
  signIndex: number;
  signName: string;
  transitMoonSign: string;
  transitMoonHouse: number;
  focus: string;
  luckyColour: { name: string; hex: string };
  luckyNumber: number;
  affirmation: string;
  remedy: { title: string; description: string };
};

export function buildDaily(
  signIndex: number,
  transitMoon: { rashi: number; rashiName: string },
  lang: Lang,
  dateStr: string
): DailyReading {
  const safeSignIndex =
    ((Math.trunc(signIndex) % 12) + 12) % 12;

  const safeMoonIndex =
    ((Math.trunc(transitMoon.rashi) % 12) + 12) % 12;

  const seed = seedFrom(`${dateStr}:${safeSignIndex}`);
  const colour = COLOURS[seed % COLOURS.length];
  const remedyList = REMEDY_LIBRARY[lang] ?? REMEDY_LIBRARY.en;
  const focusList = FOCUS[lang] ?? FOCUS.en;
  const affirmationList = AFFIRMATIONS[lang] ?? AFFIRMATIONS.en;

  return {
    date: dateStr,
    signIndex: safeSignIndex,
    signName:
      lang === "hi"
        ? RASHIS_HI[safeSignIndex]
        : RASHIS[safeSignIndex],
    transitMoonSign:
      lang === "hi"
        ? RASHIS_HI[safeMoonIndex]
        : transitMoon.rashiName,
    transitMoonHouse:
      ((safeMoonIndex - safeSignIndex + 12) % 12) + 1,
    focus: focusList[safeSignIndex],
    luckyColour: {
      name: colour[lang] ?? colour.en,
      hex: colour.hex,
    },
    luckyNumber: (seed % 9) + 1,
    affirmation: affirmationList[seed % affirmationList.length],
    remedy: remedyList[seed % remedyList.length],
  };
}