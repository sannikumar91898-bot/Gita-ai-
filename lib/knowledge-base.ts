
import { getExtendedKnowledgeEntries } from "./knowledge/knowledge-adapter";

export type KnowledgeLanguage = "hi" | "hinglish" | "en";

export type KnowledgeEntry = {
  id: string;
  topic: string;
  question: string;
  aliases: string[];
  answers: Record<KnowledgeLanguage, string>;
};

const SEEDS: Omit<KnowledgeEntry, "id">[] = [
  {
    topic: "vedic-astrology",
    question: "वैदिक ज्योतिष क्या है?",
    aliases: ["vedic astrology", "jyotish kya hai", "ज्योतिष क्या है"],
    answers: {
      hi: "प्रिय, वैदिक ज्योतिष हमारी प्राचीन भारतीय परंपरा का प्रतीकात्मक ज्ञान है। इसमें ग्रहों, राशियों, नक्षत्रों और जन्म समय की स्थिति से जीवन की दिशा समझने की कोशिश की जाती है। इसे निश्चित भविष्यवाणी या वैज्ञानिक प्रमाण न समझें।",
      hinglish: "Priya, Vedic astrology hamari purani Bhartiya parampara ka symbolic knowledge hai. Ismein grah, rashi, nakshatra aur birth time dekhkar life ki direction samajhne ki koshish hoti hai. Ise guaranteed prediction na samjhein.",
      en: "Vedic astrology is a symbolic system from the Indian tradition. It uses planetary and birth-chart symbolism for reflection, not guaranteed predictions or scientific proof."
    }
  },
  {
    topic: "kundli",
    question: "जन्म कुंडली क्या होती है?",
    aliases: ["kundli kya hai", "birth chart", "janam patri", "जन्मपत्री"],
    answers: {
      hi: "बेटा, जन्म कुंडली जन्म की तारीख, सही समय और स्थान के आधार पर बनाई जाती है। व्यक्तिगत कुंडली के लिए सही जन्म विवरण ज़रूरी हैं।",
      hinglish: "Beta, janam kundli birth date, accurate time aur place ke basis par banti hai. Personal kundli ke liye sahi birth details zaroori hain.",
      en: "A birth chart is prepared from your date, exact time and place of birth. Accurate details are important for a personal chart."
    }
  },
  {
    topic: "kundli",
    question: "लग्न क्या होता है?",
    aliases: ["ascendant", "lagna meaning", "lagna kya hota hai"],
    answers: {
      hi: "लग्न वह राशि है जो जन्म के समय पूर्वी आकाश में उदय हो रही होती है। इसकी गणना जन्म समय और स्थान पर निर्भर करती है।",
      hinglish: "Lagna woh rashi hai jo birth ke time eastern sky mein rise ho rahi hoti hai. Iski calculation birth time aur place par depend karti hai.",
      en: "The Ascendant is the sign rising on the eastern horizon at birth. Its calculation depends on birth time and location."
    }
  },
  {
    topic: "graha",
    question: "नवग्रह कौन-कौन से हैं?",
    aliases: ["nine planets", "navgrah names", "navagraha"],
    answers: {
      hi: "परंपरा में नवग्रह हैं — सूर्य, चंद्र, मंगल, बुध, बृहस्पति, शुक्र, शनि, राहु और केतु। राहु और केतु खगोलीय छाया बिंदु हैं।",
      hinglish: "Navgrah hain Surya, Chandra, Mangal, Budh, Brihaspati, Shukra, Shani, Rahu aur Ketu. Rahu aur Ketu astronomical shadow points hain.",
      en: "The nine grahas are the Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu and Ketu. Rahu and Ketu are astronomical shadow points."
    }
  },
  {
    topic: "graha",
    question: "शनि ग्रह का ज्योतिष में क्या अर्थ है?",
    aliases: ["saturn meaning", "shani ka prabhav", "shani grah"],
    answers: {
      hi: "प्रिय, शनि को अनुशासन, धैर्य, जिम्मेदारी और कर्म से जोड़ा जाता है। ज्योतिषीय व्याख्याएँ निश्चित तथ्य या गारंटी नहीं होतीं।",
      hinglish: "Priya, Shani ko discipline, patience, responsibility aur karma se joda jata hai. Astrology ki interpretations guaranteed facts nahi hoti.",
      en: "Saturn is traditionally associated with discipline, patience, responsibility and karma. Astrological interpretations are not guaranteed facts."
    }
  },
  {
    topic: "graha",
    question: "बृहस्पति ग्रह किसका प्रतीक है?",
    aliases: ["guru grah", "jupiter astrology", "brihaspati meaning"],
    answers: {
      hi: "बृहस्पति को ज्ञान, शिक्षा, मार्गदर्शन और विस्तार का प्रतीक माना जाता है। यह पारंपरिक मान्यता है, परिणाम की गारंटी नहीं।",
      hinglish: "Brihaspati ko knowledge, education, guidance aur growth ka symbol maana jata hai. Yeh traditional belief hai, guarantee nahi.",
      en: "Jupiter is traditionally associated with knowledge, learning, guidance and expansion. This is a traditional belief, not a guarantee."
    }
  },
  {
    topic: "rashi",
    question: "बारह राशियों के नाम क्या हैं?",
    aliases: ["12 zodiac signs", "all rashis", "rashi names"],
    answers: {
      hi: "बारह राशियाँ हैं — मेष, वृषभ, मिथुन, कर्क, सिंह, कन्या, तुला, वृश्चिक, धनु, मकर, कुंभ और मीन।",
      hinglish: "12 rashiyan hain — Mesh, Vrishabh, Mithun, Kark, Singh, Kanya, Tula, Vrishchik, Dhanu, Makar, Kumbh aur Meen.",
      en: "The twelve signs are Aries, Taurus, Gemini, Cancer, Leo, Virgo, Libra, Scorpio, Sagittarius, Capricorn, Aquarius and Pisces."
    }
  },
  {
    topic: "rashi",
    question: "चंद्र राशि क्या होती है?",
    aliases: ["moon sign", "chandra rashi", "moon rashi"],
    answers: {
      hi: "चंद्र राशि वह राशि है जिसमें जन्म के समय चंद्रमा स्थित होता है। इसे निकालने के लिए सही जन्म विवरण ज़रूरी हैं।",
      hinglish: "Chandra rashi woh sign hai jisme birth ke time Moon hota hai. Iske liye accurate birth details chahiye.",
      en: "The Moon sign is the zodiac sign occupied by the Moon at birth. Accurate birth details are needed to calculate it."
    }
  },
  {
    topic: "nakshatra",
    question: "नक्षत्र क्या होता है?",
    aliases: ["nakshatra meaning", "27 nakshatra", "birth star"],
    answers: {
      hi: "वैदिक ज्योतिष में आकाश को 27 नक्षत्रों में बाँटा जाता है। जन्म नक्षत्र चंद्रमा की स्थिति से निकाला जाता है।",
      hinglish: "Vedic astrology mein aakash ko 27 nakshatron mein baanta jata hai. Janma nakshatra Moon ki position se calculate hota hai.",
      en: "Vedic astrology divides the sky into 27 nakshatras. The birth nakshatra is calculated from the Moon's position."
    }
  },
  {
    topic: "dasha",
    question: "विंशोत्तरी दशा क्या है?",
    aliases: ["vimshottari dasha", "mahadasha meaning", "dasha system"],
    answers: {
      hi: "विंशोत्तरी दशा एक पारंपरिक ग्रह-अवधि प्रणाली है। व्यक्तिगत दशा के लिए जन्म नक्षत्र और सही गणना आवश्यक है।",
      hinglish: "Vimshottari Dasha ek traditional planetary-period system hai. Personal dasha ke liye birth nakshatra aur accurate calculation zaroori hai.",
      en: "Vimshottari Dasha is a traditional planetary-period system. Personal calculations require the birth nakshatra and accurate chart data."
    }
  },
  {
    topic: "yog",
    question: "राजयोग क्या होता है?",
    aliases: ["raj yoga", "raajyog meaning", "kundli yog"],
    answers: {
      hi: "राजयोग कुछ विशेष ग्रह-भाव संबंधों के लिए इस्तेमाल होने वाला ज्योतिषीय शब्द है। यह सफलता या धन की गारंटी नहीं देता।",
      hinglish: "Rajyog kuch special planet-house combinations ke liye use hota hai. Yeh success ya wealth ki guarantee nahi deta.",
      en: "Raj Yoga describes certain planetary and house combinations in astrology. It does not guarantee success or wealth."
    }
  },
  {
    topic: "dosha",
    question: "मंगल दोष क्या है?",
    aliases: ["manglik dosh", "mangal dosha", "manglik meaning"],
    answers: {
      hi: "मंगल दोष पारंपरिक ज्योतिष में मंगल की कुछ स्थितियों को कहा जाता है। इससे डरकर विवाह का निर्णय न लें। सम्मान, संवाद और आपसी समझ अधिक महत्वपूर्ण हैं।",
      hinglish: "Mangal dosh traditional astrology mein Mars ki kuch positions ko kehte hain. Isse darkar marriage ka decision na lein. Respect aur understanding zyada important hain.",
      en: "Mangal Dosha is a traditional label for certain Mars placements. Do not make marriage decisions out of fear; respect and understanding matter more."
    }
  },
  {
    topic: "love",
    question: "प्रेम संबंध में अनुकूलता कैसे समझें?",
    aliases: ["love compatibility", "relationship match", "love life"],
    answers: {
      hi: "प्रिय, स्वस्थ रिश्ते में आपसी सम्मान, भरोसा, ईमानदार बातचीत और सहमति सबसे ज़रूरी हैं। कुंडली किसी रिश्ते की सफलता की गारंटी नहीं देती।",
      hinglish: "Priya, healthy relationship mein respect, trust, honest communication aur consent sabse zaroori hain. Kundli relationship ki success guarantee nahi karti.",
      en: "Healthy relationships rely on mutual respect, trust, honest communication and consent. A birth chart cannot guarantee relationship success."
    }
  },
  {
    topic: "marriage",
    question: "विवाह का सही समय कैसे पता चलता है?",
    aliases: ["marriage timing", "shaadi kab hogi", "vivah yog"],
    answers: {
      hi: "ज्योतिष में कुंडली, दशा और गोचर देखकर समय की चर्चा होती है, लेकिन विवाह की निश्चित तारीख की गारंटी नहीं दी जा सकती।",
      hinglish: "Astrology mein kundli, dasha aur transit dekhkar timing discuss hoti hai, lekin shaadi ki exact date guarantee nahi ki ja sakti.",
      en: "Astrologers may discuss timing using charts and transits, but no one can guarantee an exact wedding date."
    }
  },
  {
    topic: "career",
    question: "करियर में सफलता कैसे मिलेगी?",
    aliases: [
      "career guidance",
      "job selection",
      "career advice",
      "करियर चुनते समय क्या ध्यान रखें",
      "करियर में सफलता कैसे मिलेगी",
      "career mein safalta kaise milegi",
      "career me success kaise milegi",
      "career success",
      "career growth",
      "how to succeed in career",
      "job kaise milegi",
      "career kaise banaye",
      "career planning",
      "career options",
      "government job preparation",
      "sarkari naukri ki taiyari"
    ],
    answers: {
      hi: "प्रिय, करियर में सफलता के लिए अपनी रुचि और योग्यता के अनुसार स्पष्ट लक्ष्य चुनें। आधिकारिक syllabus और selection process समझें, रोज़ नियमित अभ्यास करें और हर सप्ताह mock test देकर कमज़ोरियों को सुधारें। सरकारी नौकरी की तैयारी कर रहे हैं, तो एक मुख्य परीक्षा चुनकर उसके previous-year papers और समयबद्ध अभ्यास पर ध्यान दें। अपनी प्रगति दर्ज करें। ज्योतिष को आत्मचिंतन का माध्यम मान सकते हैं, लेकिन करियर का निर्णय वास्तविक योग्यता, अवसर और तैयारी के आधार पर लें।",
      hinglish: "Priya, career mein success ke liye apni interest aur skills ke hisaab se clear goal choose karein. Official syllabus aur selection process samjhein, roz fixed time par practice karein aur har week mock test dekar weak topics improve karein. Sarkari naukri ki taiyari kar rahe hain, to ek main exam select karke uske previous-year papers aur timed practice par focus karein. Apni progress track karein. Astrology ko reflection ke liye use kar sakte hain, lekin career decisions practical skills, opportunities aur preparation ke basis par lein.",
      en: "Dear, career success starts with a clear goal that matches your interests and skills. Understand the official syllabus and selection process, practise regularly, and review your progress with weekly mock tests. If preparing for a government job, focus on one primary exam, its previous-year papers and timed practice. Track your progress. Astrology may be used for reflection, but make career decisions based on real skills, opportunities and preparation."
    }
  },
  {
    topic: "money",
    question: "धन प्रबंधन कैसे बेहतर करें?",
    aliases: ["money problems", "financial growth", "wealth advice"],
    answers: {
      hi: "आय और खर्च लिखें, ज़रूरी खर्चों को प्राथमिकता दें और नियमित बचत करें। कोई ज्योतिषीय उपाय धन आने की गारंटी नहीं देता।",
      hinglish: "Income aur expenses track karein, zaroori kharchon ko priority dein aur regular saving karein. Koi astrological upay paisa aane ki guarantee nahi deta.",
      en: "Track income and expenses, prioritise essentials and save regularly. No astrological remedy can guarantee money."
    }
  },
  {
    topic: "remedies",
    question: "क्या ज्योतिषीय उपाय जरूरी हैं?",
    aliases: ["astrology remedies", "upay", "grah shanti"],
    answers: {
      hi: "मंत्र, प्रार्थना, ध्यान या दान कुछ लोगों के लिए मन की शांति का माध्यम हो सकते हैं। महँगे उपायों और चमत्कारी वादों से सावधान रहें।",
      hinglish: "Mantra, prayer, meditation ya daan kuch logon ke liye peace ka medium ho sakte hain. Mehnge upay aur miracle promises se savdhan rahein.",
      en: "Prayer, meditation or charity may provide comfort to some people. Be cautious about expensive remedies and miracle promises."
    }
  },
  {
    topic: "palmistry",
    question: "हस्तरेखा विज्ञान क्या है?",
    aliases: ["palm reading", "palmistry meaning", "haath ki rekha"],
    answers: {
      hi: "हस्तरेखा पढ़ना हाथ की रेखाओं की पारंपरिक व्याख्या है। इससे भविष्य या स्वास्थ्य को विश्वसनीय रूप से नहीं जाना जा सकता।",
      hinglish: "Palmistry haath ki lines ki traditional interpretation hai. Isse future ya health reliably nahi jaani ja sakti.",
      en: "Palmistry is a traditional interpretation of hand lines. It cannot reliably predict the future or health outcomes."
    }
  },
  {
    topic: "daily-horoscope",
    question: "दैनिक राशिफल कितना सही होता है?",
    aliases: ["daily horoscope", "aaj ka rashifal", "today horoscope"],
    answers: {
      hi: "दैनिक राशिफल आमतौर पर सामान्य होता है। इसे हल्के आत्मचिंतन की तरह पढ़ें, बड़े निर्णयों का आधार न बनाएँ।",
      hinglish: "Daily horoscope usually general hota hai. Ise light reflection samjhein, bade decisions ka base na banayein.",
      en: "Daily horoscopes are usually general. Treat them as light reflection, not the basis for important decisions."
    }
  },
  {
    topic: "gita",
    question: "भगवद्गीता का मुख्य संदेश क्या है?",
    aliases: ["bhagavad gita meaning", "gita teachings", "गीता का संदेश"],
    answers: {
      hi: "गीता हमें कर्तव्य, विवेक, आत्मसंयम और भक्ति का संदेश देती है। अपना काम लगन से करें और फल की चिंता कम करें।",
      hinglish: "Gita humein duty, wisdom, self-control aur devotion ka sandesh deti hai. Apna kaam lagan se karein aur result ki chinta kam karein.",
      en: "The Gita teaches duty, wisdom, self-discipline and devotion. Work sincerely while reducing excessive attachment to results."
    }
  },
  {
    topic: "gita",
    question: "कठिन समय में गीता से क्या सीख सकते हैं?",
    aliases: ["gita for difficult times", "stress and gita", "गीता की सीख"],
    answers: {
      hi: "कठिन समय में गीता धैर्य, स्पष्टता और अपने नियंत्रण वाले कार्यों पर ध्यान देने की प्रेरणा देती है। ज़रूरत पड़ने पर सहायता लेना भी सही है।",
      hinglish: "Mushkil samay mein Gita patience, clarity aur apne control wale kaamon par focus karna sikhati hai. Zarurat par help lena bhi sahi hai.",
      en: "In difficult times, the Gita encourages patience, clarity and focus on what we can control. Seeking help when needed is also appropriate."
    }
  },
  {
    topic: "wellbeing",
    question: "क्या कुंडली से स्वास्थ्य की बीमारी पता चल सकती है?",
    aliases: ["health astrology", "health prediction", "disease in kundli"],
    answers: {
      hi: "नहीं प्रिय, कुंडली से किसी बीमारी का विश्वसनीय निदान नहीं हो सकता। लक्षण हों तो डॉक्टर से सलाह लें। ज्योतिष चिकित्सा का विकल्प नहीं है।",
      hinglish: "Nahi priya, kundli se kisi bimari ka reliable diagnosis nahi ho sakta. Symptoms hon to doctor se salah lein. Astrology medical care ka replacement nahi hai.",
      en: "A birth chart cannot reliably diagnose an illness. Consult a doctor if you have symptoms; astrology is not a substitute for medical care."
    }
  },
  {
    topic: "health-prevention",
    question: "स्वास्थ्य की देखभाल और बीमारी से बचाव कैसे करें?",
    aliases: ["health prevention", "health care tips", "bimari se bachav", "sehat ka dhyan", "स्वास्थ्य की सावधानियां"],
    answers: {
      hi: "नियमित नींद, संतुलित भोजन, पर्याप्त पानी और हल्की गतिविधि अपनाएँ। कोई लक्षण लंबे समय तक रहे तो डॉक्टर से बात करें।",
      hinglish: "Regular sleep, balanced food, enough water aur halki activity apnayein. Koi symptom lambe samay tak rahe to doctor se baat karein.",
      en: "Maintain regular sleep, balanced meals, hydration and light activity. If symptoms persist, speak to a doctor."
    }
  },
  {
    topic: "health-anxiety",
    question: "अगर मुझे बीमारी का डर बार-बार लगता है तो क्या करूं?",
    aliases: ["fear of illness", "health anxiety", "bimari ka dar", "mujhe bimari ka darr hai", "health ko lekar tension"],
    answers: {
      hi: "मैं समझ सकती हूँ कि सेहत को लेकर बार-बार डर लगना कितना थका देने वाला होता है। धीरे-धीरे साँस लें। अगर चिंता रोज़मर्रा की ज़िंदगी प्रभावित कर रही है, तो डॉक्टर या मानसिक स्वास्थ्य विशेषज्ञ से बात करें।",
      hinglish: "Main samajh sakti hoon ki health ko lekar baar-baar darr lagna kitna exhausting hota hai. Dheere saans lein. Agar anxiety daily life affect kar rahi hai, to doctor ya mental health professional se baat karein.",
      en: "Repeated fear about illness can be exhausting. Take slow breaths, and if anxiety affects daily life, consider speaking with a doctor or mental-health professional."
    }
  },
  {
    topic: "mental-wellbeing",
    question: "तनाव और ज्यादा सोचने पर मन को शांत कैसे करें?",
    aliases: ["stress and overthinking", "mind ko shant kaise karein", "overthinking help", "tension kam karna", "anxiety calming"],
    answers: {
      hi: "आराम से बैठें, धीरे साँस अंदर लें और धीरे बाहर छोड़ें। फिर देखें कि अभी कौन-सा छोटा काम आपके नियंत्रण में है। तनाव लंबे समय तक रहे तो मदद लें।",
      hinglish: "Aaram se baithkar dheere saans andar lein aur bahar chhodein. Phir dekhein ki abhi kaunsa chhota kaam aapke control mein hai. Stress lambe samay tak rahe to help lein.",
      en: "Sit comfortably, breathe in and out slowly, and identify one small thing within your control. If stress continues, reach out to someone you trust or a professional."
    }
  },
  {
    topic: "age-and-longevity",
    question: "क्या कुंडली से आयु या मृत्यु का समय पता चल सकता है?",
    aliases: ["life expectancy astrology", "death prediction", "meri umar kitni hogi", "ayu in kundli", "death age prediction", "longevity prediction"],
    answers: {
      hi: "मैं आपकी आयु या मृत्यु का समय कुंडली से निश्चित रूप से नहीं बता सकती। ऐसी भविष्यवाणियाँ भरोसेमंद नहीं हैं। आज की सेहत, सुरक्षित आदतों और अपनों के साथ समय पर ध्यान दें।",
      hinglish: "Main aapki exact age ya death ka time kundli se reliably nahi bata sakti. Aisi predictions trustworthy nahi hain. Aaj ki health, safe habits aur apno ke saath waqt par focus karein.",
      en: "A birth chart cannot reliably tell anyone's lifespan or time of death. Focus on health, safe habits and time with loved ones instead."
    }
  }
];

