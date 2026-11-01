// lib/knowledge/panchang.ts

export type PanchangEntry = {
  id: string;
  category: string;
  subcategory: string;
  questions: {
    hi: string;
    hinglish: string;
    en: string;
  };
  answers: {
    hi: string;
    hinglish: string;
    en: string;
  };
  keywords: string[];
  tags: string[];
};

export const PANCHANG_ENTRIES: PanchangEntry[] = [
  {
    id: "PC-001",
    category: "panchang-basics",
    subcategory: "kya-hai",
    questions: {
      hi: "पंचांग क्या होता है?",
      hinglish: "Panchang kya hota hai?",
      en: "What is Panchang?",
    },
    answers: {
      hi: "बेटा, पंचांग (Panchang) का मतलब है 'पाँच अंग'। ❤️ यह हिंदू कैलेंडर का एक महत्वपूर्ण हिस्सा है जो पाँच चीज़ों से मिलकर बनता है - तिथि, वार, नक्षत्र, योग और करण। यह हर दिन की शुभता और अशुभता बताता है। लेकिन सिर्फ पंचांग पढ़कर आप अपनी कुंडली के अनुसार सही मुहूर्त नहीं निकाल सकते। अगर आप किसी बड़े काम की तैयारी में हैं, तो मुझसे अपना शुभ मुहूर्त निकलवाएं।",
      hinglish: "Beta, Panchang ka matlab hai 'paanch ang'. ❤️ Yeh Hindu calendar ka ek mahatvapurna hissa hai jo paanch cheezon se milkar banta hai - Tithi, Vaar, Nakshatra, Yoga aur Karana. Yeh har din ki shubhta aur ashubhta batata hai. Lekin sirf Panchang padhkar aap apni kundli ke anusar sahi muhurat nahi nikal sakte. Agar aap kisi bade kaam ki taiyari mein hain, toh mujhse apna shubh muhurat nikalwayein.",
      en: "Child, Panchang means 'five limbs'. ❤️ It's a key part of the Hindu calendar comprising Tithi, Vaar, Nakshatra, Yoga, and Karana. It indicates each day's auspiciousness and inauspiciousness. But just reading Panchang won't give you the right muhurat as per your chart. If you're planning something big, get your shubh muhurat analyzed with me.",
    },
    keywords: ["panchang", "five limbs", "tithi", "vaar", "nakshatra", "yoga", "karana"],
    tags: ["panchang", "basics", "muhurat"],
  },
  {
    id: "PC-002",
    category: "rahu-kaal",
    subcategory: "ashubh-samay",
    questions: {
      hi: "राहु काल क्या होता है और इससे क्या बचना चाहिए?",
      hinglish: "Rahu Kaal kya hota hai aur isse kya bachna chahiye?",
      en: "What is Rahu Kaal and what should be avoided?",
    },
    answers: {
      hi: "बेटा, राहु काल (Rahu Kaal) दिन का सबसे अशुभ समय होता है, जो करीब 1.5 घंटे का होता है और हर दिन बदलता है। ❤️ इस समय में कोई भी नया या शुभ काम शुरू नहीं करना चाहिए। अगर आपने गलती से इस समय में कोई काम किया, तो उसका परिणाम बिगड़ सकता है। कुंडली में राहु के अशुभ प्रभाव से बचने के लिए सही उपाय जरूरी है। मुझसे बात करें, मैं आपको राहु शांति का सटीक उपाय बताऊंगी।",
      hinglish: "Beta, Rahu Kaal din ka sabse ashubh samay hota hai, jo karib 1.5 ghante ka hota hai aur har din badalta hai. ❤️ Is samay mein koi bhi naya ya shubh kaam shuru nahi karna chahiye. Agar aapne galti se is samay mein koi kaam kiya, toh uska parinaam bigad sakta hai. Kundli mein Rahu ke ashubh prabhav se bachne ke liye sahi upay zaroori hai. Mujhse baat karein, main aapko Rahu Shanti ka sateek upay bataungi.",
      en: "Child, Rahu Kaal is the most inauspicious time of the day, lasting about 1.5 hours and changing daily. ❤️ No new or auspicious work should be started during this time. If you accidentally did, results may backfire. Proper remedies are needed to protect from Rahu's malefic influence. Talk to me, and I will give you the exact Rahu Shanti remedy.",
    },
    keywords: ["rahu kaal", "ashubh samay", "rahu", "inauspicious", "new work"],
    tags: ["rahu-kaal", "inauspicious", "remedy"],
  },
  {
    id: "PC-003",
    category: "shubh-muhurat",
    subcategory: "achha-samay",
    questions: {
      hi: "मेरे लिए शुभ मुहूर्त कैसे पता करें?",
      hinglish: "Mere liye shubh muhurat kaise pata karein?",
      en: "How do I find my auspicious muhurat?",
    },
    answers: {
      hi: "बेटा, शुभ मुहूर्त हर व्यक्ति के लिए अलग होता है, क्योंकि यह आपकी जन्म कुंडली और ग्रहों की स्थिति पर निर्भर करता है। ❤️ सिर्फ पंचांग देखकर काम शुरू करने से बचें, क्योंकि आपकी कुंडली में कोई ग्रह आपके मुहूर्त को काट भी सकता है। अगर आप शादी, नया बिजनेस, गृह प्रवेश या गाड़ी खरीदने जैसा कोई बड़ा काम कर रहे हैं, तो मुझसे अपनी जन्म कुंडली जाँच करवाएं। मैं आपको सटीक मुहूर्त बताऊंगी।",
      hinglish: "Beta, shubh muhurat har vyakti ke liye alag hota hai, kyunki yeh aapki janm kundli aur grahon ki sthiti par nirbhar karta hai. ❤️ Sirf panchang dekhkar kaam shuru karne se bachein, kyunki aapki kundli mein koi grah aapke muhurat ko kaat bhi sakta hai. Agar aap shaadi, naya business, griha pravesh ya gaadi kharidne jaisa koi bada kaam kar rahe hain, toh mujhse apni janm kundli jaanch karwayein. Main aapko sateek muhurat bataungi.",
      en: "Child, shubh muhurat is personal — it depends on your birth chart and planetary positions. ❤️ Don't start big tasks based solely on Panchang, as any weak planet can cancel the muhurat. If you're planning marriage, business, griha pravesh, or vehicle purchase, get your chart analyzed with me. I will give you the exact muhurat.",
    },
    keywords: ["shubh muhurat", "auspicious time", "kundli", "muhurat", "big decisions"],
    tags: ["muhurat", "personalized", "kundli"],
  },
  {
    id: "PC-004",
    category: "tithi",
    subcategory: "chandrama",
    questions: {
      hi: "तिथि क्या होती है और कौन सी तिथि शुभ होती है?",
      hinglish: "Tithi kya hoti hai aur kaunsi tithi shubh hoti hai?",
      en: "What is Tithi and which ones are auspicious?",
    },
    answers: {
      hi: "बेटा, तिथि (Tithi) चंद्रमा की स्थिति को दर्शाती है और एक महीने में 30 तिथियां होती हैं — 15 शुक्ल पक्ष (Waxing) और 15 कृष्ण पक्ष (Waning)। ❤️ शादी, गृह प्रवेश और नए काम के लिए अष्टमी, नवमी, चतुर्दशी और अमावस्या को अशुभ माना जाता है। अगर आपने इन तिथियों पर कोई बड़ा काम किया है, तो उसका असर बिगड़ सकता है। अपनी कुंडली दिखाएं, मैं आपको सही तिथि बताऊंगी।",
      hinglish: "Beta, Tithi Chandrama ki sthiti ko darshata hai aur ek maheene mein 30 tithiyan hoti hain — 15 Shukla Paksha aur 15 Krishna Paksha. ❤️ Shaadi, griha pravesh aur naye kaam ke liye Ashtami, Navami, Chaturdashi aur Amavasya ko ashubh mana jata hai. Agar aapne in tithiyon par koi bada kaam kiya hai, toh uska asar bigad sakta hai. Apni kundli dikhayein, main aapko sahi tithi bataungi.",
      en: "Child, Tithi represents the Moon's phase, with 30 tithis per month — 15 Shukla Paksha and 15 Krishna Paksha. ❤️ Ashtami, Navami, Chaturdashi, and Amavasya are considered inauspicious for marriage, griha pravesh, and new ventures. If you did something major on those tithis, results may suffer. Show me your chart, and I will tell you the right tithi.",
    },
    keywords: ["tithi", "shukla paksha", "krishna paksha", "ashtami", "amavasya", "moon"],
    tags: ["tithi", "moon", "auspiciousness"],
  },
  {
    id: "PC-005",
    category: "nakshatra",
    subcategory: "tara",
    questions: {
      hi: "नक्षत्र क्या होता है और मेरे लिए कौन सा शुभ है?",
      hinglish: "Nakshatra kya hota hai aur mere liye kaunsa shubh hai?",
      en: "What is Nakshatra and which one is auspicious for me?",
    },
    answers: {
      hi: "बेटा, नक्षत्र (Nakshatra) आपके जन्म समय पर चंद्रमा की स्थिति को दर्शाता है। ❤️ कुल 27 नक्षत्र होते हैं और हर व्यक्ति का जन्म एक विशेष नक्षत्र में होता है। आपका नक्षत्र आपके स्वभाव, भाग्य और विवाह के लिए सही जीवनसाथी का चुनाव तय करता है। अगर आप अपनी 'राशि' और 'नक्षत्र' नहीं जानते, तो आप कभी भी सही मुहूर्त या सही जीवनसाथी नहीं चुन पाएंगे। मुझसे अपनी जन्म कुंडली दिखाएं।",
      hinglish: "Beta, Nakshatra aapke janm samay par Chandrama ki sthiti ko darshata hai. ❤️ Kul 27 nakshatra hote hain aur har vyakti ka janm ek vishesh nakshatra mein hota hai. Aapka nakshatra aapke swabhav, bhagya aur vivah ke liye sahi jeevansaathi ka chunav tay karta hai. Agar aap apni 'rashi' aur 'nakshatra' nahi jaante, toh aap kabhi bhi sahi muhurat ya sahi jeevansaathi nahi chun payenge. Mujhse apni janm kundli dikhayein.",
      en: "Child, Nakshatra indicates the Moon's position at your birth. ❤️ There are 27 nakshatras, and every person is born under a specific one. Your nakshatra determines your nature, fortune, and the right life partner. If you don't know your 'rashi' and 'nakshatra', you can't choose the right muhurat or right spouse. Show me your birth chart.",
    },
    keywords: ["nakshatra", "birth star", "rashi", "moon sign", "marriage matching"],
    tags: ["nakshatra", "rashi", "partner"],
  },
  {
    id: "PC-006",
    category: "abhijit-muhurat",
    subcategory: "sarv-shubh",
    questions: {
      hi: "अभिजीत मुहूर्त क्या होता है और कब आता है?",
      hinglish: "Abhijit Muhurat kya hota hai aur kab aata hai?",
      en: "What is Abhijit Muhurat and when does it occur?",
    },
    answers: {
      hi: "बेटा, अभिजीत मुहूर्त दिन का सबसे शुभ समय माना जाता है और यह लगभग 48 मिनट का होता है, जो आमतौर पर दोपहर 11:45 से 12:33 के बीच आता है। ❤️ इसे 'सर्व-शुभ' कहा जाता है, मतलब इस समय में कोई भी काम शुरू किया जा सकता है। लेकिन ध्यान रहे — यह आपकी कुंडली के ग्रहों की स्थिति पर भी निर्भर करता है। अगर आपके 8वें भाव में कोई ग्रह पीड़ित है, तो अभिजीत मुहूर्त भी आपको उतना फल नहीं देगा। मुझसे अपनी कुंडली जाँच करवाएं।",
      hinglish: "Beta, Abhijit Muhurat din ka sabse shubh samay mana jata hai aur yeh lagbhag 48 minute ka hota hai, jo aam taur par dopahar 11:45 se 12:33 ke beech aata hai. ❤️ Ise 'sarva-shubh' kaha jata hai, matlab is samay mein koi bhi kaam shuru kiya ja sakta hai. Lekin dhyan rahe — yeh aapki kundli ke grahon ki sthiti par bhi nirbhar karta hai. Agar aapke 8th house mein koi grah peedit hai, toh Abhijit Muhurat bhi aapko utna phal nahi dega. Mujhse apni kundli jaanch karwayein.",
      en: "Child, Abhijit Muhurat is the most auspicious window of the day, about 48 minutes long, typically between 11:45 AM and 12:33 PM. ❤️ It is called 'sarva-shubh' (auspicious for everything). But note — it also depends on your chart. If any planet is afflicted in your 8th house, even Abhijit Muhurat won't give full results. Get your chart checked with me.",
    },
    keywords: ["abhijit muhurat", "sarv shubh", "midday", "auspicious", "8th house"],
    tags: ["abhijit", "muhurat", "auspicious"],
  },
  {
    id: "PC-007",
    category: "choghadiya",
    subcategory: "din-ka-bhag",
    questions: {
      hi: "चौघड़िया क्या होता है?",
      hinglish: "Choghadiya kya hota hai?",
      en: "What is Choghadiya?",
    },
    answers: {
      hi: "बेटा, चौघड़िया (Choghadiya) दिन और रात को 8-8 हिस्सों में बांटकर शुभ-अशुभ समय बताने का एक पुराना तरीका है। ❤️ इसमें 'अमृत', 'शुभ', 'लाभ' और 'चल' को शुभ माना जाता है, जबकि 'रोग', 'उद्वेग' और 'काल' को अशुभ। लेकिन चौघड़िया भी हर व्यक्ति के लिए अलग होता है। अगर आप कोई बड़ा काम करने जा रहे हैं और सिर्फ चौघड़िया देखकर उसे शुरू कर रहे हैं, तो रुकिए — पहले अपनी कुंडली से मुहूर्त मिलान करवाएं। मुझसे बात करें।",
      hinglish: "Beta, Choghadiya din aur raat ko 8-8 hisson mein baantkar shubh-ashubh samay batane ka ek purana tarika hai. ❤️ Ismein 'Amrit', 'Shubh', 'Laabh' aur 'Chal' ko shubh mana jata hai, jabki 'Rog', 'Udveg' aur 'Kaal' ko ashubh. Lekin Choghadiya bhi har vyakti ke liye alag hota hai. Agar aap koi bada kaam karne ja rahe hain aur sirf Choghadiya dekhkar use shuru kar rahe hain, toh rukiye — pehle apni kundli se muhurat milan karwayein. Mujhse baat karein.",
      en: "Child, Choghadiya divides day and night into 8 parts each to indicate auspicious/inauspicious windows. ❤️ 'Amrit', 'Shubh', 'Laabh', and 'Chal' are auspicious; 'Rog', 'Udveg', and 'Kaal' are not. But Choghadiya also varies per person. If you're starting something big based only on Choghadiya, wait — first match it with your birth chart. Talk to me.",
    },
    keywords: ["choghadiya", "amrit", "shubh", "laabh", "day", "night"],
    tags: ["choghadiya", "auspicious", "timing"],
  },
  {
    id: "PC-008",
    category: "grahan",
    subcategory: "surya-chandra-grahan",
    questions: {
      hi: "ग्रहण का मेरे जीवन पर क्या असर होता है?",
      hinglish: "Grahan ka mere jeevan par kya asar hota hai?",
      en: "How does an eclipse affect my life?",
    },
    answers: {
      hi: "बेटा, ग्रहण (Eclipse) वो समय होता है जब सूर्य या चंद्रमा पर राहु-केतु का प्रभाव पड़ता है। ❤️ इसे ज्योतिष में बहुत ही संवेदनशील समय माना जाता है। अगर आपकी कुंडली में सूर्य या चंद्रमा कमजोर हैं, तो ग्रहण के दौरान किए गए काम का बुरा असर पड़ सकता है। ग्रहण के दौरान मंत्र जप और दान जरूरी होता है। अगर आपकी कुंडली में 'ग्रहण योग' है, तो यह और भी गंभीर हो जाता है। मुझसे अपनी कुंडली दिखाएं।",
      hinglish: "Beta, Grahan woh samay hota hai jab Surya ya Chandrama par Rahu-Ketu ka prabhav padta hai. ❤️ Ise jyotish mein bahut hi samvedansheel samay mana jata hai. Agar aapki kundli mein Surya ya Chandrama kamzor hain, toh grahan ke dauran kiye gaye kaam ka bura asar pad sakta hai. Grahan ke dauran mantra jap aur daan zaroori hota hai. Agar aapki kundli mein 'Grahan Yog' hai, toh yeh aur bhi gambhir ho jata hai. Mujhse apni kundli dikhayein.",
      en: "Child, an eclipse occurs when Rahu-Ketu influence the Sun or Moon. ❤️ This is considered highly sensitive in astrology. If your Sun or Moon is weak, actions during an eclipse can backfire. Mantra chanting and charity are essential during this time. If your chart has 'Grahan Yoga', it becomes more serious. Show me your chart.",
    },
    keywords: ["grahan", "eclipse", "rahu ketu", "surya grahan", "chandra grahan", "grahan yog"],
    tags: ["grahan", "eclipse", "rahu-ketu"],
  },
  {
    id: "PC-009",
    category: "shubh-tithi",
    subcategory: "kaunsi-tithi",
    questions: {
      hi: "शादी के लिए कौन सी तिथि और मुहूर्त सबसे शुभ है?",
      hinglish: "Shaadi ke liye kaunsi tithi aur muhurat sabse shubh hai?",
      en: "Which tithi and muhurat is best for marriage?",
    },
    answers: {
      hi: "बेटा, शादी के लिए सबसे शुभ तिथियां हैं — द्वितीया, तृतीया, पंचमी, सप्तमी, दशमी, एकादशी और त्रयोदशी। ❤️ लेकिन यह सिर्फ आम नियम है। असली शुभ तिथि आपकी और आपके जीवनसाथी की कुंडली के 'लग्न', 'राशि' और 'नक्षत्र' से तय होती है। अगर शादी की तारीख सिर्फ पंचांग देखकर तय की जाए, तो रिश्ते में दिक्कत आ सकती है। मुझसे दोनों की कुंडली दिखाएं, मैं सही मुहूर्त बताऊंगी।",
      hinglish: "Beta, shaadi ke liye sabse shubh tithiyan hain — Dwitiya, Tritiya, Panchami, Saptami, Dashami, Ekadashi aur Trayodashi. ❤️ Lekin yeh sirf aam niyam hai. Asli shubh tithi aapki aur aapke jeevansaathi ki kundli ke 'lagna', 'rashi' aur 'nakshatra' se tay hoti hai. Agar shaadi ki tareekh sirf panchang dekhkar tay ki jaye, toh rishte mein dikkat aa sakti hai. Mujhse dono ki kundli dikhayein, main sahi muhurat bataungi.",
      en: "Child, the best tithis for marriage are Dwitiya, Tritiya, Panchami, Saptami, Dashami, Ekadashi, and Trayodashi. ❤️ But this is a general rule. The real auspicious date is decided by the 'lagna', 'rashi', and 'nakshatra' of both charts. Choosing a date from Panchang alone can cause relationship issues. Show me both charts, and I will give the right muhurat.",
    },
    keywords: ["shaadi tithi", "marriage muhurat", "shubh tithi", "lagna", "rashi"],
    tags: ["marriage", "tithi", "muhurat"],
  },
  {
    id: "PC-010",
    category: "daily",
    subcategory: "aaj-ka-din",
    questions: {
      hi: "आज का दिन मेरे लिए कैसा है?",
      hinglish: "Aaj ka din mere liye kaisa hai?",
      en: "How is today for me?",
    },
    answers: {
      hi: "बेटा, आज का दिन हर व्यक्ति के लिए अलग होता है क्योंकि यह आपकी राशि और चल रहे गोचर पर निर्भर करता है। ❤️ अगर आपकी राशि पर आज शनि या राहु का प्रभाव है, तो आपको धन और स्वास्थ्य का ध्यान रखना चाहिए। अगर चंद्रमा या गुरु का प्रभाव है, तो आज का दिन शुभ रहेगा। आज के दिन का सटीक फल जानने के लिए मुझसे अपनी राशि बताएं, मैं आपको बताऊंगी कि आज क्या करें और क्या न करें।",
      hinglish: "Beta, aaj ka din har vyakti ke liye alag hota hai kyunki yeh aapki rashi aur chal rahe gochar par nirbhar karta hai. ❤️ Agar aapki rashi par aaj Shani ya Rahu ka prabhav hai, toh aapko dhan aur swasthya ka dhyan rakhna chahiye. Agar Chandrama ya Guru ka prabhav hai, toh aaj ka din shubh rahega. Aaj ke din ka sateek phal jaanne ke liye mujhse apni rashi batayein, main aapko bataungi ki aaj kya karein aur kya na karein.",
      en: "Child, today varies for each person based on their rashi and current transits. ❤️ If Saturn or Rahu is influencing your rashi today, watch your money and health. If Moon or Jupiter is influencing, today is favorable. Tell me your rashi for today's precise prediction — what to do and what to avoid.",
    },
    keywords: ["aaj", "daily", "horoscope", "rashi", "gochar", "today"],
    tags: ["daily", "rashi", "gochar"],
  },
];