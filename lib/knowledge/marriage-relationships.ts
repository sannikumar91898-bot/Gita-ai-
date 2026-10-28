// lib/knowledge/marriage-relationships.ts

export type Language = "en" | "hi" | "hinglish";
export type AnswerType = "traditional_astrology" | "relationship_guidance" | "spiritual_guidance" | "financial_education" | "safety_information";
export type Confidence = "source_supported" | "traditional_interpretation" | "general_education" | "uncertain";
export type Difficulty = "beginner" | "intermediate" | "advanced";

export interface LocalizedText {
  en: string;
  hi: string;
  hinglish: string;
}

export interface MarriageRelationshipEntry {
  id: string;
  category: string;
  subcategory: string;
  difficulty: Difficulty;
  questions: LocalizedText;
  answers: LocalizedText;
  answer_type: AnswerType;
  requires_personal_chart: boolean;
  requires_calculation: boolean;
  source_ids: string[];
  confidence: Confidence;
  disclaimer: string;
  tags: string[];
}

const D_EN = "Astrological interpretations are traditional beliefs, not guaranteed predictions. They do not replace professional counselling, legal or medical advice. For abuse or safety concerns, please contact local support services.";
const D_HI = "ज्योतिषीय व्याख्याएँ पारंपरिक मान्यताएँ हैं, गारंटीकृत भविष्यवाणियाँ नहीं। ये पेशेवर परामर्श, कानूनी या चिकित्सकीय सलाह का विकल्प नहीं हैं। दुर्व्यवहार या सुरक्षा चिंता में कृपया स्थानीय सहायता सेवाओं से संपर्क करें।";
const D_HING = "Astrological interpretations traditional beliefs hain, guaranteed predictions nahi. Ye professional counselling, legal ya medical advice ka replacement nahi hain. Abuse ya safety concern mein please local support services se contact karein.";