function normalizeKnowledgeText(value: string): string {
  return value
    .toLocaleLowerCase()
    .normalize("NFKC")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function topicMatches(entryTopic: string, requestedTopic: string): boolean {
  const topic = requestedTopic.toLowerCase().trim();

  if (!topic || topic === "general") return true;

  const aliases: Record<string, string[]> = {
    health: ["health", "wellbeing", "health-prevention", "health-anxiety"],
    love: ["love", "relationship", "marriage"],
    career: ["career", "career-business", "job", "business"],
    money: ["money", "wealth", "property"],
    remedies: ["remedies", "planetary-doshas", "dosha"],
    family: ["family", "marriage", "relationship"],
    palm: ["palm", "palmistry"]
  };

  const allowed = aliases[topic] ?? [topic];

  return allowed.some((item) => entryTopic.toLowerCase().includes(item));
}

export function getKnowledgeAnswerText(
  question: string,
  language: KnowledgeLanguage = "hinglish",
  topic = "general"
): string | null {
  const query = normalizeKnowledgeText(question);

  if (!query) return null;

  const baseEntries: KnowledgeEntry[] = SEEDS.map((entry, index) => ({
    ...entry,
    id: `seed-${index + 1}`
  }));

  const entries = [
    ...baseEntries,
    ...getExtendedKnowledgeEntries()
  ];

  const requestedTopic = topic.toLowerCase().trim();

  const candidates = entries.filter((entry) =>
    topicMatches(entry.topic, requestedTopic)
  );

  let bestEntry: KnowledgeEntry | null = null;
  let bestScore = 0;

  for (const entry of candidates) {
    const phrases = [entry.question, ...entry.aliases];

    for (const phrase of phrases) {
      const candidate = normalizeKnowledgeText(phrase);

      if (!candidate) continue;

      let score = 0;

      if (candidate === query) {
        score = 100;
      } else if (candidate.length >= 5 && query.includes(candidate)) {
        score = 80 + candidate.length / 100;
      } else if (query.length >= 5 && candidate.includes(query)) {
        score = 60 + query.length / 100;
      }

      if (score > bestScore) {
        bestScore = score;
        bestEntry = entry;
      }
    }
  }

  if (!bestEntry) return null;

  return (
    bestEntry.answers[language] ||
    bestEntry.answers.hinglish ||
    bestEntry.answers.hi ||
    bestEntry.answers.en ||
    null
  );
}
