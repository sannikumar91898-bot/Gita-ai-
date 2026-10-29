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
      hi: "प्रिय, वैदिक ज्योतिष हमारी प्राचीन भारतीय परंपरा का एक सुंदर प्रतीकात्मक ज्ञान है। इसमें ग्रहों, राशियों, नक्षत्रों और जन्म समय की स्थिति को देखकर जीवन की दिशा समझने की कोशिश की जाती है। इसे निश्चित भविष्यवाणी या वैज्ञानिक प्रमाण न समझें — बस एक मार्गदर्शन की तरह लें।",
      hinglish: "Priya, Vedic astrology hamari purani Bhartiya parampara ka ek sundar symbolic knowledge hai. Ismein grah, rashi, nakshatra aur birth time dekhkar life ki direction samajhne ki koshish hoti hai. Ise guaranteed prediction ya scientific proof na samjhein — bas ek guidance ki tarah lein.",
      en: "Dear one, Vedic astrology is a beautiful symbolic system from our ancient Indian tradition. It looks at planets, signs, nakshatras and birth time to offer gentle guidance about life’s direction. Please don’t treat it as a guaranteed prediction or scientific proof — just as a soft companion for reflection."
    }
  },
  {
    topic: "kundli",
    question: "जन्म कुंडली क्या होती है?",
    aliases: ["kundli kya hai", "birth chart", "janam patri", "जन्मपत्री"],
    answers: {
      hi: "बेटा, जन्म कुंडली आपके जन्म की तारीख, सही समय और स्थान के आधार पर बनाई जाती है। यह एक ज्योतिषीय मानचित्र की तरह है। व्यक्तिगत कुंडली के लिए सही जन्म विवरण बहुत ज़रूरी होते हैं।",
      hinglish: "Beta, janam kundli aapki birth date, accurate time aur place ke basis par banti hai. Yeh ek astrology chart jaisa hota hai. Personal kundli ke liye sahi birth details bahut zaroori hote hain.",
      en: "Dear, a birth chart is prepared from your exact date, time and place of birth. It is like an astrological map of that moment. For a personal chart, accurate birth details are truly important."
    }
  },
  {
    topic: "kundli",
    question: "लग्न क्या होता है?",
    aliases: ["ascendant", "lagna meaning", "lagna kya hota hai"],
    answers: {
      hi: "लग्न वह राशि है जो आपके जन्म के समय पूर्वी आकाश में उदय हो रही होती है। इसकी गणना जन्म समय और स्थान पर निर्भर करती है। यह कुंडली का बहुत महत्वपूर्ण हिस्सा माना जाता है।",
      hinglish: "Lagna woh rashi hai jo aapke birth ke time eastern sky mein uth rahi hoti hai. Iski calculation birth time aur place par depend karti hai. Yeh kundli ka bahut important part maana jata hai.",
      en: "The Ascendant (Lagna) is the sign that was rising on the eastern horizon at the exact moment of your birth. Its calculation depends on birth time and place, and it is considered a very important part of the chart."
    }
  },
  {
    topic: "graha",
    question: "नवग्रह कौन-कौन से हैं?",
    aliases: ["nine planets", "navgrah names", "navagraha"],
    answers: {
      hi: "परंपरा में नवग्रह हैं — सूर्य, चंद्र, मंगल, बुध, बृहस्पति, शुक्र, शनि, राहु और केतु। राहु और केतु वास्तविक ग्रह नहीं, बल्कि खगोलीय छाया बिंदु हैं।",
      hinglish: "Parampara mein Navgrah hain — Surya, Chandra, Mangal, Budh, Brihaspati, Shukra, Shani, Rahu aur Ketu. Rahu aur Ketu asli planet nahi, balki astronomical shadow points hain.",
      en: "In tradition the nine grahas are the Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu and Ketu. Rahu and Ketu are not physical planets but astronomical shadow points."
    }
  },
  {
    topic: "graha",
    question: "शनि ग्रह का ज्योतिष में क्या अर्थ है?",
    aliases: ["saturn meaning", "shani ka prabhav", "shani grah"],
    answers: {
      hi: "प्रिय, शनि को अनुशासन, धैर्य, जिम्मेदारी और कर्म का ग्रह माना जाता है। किसी व्यक्ति पर इसका प्रभाव समझने के लिए पूरी कुंडली देखनी पड़ती है। ज्योतिषीय व्याख्याएँ निश्चित तथ्य नहीं होतीं।",
      hinglish: "Priya, Shani ko discipline, patience, responsibility aur karma ka grah maana jata hai. Kisi vyakti par iska effect samajhne ke liye poori kundli dekhni padti hai. Astrology ki baatein guaranteed facts nahi hoti.",
      en: "Dear, Saturn is traditionally linked with discipline, patience, responsibility and karma. To understand its influence on anyone, the full chart must be studied. Astrological interpretations are never guaranteed facts."
    }
  },
  {
    topic: "graha",
    question: "बृहस्पति ग्रह किसका प्रतीक है?",
    aliases: ["guru grah", "jupiter astrology", "brihaspati meaning"],
    answers: {
      hi: "बृहस्पति को ज्ञान, शिक्षा, मार्गदर्शन और विस्तार का शुभ ग्रह माना जाता है। यह एक पारंपरिक मान्यता है, किसी परिणाम की गारंटी नहीं।",
      hinglish: "Brihaspati ko knowledge, education, guidance aur growth ka shubh grah maana jata hai. Yeh traditional belief hai, koi guarantee nahi.",
      en: "Jupiter is traditionally seen as the planet of knowledge, learning, guidance and expansion. This is a traditional view, not a promise of results."
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
      hi: "चंद्र राशि वह राशि है जिसमें जन्म के समय चंद्रमा स्थित होता है। इसे निकालने के लिए जन्म तारीख, समय और स्थान की सही जानकारी ज़रूरी है।",
      hinglish: "Chandra rashi woh sign hai jisme birth ke time Moon hota hai. Isse nikalne ke liye birth date, time aur place ki sahi jaankari zaroori hai.",
      en: "The Moon sign is the zodiac sign where the Moon was placed at birth. Accurate birth date, time and place are needed to calculate it."
    }
  },
  {
    topic: "nakshatra",
    question: "नक्षत्र क्या होता है?",
    aliases: ["nakshatra meaning", "27 nakshatra", "birth star"],
    answers: {
      hi: "वैदिक ज्योतिष में आकाश को 27 नक्षत्रों में बाँटा गया है। जन्म नक्षत्र चंद्रमा की स्थिति से निकाला जाता है, जिसके लिए सही जन्म विवरण चाहिए।",
      hinglish: "Vedic astrology mein aakash ko 27 nakshatron mein baanta gaya hai. Janma nakshatra Moon ki position se nikalta hai, jiske liye sahi birth details chahiye.",
      en: "Vedic astrology divides the sky into 27 nakshatras. The birth nakshatra is found from the Moon’s position and needs accurate birth details."
    }
  },
  {
    topic: "dasha",
    question: "विंशोत्तरी दशा क्या है?",
    aliases: ["vimshottari dasha", "mahadasha meaning", "dasha system"],
    answers: {
      hi: "विंशोत्तरी दशा एक समय-चक्र प्रणाली है जिसमें अलग-अलग ग्रहों के काल बताए जाते हैं। व्यक्तिगत दशा जानने के लिए जन्म नक्षत्र और सही गणना आवश्यक है।",
      hinglish: "Vimshottari Dasha ek time-cycle system hai jisme alag-alag grahon ke periods bataye jate hain. Personal dasha ke liye birth nakshatra aur sahi calculation zaroori hai.",
      en: "Vimshottari Dasha is a planetary period system. To know someone’s personal dasha, the birth nakshatra and proper calculations are required."
    }
  },
  {
    topic: "yog",
    question: "राजयोग क्या होता है?",
    aliases: ["raj yoga", "raajyog meaning", "kundli yog"],
    answers: {
      hi: "राजयोग कुछ विशेष ग्रह-भाव संबंधों के लिए इस्तेमाल किया जाने वाला शब्द है। केवल योग का नाम सुनकर सफलता या धन की गारंटी नहीं दी जा सकती।",
      hinglish: "Rajyog kuch special planet-house combinations ke liye use hota hai. Sirf yog ka naam sunkar success ya wealth ki guarantee nahi di ja sakti.",
      en: "Raj Yoga is a term used for certain special planetary and house combinations. Simply having the name does not guarantee success or wealth."
    }
  },
  {
    topic: "dosha",
    question: "मंगल दोष क्या है?",
    aliases: ["manglik dosh", "mangal dosha", "manglik meaning"],
    answers: {
      hi: "मंगल दोष पारंपरिक ज्योतिष में मंगल की कुछ स्थितियों को कहा जाता है। इससे डरकर विवाह का निर्णय न लें। रिश्ते में सम्मान, संवाद और आपसी समझ कहीं ज़्यादा महत्वपूर्ण हैं।",
      hinglish: "Mangal dosh traditional astrology mein Mars ki kuch positions ko kehte hain. Isse darkar marriage ka decision na lein. Rishton mein respect, communication aur mutual understanding bahut zyada important hain.",
      en: "Mangal Dosha is a traditional label for certain Mars placements. Please don’t make marriage decisions out of fear. Respect, communication and mutual understanding matter far more in any relationship."
    }
  },
  {
    topic: "love",
    question: "प्रेम संबंध में अनुकूलता कैसे समझें?",
    aliases: ["love compatibility", "relationship match", "love life"],
    answers: {
      hi: "प्रिय, स्वस्थ रिश्ते में सबसे ज़रूरी है आपसी सम्मान, भरोसा, ईमानदार बातचीत और सहमति। राशि या कुंडली किसी रिश्ते की सफलता की गारंटी नहीं दे सकती।",
      hinglish: "Priya, healthy relationship mein sabse zaroori hai mutual respect, trust, honest baatcheet aur consent. Rashi ya kundli kisi relationship ki success guarantee nahi de sakti.",
      en: "Dear one, the foundation of a healthy relationship is mutual respect, trust, honest communication and consent. A zodiac sign or birth chart can never guarantee the success of a relationship."
    }
  },
  {
    topic: "marriage",
    question: "विवाह का सही समय कैसे पता चलता है?",
    aliases: ["marriage timing", "shaadi kab hogi", "vivah yog"],
    answers: {
      hi: "ज्योतिष में कुंडली, दशा और गोचर देखकर समय की चर्चा की जाती है, लेकिन विवाह की तारीख कोई निश्चित रूप से नहीं बता सकता। व्यक्तिगत विश्लेषण के लिए सही गणना ज़रूरी है।",
      hinglish: "Astrology mein kundli, dasha aur transit dekhkar timing ki baat hoti hai, lekin shaadi ki exact date koi guarantee nahi kar sakta. Personal analysis ke liye sahi calculation zaroori hai.",
      en: "Astrologers may look at the chart, dashas and transits for timing, but no one can guarantee an exact wedding date. Proper personal calculations are needed for any meaningful discussion."
    }
  },
  {
    topic: "career",
    question: "करियर चुनते समय क्या ध्यान रखें?",
    aliases: ["career guidance", "job selection", "career advice"],
    answers: {
      hi: "करियर चुनते समय अपनी रुचि, योग्यता, अवसर और तैयारी के समय को देखें। ज्योतिष को चाहें तो सोचने का एक तरीका मान सकते हैं, लेकिन अंतिम निर्णय वास्तविक जानकारी पर ही लें।",
      hinglish: "Career choose karte waqt apni interest, skills, opportunities aur preparation time dekhein. Astrology ko sochne ka ek tarika maan sakte hain, lekin final decision practical information par hi lein.",
      en: "When choosing a career, look at your interests, skills, available opportunities and the time you can give for preparation. You may use astrology as optional reflection, but base your decision on real information."
    }
  },
  {
    topic: "money",
    question: "धन प्रबंधन कैसे बेहतर करें?",
    aliases: ["money problems", "financial growth", "wealth advice"],
    answers: {
      hi: "आय और खर्च लिखें, ज़रूरी खर्चों को प्राथमिकता दें और नियमित बचत करें। कोई भी ज्योतिषीय उपाय धन आने की गारंटी नहीं देता।",
      hinglish: "Income aur expenses track karein, zaroori kharchon ko priority dein aur regular saving karein. Koi bhi astrological upay paisa aane ki guarantee nahi deta.",
      en: "Track your income and expenses, prioritise essentials and save regularly. No astrological remedy can guarantee money coming in."
    }
  },
  {
    topic: "remedies",
    question: "क्या ज्योतिषीय उपाय जरूरी हैं?",
    aliases: ["astrology remedies", "upay", "grah shanti"],
    answers: {
      hi: "मंत्र, प्रार्थना, ध्यान या दान कुछ लोगों के लिए मन की शांति और आस्था का माध्यम हो सकते हैं। महँगे उपायों और चमत्कारी वादों से सावधान रहें।",
      hinglish: "Mantra, prayer, meditation ya daan kuch logon ke liye mann ki shanti aur faith ka medium ho sakte hain. Mehnge upay aur miracle wade se savdhan rahein.",
      en: "Chanting, prayer, meditation or charity can be a source of peace and personal faith for some people. Be careful of expensive remedies and promises of miracles."
    }
  },
  {
    topic: "palmistry",
    question: "हस्तरेखा विज्ञान क्या है?",
    aliases: ["palm reading", "palmistry meaning", "haath ki rekha"],
    answers: {
      hi: "हस्तरेखा पढ़ना हाथ की रेखाओं की पारंपरिक व्याख्या है। इससे भविष्य या स्वास्थ्य को विश्वसनीय रूप से नहीं जाना जा सकता।",
      hinglish: "Palmistry haath ki lines ki traditional interpretation hai. Isse future ya health ko reliably nahi jaana ja sakta.",
      en: "Palmistry is a traditional reading of the lines of the hand. It cannot reliably tell the future or health outcomes."
    }
  },
  {
    topic: "daily-horoscope",
    question: "दैनिक राशिफल कितना सही होता है?",
    aliases: ["daily horoscope", "aaj ka rashifal", "today horoscope"],
    answers: {
      hi: "दैनिक राशिफल आमतौर पर बहुत सामान्य होता है। इसे मनोरंजन या हल्के आत्मचिंतन की तरह पढ़ें, बड़े निर्णयों का आधार न बनाएँ।",
      hinglish: "Daily horoscope usually bahut general hota hai. Ise entertainment ya halka reflection samajhkar padhein, bade decisions ka base na banayein.",
      en: "Daily horoscopes are usually very general. Treat them as light entertainment or gentle reflection, never as the basis for important decisions."
    }
  },
  {
    topic: "gita",
    question: "भगवद्गीता का मुख्य संदेश क्या है?",
    aliases: ["bhagavad gita meaning", "gita teachings", "गीता का संदेश"],
    answers: {
      hi: "गीता हमें कर्तव्य, विवेक, आत्मसंयम और भक्ति का सुंदर संदेश देती है। एक महत्वपूर्ण बात यह है कि अपना काम पूरी लगन से करें और फल की चिंता कम करें।",
      hinglish: "Gita humein duty, wisdom, self-control aur devotion ka sundar sandesh deti hai. Ek important baat yeh hai ki apna kaam poori lagan se karein aur result ki chinta kam karein.",
      en: "The Gita gently teaches us about duty, wisdom, self-discipline and devotion. One of its beautiful messages is to perform our work with sincerity and reduce excessive attachment to the results."
    }
  },
  {
    topic: "gita",
    question: "कठिन समय में गीता से क्या सीख सकते हैं?",
    aliases: ["gita for difficult times", "stress and gita", "गीता की सीख"],
    answers: {
      hi: "कठिन समय में गीता हमें धैर्य, स्पष्टता और अपने नियंत्रण वाले कार्यों पर ध्यान देने की प्रेरणा देती है। ज़रूरत पड़ने पर किसी भरोसेमंद व्यक्ति या विशेषज्ञ से सहायता लेना भी बिल्कुल सही है।",
      hinglish: "Mushkil samay mein Gita humein patience, clarity aur apne control wale kaamon par focus karne ki prerana deti hai. Zarurat padne par kisi trusted person ya professional se help lena bhi bilkul sahi hai.",
      en: "In difficult times the Gita encourages patience, clarity and focus on what is within our control. It is also completely okay to seek help from a trusted person or a professional when needed."
    }
  },
  {
    topic: "wellbeing",
    question: "क्या कुंडली से स्वास्थ्य की बीमारी पता चल सकती है?",
    aliases: ["health astrology", "health prediction", "disease in kundli"],
    answers: {
      hi: "नहीं प्रिय, कुंडली से किसी बीमारी का विश्वसनीय निदान नहीं हो सकता। लक्षण हों तो कृपया डॉक्टर से सलाह लें। ज्योतिष चिकित्सा का विकल्प नहीं है।",
      hinglish: "Nahi priya, kundli se kisi bimari ka reliable diagnosis nahi ho sakta. Symptoms hon to please doctor se salah lein. Astrology medical care ka replacement nahi hai.",
      en: "No dear, a birth chart cannot reliably diagnose any illness. If you have symptoms, please consult a doctor. Astrology is never a substitute for medical care."
    }
  },
  {
    topic: "health-prevention",
    question: "स्वास्थ्य की देखभाल और बीमारी से बचाव कैसे करें?",
    aliases: ["health prevention", "health care tips", "bimari se bachav", "sehat ka dhyan", "स्वास्थ्य की सावधानियां"],
    answers: {
      hi: "अपनी सेहत के लिए नियमित नींद, संतुलित भोजन, पानी और हल्की गतिविधि अपनाएँ। कोई लक्षण लंबे समय तक रहे तो उसे सिर्फ ग्रहों से जोड़कर न छोड़ें — डॉक्टर से बात करें।",
      hinglish: "Apni sehat ke liye regular sleep, balanced food, paani aur halki activity adopt karein. Koi symptom lambe time tak rahe to use sirf grahon se jodkar na chhodein — doctor se baat karein.",
      en: "Take care of yourself with regular sleep, balanced meals, enough water and light daily movement. If any symptom continues, please don’t attribute it only to planets — speak to a doctor."
    }
  },
  {
    topic: "health-anxiety",
    question: "अगर मुझे बीमारी का डर बार-बार लगता है तो क्या करूं?",
    aliases: ["fear of illness", "health anxiety", "bimari ka dar", "mujhe bimari ka darr hai", "health ko lekar tension"],
    answers: {
      hi: "मैं समझ सकती हूँ कि सेहत को लेकर बार-बार डर लगना कितना थका देने वाला होता है। अभी धीरे-धीरे साँस लें। अगर यह चिंता रोज़मर्रा की ज़िंदगी प्रभावित कर रही है, तो डॉक्टर या मानसिक स्वास्थ्य विशेषज्ञ से बात करना बहुत मददगार हो सकता है।",
      hinglish: "Main samajh sakti hoon ki health ko lekar baar-baar darr lagna kitna exhausting hota hai. Abhi dheere-dheere saans lein. Agar yeh anxiety daily life affect kar rahi hai, to doctor ya mental health professional se baat karna bahut helpful ho sakta hai.",
      en: "I understand how exhausting it can feel when the fear of illness keeps returning. Take a few slow breaths right now. If this anxiety is affecting your daily life, speaking with a doctor or mental-health professional can be truly helpful."
    }
  },
  {
    topic: "mental-wellbeing",
    question: "तनाव और ज्यादा सोचने पर मन को शांत कैसे करें?",
    aliases: ["stress and overthinking", "mind ko shant kaise karein", "overthinking help", "tension kam karna", "anxiety calming"],
    answers: {
      hi: "चलो एक छोटा कदम लेते हैं। आराम से बैठें, साँस को धीरे अंदर लें और धीरे बाहर छोड़ें। फिर देखें कि अभी कौन-सा एक छोटा काम आपके नियंत्रण में है। अगर तनाव लंबे समय तक रहे तो किसी भरोसेमंद व्यक्ति या विशेषज्ञ से बात करें।",
      hinglish: "Chaliye ek chhota step lete hain. Aaram se baithkar dheere saans andar lein aur dheere bahar chhodein. Phir dekhein ki abhi kaunsa ek chhota kaam aapke control mein hai. Agar stress lambe time tak rahe to kisi trusted person ya professional se baat karein.",
      en: "Let’s take one small step together. Sit comfortably, breathe in slowly and breathe out slowly. Then notice one small thing that is within your control right now. If the stress continues for a long time, please reach out to someone you trust or a professional."
    }
  },
  {
    topic: "age-and-longevity",
    question: "क्या कुंडली से आयु या मृत्यु का समय पता चल सकता है?",
    aliases: ["life expectancy astrology", "death prediction", "meri umar kitni hogi", "ayu in kundli", "death age prediction", "longevity prediction"],
    answers: {
      hi: "मैं आपकी आयु या मृत्यु का समय कुंडली से निश्चित रूप से नहीं बता सकती, और ऐसी भविष्यवाणी भरोसेमंद नहीं होती। डरने के बजाय आज की सेहत, सुरक्षित आदतों और अपनों के साथ समय पर ध्यान दें। अगर इस विचार से बहुत घबराहट हो रही है, तो किसी भरोसेमंद व्यक्ति से बात करें।",
      hinglish: "Main aapki exact age ya death ka time kundli se reliably nahi bata sakti. Aisi predictions par darne ke bajay aaj ki health, safe habits aur apno ke saath time par focus karein. Agar is soch se bahut anxiety ho rahi hai, to kisi trusted person se baat karein.",
      en: "I cannot reliably tell anyone’s lifespan or time of death from a birth chart, and such predictions are not trustworthy. Instead of fear, focus on today’s health, safe habits and time with loved ones. If this thought is causing you deep anxiety, please talk to someone you trust."
    }
  }
];
import { getExtendedKnowledgeEntries } from "./knowledge/knowledge-adapter";