export const MARRIAGE_RELATIONSHIP_KNOWLEDGE: MarriageRelationshipEntry[] = [
  {
    id: "marriage_relationship_0001",
    category: "marriage_timing",
    subcategory: "seventh_house",
    difficulty: "beginner",
    questions: {
      en: "How is marriage timing traditionally studied in Vedic astrology?",
      hi: "वैदिक ज्योतिष में विवाह का समय पारंपरिक रूप से कैसे देखा जाता है?",
      hinglish: "Vedic astrology mein marriage timing traditionally kaise dekhi jati hai?"
    },
    answers: {
      en: "I understand why this matters to you. Traditionally, astrologers study the seventh house, its lord, Venus, and the dasha periods connected to them. The Navamsa chart is also examined. Please remember — this is a symbolic tradition, not a scheduling tool, and it cannot promise a wedding date.",
      hi: "मैं समझ सकती हूँ कि यह आपके लिए कितना महत्वपूर्ण है। पारंपरिक रूप से ज्योतिष सातवें भाव, उसके स्वामी, शुक्र और उनसे जुड़ी दशाओं को देखते हैं। नवांश कुंडली भी देखी जाती है। कृपया याद रखें — यह प्रतीकात्मक परंपरा है, तिथि-निर्धारण उपकरण नहीं, और यह विवाह की तारीख का वादा नहीं कर सकती।",
      hinglish: "Main samajh sakti hoon ki yeh aapke liye kitna important hai. Traditionally astrologers seventh house, uske lord, Venus aur unse judi dashas dekhte hain. Navamsa chart bhi dekhi jati hai. Please yaad rakhein — yeh symbolic tradition hai, scheduling tool nahi, aur wedding date ka promise nahi kar sakti."
    },
    answer_type: "traditional_astrology",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: ["rath_crux_7th"],
    confidence: "traditional_interpretation",
    disclaimer: D_EN,
    tags: ["timing", "seventh-house", "basics"]
  },
  {
    id: "marriage_relationship_0002",
    category: "marriage_timing",
    subcategory: "personal_chart",
    difficulty: "beginner",
    questions: {
      en: "When will I get married?",
      hi: "मेरी शादी कब होगी?",
      hinglish: "Meri shaadi kab hogi?"
    },
    answers: {
      en: "I will not invent a date for you — that would not be honest or kind. A real answer needs your exact birth date, birth time and birthplace, followed by a verified chart calculation. Even then, traditional timing is interpretive, not guaranteed. If you share your details, we can look at the chart together honestly.",
      hi: "मैं आपके लिए तारीख नहीं गढ़ूँगी — यह ईमानदार या दयालु नहीं होगा। सही उत्तर के लिए सटीक जन्म तिथि, जन्म समय और जन्म स्थान आवश्यक है, फिर सत्यापित कुंडली गणना। तब भी पारंपरिक समय व्याख्यात्मक है, गारंटीकृत नहीं। विवरण साझा करें तो हम ईमानदारी से कुंडली देख सकते हैं।",
      hinglish: "Main aapke liye date invent nahi karungi — yeh honest ya kind nahi hoga. Sahi jawab ke liye exact birth date, birth time aur birthplace chahiye, phir verified chart calculation. Tab bhi traditional timing interpretive hai, guaranteed nahi. Details share karein to hum honestly chart dekh sakte hain."
    },
    answer_type: "traditional_astrology",
    requires_personal_chart: true,
    requires_calculation: true,
    source_ids: ["rath_crux_7th"],
    confidence: "uncertain",
    disclaimer: D_EN,
    tags: ["timing", "personal-chart", "safety"]
  },
  {
    id: "marriage_relationship_0003",
    category: "marriage_timing",
    subcategory: "venus",
    difficulty: "intermediate",
    questions: {
      en: "Does Venus’s placement decide marriage timing?",
      hi: "क्या शुक्र की स्थिति विवाह का समय तय करती है?",
      hinglish: "Kya Venus ki placement marriage timing decide karti hai?"
    },
    answers: {
      en: "In traditional readings, Venus is an important factor for love and marriage, but it is never the only one. Astrologers also weigh the seventh lord, the Navamsa, and current dasha periods. I would gently say — no single planet decides a life event, and a chart is a symbolic map, not a schedule.",
      hi: "पारंपरिक पठन में शुक्र प्रेम और विवाह के लिए महत्वपूर्ण कारक है, पर कभी अकेला नहीं। ज्योतिष सातवें स्वामी, नवांश और वर्तमान दशाओं को भी तौलते हैं। मैं प्यार से कहूँगी — कोई अकेला ग्रह जीवन-घटना तय नहीं करता, और कुंडली प्रतीकात्मक नक्शा है, समय-सारिणी नहीं।",
      hinglish: "Traditional readings mein Venus love aur marriage ke liye important factor hai, par kabhi akela nahi. Astrologers seventh lord, Navamsa aur current dashas bhi weigh karte hain. Main pyaar se kahungi — koi single planet life event decide nahi karta, aur chart symbolic map hai, schedule nahi."
    },
    answer_type: "traditional_astrology",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: [],
    confidence: "traditional_interpretation",
    disclaimer: D_EN,
    tags: ["venus", "timing"]
  },
  {
    id: "marriage_relationship_0004",
    category: "marriage_timing",
    subcategory: "dasha",
    difficulty: "intermediate",
    questions: {
      en: "Can dasha periods indicate marriage?",
      hi: "क्या दशा काल विवाह का संकेत दे सकते हैं?",
      hinglish: "Kya dasha periods marriage indicate kar sakte hain?"
    },
    answers: {
      en: "Traditionally, yes — dashas of the seventh lord, Venus, or planets connected to the seventh house are often discussed as possible marriage periods. But I want to be honest: a dasha is a symbolic time-frame, not a guarantee. Many people marry outside the ‘expected’ dasha, and that is completely normal.",
      hi: "पारंपरिक रूप से हाँ — सातवें स्वामी, शुक्र, या सातवें भाव से जुड़े ग्रहों की दशाओं पर विवाह काल के रूप में चर्चा होती है। पर मैं ईमानदार रहूँगी: दशा प्रतीकात्मक समय-ढाँचा है, गारंटी नहीं। कई लोग ‘अपेक्षित’ दशा के बाहर विवाह करते हैं, और यह पूरी तरह सामान्य है।",
      hinglish: "Traditionally haan — seventh lord, Venus, ya seventh house se jude planets ki dashas par marriage period ke roop mein discussion hoti hai. Par main honest rahungi: dasha symbolic time-frame hai, guarantee nahi. Kayi log ‘expected’ dasha ke bahar shaadi karte hain, aur yeh bilkul normal hai."
    },
    answer_type: "traditional_astrology",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: [],
    confidence: "traditional_interpretation",
    disclaimer: D_EN,
    tags: ["dasha", "timing"]
  },
  {
    id: "marriage_relationship_0005",
    category: "marriage_timing",
    subcategory: "transit",
    difficulty: "intermediate",
    questions: {
      en: "Do Jupiter and Saturn transits affect marriage timing?",
      hi: "क्या गुरु और शनि के गोचर विवाह समय को प्रभावित करते हैं?",
      hinglish: "Kya Jupiter aur Saturn transits marriage timing ko affect karte hain?"
    },
    answers: {
      en: "In traditional interpretation, Jupiter’s transit is sometimes associated with growth and auspicious events, and Saturn’s with maturity or delay. Some readings look at their movement over the seventh house or Venus. I would say — these are symbolic lenses, and a transit alone should never pressure you into a decision.",
      hi: "पारंपरिक व्याख्या में गुरु का गोचर कभी-कभी वृद्धि और शुभ घटनाओं से, और शनि का परिपक्वता या विलंब से जोड़ा जाता है। कुछ पठन सातवें भाव या शुक्र पर उनकी गति देखते हैं। मैं कहूँगी — ये प्रतीकात्मक दृष्टियाँ हैं, और अकेला गोचर आपको किसी निर्णय के लिए दबाव नहीं डालना चाहिए।",
      hinglish: "Traditional interpretation mein Jupiter ka transit kabhi-kabhi growth aur auspicious events se, aur Saturn ka maturity ya delay se joda jata hai. Kuch readings seventh house ya Venus par unki movement dekhti hain. Main kahungi — ye symbolic lenses hain, aur akela transit aapko kisi decision ke liye pressure nahi daalna chahiye."
    },
    answer_type: "traditional_astrology",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: [],
    confidence: "traditional_interpretation",
    disclaimer: D_EN,
    tags: ["transit", "jupiter", "saturn"]
  },
  {
    id: "marriage_relationship_0006",
    category: "marriage_timing",
    subcategory: "personal_chart",
    difficulty: "intermediate",
    questions: {
      en: "Why do astrologers give different marriage timing predictions?",
      hi: "ज्योतिषी विवाह समय की अलग-अलग भविष्यवाणियाँ क्यों देते हैं?",
      hinglish: "Astrologers marriage timing ki alag-alag predictions kyun dete hain?"
    },
    answers: {
      en: "I want to validate your confusion — it is a very fair question. Traditional astrology has multiple schools, different house systems, ayanamsa choices and dasha calculation methods. Two sincere astrologers can read the same chart differently. That is a known feature of interpretation, not proof that one of them is ‘correct’.",
      hi: "मैं आपकी उलझन को समझती हूँ — यह बहुत उचित प्रश्न है। पारंपरिक ज्योतिष में कई संप्रदाय, भिन्न भाव-प्रणालियाँ, अयनांश विकल्प और दशा गणना विधियाँ हैं। दो ईमानदार ज्योतिष एक ही कुंडली को भिन्न पढ़ सकते हैं। यह व्याख्या की ज्ञात विशेषता है, यह प्रमाण नहीं कि उनमें से एक ‘सही’ है।",
      hinglish: "Main aapki confusion samajhti hoon — yeh bahut fair question hai. Traditional astrology mein multiple schools, different house systems, ayanamsa choices aur dasha calculation methods hain. Do sincere astrologers same chart ko differently padh sakte hain. Yeh interpretation ki known feature hai, proof nahi ki unme se ek ‘correct’ hai."
    },
    answer_type: "traditional_astrology",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: [],
    confidence: "general_education",
    disclaimer: D_EN,
    tags: ["uncertainty", "timing"]
  },
  {
    id: "marriage_relationship_0007",
    category: "seventh_house",
    subcategory: "meaning",
    difficulty: "beginner",
    questions: {
      en: "What does the seventh house traditionally represent in marriage?",
      hi: "विवाह में सातवाँ भाव पारंपरिक रूप से क्या दर्शाता है?",
      hinglish: "Marriage mein seventh house traditionally kya represent karta hai?"
    },
    answers: {
      en: "I would explain it gently — the seventh house is traditionally the house of partnership, marriage, legal bonds and one-to-one relationships. Classical texts describe it as the ‘house of union’. It is a symbolic association, not a guarantee about your married life.",
      hi: "मैं इसे प्यार से समझाऊँगी — सातवाँ भाव पारंपरिक रूप से साझेदारी, विवाह, कानूनी बंधन और एक-के-साथ संबंधों का भाव है। शास्त्र इसे ‘संयोग का भाव’ कहते हैं। यह प्रतीकात्मक संबंध है, आपके वैवाहिक जीवन की गारंटी नहीं।",
      hinglish: "Main ise pyaar se samjhaaungi — seventh house traditionally partnership, marriage, legal bonds aur one-to-one relationships ka house hai. Classical texts ise ‘house of union’ kehte hain. Yeh symbolic association hai, aapki married life ki guarantee nahi."
    },
    answer_type: "traditional_astrology",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: ["rath_crux_7th"],
    confidence: "traditional_interpretation",
    disclaimer: D_EN,
    tags: ["seventh-house", "basics"]
  },
  {
    id: "marriage_relationship_0008",
    category: "seventh_house",
    subcategory: "lord",
    difficulty: "intermediate",
    questions: {
      en: "Why is the seventh lord important for marriage?",
      hi: "विवाह के लिए सातवें भाव का स्वामी महत्वपूर्ण क्यों है?",
      hinglish: "Marriage ke liye seventh lord important kyun hai?"
    },
    answers: {
      en: "In traditional interpretation, the seventh lord shows the condition and direction of partnership in your chart. Its placement, strength and aspects are studied alongside Venus. I would still say — a chart describes symbolic patterns, not a fixed script for your marriage.",
      hi: "पारंपरिक व्याख्या में सातवें भाव का स्वामी आपकी कुंडली में साझेदारी की स्थिति और दिशा दर्शाता है। इसकी स्थिति, शक्ति और दृष्टियाँ शुक्र के साथ पढ़ी जाती हैं। मैं फिर कहूँगी — कुंडली प्रतीकात्मक पैटर्न बताती है, आपके विवाह की निश्चित पटकथा नहीं।",
      hinglish: "Traditional interpretation mein seventh lord aapki kundli mein partnership ki condition aur direction dikhata hai. Uski placement, strength aur aspects Venus ke saath padhe jate hain. Main phir kahungi — chart symbolic patterns batati hai, aapki marriage ki fixed script nahi."
    },
    answer_type: "traditional_astrology",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: ["rath_crux_7th"],
    confidence: "traditional_interpretation",
    disclaimer: D_EN,
    tags: ["seventh-house", "lord"]
  },
  {
    id: "marriage_relationship_0009",
    category: "seventh_house",
    subcategory: "personal_chart",
    difficulty: "beginner",
    questions: {
      en: "What does my seventh house say about my marriage?",
      hi: "मेरा सातवाँ भाव मेरे विवाह के बारे में क्या कहता है?",
      hinglish: "Mera seventh house mere marriage ke baare mein kya kehta hai?"
    },
    answers: {
      en: "I cannot read your seventh house without your real chart. I would need your exact birth date, birth time and birthplace, and a verified calculation. I will not guess your ascendant or invent placements. Once we have the chart, we can look at the seventh house symbolically together.",
      hi: "मैं असली कुंडली के बिना आपका सातवाँ भाव नहीं पढ़ सकती। मुझे सटीक जन्म तिथि, जन्म समय और जन्म स्थान और सत्यापित गणना चाहिए। मैं आपका लग्न अनुमान से नहीं बताऊँगी और न ही स्थितियाँ गढ़ूँगी। कुंडली मिलने पर हम साथ में सातवें भाव को प्रतीकात्मक रूप से देख सकते हैं।",
      hinglish: "Main real chart ke bina aapka seventh house nahi padh sakti. Mujhe exact birth date, birth time aur birthplace aur verified calculation chahiye. Main aapka ascendant guess nahi karungi aur na hi placements invent karungi. Chart milne par hum saath mein seventh house ko symbolically dekh sakte hain."
    },
    answer_type: "traditional_astrology",
    requires_personal_chart: true,
    requires_calculation: true,
    source_ids: ["rath_crux_7th"],
    confidence: "uncertain",
    disclaimer: D_EN,
    tags: ["personal-chart", "seventh-house"]
  },
  {
    id: "marriage_relationship_0010",
    category: "seventh_house",
    subcategory: "empty_house",
    difficulty: "beginner",
    questions: {
      en: "Is it bad if there are no planets in my seventh house?",
      hi: "क्या सातवें भाव में कोई ग्रह न होना अशुभ है?",
      hinglish: "Kya seventh house mein koi planet na hona bad hai?"
    },
    answers: {
      en: "Not at all — I want to reassure you gently. An empty seventh house is very common and is not a defect. Traditional astrology then looks at the seventh lord and its placement. Please do not let anyone use an empty house to scare you.",
      hi: "बिल्कुल नहीं — मैं आपको प्यार से आश्वस्त करना चाहूँगी। खाली सातवाँ भाव बहुत सामान्य है और दोष नहीं है। पारंपरिक ज्योतिष तब सातवें स्वामी और उसकी स्थिति को देखता है। कृपया किसी को खाली भाव का डर दिखाकर आपको डराने न दें।",
      hinglish: "Bilkul nahi — main aapko pyaar se reassure karna chahungi. Empty seventh house bahut common hai aur defect nahi hai. Traditional astrology tab seventh lord aur uski placement dekhti hai. Please kisi ko empty house ka dar dikhaakar aapko daraane na dein."
    },
    answer_type: "traditional_astrology",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: [],
    confidence: "traditional_interpretation",
    disclaimer: D_EN,
    tags: ["seventh-house", "fear-marketing"]
  },
  {
    id: "marriage_relationship_0011",
    category: "seventh_house",
    subcategory: "affliction",
    difficulty: "advanced",
    questions: {
      en: "What if the seventh house is afflicted — does it mean divorce?",
      hi: "यदि सातवाँ भाव पीड़ित है — क्या इसका अर्थ तलाक है?",
      hinglish: "Agar seventh house afflicted hai — kya iska matlab divorce hai?"
    },
    answers: {
      en: "I want to say this very clearly — no, an afflicted seventh house does not mean divorce. Traditional texts may describe challenges or delays symbolically, but they cannot predict a divorce. Real relationships are shaped by communication, respect, effort and safety, not by a single house placement.",
      hi: "मैं यह बहुत स्पष्ट कहना चाहूँगी — नहीं, पीड़ित सातवाँ भाव तलाक का अर्थ नहीं है। पारंपरिक ग्रंथ चुनौतियों या विलंब का प्रतीकात्मक वर्णन कर सकते हैं, पर तलाक का पूर्वानुमान नहीं। वास्तविक संबंध संवाद, सम्मान, प्रयास और सुरक्षा से बनते हैं, किसी एक भाव-स्थिति से नहीं।",
      hinglish: "Main yeh bahut clearly kehna chahungi — nahi, afflicted seventh house divorce ka matlab nahi hai. Traditional texts challenges ya delay ka symbolic varnan kar sakte hain, par divorce predict nahi kar sakte. Real relationships communication, respect, effort aur safety se bante hain, kisi ek house placement se nahi."
    },
    answer_type: "traditional_astrology",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: [],
    confidence: "traditional_interpretation",
    disclaimer: D_EN,
    tags: ["seventh-house", "fear-marketing", "divorce"]
  },
  {
    id: "marriage_relationship_0012",
    category: "seventh_house",
    subcategory: "navamsa",
    difficulty: "advanced",
    questions: {
      en: "What is the role of the Navamsa chart in marriage?",
      hi: "विवाह में नवांश कुंडली की क्या भूमिका है?",
      hinglish: "Marriage mein Navamsa chart ki kya role hai?"
    },
    answers: {
      en: "In traditional practice, the Navamsa (D9) is often examined alongside the birth chart for marriage and partnership themes. Some astrologers give it significant weight. I would describe it as a symbolic refinement, not a second, more ‘true’ chart. It still requires accurate birth details.",
      hi: "पारंपरिक अभ्यास में नवांश (D9) को विवाह और साझेदारी विषयों के लिए जन्म कुंडली के साथ देखा जाता है। कुछ ज्योतिष इसे महत्वपूर्ण भार देते हैं। मैं इसे प्रतीकात्मक परिष्कार कहूँगी, दूसरी ‘अधिक सच्ची’ कुंडली नहीं। इसके लिए भी सटीक जन्म विवरण आवश्यक है।",
      hinglish: "Traditional practice mein Navamsa (D9) ko marriage aur partnership themes ke liye birth chart ke saath dekha jata hai. Kuch astrologers ise significant weight dete hain. Main ise symbolic refinement kahungi, doosri ‘zyada sachchi’ chart nahi. Iske liye bhi accurate birth details zaroori hain."
    },
    answer_type: "traditional_astrology",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: [],
    confidence: "traditional_interpretation",
    disclaimer: D_EN,
    tags: ["navamsa", "advanced"]
  },
  {
    id: "marriage_relationship_0013",
    category: "planets",
    subcategory: "venus",
    difficulty: "beginner",
    questions: {
      en: "What does Venus traditionally signify in marriage?",
      hi: "विवाह में शुक्र पारंपरिक रूप से क्या दर्शाता है?",
      hinglish: "Marriage mein Venus traditionally kya signify karta hai?"
    },
    answers: {
      en: "Venus is traditionally associated with love, attraction, beauty and partnership. In marriage readings, its placement and condition are studied with care. I would add — Venus describes symbolic themes of affection, not a promise about your specific partner.",
      hi: "शुक्र पारंपरिक रूप से प्रेम, आकर्षण, सौंदर्य और साझेदारी से जोड़ा जाता है। विवाह पठन में इसकी स्थिति और दशा ध्यान से देखी जाती है। मैं जोड़ूँगी — शुक्र स्नेह के प्रतीकात्मक विषय बताता है, आपके विशिष्ट साथी के बारे में वादा नहीं।",
      hinglish: "Venus traditionally love, attraction, beauty aur partnership se joda jata hai. Marriage readings mein uski placement aur condition dhyan se study ki jati hai. Main add karungi — Venus affection ke symbolic themes batata hai, aapke specific partner ke baare mein promise nahi."
    },
    answer_type: "traditional_astrology",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: [],
    confidence: "traditional_interpretation",
    disclaimer: D_EN,
    tags: ["venus", "planets"]
  },
  {
    id: "marriage_relationship_0014",
    category: "planets",
    subcategory: "jupiter",
    difficulty: "beginner",
    questions: {
      en: "What does Jupiter traditionally signify for marriage?",
      hi: "विवाह के लिए गुरु पारंपरिक रूप से क्या दर्शाता है?",
      hinglish: "Marriage ke liye Jupiter traditionally kya signify karta hai?"
    },
    answers: {
      en: "In traditional interpretation, Jupiter is associated with wisdom, protection and good fortune. Some classical texts describe Jupiter in the seventh as giving a learned spouse and blessings after marriage. I would frame this as a traditional belief, not a guaranteed outcome.",
      hi: "पारंपरिक व्याख्या में गुरु ज्ञान, संरक्षण और सौभाग्य से जोड़ा जाता है। कुछ शास्त्रों में सातवें भाव का गुरु विद्वान जीवनसाथी और विवाह के बाद आशीर्वाद देने वाला बताया गया है। मैं इसे पारंपरिक मान्यता कहूँगी, गारंटीकृत परिणाम नहीं।",
      hinglish: "Traditional interpretation mein Jupiter wisdom, protection aur good fortune se joda jata hai. Kuch classical texts mein seventh house ka Jupiter learned spouse aur marriage ke baad blessings dene wala bataya gaya hai. Main ise traditional belief kahungi, guaranteed outcome nahi."
    },
    answer_type: "traditional_astrology",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: ["rath_crux_7th"],
    confidence: "traditional_interpretation",
    disclaimer: D_EN,
    tags: ["jupiter", "planets"]
  },
  {
    id: "marriage_relationship_0015",
    category: "planets",
    subcategory: "mars",
    difficulty: "intermediate",
    questions: {
      en: "What does Mars traditionally signify in marriage?",
      hi: "विवाह में मंगल पारंपरिक रूप से क्या दर्शाता है?",
      hinglish: "Marriage mein Mars traditionally kya signify karta hai?"
    },
    answers: {
      en: "Mars is traditionally associated with energy, courage and sometimes conflict. In marriage readings, its placement is studied carefully, especially regarding Manglik discussions. I would gently remind you — Mars does not decide your relationship’s fate, and fear-based Mars claims are often exaggerated.",
      hi: "मंगल पारंपरिक रूप से ऊर्जा, साहस और कभी-कभी टकराव से जोड़ा जाता है। विवाह पठन में इसकी स्थिति ध्यान से देखी जाती है, विशेषकर मांगलिक चर्चा में। मैं प्यार से याद दिलाऊँगी — मंगल आपके संबंध का भाग्य तय नहीं करता, और भय-आधारित मंगल दावे अक्सर बढ़ा-चढ़ाकर होते हैं।",
      hinglish: "Mars traditionally energy, courage aur kabhi-kabhi conflict se joda jata hai. Marriage readings mein uski placement dhyan se dekhi jati hai, especially Manglik discussion mein. Main pyaar se yaad dilaaungi — Mars aapke relationship ka fate decide nahi karta, aur fear-based Mars claims often exaggerated hote hain."
    },
    answer_type: "traditional_astrology",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: ["rath_crux_7th", "mangala_dosha_wikipedia"],
    confidence: "traditional_interpretation",
    disclaimer: D_EN,
    tags: ["mars", "manglik"]
  },
  {
    id: "marriage_relationship_0016",
    category: "planets",
    subcategory: "saturn",
    difficulty: "intermediate",
    questions: {
      en: "Does Saturn in the seventh house mean delayed marriage?",
      hi: "क्या सातवें भाव में शनि विवाह में देरी दर्शाता है?",
      hinglish: "Kya seventh house mein Saturn marriage delay dikhata hai?"
    },
    answers: {
      en: "In traditional interpretation, Saturn in the seventh is often associated with a mature, industrious spouse and sometimes with delay or foreign residence. But I would say — delay is not failure. Many people with Saturn in the seventh marry later and very happily. Timing is symbolic, not a verdict.",
      hi: "पारंपरिक व्याख्या में सातवें भाव का शनि अक्सर परिपक्व, परिश्रमी जीवनसाथी और कभी-कभी देरी या विदेश-निवास से जोड़ा जाता है। पर मैं कहूँगी — देरी विफलता नहीं है। सातवें भाव में शनि वाले कई लोग देर से और बहुत खुशी से विवाह करते हैं। समय प्रतीकात्मक है, फैसला नहीं।",
      hinglish: "Traditional interpretation mein seventh house ka Saturn often mature, industrious spouse aur kabhi-kabhi delay ya foreign residence se joda jata hai. Par main kahungi — delay failure nahi hai. Seventh house mein Saturn wale kayi log late aur bahut happily shaadi karte hain. Timing symbolic hai, verdict nahi."
    },
    answer_type: "traditional_astrology",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: ["rath_crux_7th"],
    confidence: "traditional_interpretation",
    disclaimer: D_EN,
    tags: ["saturn", "delay"]
  },
  {
    id: "marriage_relationship_0017",
    category: "planets",
    subcategory: "rahu_ketu",
    difficulty: "advanced",
    questions: {
      en: "What do Rahu and Ketu traditionally signify in the seventh house?",
      hi: "सातवें भाव में राहु और केतु पारंपरिक रूप से क्या दर्शाते हैं?",
      hinglish: "Seventh house mein Rahu aur Ketu traditionally kya signify karte hain?"
    },
    answers: {
      en: "Traditional texts describe Rahu in the seventh with themes of unconventional partnerships or strong desire, and Ketu with detachment or spiritual focus. I would gently caution — these are symbolic descriptions, and fear-based Rahu/Ketu marketing is common. Please do not let it frighten you.",
      hi: "पारंपरिक ग्रंथ सातवें भाव के राहु को अपरंपरागत साझेदारी या तीव्र इच्छा से, और केतु को वैराग्य या आध्यात्मिक केंद्र से जोड़ते हैं। मैं प्यार से सावधान करूँगी — ये प्रतीकात्मक वर्णन हैं, और भय-आधारित राहु/केतु मार्केटिंग आम है। कृपया इसे आपको डराने न दें।",
      hinglish: "Traditional texts seventh house ke Rahu ko unconventional partnerships ya strong desire se, aur Ketu ko detachment ya spiritual focus se jodte hain. Main pyaar se caution karungi — ye symbolic descriptions hain, aur fear-based Rahu/Ketu marketing common hai. Please ise aapko daraane na dein."
    },
    answer_type: "traditional_astrology",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: ["rath_crux_7th"],
    confidence: "traditional_interpretation",
    disclaimer: D_EN,
    tags: ["rahu", "ketu", "fear-marketing"]
  },
  {
    id: "marriage_relationship_0018",
    category: "planets",
    subcategory: "moon",
    difficulty: "beginner",
    questions: {
      en: "What does the Moon traditionally signify for emotional compatibility?",
      hi: "भावनात्मक अनुकूलता के लिए चंद्रमा पारंपरिक रूप से क्या दर्शाता है?",
      hinglish: "Emotional compatibility ke liye Moon traditionally kya signify karta hai?"
    },
    answers: {
      en: "The Moon is traditionally associated with mind, emotions and comfort. In matchmaking, Moon signs and Nakshatras are often compared for emotional resonance. I would say — this is a symbolic framework, and real emotional compatibility grows through communication and mutual care.",
      hi: "चंद्रमा पारंपरिक रूप से मन, भावनाओं और सुख से जोड़ा जाता है। मिलान में चंद्र राशि और नक्षत्र भावनात्मक तालमेल के लिए तुलना किए जाते हैं। मैं कहूँगी — यह प्रतीकात्मक ढाँचा है, और वास्तविक भावनात्मक अनुकूलता संवाद और पारस्परिक देखभाल से बढ़ती है।",
      hinglish: "Moon traditionally mind, emotions aur comfort se joda jata hai. Matchmaking mein Moon signs aur Nakshatras emotional resonance ke liye compare kiye jate hain. Main kahungi — ye symbolic framework hai, aur real emotional compatibility communication aur mutual care se badhti hai."
    },
    answer_type: "traditional_astrology",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: [],
    confidence: "traditional_interpretation",
    disclaimer: D_EN,
    tags: ["moon", "compatibility"]
  },
  {
    id: "marriage_relationship_0019",
    category: "planets",
    subcategory: "mercury",
    difficulty: "beginner",
    questions: {
      en: "What does Mercury signify for communication in marriage?",
      hi: "विवाह में संवाद के लिए बुध क्या दर्शाता है?",
      hinglish: "Marriage mein communication ke liye Mercury kya signify karta hai?"
    },
    answers: {
      en: "Mercury is traditionally linked with speech, intellect and negotiation — all very relevant to partnership. A well-placed Mercury is sometimes described as supporting healthy dialogue. But I would always add — communication is a learnable skill, not something a planet gives you permanently.",
      hi: "बुध पारंपरिक रूप से वाणी, बुद्धि और संवाद से जुड़ा है — सभी साझेदारी के लिए बहुत प्रासंगिक। शुभ स्थिति का बुध कभी-कभी स्वस्थ संवाद का समर्थक बताया जाता है। पर मैं सदा जोड़ूँगी — संवाद सीखने योग्य कौशल है, ग्रह आपको स्थायी रूप से नहीं देता।",
      hinglish: "Mercury traditionally speech, intellect aur negotiation se juda hai — sab partnership ke liye bahut relevant. Well-placed Mercury kabhi-kabhi healthy dialogue ka supporter bataya jata hai. Par main always add karungi — communication learnable skill hai, planet aapko permanently nahi deta."
    },
    answer_type: "traditional_astrology",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: [],
    confidence: "traditional_interpretation",
    disclaimer: D_EN,
    tags: ["mercury", "communication"]
  },
  {
    id: "marriage_relationship_0020",
    category: "planets",
    subcategory: "sun",
    difficulty: "intermediate",
    questions: {
      en: "What does the Sun traditionally signify about the spouse?",
      hi: "जीवनसाथी के बारे में सूर्य पारंपरिक रूप से क्या दर्शाता है?",
      hinglish: "Spouse ke baare mein Sun traditionally kya signify karta hai?"
    },
    answers: {
      en: "The Sun is traditionally associated with authority, father, and self-confidence. Some readings link it to a spouse with a strong personality or government connection. I would frame this carefully — these are symbolic associations, not a description of a real person you have not met.",
      hi: "सूर्य पारंपरिक रूप से अधिकार, पिता और आत्मविश्वास से जोड़ा जाता है। कुछ पठन इसे मजबूत व्यक्तित्व या सरकारी संबंध वाले जीवनसाथी से जोड़ते हैं। मैं इसे सावधानी से रखूँगी — ये प्रतीकात्मक संबंध हैं, किसी ऐसे वास्तविक व्यक्ति का वर्णन नहीं जिससे आप मिले नहीं।",
      hinglish: "Sun traditionally authority, father aur self-confidence se joda jata hai. Kuch readings ise strong personality ya government connection wale spouse se jodti hain. Main ise carefully rakhungi — ye symbolic associations hain, kisi aise real person ka description nahi jisse aap mile nahi."
    },
    answer_type: "traditional_astrology",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: [],
    confidence: "traditional_interpretation",
    disclaimer: D_EN,
    tags: ["sun", "spouse"]
  },
  {
    id: "marriage_relationship_0021",
    category: "love_arranged",
    subcategory: "love_marriage",
    difficulty: "beginner",
    questions: {
      en: "Does my chart show love marriage or arranged marriage?",
      hi: "क्या मेरी कुंडली प्रेम विवाह या अरेंज मैरिज दर्शाती है?",
      hinglish: "Kya meri kundli love marriage ya arranged marriage show karti hai?"
    },
    answers: {
      en: "I cannot say without your real chart — and even with a chart, traditional astrology describes symbolic tendencies, not a guaranteed outcome. Some readings associate the fifth and seventh houses with love matches. But the actual path depends on you, your family and your choices.",
      hi: "मैं असली कुंडली के बिना नहीं कह सकती — और कुंडली के साथ भी, पारंपरिक ज्योतिष प्रतीकात्मक प्रवृत्तियाँ बताता है, गारंटीकृत परिणाम नहीं। कुछ पठन पाँचवें और सातवें भाव को प्रेम-मिलान से जोड़ते हैं। पर वास्तविक मार्ग आप, आपके परिवार और आपके चुनावों पर निर्भर है।",
      hinglish: "Main real chart ke bina nahi keh sakti — aur chart ke saath bhi, traditional astrology symbolic tendencies batata hai, guaranteed outcome nahi. Kuch readings fifth aur seventh houses ko love match se jodti hain. Par actual path aap, aapka family aur aapke choices par depend karta hai."
    },
    answer_type: "traditional_astrology",
    requires_personal_chart: true,
    requires_calculation: true,
    source_ids: [],
    confidence: "uncertain",
    disclaimer: D_EN,
    tags: ["love-marriage", "personal-chart"]
  },
  {
    id: "marriage_relationship_0022",
    category: "love_arranged",
    subcategory: "love_marriage",
    difficulty: "beginner",
    questions: {
      en: "Will I have a love marriage?",
      hi: "क्या मेरा प्रेम विवाह होगा?",
      hinglish: "Kya mera love marriage hoga?"
    },
    answers: {
      en: "I will not promise you a love marriage — that would not be fair to you. A chart can be discussed symbolically, but it cannot decide whom you will love or marry. What I can say is — love grows through respect, trust and shared effort, and those are within your influence.",
      hi: "मैं आपसे प्रेम विवाह का वादा नहीं करूँगी — यह आपके साथ न्याय नहीं होगा। कुंडली पर प्रतीकात्मक चर्चा हो सकती है, पर वह तय नहीं कर सकती कि आप किससे प्रेम करेंगे या विवाह। मैं यह कह सकती हूँ — प्रेम सम्मान, विश्वास और साझा प्रयास से बढ़ता है, और ये आपके प्रभाव में हैं।",
      hinglish: "Main aapse love marriage ka promise nahi karungi — yeh aapke saath fair nahi hoga. Chart par symbolic discussion ho sakti hai, par woh decide nahi kar sakti ki aap kisse pyaar karenge ya shaadi. Main yeh keh sakti hoon — love respect, trust aur shared effort se badhta hai, aur ye aapke influence mein hain."
    },
    answer_type: "traditional_astrology",
    requires_personal_chart: true,
    requires_calculation: true,
    source_ids: [],
    confidence: "uncertain",
    disclaimer: D_EN,
    tags: ["love-marriage", "safety"]
  },
  {
    id: "marriage_relationship_0023",
    category: "love_arranged",
    subcategory: "comparison",
    difficulty: "intermediate",
    questions: {
      en: "Is arranged marriage less romantic than love marriage?",
      hi: "क्या अरेंज मैरिज प्रेम विवाह से कम रोमांटिक होती है?",
      hinglish: "Kya arranged marriage love marriage se kam romantic hoti hai?"
    },
    answers: {
      en: "I hear the assumption in your question, and I want to gently challenge it. Many arranged marriages grow deep affection over time, and many love marriages face serious challenges. What matters is respect, communication and mutual effort — not the label on how you met.",
      hi: "मैं आपके प्रश्न की धारणा सुनती हूँ, और प्यार से उसे चुनौती देना चाहूँगी। कई अरेंज मैरिज समय के साथ गहरा स्नेह बनाती हैं, और कई प्रेम विवाह गंभीर चुनौतियों का सामना करते हैं। महत्वपूर्ण है सम्मान, संवाद और पारस्परिक प्रयास — न कि मिलने के तरीके का लेबल।",
      hinglish: "Main aapke question ki assumption sunti hoon, aur pyaar se usko challenge karna chahungi. Kayi arranged marriages time ke saath deep affection banati hain, aur kayi love marriages serious challenges face karti hain. Important hai respect, communication aur mutual effort — na ki milne ke tareeke ka label."
    },
    answer_type: "relationship_guidance",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: [],
    confidence: "general_education",
    disclaimer: D_EN,
    tags: ["arranged-marriage", "love-marriage"]
  },
  {
    id: "marriage_relationship_0024",
    category: "love_arranged",
    subcategory: "family",
    difficulty: "intermediate",
    questions: {
      en: "My family disapproves of my love marriage. What should I do?",
      hi: "मेरा परिवार मेरे प्रेम विवाह को नहीं मान रहा। मुझे क्या करना चाहिए?",
      hinglish: "Mera family mere love marriage ko nahi maan raha. Mujhe kya karna chahiye?"
    },
    answers: {
      en: "I can hear how painful this is. I would say — speak with your family calmly and listen to their concerns without abandoning your own truth. If there is any risk of coercion or harm, please prioritise your safety and seek support. Astrology cannot resolve family conflict; dialogue, time and sometimes counselling can help.",
      hi: "मैं समझ सकती हूँ कि यह कितना कठिन है। मैं कहूँगी — परिवार से शांति से बात करें और उनकी चिंताएँ सुनें, बिना अपनी सच्चाई छोड़े। यदि जबरदस्ती या नुकसान का कोई जोखिम हो, तो कृपया अपनी सुरक्षा को प्राथमिकता दें और सहायता लें। ज्योतिष पारिवारिक संघर्ष नहीं सुलझा सकता; संवाद, समय और कभी-कभी परामर्श मदद कर सकते हैं।",
      hinglish: "Main samajh sakti hoon ki yeh kitna painful hai. Main kahungi — family se calmly baat karein aur unki concerns sunein, bina apni truth chhode. Agar coercion ya harm ka koi risk ho, to please apni safety ko priority dein aur support lein. Astrology family conflict resolve nahi kar sakta; dialogue, time aur kabhi-kabhi counselling help kar sakte hain."
    },
    answer_type: "relationship_guidance",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: [],
    confidence: "general_education",
    disclaimer: D_EN,
    tags: ["family", "pressure", "safety"]
  },
  {
    id: "marriage_relationship_0025",
    category: "love_arranged",
    subcategory: "chart",
    difficulty: "intermediate",
    questions: {
      en: "Which houses indicate love marriage in traditional astrology?",
      hi: "पारंपरिक ज्योतिष में कौन से भाव प्रेम विवाह दर्शाते हैं?",
      hinglish: "Traditional astrology mein kaun se houses love marriage indicate karte hain?"
    },
    answers: {
      en: "Traditionally, the fifth house is associated with romance and attraction, and the seventh with marriage. Some readings look at connections between their lords. I would add — this is a symbolic framework, and many love marriages do not ‘show’ in the chart in the way people expect.",
      hi: "पारंपरिक रूप से पाँचवाँ भाव रोमांस और आकर्षण से, और सातवाँ विवाह से जोड़ा जाता है। कुछ पठन उनके स्वामियों के संबंध देखते हैं। मैं जोड़ूँगी — यह प्रतीकात्मक ढाँचा है, और कई प्रेम विवाह कुंडली में उस तरह ‘नहीं दिखते’ जैसा लोग सोचते हैं।",
      hinglish: "Traditionally fifth house romance aur attraction se, aur seventh marriage se joda jata hai. Kuch readings unke lords ke connection dekhti hain. Main add karungi — ye symbolic framework hai, aur kayi love marriages chart mein us tarah ‘show nahi’ karte jaisa log sochte hain."
    },
    answer_type: "traditional_astrology",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: [],
    confidence: "traditional_interpretation",
    disclaimer: D_EN,
    tags: ["love-marriage", "fifth-house"]
  },
  {
    id: "marriage_relationship_0026",
    category: "love_arranged",
    subcategory: "interfaith",
    difficulty: "intermediate",
    questions: {
      en: "Can astrology predict an inter-caste or interfaith marriage?",
      hi: "क्या ज्योतिष अंतर-जाति या अंतर-धर्म विवाह का पूर्वानुमान लगा सकता है?",
      hinglish: "Kya astrology inter-caste ya interfaith marriage predict kar sakta hai?"
    },
    answers: {
      en: "Some traditional readings associate certain combinations with unconventional partnerships. But I want to be honest — astrology cannot reliably predict the caste or religion of your partner, and it should not be used to pressure you either way. Your life choices belong to you.",
      hi: "कुछ पारंपरिक पठन कुछ संयोगों को अपरंपरागत साझेदारी से जोड़ते हैं। पर मैं ईमानदार रहूँगी — ज्योतिष आपके साथी की जाति या धर्म का विश्वसनीय पूर्वानुमान नहीं लगा सकता, और इसे आप पर किसी भी तरह दबाव डालने के लिए नहीं इस्तेमाल करना चाहिए। आपके जीवन के चुनाव आपके हैं।",
      hinglish: "Kuch traditional readings kuch combinations ko unconventional partnerships se jodti hain. Par main honest rahungi — astrology aapke partner ki caste ya religion reliably predict nahi kar sakta, aur ise aap par kisi bhi tarah pressure daalne ke liye use nahi karna chahiye. Aapke life choices aapke hain."
    },
    answer_type: "traditional_astrology",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: [],
    confidence: "uncertain",
    disclaimer: D_EN,
    tags: ["interfaith", "inter-caste"]
  },
  {
    id: "marriage_relationship_0027",
    category: "spouse",
    subcategory: "characteristics",
    difficulty: "beginner",
    questions: {
      en: "Can astrology describe my future spouse’s personality?",
      hi: "क्या ज्योतिष मेरे भावी जीवनसाथी के व्यक्तित्व का वर्णन कर सकता है?",
      hinglish: "Kya astrology mere future spouse ki personality describe kar sakta hai?"
    },
    answers: {
      en: "Traditional readings do describe symbolic qualities of a spouse through the seventh house and its lord. But I would say gently — these are archetypes, not a photograph of a real person. Please do not reject someone or fixate on someone based only on a chart description.",
      hi: "पारंपरिक पठन सातवें भाव और उसके स्वामी से जीवनसाथी के प्रतीकात्मक गुणों का वर्णन करते हैं। पर मैं प्यार से कहूँगी — ये आदर्श-प्रतीक हैं, किसी वास्तविक व्यक्ति की तस्वीर नहीं। कृपया केवल कुंडली-वर्णन के आधार पर किसी को अस्वीकार या किसी पर मोहित न हों।",
      hinglish: "Traditional readings seventh house aur uske lord se spouse ke symbolic qualities describe karti hain. Par main pyaar se kahungi — ye archetypes hain, kisi real person ki photograph nahi. Please sirf chart description ke basis par kisi ko reject ya kisi par fixate na karein."
    },
    answer_type: "traditional_astrology",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: [],
    confidence: "traditional_interpretation",
    disclaimer: D_EN,
    tags: ["spouse", "characteristics"]
  },
  {
    id: "marriage_relationship_0028",
    category: "spouse",
    subcategory: "appearance",
    difficulty: "beginner",
    questions: {
      en: "Does the seventh house describe my spouse’s appearance?",
      hi: "क्या सातवाँ भाव मेरे जीवनसाथी के रूप का वर्णन करता है?",
      hinglish: "Kya seventh house mere spouse ke appearance ka description karta hai?"
    },
    answers: {
      en: "Some traditional texts offer symbolic descriptions of appearance through the seventh house and Venus. I would encourage you to hold these lightly — they are poetic associations, not reliable physical predictions. Real attraction is shaped by much more than a chart.",
      hi: "कुछ पारंपरिक ग्रंथ सातवें भाव और शुक्र से रूप के प्रतीकात्मक वर्णन देते हैं। मैं इन्हें हल्के से पकड़ने की सलाह दूँगी — ये काव्यात्मक संबंध हैं, विश्वसनीय शारीरिक पूर्वानुमान नहीं। वास्तविक आकर्षण कुंडली से कहीं अधिक चीजों से बनता है।",
      hinglish: "Kuch traditional texts seventh house aur Venus se appearance ke symbolic descriptions dete hain. Main inhe lightly lene ki salah dungi — ye poetic associations hain, reliable physical predictions nahi. Real attraction chart se kaafi zyada cheezon se banti hai."
    },
    answer_type: "traditional_astrology",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: [],
    confidence: "traditional_interpretation",
    disclaimer: D_EN,
    tags: ["spouse", "appearance"]
  },
  {
    id: "marriage_relationship_0029",
    category: "spouse",
    subcategory: "profession",
    difficulty: "intermediate",
    questions: {
      en: "Can astrology indicate my spouse’s profession?",
      hi: "क्या ज्योतिष मेरे जीवनसाथी का पेशा बता सकता है?",
      hinglish: "Kya astrology mere spouse ka profession bata sakta hai?"
    },
    answers: {
      en: "Some traditional readings link the seventh lord or planets in the seventh to the spouse’s likely field of work. I would say — these are symbolic hints, not reliable career predictions for another person. Please let your partner’s actual choices define their profession.",
      hi: "कुछ पारंपरिक पठन सातवें स्वामी या सातवें भाव के ग्रहों को जीवनसाथी के संभावित कार्यक्षेत्र से जोड़ते हैं। मैं कहूँगी — ये प्रतीकात्मक संकेत हैं, किसी अन्य व्यक्ति के विश्वसनीय करियर पूर्वानुमान नहीं। कृपया आपके साथी के वास्तविक चुनावों को उनका पेशा तय करने दें।",
      hinglish: "Kuch traditional readings seventh lord ya seventh house ke planets ko spouse ke likely work field se jodti hain. Main kahungi — ye symbolic hints hain, kisi doosre person ke reliable career predictions nahi. Please aapke partner ke actual choices ko unka profession define karne dein."
    },
    answer_type: "traditional_astrology",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: [],
    confidence: "uncertain",
    disclaimer: D_EN,
    tags: ["spouse", "profession"]
  },
  {
    id: "marriage_relationship_0030",
    category: "spouse",
    subcategory: "age",
    difficulty: "intermediate",
    questions: {
      en: "Does the chart show whether my spouse will be older or younger?",
      hi: "क्या कुंडली बताती है कि मेरा जीवनसाथी बड़ा होगा या छोटा?",
      hinglish: "Kya chart batata hai ki mera spouse older hoga ya younger?"
    },
    answers: {
      en: "Some traditional interpretations associate Saturn in the seventh with an older spouse, and certain combinations with a younger one. I want to be honest — these are not reliable predictions. Age difference is a personal choice and cannot be determined from a chart with certainty.",
      hi: "कुछ पारंपरिक व्याख्याएँ सातवें भाव के शनि को बड़े जीवनसाथी से, और कुछ संयोगों को छोटे से जोड़ती हैं। मैं ईमानदार रहूँगी — ये विश्वसनीय पूर्वानुमान नहीं हैं। आयु-अंतर व्यक्तिगत चुनाव है और कुंडली से निश्चितता से नहीं तय हो सकता।",
      hinglish: "Kuch traditional interpretations seventh house ke Saturn ko older spouse se, aur kuch combinations ko younger se jodti hain. Main honest rahungi — ye reliable predictions nahi hain. Age difference personal choice hai aur chart se certainty se determine nahi ho sakta."
    },
    answer_type: "traditional_astrology",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: [],
    confidence: "uncertain",
    disclaimer: D_EN,
    tags: ["spouse", "age"]
  }
];