function normalizeKnowledgeText(value: string): string {
  return value
    .toLowerCase()
    .replace(/[.,!?;:'"()[\]{}]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function getKnowledgeAnswerText(
  question: string,
  language: KnowledgeLanguage = "hinglish",
  topic = "general",
): string | null {
  const query = normalizeKnowledgeText(question);
  if (!query) return null;

  const baseEntries: KnowledgeEntry[] = SEEDS.map((entry, index) => ({
    ...entry,
    id: `seed-${index + 1}`,
  }));

  const entries = [
    ...baseEntries,
    ...getExtendedKnowledgeEntries(),
  ];

  const topicAliases: Record<string, string[]> = {
    health: ["health", "wellbeing", "physical_wellbeing"],
    love: ["love", "relationship", "marriage"],
    career: ["career", "career-business", "job", "business"],
    money: ["money", "wealth", "property"],
    remedies: ["remedies", "dosha", "planetary-doshas"],
    family: ["family", "marriage", "relationship"],
    palm: ["palm", "palmistry"],
  };

  const allowedTopics = topicAliases[topic] ?? [topic];

  for (const entry of entries) {
    if (
      topic !== "general" &&
      !allowedTopics.some((item) =>
        entry.topic.toLowerCase().includes(item),
      )
    ) {
      continue;
    }

    const phrases = [entry.question, ...entry.aliases];

    const matched = phrases.some((phrase) => {
      const candidate = normalizeKnowledgeText(phrase);

      return (
        candidate.length >= 3 &&
        (candidate === query ||
          query.includes(candidate) ||
          candidate.includes(query))
      );
    });

    if (!matched) continue;

    return (
      entry.answers[language] ||
      entry.answers.hinglish ||
      entry.answers.hi ||
      entry.answers.en ||
      null
    );
  }

  return null;
}