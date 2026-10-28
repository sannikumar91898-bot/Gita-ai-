// lib/knowledge/wealth-property.ts
// Female-tone knowledge base seed for Gita AI Astrologer
// 50 entries · en / hi / hinglish · honest, warm, non-manipulative

import type { WealthPropertyEntry } from "./wealth-property.types";

const D_EN =
  "Astrological interpretations are traditional beliefs, not guaranteed predictions. They do not replace professional financial, legal or medical advice.";
const D_HI =
  "ज्योतिषीय व्याख्याएँ पारंपरिक मान्यताएँ हैं, गारंटीकृत भविष्यवाणियाँ नहीं। ये पेशेवर वित्तीय, कानूनी या चिकित्सकीय सलाह का विकल्प नहीं हैं।";
const D_HING =
  "Astrological interpretations traditional beliefs hain, guaranteed predictions nahi. Ye professional financial, legal ya medical advice ka replacement nahi hain.";

export const SEED_ENTRIES: WealthPropertyEntry[] = [
  // ─────────── WEALTH HOUSES (10) ───────────
  {
    id: "wealth_property_0001",
    category: "wealth_houses",
    subcategory: "second_house",
    difficulty: "beginner",
    questions: {
      en: "What does the second house traditionally represent in wealth astrology?",
      hi: "धन ज्योतिष में दूसरा भाव पारंपरिक रूप से क्या दर्शाता है?",
      hinglish: "Wealth astrology mein second house traditionally kya represent karta hai?"
    },
    answers: {
      en: "I would explain it this way: in traditional Vedic astrology, the second house (Dhana Bhava) is associated with accumulated wealth, family resources, speech and movable assets. Please keep in mind this is a traditional interpretive framework, not a financial guarantee. For a real reading we would need your verified ascendant, planetary positions and house lords.",
      hi: "मैं इसे इस तरह समझाती हूँ — पारंपरिक वैदिक ज्योतिष में दूसरा भाव (धन भाव) संचित धन, पारिवारिक संसाधन, वाणी और चल संपत्ति से जोड़ा जाता है। ध्यान रखिए, यह एक पारंपरिक व्याख्या है, धन की गारंटी नहीं। सही पठन के लिए सत्यापित लग्न, ग्रह-स्थिति और भाव-स्वामी आवश्यक हैं।",
      hinglish: "Main ise aise samjhaati hoon — traditional Vedic astrology mein second house (Dhana Bhava) accumulated wealth, family resources, speech aur movable assets se joda jata hai. Yaad rakhiye, yeh traditional interpretation hai, wealth ki guarantee nahi. Real reading ke liye verified ascendant, planetary positions aur house lords chahiye."
    },
    answer_type: "traditional_astrology",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: ["dhana_yoga_overview"],
    confidence: "traditional_interpretation",
    disclaimer: D_EN
  },
  {
    id: "wealth_property_0002",
    category: "wealth_houses",
    subcategory: "eleventh_house",
    difficulty: "beginner",
    questions: {
      en: "What does the eleventh house represent for income and gains?",
      hi: "ग्यारहवाँ भाव आय और लाभ के लिए क्या दर्शाता है?",
      hinglish: "Eleventh house income aur gains ke liye kya represent karta hai?"
    },
    answers: {
      en: "In my traditional understanding, the eleventh house (Labha Bhava) is associated with income, gains, fulfilment of desires and social networks. Traditional interpreters often pair it with the second house — one for what flows in, the other for what stays. These are interpretive associations, not measurable forecasts.",
      hi: "मेरी पारंपरिक समझ में ग्यारहवाँ भाव (लाभ भाव) आय, लाभ, इच्छापूर्ति और सामाजिक संबंधों से जोड़ा जाता है। पारंपरिक व्याख्याकार इसे अक्सर दूसरे भाव के साथ जोड़ते हैं — एक आने वाले प्रवाह के लिए, दूसरा संचय के लिए। ये व्याख्यात्मक संबंध हैं, मापने योग्य पूर्वानुमान नहीं।",
      hinglish: "Meri traditional samajh mein eleventh house (Labha Bhava) income, gains, desires ki fulfilment aur social networks se joda jata hai. Traditional interpreters ise often second house ke saath pair karte hain — ek inflow ke liye, doosra storage ke liye. Ye interpretive associations hain, measurable forecasts nahi."
    },
    answer_type: "traditional_astrology",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: ["dhana_yoga_overview"],
    confidence: "traditional_interpretation",
    disclaimer: D_EN
  },
  {
    id: "wealth_property_0003",
    category: "wealth_houses",
    subcategory: "second_vs_eleventh",
    difficulty: "beginner",
    questions: {
      en: "What is the difference between the second and eleventh houses?",
      hi: "दूसरे और ग्यारहवें भाव में क्या अंतर है?",
      hinglish: "Second aur eleventh house mein kya difference hai?"
    },
    answers: {
      en: "I would put it simply: the second house is traditionally about what is saved and stored, and the eleventh about what comes in as income or gain. Many classical texts describe the second as the treasury and the eleventh as the inflow. These are traditional distinctions, and both matter in an interpretive reading together.",
      hi: "मैं सरलता से कहूँगी — दूसरा भाव पारंपरिक रूप से बचत और संचय का है, और ग्यारहवाँ आय या लाभ के रूप में आने वाले प्रवाह का। कई शास्त्रों में दूसरे को तिजोरी और ग्यारहवें को आवक कहा गया है। ये पारंपरिक भेद हैं, और व्याख्या में दोनों साथ देखे जाते हैं।",
      hinglish: "Main simply kahungi — second house traditionally savings aur storage ka hai, aur eleventh income ya gain ke inflow ka. Kayi classical texts mein second ko treasury aur eleventh ko inflow kaha gaya hai. Ye traditional distinctions hain, aur interpretation mein dono saath dekhe jate hain."
    },
    answer_type: "traditional_astrology",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: ["dhana_yoga_overview"],
    confidence: "traditional_interpretation",
    disclaimer: D_EN
  },
  {
    id: "wealth_property_0004",
    category: "wealth_houses",
    subcategory: "fifth_house",
    difficulty: "beginner",
    questions: {
      en: "What does the fifth house have to do with wealth?",
      hi: "धन से पाँचवें भाव का क्या संबंध है?",
      hinglish: "Wealth se fifth house ka kya connection hai?"
    },
    answers: {
      en: "In traditional Parasari interpretations, the fifth house (Putra Bhava) is often linked with speculation, creativity, past-life merit (purva punya) and, in some combinations, gains through intelligence. It is sometimes called a wealth-giving bhava in classical texts. I would still say — this is a traditional interpretive frame, not a prediction of earnings.",
      hi: "पारंपरिक पाराशरी व्याख्याओं में पाँचवाँ भाव (पुत्र भाव) अक्सर सट्टा, रचनात्मकता, पूर्व पुण्य और कुछ योगों में बुद्धि से लाभ से जोड़ा जाता है। शास्त्रों में इसे कभी-कभी धन देने वाला भाव भी कहा गया है। मैं फिर भी कहूँगी — यह पारंपरिक ढाँचा है, कमाई का पूर्वानुमान नहीं।",
      hinglish: "Traditional Parasari interpretations mein fifth house (Putra Bhava) ko often speculation, creativity, purva punya aur kuch yogas mein intelligence se gains se joda jata hai. Classical texts mein ise kabhi-kabhi wealth-giving bhava bhi kaha gaya hai. Main phir bhi kahungi — yeh traditional frame hai, earnings ka prediction nahi."
    },
    answer_type: "traditional_astrology",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: ["dhana_yoga_overview"],
    confidence: "traditional_interpretation",
    disclaimer: D_EN
  },
  {
    id: "wealth_property_0005",
    category: "wealth_houses",
    subcategory: "ninth_house",
    difficulty: "beginner",
    questions: {
      en: "Why is the ninth house considered lucky for wealth?",
      hi: "नौवाँ भाव धन के लिए भाग्यशाली क्यों माना जाता है?",
      hinglish: "Ninth house wealth ke liye lucky kyun mana jata hai?"
    },
    answers: {
      en: "In tradition, the ninth house (Dharma Bhava) is associated with fortune, higher purpose, teachers and long-distance matters. Because some classical texts group it with the fifth as a ‘wealth-giving’ house, astrologers often look at it alongside the second and eleventh. I would gently remind you that ‘lucky’ here is a traditional label, not a promise that good fortune is guaranteed.",
      hi: "परंपरा में नौवाँ भाव (धर्म भाव) भाग्य, उच्च उद्देश्य, गुरुजन और दूरस्थ मामलों से जोड़ा जाता है। कुछ शास्त्रों में इसे पाँचवें के साथ ‘धन देने वाला’ भाव कहा गया है, इसलिए ज्योतिष इसे दूसरे और ग्यारहवें के साथ देखते हैं। मैं प्यार से याद दिलाऊँगी — यहाँ ‘भाग्यशाली’ एक पारंपरिक शब्द है, सौभाग्य की गारंटी नहीं।",
      hinglish: "Tradition mein ninth house (Dharma Bhava) fortune, higher purpose, teachers aur long-distance matters se joda jata hai. Kuch classical texts ise fifth ke saath ‘wealth-giving’ house kehte hain, isliye astrologers ise second aur eleventh ke saath dekhte hain. Main pyaar se yaad dilaaungi — yahan ‘lucky’ ek traditional label hai, good fortune ki guarantee nahi."
    },
    answer_type: "traditional_astrology",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: ["dhana_yoga_overview"],
    confidence: "traditional_interpretation",
    disclaimer: D_EN
  },
  {
    id: "wealth_property_0006",
    category: "wealth_houses",
    subcategory: "ascendant",
    difficulty: "beginner",
    questions: {
      en: "Why does the ascendant and its lord matter for wealth?",
      hi: "धन के लिए लग्न और उसके स्वामी का क्या महत्व है?",
      hinglish: "Wealth ke liye ascendant aur uske lord ka kya importance hai?"
    },
    answers: {
      en: "I would explain that the ascendant (Lagna) sets the whole chart — it determines which house is which. Its lord is often treated as the chart’s anchor. For wealth questions, astrologers typically check the ascendant lord’s strength, placement and relationship with the second, eleventh and tenth houses. This is all interpretive — the ascendant alone does not predict money.",
      hi: "मैं समझाती हूँ कि लग्न पूरी कुंडली की नींव रखता है — यह तय करता है कौन सा भाव कौन सा है। उसका स्वामी अक्सर कुंडली का आधार माना जाता है। धन संबंधी प्रश्नों में ज्योतिष लग्नेश की शक्ति, स्थिति और दूसरे, ग्यारहवें, दसवें भावों से संबंध देखते हैं। यह सब व्याख्यात्मक है — अकेला लग्न धन का पूर्वानुमान नहीं है।",
      hinglish: "Main samjhaati hoon ki ascendant (Lagna) poori kundli ki foundation rakhta hai — yeh decide karta hai kaun sa house kaun sa hai. Uska lord often kundli ka anchor mana jata hai. Wealth questions mein astrologers ascendant lord ki strength, placement aur second, eleventh, tenth houses se relationship dekhte hain. Ye sab interpretive hai — akela ascendant money ka prediction nahi hai."
    },
    answer_type: "traditional_astrology",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: [],
    confidence: "traditional_interpretation",
    disclaimer: D_EN
  },
  {
    id: "wealth_property_0007",
    category: "wealth_houses",
    subcategory: "overview",
    difficulty: "beginner",
    questions: {
      en: "Which houses should a beginner study first for wealth?",
      hi: "धन के लिए शुरुआती व्यक्ति को पहले कौन से भाव पढ़ने चाहिए?",
      hinglish: "Wealth ke liye beginner ko pehle kaun se houses padhne chahiye?"
    },
    answers: {
      en: "I usually suggest starting with the second house (savings), eleventh house (income), fourth house (home and property) and tenth house (career). Once those feel clear, the fifth and ninth become easier to add. Learn the meanings, lords and basic aspects before attempting yogas or dashas. These are traditional categories — not scientific indicators.",
      hi: "मैं आमतौर पर सुझाती हूँ कि दूसरे भाव (बचत), ग्यारहवें भाव (आय), चौथे भाव (घर और संपत्ति) और दसवें भाव (करियर) से शुरुआत करें। जब ये स्पष्ट लगें, तब पाँचवाँ और नौवाँ जोड़ना आसान होगा। योग या दशा से पहले अर्थ, स्वामी और मूल दृष्टियाँ सीखें। ये पारंपरिक श्रेणियाँ हैं — वैज्ञानिक संकेतक नहीं।",
      hinglish: "Main usually suggest karti hoon ki second house (savings), eleventh house (income), fourth house (home aur property) aur tenth house (career) se shuru karein. Jab ye clear lagein, tab fifth aur ninth add karna easier hoga. Yogas ya dashas try karne se pehle meanings, lords aur basic aspects seekhein. Ye traditional categories hain — scientific indicators nahi."
    },
    answer_type: "traditional_astrology",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: ["dhana_yoga_overview"],
    confidence: "traditional_interpretation",
    disclaimer: D_EN
  },
  {
    id: "wealth_property_0008",
    category: "wealth_houses",
    subcategory: "personal_chart",
    difficulty: "beginner",
    questions: {
      en: "Will I become rich?",
      hi: "क्या मैं अमीर बनूँगा/बनूँगी?",
      hinglish: "Kya main ameer banunga/banungi?"
    },
    answers: {
      en: "I want to be honest with you — astrology cannot reliably answer whether someone will become rich, and I will not invent a chart to pretend otherwise. A traditional reading could look at the wealth houses and dashas, but even that is interpretive, not a forecast. Real wealth comes from income, savings, discipline, opportunity and health — all of which you can act on. If you would like a chart-based discussion, please share accurate birth date, time and place.",
      hi: "मैं ईमानदारी से कहूँगी — ज्योतिष विश्वसनीय रूप से यह उत्तर नहीं दे सकता कि कोई अमीर बनेगा या नहीं, और मैं नकली कुंडली गढ़कर ऐसा दिखावा नहीं करूँगी। पारंपरिक पठन धन भावों और दशाओं को देख सकता है, लेकिन वह भी व्याख्या है, पूर्वानुमान नहीं। वास्तविक धन आय, बचत, अनुशासन, अवसर और स्वास्थ्य से आता है — इन सब पर आप काम कर सकते हैं। कुंडली-आधारित चर्चा के लिए सटीक जन्म तिथि, समय और स्थान साझा करें।",
      hinglish: "Main honestly kahungi — astrology reliably answer nahi kar sakta ki koi ameer banega ya nahi, aur main fake kundli banaakar aisa dikhawa nahi karungi. Traditional reading wealth houses aur dashas dekh sakti hai, lekin woh bhi interpretation hai, forecast nahi. Real wealth income, savings, discipline, opportunity aur health se aata hai — in sab par aap kaam kar sakte hain. Chart-based discussion ke liye accurate birth date, time aur place share karein."
    },
    answer_type: "traditional_astrology",
    requires_personal_chart: true,
    requires_calculation: true,
    source_ids: [],
    confidence: "uncertain",
    disclaimer: D_EN
  },
  {
    id: "wealth_property_0009",
    category: "wealth_houses",
    subcategory: "ascendant_lord",
    difficulty: "intermediate",
    questions: {
      en: "What if the ascendant lord is weak in my chart?",
      hi: "यदि मेरी कुंडली में लग्नेश कमज़ोर हो तो क्या होता है?",
      hinglish: "Agar meri kundli mein ascendant lord weak ho to kya hota hai?"
    },
    answers: {
      en: "This needs an actual chart — I cannot say whether your ascendant lord is weak without seeing verified birth details and a calculated chart. In traditional interpretation, a weak ascendant lord might be discussed in relation to health, confidence or general life direction, but that is a symbolic reading, not a diagnosis. Please share your birth date, time and place if you would like a real chart calculation.",
      hi: "इसके लिए असली कुंडली चाहिए — मैं सत्यापित जन्म विवरण और गणना किए गए चार्ट के बिना नहीं कह सकती कि आपका लग्नेश कमज़ोर है या नहीं। पारंपरिक व्याख्या में कमज़ोर लग्नेश पर स्वास्थ्य, आत्मविश्वास या जीवन-दिशा के संदर्भ में चर्चा होती है, पर वह प्रतीकात्मक पठन है, निदान नहीं। असली गणना के लिए जन्म तिथि, समय और स्थान साझा करें।",
      hinglish: "Iske liye asli kundli chahiye — main verified birth details aur calculated chart ke bina nahi keh sakti ki aapka ascendant lord weak hai ya nahi. Traditional interpretation mein weak ascendant lord par health, confidence ya life direction ke reference mein discussion hoti hai, par woh symbolic reading hai, diagnosis nahi. Real calculation ke liye birth date, time aur place share karein."
    },
    answer_type: "traditional_astrology",
    requires_personal_chart: true,
    requires_calculation: true,
    source_ids: [],
    confidence: "uncertain",
    disclaimer: D_EN
  },
  {
    id: "wealth_property_0010",
    category: "wealth_houses",
    subcategory: "wealth_leak",
    difficulty: "intermediate",
    questions: {
      en: "Which placements are traditionally said to leak wealth?",
      hi: "पारंपरिक रूप से कौन सी स्थितियाँ धन के रिसाव से जुड़ी मानी जाती हैं?",
      hinglish: "Traditionally kaun si placements wealth leak karne wali maani jati hain?"
    },
    answers: {
      en: "In traditional readings, a few combinations are often discussed as ‘wealth leakage’ — for example, a strong twelfth house with a weak second, or afflictions to the second lord. I would like to be clear: this is a symbolic language of classical texts, not evidence of real financial leakage. Real leaks are usually visible in your bank statement — subscriptions, impulse spending, high-interest debt.",
      hi: "पारंपरिक पठन में कुछ संयोग ‘धन रिसाव’ के रूप में चर्चित हैं — जैसे कमज़ोर दूसरे भाव के साथ मज़बूत बारहवाँ भाव, या दूसरे स्वामी पर पीड़ा। मैं स्पष्ट कहना चाहूँगी — यह शास्त्रों की प्रतीकात्मक भाषा है, वास्तविक वित्तीय रिसाव का प्रमाण नहीं। असली रिसाव आमतौर पर बैंक स्टेटमेंट में दिखता है — सब्सक्रिप्शन, आवेगी खर्च, उच्च-ब्याज कर्ज़।",
      hinglish: "Traditional readings mein kuch combinations ‘wealth leakage’ ke roop mein discuss hote hain — jaise weak second ke saath strong twelfth, ya second lord par affliction. Main clearly kahungi — yeh classical texts ki symbolic language hai, real financial leak ka evidence nahi. Real leaks aam taur par bank statement mein dikhte hain — subscriptions, impulse spending, high-interest debt."
    },
    answer_type: "traditional_astrology",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: ["dhana_yoga_overview"],
    confidence: "traditional_interpretation",
    disclaimer: D_EN
  },

  // ─────────── DHANA / RAJ YOGA (8) ───────────
  {
    id: "wealth_property_0011",
    category: "yoga",
    subcategory: "dhana_yoga",
    difficulty: "beginner",
    questions: {
      en: "What is Dhana Yoga?",
      hi: "धन योग क्या है?",
      hinglish: "Dhana Yoga kya hai?"
    },
    answers: {
      en: "I would describe it like this: Dhana Yoga is a traditional family of planetary combinations associated with wealth in Parasari astrology. Typically it involves associations between the lords of the 1st, 2nd, 5th, 9th and 11th houses. It is a traditional interpretive concept — not evidence that a person will become wealthy.",
      hi: "मैं इसे इस तरह बताऊँगी — धन योग पाराशरी ज्योतिष में धन से जुड़े ग्रह-संयोगों का पारंपरिक समूह है। आमतौर पर इसमें पहले, दूसरे, पाँचवें, नौवें और ग्यारहवें भाव के स्वामियों का संबंध शामिल होता है। यह पारंपरिक अवधारणा है — यह प्रमाण नहीं कि व्यक्ति धनी होगा।",
      hinglish: "Main ise aise bataaungi — Dhana Yoga Parasari astrology mein wealth se jude planetary combinations ka traditional group hai. Usually isme 1st, 2nd, 5th, 9th aur 11th house ke lords ka association hota hai. Yeh traditional concept hai — yeh evidence nahi ki person wealthy hoga."
    },
    answer_type: "traditional_astrology",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: ["dhana_yoga_overview"],
    confidence: "traditional_interpretation",
    disclaimer: D_EN
  },
  {
    id: "wealth_property_0012",
    category: "yoga",
    subcategory: "dhana_yoga_formation",
    difficulty: "intermediate",
    questions: {
      en: "How are Dhana Yogas formed?",
      hi: "धन योग कैसे बनते हैं?",
      hinglish: "Dhana Yogas kaise bante hain?"
    },
    answers: {
      en: "In the traditional framework, Dhana Yogas are typically described as combinations or mutual aspects between the lords of wealth-relevant houses — especially the 1st, 2nd, 5th, 9th and 11th. Specific classical texts give many named formations. I would still encourage you to read them as symbolic grammar, not as earnings forecasts.",
      hi: "पारंपरिक ढाँचे में धन योग आमतौर पर धन-संबंधित भावों के स्वामियों — विशेषकर पहले, दूसरे, पाँचवें, नौवें और ग्यारहवें — के बीच युति या पारस्परिक दृष्टि के रूप में वर्णित हैं। विशिष्ट शास्त्रों में कई नामित योग दिए गए हैं। मैं फिर भी कहूँगी इन्हें प्रतीकात्मक व्याकरण मानें, कमाई का पूर्वानुमान नहीं।",
      hinglish: "Traditional framework mein Dhana Yogas usually wealth-relevant houses ke lords — especially 1st, 2nd, 5th, 9th aur 11th — ke beech conjunction ya mutual aspect ke roop mein described hote hain. Specific classical texts mein kayi named formations hain. Main phir bhi kahungi inhe symbolic grammar maanein, earnings ka forecast nahi."
    },
    answer_type: "traditional_astrology",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: ["dhana_yoga_overview"],
    confidence: "traditional_interpretation",
    disclaimer: D_EN
  },
  {
    id: "wealth_property_0013",
    category: "yoga",
    subcategory: "raja_yoga",
    difficulty: "beginner",
    questions: {
      en: "What is a Raja Yoga and does it mean I will become a king?",
      hi: "राज योग क्या है और क्या इसका अर्थ है कि मैं राजा बनूँगा/बनूँगी?",
      hinglish: "Raja Yoga kya hai aur kya iska matlab hai main king banunga/banungi?"
    },
    answers: {
      en: "Smiling — no, Raja Yoga in classical astrology is a traditional category of powerful combinations, usually involving kendra (1, 4, 7, 10) and trikona (1, 5, 9) lords. It is associated with status, authority and prominence, not literal kingship. It is a symbolic framework — many people with traditional Raja Yogas live ordinary, peaceful lives.",
      hi: "मुस्कुराते हुए — नहीं, शास्त्रीय ज्योतिष में राज योग शक्तिशाली संयोगों की पारंपरिक श्रेणी है, आमतौर पर केंद्र (1, 4, 7, 10) और त्रिकोण (1, 5, 9) स्वामियों से जुड़ी। यह प्रतिष्ठा, अधिकार और प्रमुखता से जुड़ा है, शाब्दिक राजत्व से नहीं। यह प्रतीकात्मक ढाँचा है — पारंपरिक राज योग वाले कई लोग साधारण, शांत जीवन जीते हैं।",
      hinglish: "Smiling — nahi, classical astrology mein Raja Yoga powerful combinations ki traditional category hai, usually kendra (1, 4, 7, 10) aur trikona (1, 5, 9) lords se judi. Yeh status, authority aur prominence se juda hai, literal kingship se nahi. Yeh symbolic framework hai — traditional Raja Yogas wale kayi log ordinary, peaceful lives jee rahe hain."
    },
    answer_type: "traditional_astrology",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: [],
    confidence: "traditional_interpretation",
    disclaimer: D_EN
  },
  {
    id: "wealth_property_0014",
    category: "yoga",
    subcategory: "personal_chart",
    difficulty: "beginner",
    questions: {
      en: "Does my chart have a Dhana Yoga?",
      hi: "क्या मेरी कुंडली में धन योग है?",
      hinglish: "Meri kundli mein Dhana Yoga hai kya?"
    },
    answers: {
      en: "I would love to look at this with you — but only from a real chart. I will not guess your ascendant or invent a yoga. Please share your exact birth date, birth time and birthplace, and I will use a verified chart calculation before offering any interpretation. Even then, Dhana Yoga is a traditional marker, not a guarantee of wealth.",
      hi: "मैं आपके साथ यह देखना चाहूँगी — पर केवल असली कुंडली से। मैं आपका लग्न अनुमान से नहीं बताऊँगी और न ही योग गढ़ूँगी। कृपया सटीक जन्म तिथि, जन्म समय और जन्म स्थान साझा करें, और मैं किसी भी व्याख्या से पहले सत्यापित गणना का उपयोग करूँगी। तब भी, धन योग एक पारंपरिक संकेत है, धन की गारंटी नहीं।",
      hinglish: "Main aapke saath yeh dekhna chahungi — par sirf real chart se. Main aapka ascendant guess nahi karungi aur na hi yoga invent karungi. Please exact birth date, birth time aur birthplace share karein, aur main kisi bhi interpretation se pehle verified chart calculation use karungi. Tab bhi, Dhana Yoga ek traditional marker hai, wealth ki guarantee nahi."
    },
    answer_type: "traditional_astrology",
    requires_personal_chart: true,
    requires_calculation: true,
    source_ids: ["dhana_yoga_overview"],
    confidence: "traditional_interpretation",
    disclaimer: D_EN
  },
  {
    id: "wealth_property_0015",
    category: "yoga",
    subcategory: "cancellation",
    difficulty: "advanced",
    questions: {
      en: "Can a Dhana Yoga be cancelled?",
      hi: "क्या धन योग भंग हो सकता है?",
      hinglish: "Kya Dhana Yoga cancel ho sakta hai?"
    },
    answers: {
      en: "In traditional interpretation, yes — classical texts describe ‘bhanga’ or cancellation of yogas through specific afflictions, weak planets or counteracting combinations. This is another reminder that these are interpretive constructs, not guarantees in either direction. I would not recommend making life decisions from a yoga description alone.",
      hi: "पारंपरिक व्याख्या में हाँ — शास्त्रों में विशिष्ट पीड़ाओं, कमज़ोर ग्रहों या प्रतिकूल संयोगों से योगों के ‘भंग’ का वर्णन है। यह फिर याद दिलाता है कि ये व्याख्यात्मक अवधारणाएँ हैं, किसी भी दिशा में गारंटी नहीं। केवल योग-वर्णन से जीवन-निर्णय लेने की मैं सलाह नहीं दूँगी।",
      hinglish: "Traditional interpretation mein haan — classical texts mein specific afflictions, weak planets ya counteracting combinations se yogas ka ‘bhanga’ describe kiya gaya hai. Yeh phir yaad dilata hai ki ye interpretive constructs hain, kisi bhi direction mein guarantee nahi. Sirf yoga description se life decisions lene ki main salah nahi dungi."
    },
    answer_type: "traditional_astrology",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: [],
    confidence: "traditional_interpretation",
    disclaimer: D_EN
  },
  {
    id: "wealth_property_0016",
    category: "yoga",
    subcategory: "dhana_vs_raja",
    difficulty: "intermediate",
    questions: {
      en: "What is the difference between Dhana Yoga and Raja Yoga?",
      hi: "धन योग और राज योग में क्या अंतर है?",
      hinglish: "Dhana Yoga aur Raja Yoga mein kya difference hai?"
    },
    answers: {
      en: "I would frame it like this — Dhana Yoga is specifically about wealth and financial flow in traditional interpretation, while Raja Yoga is broader, associated with status, authority and prominence. Both are traditional symbolic categories, and a chart may show one, both or neither. Neither guarantees a specific life outcome.",
      hi: "मैं इसे इस तरह रखूँगी — धन योग पारंपरिक व्याख्या में विशेष रूप से धन और वित्तीय प्रवाह का है, जबकि राज योग व्यापक है, प्रतिष्ठा, अधिकार और प्रमुखता से जुड़ा। दोनों पारंपरिक प्रतीकात्मक श्रेणियाँ हैं, और कुंडली में एक, दोनों या कोई नहीं हो सकता। कोई भी विशिष्ट जीवन-परिणाम की गारंटी नहीं।",
      hinglish: "Main ise aise rakhungi — Dhana Yoga traditional interpretation mein specifically wealth aur financial flow ka hai, jabki Raja Yoga broader hai, status, authority aur prominence se juda. Dono traditional symbolic categories hain, aur chart mein ek, dono ya koi bhi nahi ho sakta. Koi bhi specific life outcome ki guarantee nahi."
    },
    answer_type: "traditional_astrology",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: [],
    confidence: "traditional_interpretation",
    disclaimer: D_EN
  },
  {
    id: "wealth_property_0017",
    category: "yoga",
    subcategory: "types",
    difficulty: "intermediate",
    questions: {
      en: "What are some famous named Dhana Yogas?",
      hi: "कुछ प्रसिद्ध नामित धन योग कौन से हैं?",
      hinglish: "Kuch famous named Dhana Yogas kaun se hain?"
    },
    answers: {
      en: "Without claiming an exhaustive list — traditional texts mention formations like Lakshmi Yoga, Kubera Yoga, and various combinations of the 2nd and 11th lords with benefics. I have not verified exact verses from a licensed classical edition here, so I would present these as commonly cited names rather than authoritative definitions. For a real study, use a properly sourced Brihat Parashara Hora Shastra edition.",
      hi: "विस्तृत सूची का दावा किए बिना — पारंपरिक ग्रंथ लक्ष्मी योग, कुबेर योग और दूसरे-ग्यारहवें स्वामियों के शुभ ग्रहों के साथ विभिन्न संयोगों का उल्लेख करते हैं। मैंने यहाँ किसी लाइसेंस्ड शास्त्रीय संस्करण से सटीक श्लोक सत्यापित नहीं किए, इसलिए इन्हें प्रचलित नाम मानूँगी, आधिकारिक परिभाषा नहीं। गंभीर अध्ययन के लिए सही स्रोत वाला बृहत् पाराशर होरा शास्त्र संस्करण लें।",
      hinglish: "Exhaustive list ka claim kiye bina — traditional texts Lakshmi Yoga, Kubera Yoga, aur 2nd-11th lords ke benefics ke saath various combinations mention karte hain. Maine yahan kisi licensed classical edition se exact verses verify nahi kiye, isliye inhe commonly cited names maanungi, authoritative definitions nahi. Real study ke liye properly sourced Brihat Parashara Hora Shastra edition lein."
    },
    answer_type: "traditional_astrology",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: [],
    confidence: "uncertain",
    disclaimer: D_EN
  },
  {
    id: "wealth_property_0018",
    category: "yoga",
    subcategory: "skeptical",
    difficulty: "beginner",
    questions: {
      en: "If I have a strong Dhana Yoga, does it mean I will definitely be wealthy?",
      hi: "यदि मेरे पास मज़बूत धन योग है, तो क्या इसका मतलब है कि मैं निश्चित रूप से धनी बनूँगा/बनूँगी?",
      hinglish: "Agar mere paas strong Dhana Yoga hai, to kya iska matlab hai main definitely wealthy banunga/banungi?"
    },
    answers: {
      en: "No — and I want to be honest rather than reassuring. Traditional astrology uses Dhana Yoga as a symbolic marker; many people with such combinations are not wealthy, and many wealthy people have no such combination. Wealth is driven by income, savings, health, opportunity, luck and decisions. I would not let any yoga description override those realities.",
      hi: "नहीं — और मैं आश्वस्त करने के बजाय ईमानदार रहना चाहूँगी। पारंपरिक ज्योतिष धन योग को प्रतीकात्मक संकेत मानता है; ऐसे संयोग वाले कई लोग धनी नहीं होते, और कई धनी लोगों में ऐसा संयोग नहीं होता। धन आय, बचत, स्वास्थ्य, अवसर, भाग्य और निर्णयों से बनता है। किसी भी योग-वर्णन को इन वास्तविकताओं पर हावी न होने दूँ।",
      hinglish: "Nahi — aur main reassure karne ke bajaye honest rehna chahungi. Traditional astrology Dhana Yoga ko symbolic marker maanta hai; aise combinations wale kayi log wealthy nahi hote, aur kayi wealthy logon mein aisa combination nahi hota. Wealth income, savings, health, opportunity, luck aur decisions se banti hai. Kisi bhi yoga description ko in realities ko override karne nahi dungi."
    },
    answer_type: "traditional_astrology",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: [],
    confidence: "traditional_interpretation",
    disclaimer: D_EN
  },

  // ─────────── PLANETARY (8) ───────────
  {
    id: "wealth_property_0019",
    category: "planetary",
    subcategory: "jupiter",
    difficulty: "beginner",
    questions: {
      en: "What does Jupiter traditionally signify for wealth?",
      hi: "गुरु पारंपरिक रूप से धन के लिए क्या दर्शाता है?",
      hinglish: "Jupiter traditionally wealth ke liye kya signify karta hai?"
    },
    answers: {
      en: "In traditional interpretation, Jupiter (Guru) is associated with wisdom, expansion, good fortune and generosity. For wealth, a well-placed Jupiter is often discussed as supportive of ethical prosperity and long-term growth. I would still add — this is symbolic language, not a predictor of returns.",
      hi: "पारंपरिक व्याख्या में गुरु ज्ञान, विस्तार, सौभाग्य और उदारता से जोड़ा जाता है। धन के लिए, शुभ स्थिति में गुरु को नैतिक समृद्धि और दीर्घकालिक विकास का समर्थक माना जाता है। मैं फिर जोड़ूँगी — यह प्रतीकात्मक भाषा है, रिटर्न का पूर्वानुमान नहीं।",
      hinglish: "Traditional interpretation mein Jupiter (Guru) wisdom, expansion, good fortune aur generosity se joda jata hai. Wealth ke liye, well-placed Jupiter ko ethical prosperity aur long-term growth ka supporter mana jata hai. Main phir add karungi — yeh symbolic language hai, returns ka predictor nahi."
    },
    answer_type: "traditional_astrology",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: [],
    confidence: "traditional_interpretation",
    disclaimer: D_EN
  },
  {
    id: "wealth_property_0020",
    category: "planetary",
    subcategory: "venus",
    difficulty: "beginner",
    questions: {
      en: "What does Venus traditionally signify for money and property?",
      hi: "शुक्र पारंपरिक रूप से धन और संपत्ति के लिए क्या दर्शाता है?",
      hinglish: "Venus traditionally money aur property ke liye kya signify karta hai?"
    },
    answers: {
      en: "Traditionally, Venus is associated with luxury, beauty, comfort, vehicles and, in some readings, wealth. A well-placed Venus is often discussed in the context of comfortable living rather than guaranteed riches. As always, I would read this as symbolic — a symbol, not a promise.",
      hi: "पारंपरिक रूप से शुक्र विलासिता, सौंदर्य, सुख-सुविधा, वाहन और कुछ पठनों में धन से जोड़ा जाता है। शुभ स्थिति में शुक्र पर आरामदायक जीवन के संदर्भ में चर्चा होती है, गारंटीकृत धन नहीं। मैं इसे सदा प्रतीकात्मक रूप में पढ़ूँगी — प्रतीक, वादा नहीं।",
      hinglish: "Traditionally, Venus luxury, beauty, comfort, vehicles aur kuch readings mein wealth se joda jata hai. Well-placed Venus par comfortable living ke context mein discussion hoti hai, guaranteed riches nahi. Main ise always symbolic roop mein padhungi — symbol, promise nahi."
    },
    answer_type: "traditional_astrology",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: [],
    confidence: "traditional_interpretation",
    disclaimer: D_EN
  },
  {
    id: "wealth_property_0021",
    category: "planetary",
    subcategory: "mercury",
    difficulty: "beginner",
    questions: {
      en: "What does Mercury traditionally signify for business and wealth?",
      hi: "बुध पारंपरिक रूप से व्यापार और धन के लिए क्या दर्शाता है?",
      hinglish: "Mercury traditionally business aur wealth ke liye kya signify karta hai?"
    },
    answers: {
      en: "Mercury (Budh) is traditionally tied to intellect, communication, trade and calculation. In a wealth reading it is often discussed as supporting business thinking, negotiation and financial acumen. I would say — these are interpretive associations, and plenty of practical skill-building matters just as much.",
      hi: "बुध पारंपरिक रूप से बुद्धि, संवाद, व्यापार और गणना से जुड़ा है। धन पठन में इसे व्यावसायिक सोच, मोल-भाव और वित्तीय कौशल का समर्थक माना जाता है। मैं कहूँगी — ये व्याख्यात्मक संबंध हैं, और व्यावहारिक कौशल-निर्माण भी उतना ही मायने रखता है।",
      hinglish: "Mercury (Budh) traditionally intellect, communication, trade aur calculation se juda hai. Wealth reading mein ise business thinking, negotiation aur financial acumen ka supporter mana jata hai. Main kahungi — ye interpretive associations hain, aur practical skill-building bhi utna hi matter karti hai."
    },
    answer_type: "traditional_astrology",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: [],
    confidence: "traditional_interpretation",
    disclaimer: D_EN
  },
  {
    id: "wealth_property_0022",
    category: "planetary",
    subcategory: "saturn",
    difficulty: "beginner",
    questions: {
      en: "Does Saturn block wealth, or does it build it slowly?",
      hi: "क्या शनि धन रोकता है, या धीरे-धीरे बनाता है?",
      hinglish: "Kya Saturn wealth block karta hai, ya dheere-dheere build karta hai?"
    },
    answers: {
      en: "I would say both interpretations appear in traditional literature. Some texts describe Saturn as a planet of discipline and slow, durable gains; others associate strong Saturn with delay or restriction. Saturn is often linked with labour, patience and long-term karma. I would not read a single planet as a blocker or a blessing on its own.",
      hi: "मैं कहूँगी पारंपरिक साहित्य में दोनों व्याख्याएँ मिलती हैं। कुछ ग्रंथ शनि को अनुशासन और धीमे, टिकाऊ लाभ का ग्रह कहते हैं; अन्य मज़बूत शनि को देरी या प्रतिबंध से जोड़ते हैं। शनि अक्सर श्रम, धैर्य और दीर्घकालिक कर्म से जुड़ा है। मैं अकेले किसी ग्रह को बाधक या वरदान नहीं पढ़ूँगी।",
      hinglish: "Main kahungi traditional literature mein dono interpretations milti hain. Kuch texts Saturn ko discipline aur slow, durable gains ka planet kehte hain; others strong Saturn ko delay ya restriction se jodte hain. Saturn often labour, patience aur long-term karma se juda hai. Main akele kisi planet ko blocker ya blessing nahi padhungi."
    },
    answer_type: "traditional_astrology",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: [],
    confidence: "traditional_interpretation",
    disclaimer: D_EN
  },
  {
    id: "wealth_property_0023",
    category: "planetary",
    subcategory: "mars",
    difficulty: "beginner",
    questions: {
      en: "What does Mars traditionally signify for earning and property?",
      hi: "मंगल पारंपरिक रूप से कमाई और संपत्ति के लिए क्या दर्शाता है?",
      hinglish: "Mars traditionally earning aur property ke liye kya signify karta hai?"
    },
    answers: {
      en: "Mars is traditionally tied to energy, courage, action and, in some readings, land and real estate. It can support decisive earning but is also linked to impulsiveness. In a wealth chart, a well-integrated Mars might be discussed as initiative; an afflicted Mars might be discussed as impulsive spending. Both are traditional interpretive lenses.",
      hi: "मंगल पारंपरिक रूप से ऊर्जा, साहस, क्रिया और कुछ पठनों में भूमि और रियल एस्टेट से जुड़ा है। यह निर्णायक कमाई में सहायक हो सकता है, पर आवेग से भी जुड़ा है। धन कुंडली में सुसंगत मंगल को पहल और पीड़ित मंगल को आवेगी खर्च के रूप में देखा जा सकता है। दोनों पारंपरिक व्याख्यात्मक दृष्टियाँ हैं।",
      hinglish: "Mars traditionally energy, courage, action aur kuch readings mein land aur real estate se juda hai. Yeh decisive earning mein help kar sakta hai, par impulsiveness se bhi juda hai. Wealth chart mein well-integrated Mars ko initiative aur afflicted Mars ko impulsive spending ke roop mein dekha ja sakta hai. Dono traditional interpretive lenses hain."
    },
    answer_type: "traditional_astrology",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: [],
    confidence: "traditional_interpretation",
    disclaimer: D_EN
  },
  {
    id: "wealth_property_0024",
    category: "planetary",
    subcategory: "sun",
    difficulty: "beginner",
    questions: {
      en: "What does the Sun traditionally signify for money?",
      hi: "सूर्य पारंपरिक रूप से धन के लिए क्या दर्शाता है?",
      hinglish: "Sun traditionally money ke liye kya signify karta hai?"
    },
    answers: {
      en: "Traditionally, the Sun is associated with authority, government, father, self-confidence and leadership. In wealth readings, a strong Sun is often discussed as supporting recognition and career authority rather than direct income. These are traditional symbolic meanings — the Sun does not decide your salary.",
      hi: "पारंपरिक रूप से सूर्य अधिकार, सरकार, पिता, आत्मविश्वास और नेतृत्व से जोड़ा जाता है। धन पठन में मज़बूत सूर्य को प्रत्यक्ष आय की तुलना में पहचान और करियर अधिकार का समर्थक माना जाता है। ये पारंपरिक प्रतीकात्मक अर्थ हैं — सूर्य आपका वेतन तय नहीं करता।",
      hinglish: "Traditionally, Sun authority, government, father, self-confidence aur leadership se joda jata hai. Wealth readings mein strong Sun ko direct income se zyada recognition aur career authority ka supporter mana jata hai. Ye traditional symbolic meanings hain — Sun aapki salary decide nahi karta."
    },
    answer_type: "traditional_astrology",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: [],
    confidence: "traditional_interpretation",
    disclaimer: D_EN
  },
  {
    id: "wealth_property_0025",
    category: "planetary",
    subcategory: "moon",
    difficulty: "beginner",
    questions: {
      en: "What does the Moon traditionally signify for savings and mental peace?",
      hi: "चंद्रमा पारंपरिक रूप से बचत और मानसिक शांति के लिए क्या दर्शाता है?",
      hinglish: "Moon traditionally savings aur mental peace ke liye kya signify karta hai?"
    },
    answers: {
      en: "Traditionally, the Moon relates to mind, emotions, mother and comfort. In a wealth context, astrologers sometimes discuss emotional balance and its role in saving versus spending. I would add — emotional discipline and savings habits are practical skills you can build directly, whatever your Moon sign.",
      hi: "पारंपरिक रूप से चंद्रमा मन, भावनाओं, माता और सुख से जुड़ा है। धन संदर्भ में ज्योतिष कभी-कभी भावनात्मक संतुलन और बचत बनाम खर्च में उसकी भूमिका पर चर्चा करते हैं। मैं जोड़ूँगी — भावनात्मक अनुशासन और बचत की आदतें व्यावहारिक कौशल हैं जो आप सीधे बना सकते हैं, आपकी राशि जो भी हो।",
      hinglish: "Traditionally, Moon mind, emotions, mother aur comfort se juda hai. Wealth context mein astrologers kabhi-kabhi emotional balance aur savings versus spending mein uski role par discuss karte hain. Main add karungi — emotional discipline aur savings habits practical skills hain jo aap directly build kar sakte hain, aapki rashi jo bhi ho."
    },
    answer_type: "traditional_astrology",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: [],
    confidence: "traditional_interpretation",
    disclaimer: D_EN
  },
  {
    id: "wealth_property_0026",
    category: "planetary",
    subcategory: "rahu",
    difficulty: "intermediate",
    questions: {
      en: "What do Rahu and Ketu traditionally signify for wealth?",
      hi: "राहु और केतु पारंपरिक रूप से धन के लिए क्या दर्शाते हैं?",
      hinglish: "Rahu aur Ketu traditionally wealth ke liye kya signify karte hain?"
    },
    answers: {
      en: "In traditional readings, Rahu is associated with ambition, foreign sources, unconventional paths and material desire, sometimes with sudden gain or loss. Ketu is associated with detachment and spiritual focus. I would caution: Rahu is often used in manipulative fear-marketing (‘Rahu is blocking your wealth!’). Real financial decisions should not be based on that kind of messaging.",
      hi: "पारंपरिक पठनों में राहु महत्वाकांक्षा, विदेशी स्रोत, अपरंपरागत मार्ग और भौतिक इच्छा से, कभी-कभी अचानक लाभ या हानि से जुड़ा है। केतु वैराग्य और आध्यात्मिक केंद्र से जुड़ा है। मैं सावधान करूँगी — राहु का प्रयोग अक्सर भय-आधारित मार्केटिंग में होता है (‘राहु आपका धन रोक रहा है!’)। वास्तविक वित्तीय निर्णय ऐसी बातों पर आधारित न हों।",
      hinglish: "Traditional readings mein Rahu ambition, foreign sources, unconventional paths aur material desire se, kabhi-kabhi sudden gain ya loss se juda hai. Ketu detachment aur spiritual focus se juda hai. Main caution karungi — Rahu ka use often fear-marketing mein hota hai (‘Rahu aapka wealth block kar raha hai!’). Real financial decisions aisi baaton par based na hon."
    },
    answer_type: "traditional_astrology",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: [],
    confidence: "traditional_interpretation",
    disclaimer: D_EN
  },

  // ─────────── DASHA / TRANSIT (6) ───────────
  {
    id: "wealth_property_0027",
    category: "dasha",
    subcategory: "mahadasha",
    difficulty: "beginner",
    questions: {
      en: "What is a Mahadasha?",
      hi: "महादशा क्या है?",
      hinglish: "Mahadasha kya hai?"
    },
    answers: {
      en: "I would explain it simply — Mahadasha is a major planetary period in the Vimshottari dasha system, lasting several years. It is a traditional timing framework used to talk about phases of life. Its interpretation is symbolic and varied between schools; it is not a scheduled forecast.",
      hi: "मैं सरलता से बताऊँगी — महादशा विंशोत्तरी दशा प्रणाली में एक प्रमुख ग्रह-काल है, जो कई वर्षों तक चलता है। यह जीवन के चरणों पर चर्चा करने का पारंपरिक समय-ढाँचा है। इसकी व्याख्या प्रतीकात्मक है और संप्रदायों में भिन्न है; यह निर्धारित पूर्वानुमान नहीं है।",
      hinglish: "Main simply bataaungi — Mahadasha Vimshottari dasha system mein ek major planetary period hai, jo kayi saalon tak chalta hai. Yeh life phases ke baare mein baat karne ka traditional timing framework hai. Iski interpretation symbolic hai aur schools mein vary karti hai; yeh scheduled forecast nahi hai."
    },
    answer_type: "traditional_astrology",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: [],
    confidence: "traditional_interpretation",
    disclaimer: D_EN
  },
  {
    id: "wealth_property_0028",
    category: "dasha",
    subcategory: "antardasha",
    difficulty: "intermediate",
    questions: {
      en: "What is an Antardasha?",
      hi: "अंतर्दशा क्या है?",
      hinglish: "Antardasha kya hai?"
    },
    answers: {
      en: "Within each Mahadasha, traditional Vimshottari system has sub-periods called Antardashas, each ruled by another planet. Together they form a layered timing framework. I would gently note that layered sub-periods can be interpreted in many different ways, which is why two astrologers may reach different conclusions from the same chart.",
      hi: "प्रत्येक महादशा के भीतर, पारंपरिक विंशोत्तरी प्रणाली में अंतर्दशाएँ होती हैं, जिनमें से प्रत्येक का स्वामी दूसरा ग्रह होता है। मिलकर वे एक स्तरित समय-ढाँचा बनाते हैं। मैं प्यार से कहूँगी कि स्तरित उप-कालों की व्याख्या कई तरह से हो सकती है, इसलिए दो ज्योतिष एक ही कुंडली से भिन्न निष्कर्ष पर पहुँच सकते हैं।",
      hinglish: "Har Mahadasha ke andar, traditional Vimshottari system mein Antardashas hote hain, har ek ka ruler doosra planet. Milkar ye ek layered timing framework banate hain. Main pyaar se kahungi ki layered sub-periods ko kayi tarah se interpret kiya ja sakta hai, isliye do astrologers same chart se alag conclusions par pahunch sakte hain."
    },
    answer_type: "traditional_astrology",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: [],
    confidence: "traditional_interpretation",
    disclaimer: D_EN
  },
  {
    id: "wealth_property_0029",
    category: "dasha",
    subcategory: "personal_chart",
    difficulty: "beginner",
    questions: {
      en: "Which Mahadasha am I currently in?",
      hi: "मैं अभी किस महादशा में हूँ?",
      hinglish: "Main abhi kis Mahadasha mein hoon?"
    },
    answers: {
      en: "I would need your real birth details for this — exact date, time and place. A dasha is calculated from your Moon’s position at birth, and I will not guess it. Once you share the details and a verified chart is calculated, I can show you the traditional dasha timeline. It is a symbolic framework, not a schedule of life events.",
      hi: "इसके लिए मुझे आपका असली जन्म विवरण चाहिए — सटीक तिथि, समय और स्थान। दशा जन्म के समय चंद्रमा की स्थिति से गणना होती है, और मैं इसे अनुमान से नहीं बताऊँगी। विवरण साझा करने और सत्यापित कुंडली की गणना के बाद मैं पारंपरिक दशा-क्रम दिखा सकती हूँ। यह प्रतीकात्मक ढाँचा है, जीवन-घटनाओं की अनुसूची नहीं।",
      hinglish: "Iske liye mujhe aapka real birth details chahiye — exact date, time aur place. Dasha aapke Moon ki position se calculate hoti hai, aur main ise guess nahi karungi. Details share karne aur verified chart calculate hone ke baad main traditional dasha timeline dikha sakti hoon. Yeh symbolic framework hai, life events ka schedule nahi."
    },
    answer_type: "traditional_astrology",
    requires_personal_chart: true,
    requires_calculation: true,
    source_ids: [],
    confidence: "traditional_interpretation",
    disclaimer: D_EN
  },
  {
    id: "wealth_property_0030",
    category: "transit",
    subcategory: "jupiter",
    difficulty: "intermediate",
    questions: {
      en: "How is Jupiter’s transit traditionally read for wealth?",
      hi: "गुरु का गोचर पारंपरिक रूप से धन के लिए कैसे पढ़ा जाता है?",
      hinglish: "Jupiter ka transit traditionally wealth ke liye kaise padha jata hai?"
    },
    answers: {
      en: "Traditional transit readings look at where Jupiter is moving relative to the Moon sign and key houses. Jupiter is generally considered a benefic, so some readings associate its transits with growth, opportunity or optimism. I want to be honest — a general Jupiter transit is not a guarantee of income, and the specific effect is always chart-dependent.",
      hi: "पारंपरिक गोचर पठन देखते हैं कि गुरु चंद्र राशि और प्रमुख भावों के सापेक्ष कहाँ जा रहा है। गुरु आमतौर पर शुभ माना जाता है, इसलिए कुछ पठन उसके गोचर को वृद्धि, अवसर या आशावाद से जोड़ते हैं। मैं ईमानदारी से कहूँगी — सामान्य गुरु गोचर आय की गारंटी नहीं, और विशिष्ट प्रभाव सदा कुंडली पर निर्भर है।",
      hinglish: "Traditional transit readings dekhti hain ki Jupiter Moon sign aur key houses ke relative kahan move kar raha hai. Jupiter generally benefic mana jata hai, isliye kuch readings uske transits ko growth, opportunity ya optimism se jodti hain. Main honestly kahungi — general Jupiter transit income ki guarantee nahi, aur specific effect always chart-dependent hai."
    },
    answer_type: "traditional_astrology",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: [],
    confidence: "traditional_interpretation",
    disclaimer: D_EN
  },
  {
    id: "wealth_property_0031",
    category: "transit",
    subcategory: "saturn",
    difficulty: "intermediate",
    questions: {
      en: "Is Saturn’s transit bad for money?",
      hi: "क्या शनि का गोचर धन के लिए अशुभ है?",
      hinglish: "Kya Saturn ka transit money ke liye bad hai?"
    },
    answers: {
      en: "I would say — not automatically. Traditional readings vary: some describe Saturn transits as a time of discipline, consolidation and delayed reward; others focus on restriction or fear. Saturn is often used in fear-based marketing, and I would gently encourage you to be cautious of anyone predicting doom from a transit. In practice, a Saturn period can be a very good time to build systems and save.",
      hi: "मैं कहूँगी — स्वतः नहीं। पारंपरिक पठन भिन्न हैं: कुछ शनि गोचर को अनुशासन, सुदृढ़ीकरण और विलंबित प्रतिफल का समय कहते हैं; अन्य प्रतिबंध या भय पर केंद्रित हैं। शनि का प्रयोग अक्सर भय-आधारित मार्केटिंग में होता है, और मैं प्यार से सावधानी बरतने की सलाह दूँगी — किसी गोचर से विनाश की भविष्यवाणी करने वालों से। व्यवहार में, शनि काल प्रणालियाँ बनाने और बचत के लिए बहुत अच्छा समय हो सकता है।",
      hinglish: "Main kahungi — automatically nahi. Traditional readings vary karti hain: kuch Saturn transits ko discipline, consolidation aur delayed reward ka time kehte hain; others restriction ya fear par focus karte hain. Saturn ka use often fear-marketing mein hota hai, aur main pyaar se cautious rehne ki salah dungi — kisi transit se doom predict karne walon se. In practice, Saturn period systems banane aur saving ke liye bahut achha time ho sakta hai."
    },
    answer_type: "traditional_astrology",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: [],
    confidence: "traditional_interpretation",
    disclaimer: D_EN
  },
  {
    id: "wealth_property_0032",
    category: "transit",
    subcategory: "personal_chart",
    difficulty: "intermediate",
    questions: {
      en: "Will my financial situation improve in the next dasha?",
      hi: "क्या अगली दशा में मेरी वित्तीय स्थिति बेहतर होगी?",
      hinglish: "Kya next dasha mein meri financial situation better hogi?"
    },
    answers: {
      en: "I want to be truthful — I cannot answer this without a real chart. A dasha-based reading needs verified birth date, birth time, birthplace, and a calculated dasha timeline. Even then, it will be a traditional interpretation, not a financial forecast. What I can offer: whatever the dasha, savings discipline, debt repayment and income skills are yours to build.",
      hi: "मैं सच कहना चाहूँगी — असली कुंडली के बिना यह उत्तर नहीं दे सकती। दशा-आधारित पठन के लिए सत्यापित जन्म तिथि, समय, स्थान और गणना किया गया दशा-क्रम चाहिए। तब भी यह पारंपरिक व्याख्या होगी, वित्तीय पूर्वानुमान नहीं। मैं जो दे सकती हूँ: दशा जो भी हो, बचत-अनुशासन, कर्ज़-चुकाना और आय-कौशल आपके हाथ में हैं।",
      hinglish: "Main sach kehna chahungi — real chart ke bina yeh answer nahi de sakti. Dasha-based reading ke liye verified birth date, time, place aur calculated dasha timeline chahiye. Tab bhi yeh traditional interpretation hogi, financial forecast nahi. Jo main de sakti hoon: dasha jo bhi ho, savings discipline, debt repayment aur income skills aapke haath mein hain."
    },
    answer_type: "traditional_astrology",
    requires_personal_chart: true,
    requires_calculation: true,
    source_ids: [],
    confidence: "uncertain",
    disclaimer: D_EN
  },

  // ─────────── PROPERTY (10) ───────────
  {
    id: "wealth_property_0033",
    category: "property",
    subcategory: "fourth_house",
    difficulty: "beginner",
    questions: {
      en: "What does the fourth house traditionally represent for property?",
      hi: "संपत्ति के लिए चौथा भाव पारंपरिक रूप से क्या दर्शाता है?",
      hinglish: "Property ke liye fourth house traditionally kya represent karta hai?"
    },
    answers: {
      en: "In traditional Vedic astrology, the fourth house (Sukha Bhava) is associated with home, land, vehicles, domestic happiness and the mother. For property questions, astrologers typically examine the fourth house, its lord and any planets placed there or aspecting it. This is an interpretive frame — not a promise of ownership.",
      hi: "पारंपरिक वैदिक ज्योतिष में चौथा भाव (सुख भाव) घर, भूमि, वाहन, घरेलू सुख और माता से जोड़ा जाता है। संपत्ति संबंधी प्रश्नों में ज्योतिष आमतौर पर चौथा भाव, उसके स्वामी और वहाँ स्थित या दृष्टि डालने वाले ग्रहों को देखते हैं। यह व्याख्यात्मक ढाँचा है — स्वामित्व का वादा नहीं।",
      hinglish: "Traditional Vedic astrology mein fourth house (Sukha Bhava) home, land, vehicles, domestic happiness aur mother se joda jata hai. Property questions mein astrologers usually fourth house, uske lord aur wahan placed ya aspect karne wale planets dekhte hain. Yeh interpretive frame hai — ownership ka promise nahi."
    },
    answer_type: "traditional_astrology",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: [],
    confidence: "traditional_interpretation",
    disclaimer: D_EN
  },
  {
    id: "wealth_property_0034",
    category: "property",
    subcategory: "personal_chart",
    difficulty: "beginner",
    questions: {
      en: "When will I buy a house?",
      hi: "मैं घर कब खरीदूँगा/खरीदूँगी?",
      hinglish: "Main ghar kab khareedunga/khareedungi?"
    },
    answers: {
      en: "I will not invent a purchase date — that would not be honest. Traditional astrology can offer a symbolic reading of the fourth house and dashas, but it cannot reliably predict when you will buy a house. If you would like me to look at your chart, please share your exact birth date, time and place, and we can do a real calculation. In parallel, practical readiness — savings, credit and legal verification — matters more than any date.",
      hi: "मैं खरीद की तारीख नहीं गढ़ूँगी — यह ईमानदार नहीं होगा। पारंपरिक ज्योतिष चौथे भाव और दशाओं का प्रतीकात्मक पठन दे सकता है, पर विश्वसनीय रूप से यह पूर्वानुमान नहीं लगा सकता कि आप घर कब खरीदेंगे। कुंडली देखनी है तो सटीक जन्म तिथि, समय और स्थान साझा करें, हम असली गणना करेंगे। साथ ही, व्यावहारिक तैयारी — बचत, क्रेडिट और कानूनी सत्यापन — किसी भी तारीख से अधिक मायने रखती है।",
      hinglish: "Main purchase date invent nahi karungi — yeh honest nahi hoga. Traditional astrology fourth house aur dashas ki symbolic reading de sakta hai, par reliably predict nahi kar sakta ki aap ghar kab kharidenge. Chart dekhna ho to exact birth date, time aur place share karein, hum real calculation karenge. Saath hi, practical readiness — savings, credit aur legal verification — kisi bhi date se zyada matter karti hai."
    },
    answer_type: "traditional_astrology",
    requires_personal_chart: true,
    requires_calculation: true,
    source_ids: [],
    confidence: "uncertain",
    disclaimer: D_EN
  },
  {
    id: "wealth_property_0035",
    category: "property",
    subcategory: "inheritance",
    difficulty: "beginner",
    questions: {
      en: "Does the eighth house indicate inherited property?",
      hi: "क्या आठवाँ भाव पैतृक संपत्ति दर्शाता है?",
      hinglish: "Kya eighth house inherited property indicate karta hai?"
    },
    answers: {
      en: "Traditionally, yes — the eighth house is associated with inheritance, wills, joint assets and matters received from others. Some classical texts discuss it alongside the fourth for inherited land or property. I would still frame it as a symbolic association, not a prediction that you will or will not inherit. Actual inheritance depends on family, law and circumstances.",
      hi: "पारंपरिक रूप से हाँ — आठवाँ भाव विरासत, वसीयत, संयुक्त संपत्ति और दूसरों से प्राप्त मामलों से जुड़ा है। कुछ शास्त्र इसे पैतृक भूमि या संपत्ति के लिए चौथे के साथ देखते हैं। मैं इसे प्रतीकात्मक संबंध मानूँगी, यह पूर्वानुमान नहीं कि आपको विरासत मिलेगी या नहीं। वास्तविक विरासत परिवार, कानून और परिस्थितियों पर निर्भर है।",
      hinglish: "Traditionally haan — eighth house inheritance, wills, joint assets aur doosron se received matters se juda hai. Kuch texts ise ancestral land ya property ke liye fourth ke saath dekhte hain. Main ise symbolic association maanungi, prediction nahi ki aapko inheritance milegi ya nahi. Actual inheritance family, law aur circumstances par depend karti hai."
    },
    answer_type: "traditional_astrology",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: [],
    confidence: "traditional_interpretation",
    disclaimer: D_EN
  },
  {
    id: "wealth_property_0036",
    category: "property",
    subcategory: "joint_ownership",
    difficulty: "intermediate",
    questions: {
      en: "Which house shows joint property ownership?",
      hi: "कौन सा भाव संयुक्त संपत्ति स्वामित्व दर्शाता है?",
      hinglish: "Kaun sa house joint property ownership show karta hai?"
    },
    answers: {
      en: "In traditional readings, joint assets and shared ownership are often associated with the eighth house, with the third and eleventh sometimes added for agreements and gains. I would say — if you are considering joint property, the legally verified documents and clarity of shares matter far more than any chart placement. Please consult a property lawyer.",
      hi: "पारंपरिक पठनों में संयुक्त संपत्ति और साझा स्वामित्व अक्सर आठवें भाव से जोड़े जाते हैं, कभी-कभी सहमति और लाभ के लिए तीसरा और ग्यारहवाँ जोड़े जाते हैं। मैं कहूँगी — यदि आप संयुक्त संपत्ति पर विचार कर रहे हैं, तो कानूनी रूप से सत्यापित दस्तावेज़ और स्पष्ट हिस्से किसी भी ग्रह-स्थिति से कहीं अधिक मायने रखते हैं। संपत्ति वकील से परामर्श करें।",
      hinglish: "Traditional readings mein joint assets aur shared ownership often eighth house se jode jate hain, kabhi-kabhi agreement aur gains ke liye third aur eleventh add hote hain. Main kahungi — agar aap joint property consider kar rahe hain, to legally verified documents aur clear shares kisi bhi planetary placement se kaafi zyada matter karte hain. Property lawyer se consult karein."
    },
    answer_type: "property_legal_information",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: [],
    confidence: "general_education",
    disclaimer: D_EN
  },
  {
    id: "wealth_property_0037",
    category: "property",
    subcategory: "timing",
    difficulty: "intermediate",
    questions: {
      en: "Which planets are traditionally associated with property timing?",
      hi: "पारंपरिक रूप से संपत्ति के समय से कौन से ग्रह जुड़े हैं?",
      hinglish: "Traditionally property timing se kaun se planets jude hain?"
    },
    answers: {
      en: "Traditional texts often mention the fourth house lord, its dispositor and dashas of the fourth, second and eleventh lords as potentially relevant for property matters. Some readings also look at transits of Jupiter or Saturn over the fourth house. These are interpretive frameworks — I would not use any of them as a scheduling tool for a real purchase.",
      hi: "पारंपरिक ग्रंथ अक्सर चौथे भाव के स्वामी, उसके स्थान-स्वामी और चौथे, दूसरे, ग्यारहवें स्वामियों की दशाओं को संपत्ति मामलों के लिए प्रासंगिक बताते हैं। कुछ पठन चौथे भाव पर गुरु या शनि के गोचर भी देखते हैं। ये व्याख्यात्मक ढाँचे हैं — मैं इनमें से किसी को भी असली खरीद की तिथि तय करने का उपकरण नहीं बनाऊँगी।",
      hinglish: "Traditional texts often fourth house lord, uske dispositor aur fourth, second, eleventh lords ki dashas ko property matters ke liye relevant batate hain. Kuch readings fourth house par Jupiter ya Saturn ke transits bhi dekhti hain. Ye interpretive frameworks hain — main inme se kisi ko bhi real purchase ki date tay karne ka tool nahi banaungi."
    },
    answer_type: "traditional_astrology",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: [],
    confidence: "traditional_interpretation",
    disclaimer: D_EN
  },
  {
    id: "wealth_property_0038",
    category: "property",
    subcategory: "afflicted_fourth",
    difficulty: "advanced",
    questions: {
      en: "What if the fourth house is afflicted — does that mean I will lose my home?",
      hi: "यदि चौथा भाव पीड़ित है — क्या इसका अर्थ है कि मैं अपना घर खो दूँगा/दूँगी?",
      hinglish: "Agar fourth house afflicted hai — kya iska matlab hai main apna ghar kho dunga/dungi?"
    },
    answers: {
      en: "I want to reassure you gently — an afflicted fourth house in traditional interpretation can be read as challenges around home, mother or emotional security, but not as a prediction of losing your home. That kind of doom reading is common in fear-marketing and I would not endorse it. Your home safety depends on loan servicing, insurance, legal title and family circumstances.",
      hi: "मैं प्यार से आश्वस्त करना चाहूँगी — पारंपरिक व्याख्या में पीड़ित चौथा भाव घर, माता या भावनात्मक सुरक्षा के आसपास चुनौतियों के रूप में पढ़ा जा सकता है, पर घर खोने का पूर्वानुमान नहीं। इस तरह का भय-पठन भय-मार्केटिंग में आम है और मैं इसका समर्थन नहीं करूँगी। घर की सुरक्षा ऋण-भुगतान, बीमा, कानूनी स्वामित्व और पारिवारिक परिस्थितियों पर निर्भर है।",
      hinglish: "Main pyaar se reassure karna chahungi — traditional interpretation mein afflicted fourth house home, mother ya emotional security ke around challenges ke roop mein padha ja sakta hai, par ghar khone ka prediction nahi. Aisa doom reading fear-marketing mein common hai aur main iska support nahi karungi. Ghar ki safety loan servicing, insurance, legal title aur family circumstances par depend karti hai."
    },
    answer_type: "traditional_astrology",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: [],
    confidence: "traditional_interpretation",
    disclaimer: D_EN
  },
  {
    id: "wealth_property_0039",
    category: "property",
    subcategory: "land_vs_flat",
    difficulty: "beginner",
    questions: {
      en: "Is buying land astrologically different from buying a flat?",
      hi: "क्या भूमि खरीदना ज्योतिषीय रूप से फ्लैट खरीदने से भिन्न है?",
      hinglish: "Kya land kharidna astrologically flat kharidne se different hai?"
    },
    answers: {
      en: "Traditional astrology does not usually draw a sharp distinction between land and a flat — both are studied through the fourth house and its associations. What does differ greatly is the legal and financial due diligence: land title verification, encumbrance, mutation and zoning are critical, whereas a flat involves builder RERA registration, OC and society documents. My practical suggestion — check the relevant official state portal and consult a property lawyer regardless of chart placement.",
      hi: "पारंपरिक ज्योतिष आमतौर पर भूमि और फ्लैट में तीव्र भेद नहीं करता — दोनों चौथे भाव से संबंधित होकर पढ़े जाते हैं। जो बहुत भिन्न है वह कानूनी और वित्तीय ड्यू डिलिजेंस है: भूमि के लिए टाइटल सत्यापन, भार-मुक्ति, नामांतरण और ज़ोनिंग महत्वपूर्ण हैं, जबकि फ्लैट में बिल्डर आरईआरए पंजीकरण, ओसी और सोसाइटी दस्तावेज़ शामिल हैं। मेरा व्यावहारिक सुझाव — चाहे कुंडली कुछ भी हो, संबंधित आधिकारिक राज्य पोर्टल देखें और संपत्ति वकील से परामर्श करें।",
      hinglish: "Traditional astrology usually land aur flat mein sharp distinction nahi karta — dono fourth house se related hokar padhe jate hain. Jo bahut different hai woh legal aur financial due diligence hai: land ke liye title verification, encumbrance, mutation aur zoning critical hain, jabki flat mein builder RERA registration, OC aur society documents involve hote hain. Meri practical suggestion — chahe chart kuch bhi ho, relevant official state portal check karein aur property lawyer se consult karein."
    },
    answer_type: "property_legal_information",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: ["mahabhumi_portal"],
    confidence: "source_supported",
    disclaimer: D_EN
  },
  {
    id: "wealth_property_0040",
    category: "property",
    subcategory: "abroad",
    difficulty: "intermediate",
    questions: {
      en: "Which house is traditionally associated with property abroad?",
      hi: "विदेश में संपत्ति पारंपरिक रूप से किस भाव से जुड़ी है?",
      hinglish: "Abroad property traditionally kis house se judi hai?"
    },
    answers: {
      en: "In traditional interpretation, foreign matters are usually associated with the ninth and twelfth houses, with the ninth covering long-distance and the twelfth covering distant places and expenses. Property specifically abroad might be read through the fourth combined with those. I would still caution — these are symbolic associations, and cross-border property involves complex law and tax beyond any chart reading.",
      hi: "पारंपरिक व्याख्या में विदेशी मामले आमतौर पर नौवें और बारहवें भाव से जुड़े होते हैं, नौवाँ दूरस्थ और बारहवाँ दूरस्थ स्थान और खर्च। विशेष रूप से विदेश में संपत्ति को चौथे के साथ इनके संयोजन से पढ़ा जा सकता है। मैं सावधान करूँगी — ये प्रतीकात्मक संबंध हैं, और सीमा-पार संपत्ति में जटिल कानून और कर शामिल हैं, किसी भी कुंडली पठन से परे।",
      hinglish: "Traditional interpretation mein foreign matters usually ninth aur twelfth houses se jude hote hain, ninth long-distance aur twelfth distant places aur expenses. Specifically abroad property fourth ke saath inke combination se padhi ja sakti hai. Main caution karungi — ye symbolic associations hain, aur cross-border property mein complex law aur tax involved hote hain, kisi bhi chart reading se beyond."
    },
    answer_type: "traditional_astrology",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: [],
    confidence: "traditional_interpretation",
    disclaimer: D_EN
  },
  {
    id: "wealth_property_0041",
    category: "property",
    subcategory: "documents",
    difficulty: "beginner",
    questions: {
      en: "Which property documents should I check before buying?",
      hi: "खरीदने से पहले कौन से संपत्ति दस्तावेज़ जाँचने चाहिए?",
      hinglish: "Kharidne se pehle kaun se property documents check karne chahiye?"
    },
    answers: {
      en: "My practical checklist — title deed, latest land record extract (like 7/12 or khata), mutation entries, encumbrance certificate, approved building plan where applicable, tax receipts, seller’s identity and authority, and any prior mortgage release. In Maharashtra, the MahaBhumi portal provides digitally signed land records. Requirements vary by state; please consult a property lawyer and verify on the official state portal.",
      hi: "मेरी व्यावहारिक जाँच सूची — टाइटल डीड, नवीनतम भू-अभिलेख (जैसे 7/12 या खाता), नामांतरण प्रविष्टियाँ, भार-मुक्ति प्रमाणपत्र, जहाँ लागू हो स्वीकृत भवन योजना, कर रसीदें, विक्रेता की पहचान व अधिकार, और पूर्व बंधक-मुक्ति। महाराष्ट्र में महाभूमि पोर्टल डिजिटल हस्ताक्षरित भू-अभिलेख देता है। आवश्यकताएँ राज्य से भिन्न होती हैं; कृपया संपत्ति वकील से परामर्श करें और आधिकारिक राज्य पोर्टल पर सत्यापित करें।",
      hinglish: "Meri practical checklist — title deed, latest land record extract (jaise 7/12 ya khata), mutation entries, encumbrance certificate, approved building plan jahan applicable ho, tax receipts, seller ki identity aur authority, aur koi prior mortgage release. Maharashtra mein MahaBhumi portal digitally signed land records deta hai. Requirements state se vary karti hain; please property lawyer se consult karein aur official state portal par verify karein."
    },
    answer_type: "property_legal_information",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: ["mahabhumi_portal", "igr_maharashtra"],
    confidence: "source_supported",
    disclaimer: D_EN
  },
  {
    id: "wealth_property_0042",
    category: "property",
    subcategory: "encumbrance",
    difficulty: "intermediate",
    questions: {
      en: "What is an encumbrance certificate and why does it matter?",
      hi: "भार-मुक्ति प्रमाणपत्र क्या है और क्यों महत्वपूर्ण है?",
      hinglish: "Encumbrance certificate kya hai aur kyun important hai?"
    },
    answers: {
      en: "An encumbrance certificate is a record showing transactions and registered charges against a property over a specified period. I would flag it as an important part of due diligence — it can reveal an existing mortgage, lien or prior sale. It does not, by itself, guarantee a clear title, so a lawyer’s review is still necessary. Availability and format vary by state.",
      hi: "भार-मुक्ति प्रमाणपत्र एक रिकॉर्ड है जो एक निर्दिष्ट अवधि में संपत्ति के विरुद्ध लेन-देन और पंजीकृत भार दर्शाता है। मैं इसे ड्यू डिलिजेंस का महत्वपूर्ण भाग बताऊँगी — यह मौजूदा बंधक, ग्रहणाधिकार या पूर्व बिक्री प्रकट कर सकता है। यह अकेला स्वच्छ टाइटल की गारंटी नहीं देता, इसलिए वकील की समीक्षा अभी भी आवश्यक है। उपलब्धता और प्रारूप राज्य से भिन्न हैं।",
      hinglish: "Encumbrance certificate ek record hai jo specified period mein property ke against transactions aur registered charges dikhata hai. Main ise due diligence ka important part bataaungi — yeh existing mortgage, lien ya prior sale reveal kar sakta hai. Yeh akela clear title ki guarantee nahi deta, isliye lawyer ki review abhi bhi zaroori hai. Availability aur format state se vary karte hain."
    },
    answer_type: "property_legal_information",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: [],
    confidence: "general_education",
    disclaimer: D_EN
  },

  // ─────────── VEHICLE (3) ───────────
  {
    id: "wealth_property_0043",
    category: "vehicle",
    subcategory: "fourth_house",
    difficulty: "beginner",
    questions: {
      en: "Which house is traditionally linked with vehicles?",
      hi: "पारंपरिक रूप से वाहन किस भाव से जुड़े हैं?",
      hinglish: "Traditionally vehicles kis house se linked hain?"
    },
    answers: {
      en: "In traditional interpretation, vehicles are usually associated with the fourth house (Sukha Bhava), which covers comforts and conveyances, and sometimes with Venus and the eleventh house for gains. These are symbolic categories — a chart does not guarantee you will own a car.",
      hi: "पारंपरिक व्याख्या में वाहन आमतौर पर चौथे भाव (सुख भाव) से जुड़े हैं, जो सुख-सुविधा और वाहन को कवर करता है, और कभी-कभी शुक्र तथा लाभ के लिए ग्यारहवें भाव से। ये प्रतीकात्मक श्रेणियाँ हैं — कुंडली कार स्वामित्व की गारंटी नहीं देती।",
      hinglish: "Traditional interpretation mein vehicles usually fourth house (Sukha Bhava) se jude hain, jo comforts aur conveyances cover karta hai, aur kabhi-kabhi Venus aur gains ke liye eleventh house se. Ye symbolic categories hain — chart car ownership ki guarantee nahi deta."
    },
    answer_type: "traditional_astrology",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: [],
    confidence: "traditional_interpretation",
    disclaimer: D_EN
  },
  {
    id: "wealth_property_0044",
    category: "vehicle",
    subcategory: "personal_chart",
    difficulty: "beginner",
    questions: {
      en: "When will I buy a vehicle?",
      hi: "मैं वाहन कब खरीदूँगा/खरीदूँगी?",
      hinglish: "Main vehicle kab khareedunga/khareedungi?"
    },
    answers: {
      en: "I would not predict a date from astrology — it would not be honest to do so. A traditional reading could look at the fourth house and its dashas, but it is interpretive. For a chart-based discussion, please share exact birth date, time and place. Practically, vehicle purchase depends on savings, loan eligibility and need — those are the factors worth planning around.",
      hi: "मैं ज्योतिष से तारीख नहीं बताऊँगी — ऐसा करना ईमानदारी नहीं होगी। पारंपरिक पठन चौथे भाव और उसकी दशाओं को देख सकता है, पर वह व्याख्या है। कुंडली-आधारित चर्चा के लिए सटीक जन्म तिथि, समय और स्थान साझा करें। व्यवहार में, वाहन खरीद बचत, ऋण-पात्रता और आवश्यकता पर निर्भर है — इन्हीं कारकों पर योजना बनाएँ।",
      hinglish: "Main astrology se date nahi bataaungi — aisa karna honest nahi hoga. Traditional reading fourth house aur uski dashas dekh sakti hai, par woh interpretation hai. Chart-based discussion ke liye exact birth date, time aur place share karein. Practically, vehicle purchase savings, loan eligibility aur need par depend karti hai — inhi factors par plan banayein."
    },
    answer_type: "traditional_astrology",
    requires_personal_chart: true,
    requires_calculation: true,
    source_ids: [],
    confidence: "uncertain",
    disclaimer: D_EN
  },
  {
    id: "wealth_property_0045",
    category: "vehicle",
    subcategory: "affordability",
    difficulty: "beginner",
    questions: {
      en: "How much car can I afford?",
      hi: "मैं कितनी महंगी कार ले सकता/सकती हूँ?",
      hinglish: "Main kitni mehngi car le sakta/sakti hoon?"
    },
    answers: {
      en: "My practical advice — consider the total cost, not just the EMI: down payment, monthly instalment, insurance, fuel, maintenance and parking. Keep those within a conservative share of stable monthly income, and preserve an emergency fund. A car is generally a depreciating asset, so affordability should be judged on cash flow. SEBI investor-education material emphasises budgeting and preparing for emergencies.",
      hi: "मेरी व्यावहारिक सलाह — केवल ईएमआई नहीं, कुल लागत देखें: डाउन पेमेंट, मासिक किस्त, बीमा, ईंधन, रखरखाव और पार्किंग। इन्हें स्थिर मासिक आय के रूढ़िवादी हिस्से में रखें, और आपातकालीन निधि बनाए रखें। कार आमतौर पर मूल्यह्रास वाली संपत्ति है, इसलिए सामर्थ्य नकदी प्रवाह पर आँकनी चाहिए। सेबी निवेश-शिक्षा सामग्री बजट और आपातकाल की तैयारी पर जोर देती है।",
      hinglish: "Meri practical salah — sirf EMI nahi, total cost dekhein: down payment, monthly instalment, insurance, fuel, maintenance aur parking. Inhe stable monthly income ke conservative share mein rakhein, aur emergency fund preserve karein. Car generally depreciating asset hai, isliye affordability cash flow par judge karni chahiye. SEBI investor-education material budgeting aur emergencies ki preparation par emphasis karti hai."
    },
    answer_type: "financial_education",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: ["sebi_homemaker_pdf"],
    confidence: "source_supported",
    disclaimer: D_EN
  },

  // ─────────── CAREER / INCOME (8) ───────────
  {
    id: "wealth_property_0046",
    category: "career",
    subcategory: "tenth_house",
    difficulty: "beginner",
    questions: {
      en: "What does the tenth house traditionally indicate about profession?",
      hi: "दसवाँ भाव पारंपरिक रूप से पेशे के बारे में क्या दर्शाता है?",
      hinglish: "Tenth house traditionally profession ke baare mein kya indicate karta hai?"
    },
    answers: {
      en: "In my traditional understanding, the tenth house (Karma Bhava) is associated with career, public role, authority and professional activity. Earning capacity is usually studied together with the second and eleventh houses. This is an interpretive framework — not a guaranteed career forecast. Practical career planning uses skills, market conditions and effort.",
      hi: "मेरी पारंपरिक समझ में दसवाँ भाव (कर्म भाव) करियर, सार्वजनिक भूमिका, अधिकार और व्यावसायिक गतिविधि से जोड़ा जाता है। कमाई की क्षमता सामान्यतः दूसरे और ग्यारहवें भाव के साथ पढ़ी जाती है। यह व्याख्यात्मक ढाँचा है — गारंटीकृत करियर पूर्वानुमान नहीं। व्यावहारिक करियर योजना कौशल, बाजार स्थितियों और प्रयास पर आधारित है।",
      hinglish: "Meri traditional samajh mein tenth house (Karma Bhava) career, public role, authority aur professional activity se joda jata hai. Earning capacity usually second aur eleventh houses ke saath study ki jati hai. Yeh interpretive framework hai — guaranteed career forecast nahi. Practical career planning skills, market conditions aur effort par based hai."
    },
    answer_type: "traditional_astrology",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: [],
    confidence: "traditional_interpretation",
    disclaimer: D_EN
  },
  {
    id: "wealth_property_0047",
    category: "career",
    subcategory: "business_vs_salary",
    difficulty: "intermediate",
    questions: {
      en: "Does my chart show business or salary income?",
      hi: "क्या मेरी कुंडली व्यवसाय या वेतन आय दर्शाती है?",
      hinglish: "Kya meri kundli business ya salary income show karti hai?"
    },
    answers: {
      en: "I cannot say without a real chart. Traditional readings examine the tenth house, its lord, the second and eleventh houses, and combinations associated with self-employment or service. Even then, the output is interpretive — no chart reliably determines whether you will earn from business or salary. Practical decisions should weigh skills, capital, risk tolerance and market conditions.",
      hi: "असली कुंडली के बिना मैं नहीं कह सकती। पारंपरिक पठन दसवें भाव, उसके स्वामी, दूसरे और ग्यारहवें भाव, और स्वरोजगार या नौकरी से जुड़े संयोगों को देखते हैं। तब भी परिणाम व्याख्यात्मक है — कोई कुंडली विश्वसनीय रूप से यह तय नहीं करती कि आप व्यवसाय या वेतन से कमाएँगे। व्यावहारिक निर्णयों में कौशल, पूँजी, जोखिम सहनशीलता और बाजार स्थितियाँ तौलें।",
      hinglish: "Real chart ke bina main nahi keh sakti. Traditional readings tenth house, uske lord, second aur eleventh houses, aur self-employment ya service se jude combinations dekhti hain. Tab bhi output interpretive hai — koi chart reliably determine nahi karta ki aap business ya salary se earn karenge. Practical decisions mein skills, capital, risk tolerance aur market conditions weigh karein."
    },
    answer_type: "traditional_astrology",
    requires_personal_chart: true,
    requires_calculation: true,
    source_ids: [],
    confidence: "uncertain",
    disclaimer: D_EN
  },
  {
    id: "wealth_property_0048",
    category: "career",
    subcategory: "multiple_income",
    difficulty: "intermediate",
    questions: {
      en: "Which houses are traditionally associated with multiple income sources?",
      hi: "पारंपरिक रूप से एकाधिक आय स्रोत किन भावों से जुड़े हैं?",
      hinglish: "Traditionally multiple income sources kin houses se jude hain?"
    },
    answers: {
      en: "Traditionally, the third and eleventh houses are sometimes associated with secondary income and gains from networks, while the second and tenth cover primary earnings. Some readings also look at the sixth house for service-based side work. These are interpretive associations — building actual multiple incomes is a practical activity involving skills, time and risk management.",
      hi: "पारंपरिक रूप से तीसरा और ग्यारहवाँ भाव कभी-कभी द्वितीयक आय और नेटवर्क से लाभ से जोड़े जाते हैं, जबकि दूसरा और दसवाँ प्राथमिक कमाई को कवर करते हैं। कुछ पठन सेवा-आधारित साइड काम के लिए छठे भाव को भी देखते हैं। ये व्याख्यात्मक संबंध हैं — वास्तविक बहु-आय बनाना कौशल, समय और जोखिम-प्रबंधन वाली व्यावहारिक गतिविधि है।",
      hinglish: "Traditionally, third aur eleventh houses kabhi-kabhi secondary income aur networks se gains se jode jate hain, jabki second aur tenth primary earnings cover karte hain. Kuch readings service-based side work ke liye sixth house bhi dekhti hain. Ye interpretive associations hain — actual multiple incomes banana skills, time aur risk management wali practical activity hai."
    },
    answer_type: "traditional_astrology",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: [],
    confidence: "traditional_interpretation",
    disclaimer: D_EN
  },
  {
    id: "wealth_property_0049",
    category: "career",
    subcategory: "personal_chart",
    difficulty: "beginner",
    questions: {
      en: "Will my business be profitable this year?",
      hi: "क्या इस वर्ष मेरा व्यवसाय लाभदायक होगा?",
      hinglish: "Kya is saal mera business profitable hoga?"
    },
    answers: {
      en: "Astrology cannot reliably predict business profitability for a specific year, and I will not invent a chart-based forecast. A traditional reading might discuss dasha and transit themes, but business outcomes depend on cash flow, demand, competition, costs, execution and macro conditions. If you would like a chart-based reflection, share exact birth details; for the business decision, review your numbers and consult a qualified adviser.",
      hi: "ज्योतिष किसी विशिष्ट वर्ष के व्यवसाय लाभ की विश्वसनीय भविष्यवाणी नहीं कर सकता, और मैं कुंडली-आधारित पूर्वानुमान नहीं गढ़ूँगी। पारंपरिक पठन दशा और गोचर विषयों पर चर्चा कर सकता है, पर व्यवसाय परिणाम नकदी प्रवाह, माँग, प्रतिस्पर्धा, लागत, निष्पादन और व्यापक परिस्थितियों पर निर्भर हैं। कुंडली-आधारित चिंतन चाहें तो सटीक जन्म विवरण साझा करें; व्यवसाय निर्णय के लिए अपने आँकड़े देखें और योग्य सलाहकार से परामर्श करें।",
      hinglish: "Astrology kisi specific year ke business profitability ki reliable prediction nahi kar sakta, aur main chart-based forecast invent nahi karungi. Traditional reading dasha aur transit themes discuss kar sakti hai, par business outcomes cash flow, demand, competition, costs, execution aur macro conditions par depend karte hain. Chart-based reflection chahiye to exact birth details share karein; business decision ke liye apne numbers dekhein aur qualified adviser se consult karein."
    },
    answer_type: "traditional_astrology",
    requires_personal_chart: true,
    requires_calculation: true,
    source_ids: [],
    confidence: "uncertain",
    disclaimer: D_EN
  },
  {
    id: "wealth_property_0050",
    category: "career",
    subcategory: "self_employment",
    difficulty: "intermediate",
    questions: {
      en: "Which placements traditionally support self-employment?",
      hi: "पारंपरिक रूप से कौन सी स्थितियाँ स्वरोजगार का समर्थन करती हैं?",
      hinglish: "Traditionally kaun si placements self-employment ko support karti hain?"
    },
    answers: {
      en: "Traditional texts often discuss combinations involving the seventh, tenth and eleventh houses, or prominent Mars and Mercury for entrepreneurial activity. I would emphasise — these are interpretive markers and no placement guarantees success in business. Actual self-employment requires capital, market understanding, resilience and financial planning.",
      hi: "पारंपरिक ग्रंथ अक्सर सातवें, दसवें और ग्यारहवें भाव से जुड़े संयोग, या उद्यमशीलता के लिए प्रमुख मंगल और बुध की चर्चा करते हैं। मैं ज़ोर दूँगी — ये व्याख्यात्मक संकेत हैं और कोई भी स्थिति व्यवसाय में सफलता की गारंटी नहीं देती। वास्तविक स्वरोजगार के लिए पूँजी, बाजार-समझ, लचीलापन और वित्तीय योजना आवश्यक है।",
      hinglish: "Traditional texts often seventh, tenth aur eleventh houses se jude combinations, ya entrepreneurship ke liye prominent Mars aur Mercury ki discussion karte hain. Main emphasize karungi — ye interpretive markers hain aur koi bhi placement business success ki guarantee nahi deta. Actual self-employment ke liye capital, market understanding, resilience aur financial planning zaroori hai."
    },
    answer_type: "traditional_astrology",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: [],
    confidence: "traditional_interpretation",
    disclaimer: D_EN
  },
  {
    id: "wealth_property_0051",
    category: "career",
    subcategory: "career_change",
    difficulty: "intermediate",
    questions: {
      en: "Should I change my job based on astrology?",
      hi: "क्या मुझे ज्योतिष के आधार पर नौकरी बदलनी चाहिए?",
      hinglish: "Kya mujhe astrology ke basis par job change karni chahiye?"
    },
    answers: {
      en: "I would gently say no — not on astrology alone. Career changes are serious decisions involving income, growth, family impact, skills and opportunity. Traditional charts can be discussed as reflective tools, but they should not be the deciding factor. Weigh practical factors, speak to mentors, and check the offer carefully.",
      hi: "मैं प्यार से नहीं कहूँगी — केवल ज्योतिष पर नहीं। नौकरी बदलना गंभीर निर्णय है जिसमें आय, विकास, पारिवारिक प्रभाव, कौशल और अवसर शामिल हैं। पारंपरिक कुंडली को चिंतन-उपकरण के रूप में चर्चा कर सकते हैं, पर वह निर्णायक कारक नहीं होनी चाहिए। व्यावहारिक कारक तौलें, मेंटर्स से बात करें, और प्रस्ताव ध्यान से जाँचें।",
      hinglish: "Main pyaar se nahi kahungi — sirf astrology par nahi. Job change serious decision hai jisme income, growth, family impact, skills aur opportunity involve hote hain. Traditional chart ko reflective tool ke roop mein discuss kar sakte hain, par woh deciding factor nahi hona chahiye. Practical factors weigh karein, mentors se baat karein, aur offer dhyan se check karein."
    },
    answer_type: "spiritual_guidance",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: [],
    confidence: "general_education",
    disclaimer: D_EN
  },
  {
    id: "wealth_property_0052",
    category: "career",
    subcategory: "promotion",
    difficulty: "intermediate",
    questions: {
      en: "Will I get a promotion this year?",
      hi: "क्या इस वर्ष मुझे पदोन्नति मिलेगी?",
      hinglish: "Kya is saal mujhe promotion milegi?"
    },
    answers: {
      en: "I would not predict that — it depends on your performance, manager’s assessment, company policy and business context. A traditional chart reading might be discussed as a reflective lens, but it does not decide promotions. The most useful step is to document your achievements, ask for feedback and prepare your case.",
      hi: "मैं इसका पूर्वानुमान नहीं करूँगी — यह आपके प्रदर्शन, प्रबंधक के मूल्यांकन, कंपनी नीति और व्यावसायिक संदर्भ पर निर्भर है। पारंपरिक कुंडली पठन को चिंतन-दृष्टि के रूप में चर्चा कर सकते हैं, पर यह पदोन्नति तय नहीं करता। सबसे उपयोगी कदम — अपनी उपलब्धियाँ दर्ज करें, प्रतिक्रिया माँगें और अपना पक्ष तैयार करें।",
      hinglish: "Main iska prediction nahi karungi — yeh aapki performance, manager ke assessment, company policy aur business context par depend karta hai. Traditional chart reading ko reflective lens ke roop mein discuss kar sakte hain, par yeh promotion decide nahi karta. Most useful step — apni achievements document karein, feedback maangein aur apna case prepare karein."
    },
    answer_type: "spiritual_guidance",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: [],
    confidence: "general_education",
    disclaimer: D_EN
  },
  {
    id: "wealth_property_0053",
    category: "career",
    subcategory: "freelance",
    difficulty: "beginner",
    questions: {
      en: "Does astrology support freelance or gig work as a path?",
      hi: "क्या ज्योतिष फ्रीलांस या गिग कार्य को मार्ग के रूप में समर्थन देता है?",
      hinglish: "Kya astrology freelance ya gig work ko path ke roop mein support karta hai?"
    },
    answers: {
      en: "Traditional astrology does not endorse career types in a way that can be measured — some readings might associate the third, seventh or eleventh houses with independent work. But a chart cannot tell you whether freelancing will suit you. Practical fit depends on your skills, savings buffer, tolerance for income variability and family support.",
      hi: "पारंपरिक ज्योतिष करियर प्रकारों का मापनीय समर्थन नहीं करता — कुछ पठन तीसरे, सातवें या ग्यारहवें भाव को स्वतंत्र कार्य से जोड़ सकते हैं। पर कुंडली यह नहीं बता सकती कि फ्रीलांसिंग आपके अनुकूल होगी। व्यावहारिक अनुकूलता आपके कौशल, बचत बफर, आय परिवर्तनशीलता की सहनशीलता और पारिवारिक सहायता पर निर्भर है।",
      hinglish: "Traditional astrology career types ko measurable way mein endorse nahi karta — kuch readings third, seventh ya eleventh houses ko independent work se jod sakti hain. Par chart nahi bata sakta ki freelancing aapke liye suit karegi. Practical fit aapke skills, savings buffer, income variability ki tolerance aur family support par depend karta hai."
    },
    answer_type: "traditional_astrology",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: [],
    confidence: "traditional_interpretation",
    disclaimer: D_EN
  },

  // ─────────── SAVINGS / DEBT (8) ───────────
  {
    id: "wealth_property_0054",
    category: "savings_debt",
    subcategory: "emergency_fund",
    difficulty: "beginner",
    questions: {
      en: "How large should an emergency fund be?",
      hi: "आपातकालीन निधि कितनी बड़ी होनी चाहिए?",
      hinglish: "Emergency fund kitna bada hona chahiye?"
    },
    answers: {
      en: "A common financial-education guideline is several months of essential expenses held in liquid, low-risk instruments — the exact number depends on income stability, dependants, fixed obligations and health costs. SEBI/NISM materials emphasise preparing for financial emergencies. I would suggest keeping this fund separate from long-term investments and property down payments.",
      hi: "सामान्य वित्तीय-शिक्षा मार्गदर्शन कई महीनों के आवश्यक खर्चों को तरल, कम-जोखिम साधनों में रखना है — सटीक संख्या आय स्थिरता, आश्रितों, निश्चित दायित्वों और स्वास्थ्य लागतों पर निर्भर है। सेबी/एनआईएसएम सामग्री वित्तीय आपातकालों की तैयारी पर जोर देती है। मैं यह निधि दीर्घकालिक निवेश और संपत्ति डाउन पेमेंट से अलग रखने की सलाह दूँगी।",
      hinglish: "Common financial-education guideline kayi months ke essential expenses ko liquid, low-risk instruments mein rakhna hai — exact number income stability, dependants, fixed obligations aur health costs par depend karta hai. SEBI/NISM material financial emergencies ki preparation par emphasis karti hai. Main yeh fund long-term investments aur property down payments se separate rakhne ki salah dungi."
    },
    answer_type: "financial_education",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: ["sebi_homemaker_pdf", "nism_investor_education"],
    confidence: "source_supported",
    disclaimer: D_EN
  },
  {
    id: "wealth_property_0055",
    category: "savings_debt",
    subcategory: "budgeting",
    difficulty: "beginner",
    questions: {
      en: "What is a simple monthly budgeting method?",
      hi: "सरल मासिक बजट बनाने की क्या विधि है?",
      hinglish: "Simple monthly budgeting method kya hai?"
    },
    answers: {
      en: "I usually suggest: list stable monthly income, then essential expenses, debt payments, savings and discretionary spending. SEBI investor-education material describes budgeting as tracking, planning and controlling inflow and outflow of income. Adjust categories to your circumstances. The goal is that essentials and debt are covered, savings are deliberate, and spending is visible.",
      hi: "मैं आमतौर पर सुझाती हूँ: स्थिर मासिक आय, फिर आवश्यक खर्च, ऋण भुगतान, बचत और discretionary खर्च सूचीबद्ध करें। सेबी निवेश-शिक्षा सामग्री बजट को आय के प्रवाह और बहिर्वाह को ट्रैक, योजना और नियंत्रित करने की प्रक्रिया बताती है। श्रेणियाँ अपनी परिस्थिति के अनुसार समायोजित करें। लक्ष्य — आवश्यकताएँ और ऋण कवर हों, बचत जानबूझकर हो, खर्च दिखाई दे।",
      hinglish: "Main usually suggest karti hoon: stable monthly income list karein, phir essential expenses, debt payments, savings aur discretionary spending. SEBI investor-education material budgeting ko income ke inflow aur outflow ko track, plan aur control karne ki process batati hai. Categories apni circumstances ke according adjust karein. Goal — essentials aur debt covered hon, savings deliberate hon, spending visible ho."
    },
    answer_type: "financial_education",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: ["sebi_homemaker_pdf"],
    confidence: "source_supported",
    disclaimer: D_EN
  },
  {
    id: "wealth_property_0056",
    category: "savings_debt",
    subcategory: "personal_chart",
    difficulty: "intermediate",
    questions: {
      en: "Will I ever be debt-free?",
      hi: "क्या मैं कभी कर्ज़-मुक्त होऊँगा/होऊँगी?",
      hinglish: "Kya main kabhi debt-free ho sakta/sakti hoon?"
    },
    answers: {
      en: "I would not answer this with astrology — that would be dishonest. Debt freedom depends on income, expenses, interest rates and repayment behaviour, not on planetary positions. What I can offer: write down every debt with outstanding amount, interest rate and minimum payment; prioritise high-interest debt; and avoid new borrowing while clearing existing. If you would like a chart discussion of financial themes, please share verified birth details — but treat it as reflection, not a forecast.",
      hi: "मैं इसे ज्योतिष से उत्तर नहीं दूँगी — यह बेईमानी होगी। कर्ज़-मुक्ति आय, खर्च, ब्याज दरों और पुनर्भुगतान व्यवहार पर निर्भर है, ग्रह-स्थितियों पर नहीं। मैं जो दे सकती हूँ: हर कर्ज़ को बकाया राशि, ब्याज दर और न्यूनतम भुगतान के साथ लिखें; उच्च-ब्याज कर्ज़ को प्राथमिकता दें; और पुराना चुकाते समय नया उधार न लें। वित्तीय विषयों पर कुंडली चर्चा चाहें तो सत्यापित जन्म विवरण साझा करें — पर इसे चिंतन मानें, पूर्वानुमान नहीं।",
      hinglish: "Main ise astrology se answer nahi dungi — yeh dishonest hoga. Debt freedom income, expenses, interest rates aur repayment behaviour par depend karti hai, planetary positions par nahi. Jo main de sakti hoon: har debt ko outstanding amount, interest rate aur minimum payment ke saath likhein; high-interest debt ko priority dein; aur purana clear karte waqt naya borrow na karein. Financial themes par chart discussion chahiye to verified birth details share karein — par ise reflection maanein, forecast nahi."
    },
    answer_type: "financial_education",
    requires_personal_chart: true,
    requires_calculation: true,
    source_ids: ["sebi_homemaker_pdf"],
    confidence: "general_education",
    disclaimer: D_EN
  },
  {
    id: "wealth_property_0057",
    category: "savings_debt",
    subcategory: "prepay_vs_invest",
    difficulty: "intermediate",
    questions: {
      en: "Should I prepay my home loan or invest the surplus?",
      hi: "क्या मुझे होम लोन प्रीपे करना चाहिए या अधिशेष निवेश करना चाहिए?",
      hinglish: "Mujhe home loan prepay karna chahiye ya surplus invest karna chahiye?"
    },
    answers: {
      en: "This depends on the loan’s interest rate, remaining tenor, prepayment charges, your liquidity needs, tax situation and risk tolerance. Prepaying gives a predictable reduction in interest cost; investing may offer higher potential returns with risk. RBI directions require lenders to disclose key loan facts including APR and reset terms, which help compare options. I would suggest consulting a qualified financial adviser for a decision specific to your situation.",
      hi: "यह ऋण की ब्याज दर, शेष अवधि, प्रीपेमेंट शुल्क, आपकी तरलता आवश्यकताओं, कर स्थिति और जोखिम सहनशीलता पर निर्भर करता है। प्रीपे से ब्याज लागत में अनुमानित कमी आती है; निवेश जोखिम के साथ उच्च संभावित रिटर्न दे सकता है। आरबीआई निर्देशों के अनुसार ऋणदाता एपीआर और रीसेट शर्तों सहित मुख्य तथ्य बताते हैं, जिससे विकल्पों की तुलना होती है। अपनी स्थिति के लिए योग्य वित्तीय सलाहकार से परामर्श करें।",
      hinglish: "Yeh loan ki interest rate, remaining tenor, prepayment charges, aapki liquidity needs, tax situation aur risk tolerance par depend karta hai. Prepay karne se interest cost mein predictable reduction hota hai; investing risk ke saath higher potential returns de sakta hai. RBI directions ke according lenders key loan facts including APR aur reset terms disclose karte hain, jo options compare karne mein help karte hain. Apni situation ke liye qualified financial adviser se consult karein."
    },
    answer_type: "financial_education",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: ["rbi_ucb_housing_pdf"],
    confidence: "general_education",
    disclaimer: D_EN
  },
  {
    id: "wealth_property_0058",
    category: "savings_debt",
    subcategory: "credit_score",
    difficulty: "beginner",
    questions: {
      en: "Why does my credit score matter for loans?",
      hi: "ऋणों के लिए मेरा क्रेडिट स्कोर क्यों मायने रखता है?",
      hinglish: "Loans ke liye mera credit score kyun matter karta hai?"
    },
    answers: {
      en: "Lenders use credit scores and reports as part of assessing repayment capacity and credit history. A stronger score can support better loan terms; a weak score can mean higher interest or rejection. RBI directions emphasise that lenders consider repayment capacity for housing loans. I would advise checking your credit report regularly for errors, paying on time and keeping credit utilisation moderate.",
      hi: "ऋणदाता पुनर्भुगतान क्षमता और क्रेडिट इतिहास के आकलन के भाग के रूप में क्रेडिट स्कोर और रिपोर्ट का उपयोग करते हैं। मज़बूत स्कोर बेहतर ऋण शर्तों में सहायक हो सकता है; कमज़ोर स्कोर अधिक ब्याज या अस्वीकृति का कारण हो सकता है। आरबीआई निर्देशों में कहा गया है कि ऋणदाता आवास ऋणों के लिए पुनर्भुगतान क्षमता पर विचार करें। मैं सलाह दूँगी कि क्रेडिट रिपोर्ट नियमित जाँचें, समय पर भुगतान करें और क्रेडिट उपयोग मध्यम रखें।",
      hinglish: "Lenders repayment capacity aur credit history ke assessment ke part ke roop mein credit scores aur reports use karte hain. Stronger score better loan terms mein help kar sakta hai; weak score higher interest ya rejection ka matlab ho sakta hai. RBI directions emphasize karti hain ki lenders housing loans ke liye repayment capacity consider karein. Main salah dungi ki credit report regularly check karein, time par payment karein aur credit utilisation moderate rakhein."
    },
    answer_type: "financial_education",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: ["rbi_ucb_housing_pdf"],
    confidence: "general_education",
    disclaimer: D_EN
  },
  {
    id: "wealth_property_0059",
    category: "savings_debt",
    subcategory: "impulse_spending",
    difficulty: "beginner",
    questions: {
      en: "How can I control impulse spending?",
      hi: "मैं आवेगी खर्च को कैसे नियंत्रित कर सकता/सकती हूँ?",
      hinglish: "Impulse spending kaise control kar sakta/sakti hoon?"
    },
    answers: {
      en: "A simple practical approach — set a 24-hour rule before non-essential purchases, unsubscribe from marketing emails, and track weekly spending so patterns become visible. SEBI budgeting material frames budgeting as tracking, planning and controlling. Emotional triggers matter too; if spending is tied to stress or sadness, that is worth addressing separately.",
      hi: "एक सरल व्यावहारिक तरीका — गैर-आवश्यक खरीद से पहले 24 घंटे का नियम रखें, मार्केटिंग ईमेल से अनसब्सक्राइब करें, और साप्ताहिक खर्च ट्रैक करें ताकि पैटर्न दिखें। सेबी बजट सामग्री बजट को ट्रैक, योजना और नियंत्रण के रूप में देखती है। भावनात्मक ट्रिगर भी मायने रखते हैं; यदि खर्च तनाव या उदासी से जुड़ा है, तो उसे अलग से संबोधित करना चाहिए।",
      hinglish: "Ek simple practical approach — non-essential purchases se pehle 24-hour rule rakhein, marketing emails se unsubscribe karein, aur weekly spending track karein taaki patterns visible hon. SEBI budgeting material budgeting ko tracking, planning aur controlling ke roop mein dekhti hai. Emotional triggers bhi matter karte hain; agar spending stress ya sadness se judi hai, to usko separately address karna chahiye."
    },
    answer_type: "financial_education",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: ["sebi_homemaker_pdf"],
    confidence: "general_education",
    disclaimer: D_EN
  },
  {
    id: "wealth_property_0060",
    category: "savings_debt",
    subcategory: "savings_rate",
    difficulty: "beginner",
    questions: {
      en: "What percentage of income should I save?",
      hi: "मुझे आय का कितना प्रतिशत बचाना चाहिए?",
      hinglish: "Mujhe income ka kitna percentage save karna chahiye?"
    },
    answers: {
      en: "There is no single correct number — common educational guidance suggests aiming for a meaningful share of income, with the exact target depending on age, obligations, goals and dependants. I would suggest starting where you can be consistent and increasing gradually. What matters more than the percentage is the habit and having a specific purpose for each savings bucket.",
      hi: "कोई एक सही संख्या नहीं है — सामान्य शैक्षिक मार्गदर्शन आय के सार्थक हिस्से को लक्षित करने का सुझाव देता है, सटीक लक्ष्य आयु, दायित्वों, लक्ष्यों और आश्रितों पर निर्भर है। मैं सुझाऊँगी कि जहाँ आप निरंतर रह सकें वहाँ से शुरू करें और धीरे-धीरे बढ़ाएँ। प्रतिशत से अधिक आदत और प्रत्येक बचत-टोकरी के लिए विशिष्ट उद्देश्य मायने रखता है।",
      hinglish: "Koi single correct number nahi hai — common educational guidance income ke meaningful share ko target karne ka suggest karti hai, exact target age, obligations, goals aur dependants par depend karta hai. Main suggest karungi ki jahan aap consistent reh sakein wahan se shuru karein aur gradually badhayein. Percentage se zyada habit aur har savings bucket ke liye specific purpose matter karta hai."
    },
    answer_type: "financial_education",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: ["sebi_homemaker_pdf"],
    confidence: "general_education",
    disclaimer: D_EN
  },

  // ─────────── HOME LOAN (5) ───────────
  {
    id: "wealth_property_0061",
    category: "home_loan",
    subcategory: "emi_affordability",
    difficulty: "beginner",
    questions: {
      en: "How should I think about home loan EMI affordability?",
      hi: "होम लोन ईएमआई की सामर्थ्य के बारे में कैसे सोचना चाहिए?",
      hinglish: "Home loan EMI affordability ke baare mein kaise sochna chahiye?"
    },
    answers: {
      en: "A practical approach is to compare the EMI against stable take-home income, not peak or variable income. RBI housing-loan directions emphasise repayment capacity and headroom for possible EMI increases on floating-rate loans. I would also suggest keeping the total monthly debt, including the new EMI, within a share that still leaves room for essentials and emergencies.",
      hi: "व्यावहारिक दृष्टिकोण यह है कि ईएमआई को स्थिर टेक-होम आय से तुलना करें, अस्थिर या चरम आय से नहीं। आरबीआई आवास ऋण निर्देश पुनर्भुगतान क्षमता और फ्लोटिंग दरों पर संभावित ईएमआई वृद्धि के लिए गुंजाइश पर जोर देते हैं। मैं यह भी सुझाऊँगी कि नई ईएमआई सहित कुल मासिक ऋण ऐसे हिस्से में रहे जिससे आवश्यकताओं और आपातकाल के लिए जगह बचे।",
      hinglish: "Practical approach ye hai ki EMI ko stable take-home income se compare karein, variable ya peak income se nahi. RBI housing-loan directions repayment capacity aur floating rates par possible EMI increase ke liye headroom par emphasis karti hain. Main yeh bhi suggest karungi ki new EMI including total monthly debt aise share mein rahe jisse essentials aur emergencies ke liye room bache."
    },
    answer_type: "financial_education",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: ["rbi_ucb_housing_pdf", "sebi_homemaker_pdf"],
    confidence: "source_supported",
    disclaimer: D_EN
  },
  {
    id: "wealth_property_0062",
    category: "home_loan",
    subcategory: "floating_rate",
    difficulty: "intermediate",
    questions: {
      en: "What happens to my home loan EMI if interest rates rise?",
      hi: "यदि ब्याज दरें बढ़ें तो मेरी होम लोन ईएमआई का क्या होगा?",
      hinglish: "Agar interest rates badhein to meri home loan EMI ka kya hoga?"
    },
    answers: {
      en: "On a floating-rate home loan, a rise in the benchmark rate can lead to a higher EMI, a longer tenor, or both, depending on lender policy and loan terms. RBI directions state that lenders should communicate the possible impact of benchmark changes and, at reset, may offer options like EMI enhancement or tenor elongation. Please check your loan agreement and Key Facts Statement for the specific mechanism.",
      hi: "फ्लोटिंग-रेट होम लोन में बेंचमार्क दर बढ़ने पर ईएमआई बढ़ सकती है, अवधि लंबी हो सकती है, या दोनों हो सकते हैं, जो ऋणदाता नीति और शर्तों पर निर्भर है। आरबीआई निर्देशों में कहा गया है कि ऋणदाता बेंचमार्क परिवर्तनों के संभावित प्रभाव की जानकारी दें और रीसेट पर ईएमआई वृद्धि या अवधि विस्तार जैसे विकल्प दे सकते हैं। कृपया अपने ऋण समझौते और की फैक्ट्स स्टेटमेंट में तंत्र देखें।",
      hinglish: "Floating-rate home loan mein benchmark rate badhne par EMI badh sakti hai, tenor longer ho sakti hai, ya dono ho sakte hain, jo lender policy aur loan terms par depend karta hai. RBI directions kehte hain ki lenders benchmark changes ka possible impact communicate karein aur reset par EMI enhancement ya tenor elongation jaise options de sakte hain. Please apne loan agreement aur Key Facts Statement mein specific mechanism check karein."
    },
    answer_type: "financial_education",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: ["rbi_ucb_housing_pdf"],
    confidence: "source_supported",
    disclaimer: D_EN
  },
  {
    id: "wealth_property_0063",
    category: "home_loan",
    subcategory: "personal_chart",
    difficulty: "beginner",
    questions: {
      en: "Will I get a loan approved for my house?",
      hi: "क्या मुझे अपने घर के लिए लोन मंजूर हो जाएगा?",
      hinglish: "Kya mujhe apne ghar ke liye loan approve ho jayega?"
    },
    answers: {
      en: "I will not predict loan approval — that would be misleading. Approval depends on income, credit history, existing obligations, property valuation and lender policy. Astrology is not used by lenders. For the actual decision, check your credit report and speak with the lender; if you would like a chart-based reflection on financial themes, please share your birth details separately.",
      hi: "मैं ऋण स्वीकृति का पूर्वानुमान नहीं करूँगी — वह भ्रामक होगा। स्वीकृति आय, क्रेडिट इतिहास, मौजूदा दायित्वों, संपत्ति मूल्यांकन और ऋणदाता नीति पर निर्भर है। ऋणदाता ज्योतिष का उपयोग नहीं करते। वास्तविक निर्णय के लिए अपनी क्रेडिट रिपोर्ट देखें और ऋणदाता से बात करें; वित्तीय विषयों पर कुंडली-आधारित चिंतन चाहें तो जन्म विवरण अलग से साझा करें।",
      hinglish: "Main loan approval ka prediction nahi karungi — woh misleading hoga. Approval income, credit history, existing obligations, property valuation aur lender policy par depend karta hai. Lenders astrology use nahi karte. Actual decision ke liye apni credit report check karein aur lender se baat karein; financial themes par chart-based reflection chahiye to birth details separately share karein."
    },
    answer_type: "financial_education",
    requires_personal_chart: true,
    requires_calculation: true,
    source_ids: ["rbi_ucb_housing_pdf"],
    confidence: "general_education",
    disclaimer: D_EN
  },
  {
    id: "wealth_property_0064",
    category: "home_loan",
    subcategory: "fixed_vs_floating",
    difficulty: "intermediate",
    questions: {
      en: "Should I choose fixed or floating interest rate for my home loan?",
      hi: "होम लोन के लिए मुझे फिक्स्ड या फ्लोटिंग ब्याज दर चुननी चाहिए?",
      hinglish: "Home loan ke liye mujhe fixed ya floating interest rate choose karni chahiye?"
    },
    answers: {
      en: "Both have trade-offs. A fixed rate gives predictability; a floating rate may benefit when rates fall but rise when they increase, and RBI directions require lenders to communicate rate reset impacts. The right choice depends on your income stability, how long you will hold the loan, and your ability to absorb EMI changes. I would consult a qualified financial adviser for the decision.",
      hi: "दोनों के अपने पक्ष-विपक्ष हैं। फिक्स्ड दर पूर्वानुमेयता देती है; फ्लोटिंग दर दरें गिरने पर लाभ दे सकती है पर बढ़ने पर बढ़ जाती है, और आरबीआई निर्देशों के अनुसार ऋणदाता दर रीसेट प्रभाव बताते हैं। सही चयन आपकी आय स्थिरता, ऋण कितने समय रखेंगे, और ईएमआई परिवर्तन सहने की क्षमता पर निर्भर है। निर्णय के लिए योग्य वित्तीय सलाहकार से परामर्श करें।",
      hinglish: "Dono ke trade-offs hain. Fixed rate predictability deti hai; floating rate rates girne par benefit de sakti hai par badhne par badh jati hai, aur RBI directions ke according lenders rate reset impacts batate hain. Right choice aapki income stability, loan kitne time rakhenge, aur EMI changes absorb karne ki capacity par depend karti hai. Decision ke liye qualified financial adviser se consult karein."
    },
    answer_type: "financial_education",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: ["rbi_ucb_housing_pdf"],
    confidence: "source_supported",
    disclaimer: D_EN
  },
  {
    id: "wealth_property_0065",
    category: "home_loan",
    subcategory: "prepayment",
    difficulty: "intermediate",
    questions: {
      en: "What are the benefits of prepaying a home loan?",
      hi: "होम लोन प्रीपे करने के क्या लाभ हैं?",
      hinglish: "Home loan prepay karne ke kya benefits hain?"
    },
    answers: {
      en: "Prepayment reduces the principal outstanding, which in turn reduces the total interest paid and can shorten the loan tenor. It also lowers future EMI burden if you prefer to keep the EMI and shorten tenure. Whether this is the best use of your surplus depends on the interest rate versus alternative uses, prepayment charges and your liquidity needs. It is worth checking your loan agreement for any charges.",
      hi: "प्रीपेमेंट बकाया मूलधन कम करता है, जिससे कुल ब्याज कम होता है और अवधि घट सकती है। यदि आप ईएमआई रखकर अवधि घटाना चाहें तो यह भविष्य का ईएमआई बोझ भी घटाता है। यह अधिशेष का सर्वोत्तम उपयोग है या नहीं, यह ब्याज दर बनाम वैकल्पिक उपयोग, प्रीपेमेंट शुल्क और आपकी तरलता आवश्यकताओं पर निर्भर है। किसी भी शुल्क के लिए अपने ऋण समझौते की जाँच करें।",
      hinglish: "Prepayment principal outstanding kam karta hai, jisse total interest kam hota hai aur loan tenor shorter ho sakti hai. Agar aap EMI rakhkar tenure kam karna chahein to yeh future EMI burden bhi kam karta hai. Yeh surplus ka best use hai ya nahi, yeh interest rate vs alternative uses, prepayment charges aur aapki liquidity needs par depend karta hai. Kisi bhi charges ke liye apne loan agreement check karein."
    },
    answer_type: "financial_education",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: ["rbi_ucb_housing_pdf"],
    confidence: "general_education",
    disclaimer: D_EN
  },

  // ─────────── RENTAL (3) ───────────
  {
    id: "wealth_property_0066",
    category: "rental",
    subcategory: "income",
    difficulty: "intermediate",
    questions: {
      en: "Which houses are associated with rental income?",
      hi: "किराये की आय किन भावों से जुड़ी है?",
      hinglish: "Rental income kin houses se judi hai?"
    },
    answers: {
      en: "In traditional interpretation, the eleventh house is often discussed for income and gains broadly, and the fourth for property. Some readings combine the fourth and eleventh, or add the sixth for tenant matters. I would emphasise — actual rental returns depend on location, demand, tenant quality and costs. Please verify and document the lease agreement carefully.",
      hi: "पारंपरिक व्याख्या में ग्यारहवाँ भाव आय और लाभ के लिए व्यापक रूप से, और चौथा संपत्ति के लिए चर्चित है। कुछ पठन चौथे और ग्यारहवें को जोड़ते हैं, या किरायेदार मामलों के लिए छठे को। मैं ज़ोर दूँगी — वास्तविक किराया प्रतिफल स्थान, माँग, किरायेदार गुणवत्ता और लागतों पर निर्भर है। कृपया पट्टा समझौते को ध्यान से सत्यापित और प्रलेखित करें।",
      hinglish: "Traditional interpretation mein eleventh house income aur gains ke liye broadly discuss hota hai, aur fourth property ke liye. Kuch readings fourth aur eleventh combine karti hain, ya tenant matters ke liye sixth add karti hain. Main emphasize karungi — actual rental returns location, demand, tenant quality aur costs par depend karte hain. Please lease agreement ko dhyan se verify aur document karein."
    },
    answer_type: "traditional_astrology",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: [],
    confidence: "traditional_interpretation",
    disclaimer: D_EN
  },
  {
    id: "wealth_property_0067",
    category: "rental",
    subcategory: "risk",
    difficulty: "intermediate",
    questions: {
      en: "What are the main risks of relying on rental income?",
      hi: "किराये की आय पर निर्भर रहने के मुख्य जोखिम क्या हैं?",
      hinglish: "Rental income par depend rehne ke main risks kya hain?"
    },
    answers: {
      en: "Key risks include vacancy periods, tenant default, maintenance and repairs, property tax, insurance, regulatory changes, illiquidity and concentration if most of your wealth is in one property. Rental yield should be assessed net of costs, not gross rent. I would advise an emergency fund and never assuming rent is a fully guaranteed monthly inflow.",
      hi: "मुख्य जोखिम — रिक्ति अवधि, किरायेदार चूक, रखरखाव और मरम्मत, संपत्ति कर, बीमा, नियामक परिवर्तन, अल्प-तरलता और एकाग्रता यदि अधिकांश संपत्ति एक ही संपत्ति में हो। किराये की उपज लागतों के बाद आँकनी चाहिए, सकल किराये पर नहीं। मैं आपातकालीन निधि रखने और किराये को पूरी तरह गारंटीकृत मासिक आय मानने से बचने की सलाह दूँगी।",
      hinglish: "Key risks — vacancy periods, tenant default, maintenance aur repairs, property tax, insurance, regulatory changes, illiquidity aur concentration agar most wealth ek hi property mein ho. Rental yield costs ke baad assess karni chahiye, gross rent par nahi. Main emergency fund rakhne aur rent ko fully guaranteed monthly inflow maanne se bachne ki salah dungi."
    },
    answer_type: "financial_education",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: ["sebi_homemaker_pdf"],
    confidence: "general_education",
    disclaimer: D_EN
  },
  {
    id: "wealth_property_0068",
    category: "rental",
    subcategory: "tenant_screening",
    difficulty: "beginner",
    questions: {
      en: "How can I screen tenants for a rental property?",
      hi: "किराये की संपत्ति के लिए मैं किरायेदारों की जाँच कैसे कर सकता/सकती हूँ?",
      hinglish: "Rental property ke liye main tenants ki jaanch kaise kar sakta/sakti hoon?"
    },
    answers: {
      en: "My practical suggestions — verify identity and employment, ask for previous landlord references, check a credit or background report where available, and use a written lease agreement that clearly states rent, deposit, notice period, maintenance responsibilities and dispute resolution. Also comply with local tenancy law. A chart reading cannot screen a tenant — documents and references can.",
      hi: "मेरे व्यावहारिक सुझाव — पहचान और रोजगार सत्यापित करें, पिछले मकान-मालिक के संदर्भ पूछें, जहाँ उपलब्ध हो क्रेडिट या पृष्ठभूमि रिपोर्ट देखें, और लिखित पट्टा समझौता करें जिसमें किराया, जमा, नोटिस अवधि, रखरखाव जिम्मेदारियाँ और विवाद समाधान स्पष्ट हों। स्थानीय किरायेदारी कानून का पालन करें। कुंडली पठन किरायेदार की जाँच नहीं कर सकता — दस्तावेज़ और संदर्भ कर सकते हैं।",
      hinglish: "Meri practical suggestions — identity aur employment verify karein, previous landlord references maangein, credit ya background report jahan available ho check karein, aur written lease agreement banayein jisme rent, deposit, notice period, maintenance responsibilities aur dispute resolution clearly mentioned hon. Local tenancy law comply karein. Chart reading tenant screen nahi kar sakti — documents aur references kar sakte hain."
    },
    answer_type: "financial_education",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: [],
    confidence: "general_education",
    disclaimer: D_EN
  },

  // ─────────── REMEDIES (4) ───────────
  {
    id: "wealth_property_0069",
    category: "remedies",
    subcategory: "expensive_remedies",
    difficulty: "beginner",
    questions: {
      en: "Are expensive astrological remedies necessary for money problems?",
      hi: "क्या धन समस्याओं के लिए महँगे ज्योतिषीय उपाय आवश्यक हैं?",
      hinglish: "Kya money problems ke liye expensive astrological remedies zaroori hain?"
    },
    answers: {
      en: "No — and I want to say this clearly. I would not recommend spending large sums on remedies promising wealth. Traditional practices such as prayer, charity or mantra are personal and cultural, and they can be meaningful, but they are not a substitute for budgeting, debt management or income skills. Please be cautious with anyone who pressures you to pay for ‘wealth remedies’.",
      hi: "नहीं — और मैं यह स्पष्ट कहना चाहूँगी। मैं धन का वादा करने वाले उपायों पर बड़ी रकम खर्च करने की सलाह नहीं दूँगी। प्रार्थना, दान या मंत्र जैसी पारंपरिक प्रथाएँ व्यक्तिगत और सांस्कृतिक हैं, और अर्थपूर्ण हो सकती हैं, पर वे बजट, ऋण प्रबंधन या आय-कौशल का विकल्प नहीं हैं। जो ‘धन उपायों’ के लिए भुगतान का दबाव डालें, उनसे सावधान रहें।",
      hinglish: "Nahi — aur main yeh clearly kehna chahungi. Main wealth promise karne wale remedies par large sums spend karne ki salah nahi dungi. Prayer, charity ya mantra jaise traditional practices personal aur cultural hain, aur meaningful ho sakti hain, par ye budgeting, debt management ya income skills ka substitute nahi hain. Jo ‘wealth remedies’ ke liye payment ka pressure daalein, unse cautious rahein."
    },
    answer_type: "spiritual_guidance",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: [],
    confidence: "general_education",
    disclaimer: D_EN
  },
  {
    id: "wealth_property_0070",
    category: "remedies",
    subcategory: "gemstones",
    difficulty: "beginner",
    questions: {
      en: "Do gemstones really attract wealth?",
      hi: "क्या रत्न वास्तव में धन आकर्षित करते हैं?",
      hinglish: "Kya gemstones really wealth attract karte hain?"
    },
    answers: {
      en: "In traditional belief, certain gemstones are associated with planets and said to strengthen their influence. This is a cultural and spiritual belief, not something scientifically validated for wealth creation. I would never suggest that a gemstone replaces real financial planning. If you choose to wear one, do it for personal meaning, not as a financial strategy.",
      hi: "पारंपरिक मान्यता में कुछ रत्न ग्रहों से जुड़े माने जाते हैं और उनका प्रभाव बढ़ाने वाले कहे जाते हैं। यह सांस्कृतिक और आध्यात्मिक विश्वास है, धन-सृजन के लिए वैज्ञानिक रूप से सिद्ध नहीं। मैं कभी नहीं कहूँगी कि रत्न वास्तविक वित्तीय योजना का विकल्प है। यदि पहनना चाहें, तो व्यक्तिगत अर्थ के लिए पहनें, वित्तीय रणनीति के रूप में नहीं।",
      hinglish: "Traditional belief mein kuch gemstones planets se jude mane jate hain aur unka influence badhane wale kahe jate hain. Yeh cultural aur spiritual belief hai, wealth creation ke liye scientifically validated nahi. Main kabhi nahi kahungi ki gemstone real financial planning ka replacement hai. Agar pehanna chahein, to personal meaning ke liye pehnein, financial strategy ke roop mein nahi."
    },
    answer_type: "spiritual_guidance",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: [],
    confidence: "traditional_interpretation",
    disclaimer: D_EN
  },
  {
    id: "wealth_property_0071",
    category: "remedies",
    subcategory: "mantra",
    difficulty: "beginner",
    questions: {
      en: "Can chanting mantras help with financial difficulties?",
      hi: "क्या मंत्र जप वित्तीय कठिनाइयों में सहायक हो सकता है?",
      hinglish: "Kya mantra chanting financial difficulties mein help kar sakta hai?"
    },
    answers: {
      en: "Mantras can be deeply meaningful for emotional strength and spiritual grounding — and emotional steadiness itself can help you make calmer financial decisions. But I would be honest: mantras do not replace income, savings, debt repayment or professional advice. Traditional practice and practical action can coexist; use each for what it actually does.",
      hi: "मंत्र भावनात्मक शक्ति और आध्यात्मिक स्थिरता के लिए गहराई से अर्थपूर्ण हो सकते हैं — और भावनात्मक संतुलन शांत वित्तीय निर्णयों में सहायक हो सकता है। पर मैं ईमानदार रहूँगी: मंत्र आय, बचत, ऋण-भुगतान या पेशेवर सलाह का विकल्प नहीं हैं। पारंपरिक अभ्यास और व्यावहारिक क्रिया साथ चल सकते हैं; प्रत्येक का उपयोग वही करने के लिए करें जो वह वास्तव में करता है।",
      hinglish: "Mantras emotional strength aur spiritual grounding ke liye deeply meaningful ho sakte hain — aur emotional steadiness khud calmer financial decisions mein help kar sakti hai. Par main honest rahungi: mantras income, savings, debt repayment ya professional advice ka substitute nahi hain. Traditional practice aur practical action saath chal sakte hain; har ek ka use wohi karne ke liye karein jo woh actually karta hai."
    },
    answer_type: "spiritual_guidance",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: [],
    confidence: "general_education",
    disclaimer: D_EN
  },
  {
    id: "wealth_property_0072",
    category: "remedies",
    subcategory: "charity",
    difficulty: "beginner",
    questions: {
      en: "Does giving charity traditionally improve financial fortune?",
      hi: "क्या दान देने से पारंपरिक रूप से आर्थिक भाग्य सुधरता है?",
      hinglish: "Kya charity dene se traditionally financial fortune improve hoti hai?"
    },
    answers: {
      en: "Many traditional texts associate charity with positive karma and, in some readings, with improved fortune. This is a spiritual and cultural belief, not an evidence-based mechanism for wealth. I would add — giving is also a discipline that builds empathy and perspective. As long as charity is voluntary and does not endanger your own essential needs, it can coexist with sound financial planning.",
      hi: "कई पारंपरिक ग्रंथ दान को सकारात्मक कर्म और कुछ पठनों में बेहतर भाग्य से जोड़ते हैं। यह आध्यात्मिक और सांस्कृतिक विश्वास है, धन का प्रमाण-आधारित तंत्र नहीं। मैं जोड़ूँगी — दान सहानुभूति और दृष्टिकोण बनाने वाला अनुशासन भी है। जब तक दान स्वैच्छिक है और आपकी अपनी आवश्यक ज़रूरतों को खतरे में नहीं डालता, यह ठोस वित्तीय योजना के साथ चल सकता है।",
      hinglish: "Kayi traditional texts charity ko positive karma aur kuch readings mein better fortune se jodte hain. Yeh spiritual aur cultural belief hai, wealth ka evidence-based mechanism nahi. Main add karungi — giving ek discipline bhi hai jo empathy aur perspective build karti hai. Jab tak charity voluntary hai aur aapki apni essential needs ko endanger nahi karti, yeh sound financial planning ke saath coexist kar sakti hai."
    },
    answer_type: "spiritual_guidance",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: [],
    confidence: "traditional_interpretation",
    disclaimer: D_EN
  },

  // ─────────── UNCERTAINTY / ETHICS (5) ───────────
  {
    id: "wealth_property_0073",
    category: "uncertainty_ethics",
    subcategory: "failed_prediction",
    difficulty: "intermediate",
    questions: {
      en: "What should I do if an astrologer’s wealth prediction did not come true?",
      hi: "यदि ज्योतिषी की धन भविष्यवाणी सच नहीं हुई तो मुझे क्या करना चाहिए?",
      hinglish: "Agar astrologer ki wealth prediction sach nahi hui to mujhe kya karna chahiye?"
    },
    answers: {
      en: "I would say — please do not treat it as your failure. Astrological predictions are traditional interpretations, not guarantees, and many factors decide outcomes. Avoid making further big financial decisions based on predictions alone. Reassess using verifiable information such as income, expenses, savings and loan terms. A responsible practitioner should acknowledge uncertainty, not pressure you into expensive remedies.",
      hi: "मैं कहूँगी — कृपया इसे अपनी विफलता न मानें। ज्योतिषीय भविष्यवाणियाँ पारंपरिक व्याख्याएँ हैं, गारंटी नहीं, और परिणाम कई कारक तय करते हैं। केवल भविष्यवाणी के आधार पर और बड़े वित्तीय निर्णय न लें। आय, खर्च, बचत और ऋण शर्तों जैसी सत्यापन योग्य जानकारी से पुनर्मूल्यांकन करें। जिम्मेदार अभ्यासी अनिश्चितता स्वीकार करेगा, महँगे उपायों के लिए दबाव नहीं डालेगा।",
      hinglish: "Main kahungi — please ise apni failure na maanein. Astrological predictions traditional interpretations hain, guarantees nahi, aur outcomes kayi factors decide karte hain. Sirf prediction ke basis par aur bade financial decisions na lein. Income, expenses, savings aur loan terms jaise verifiable information se reassess karein. Responsible practitioner uncertainty acknowledge karega, expensive remedies ke liye pressure nahi daalega."
    },
    answer_type: "spiritual_guidance",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: [],
    confidence: "general_education",
    disclaimer: D_EN
  },
  {
    id: "wealth_property_0074",
    category: "uncertainty_ethics",
    subcategory: "conflicting_readings",
    difficulty: "intermediate",
    questions: {
      en: "Why do two astrologers give different wealth readings for the same chart?",
      hi: "एक ही कुंडली पर दो ज्योतिषी अलग-अलग धन विश्लेषण क्यों देते हैं?",
      hinglish: "Ek hi kundli par do astrologers alag-alag wealth readings kyun dete hain?"
    },
    answers: {
      en: "Traditional astrology has multiple schools, interpretive priorities and techniques — different house systems, ayanamsa choices, yoga definitions and dasha calculations. Practitioners may weigh factors differently, producing different readings from the same birth data. This is a known feature of traditional interpretation, not proof that one is a guaranteed forecast. For financial decisions, rely on verifiable financial and legal information.",
      hi: "पारंपरिक ज्योतिष में कई संप्रदाय, व्याख्यात्मक प्राथमिकताएँ और तकनीकें हैं — भिन्न भाव-प्रणालियाँ, अयनांश विकल्प, योग परिभाषाएँ और दशा गणनाएँ। अभ्यासी कारकों को भिन्न महत्व दे सकते हैं, समान जन्म डेटा से भिन्न पठन बनते हैं। यह पारंपरिक व्याख्या की ज्ञात विशेषता है, यह प्रमाण नहीं कि कोई एक गारंटीकृत पूर्वानुमान है। वित्तीय निर्णयों के लिए सत्यापन योग्य वित्तीय और कानूनी जानकारी पर निर्भर रहें।",
      hinglish: "Traditional astrology mein multiple schools, interpretive priorities aur techniques hain — different house systems, ayanamsa choices, yoga definitions aur dasha calculations. Practitioners factors ko differently weigh kar sakte hain, same birth data se different readings banti hain. Yeh traditional interpretation ki known feature hai, proof nahi ki koi ek guaranteed forecast hai. Financial decisions ke liye verifiable financial aur legal information par rely karein."
    },
    answer_type: "spiritual_guidance",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: [],
    confidence: "general_education",
    disclaimer: D_EN
  },
  {
    id: "wealth_property_0075",
    category: "uncertainty_ethics",
    subcategory: "fear_marketing",
    difficulty: "beginner",
    questions: {
      en: "Someone told me my chart has a ‘wealth curse’. Should I be worried?",
      hi: "किसी ने कहा कि मेरी कुंडली में ‘धन शाप’ है। क्या मुझे चिंतित होना चाहिए?",
      hinglish: "Kisi ne kaha ki meri kundli mein ‘wealth curse’ hai. Kya mujhe worried hona chahiye?"
    },
    answers: {
      en: "Please do not be worried. ‘Wealth curse’ is not a classical category — it is language used in fear-based marketing to pressure people into expensive remedies. Real astrological texts discuss challenging combinations symbolically, not as curses. I would gently advise: walk away from anyone using fear to sell remedies. Financial planning is what actually helps.",
      hi: "कृपया चिंतित न हों। ‘धन शाप’ शास्त्रीय श्रेणी नहीं है — यह भय-आधारित मार्केटिंग की भाषा है जो लोगों को महँगे उपायों की ओर दबाव डालती है। वास्तविक ज्योतिष ग्रंथ चुनौतीपूर्ण संयोगों की प्रतीकात्मक चर्चा करते हैं, शाप के रूप में नहीं। मैं प्यार से सलाह दूँगी — जो उपाय बेचने के लिए भय का प्रयोग करें, उनसे दूर रहें। वित्तीय योजना वह है जो वास्तव में सहायक है।",
      hinglish: "Please worried na hon. ‘Wealth curse’ classical category nahi hai — yeh fear-based marketing ki language hai jo logon ko expensive remedies ki taraf pressure karti hai. Real astrological texts challenging combinations ki symbolic discussion karte hain, curses ke roop mein nahi. Main pyaar se salah dungi — jo remedies bechne ke liye fear ka use karein, unse door rahein. Financial planning wahi hai jo actually help karti hai."
    },
    answer_type: "spiritual_guidance",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: [],
    confidence: "general_education",
    disclaimer: D_EN
  },
  {
    id: "wealth_property_0076",
    category: "uncertainty_ethics",
    subcategory: "personal_chart",
    difficulty: "beginner",
    questions: {
      en: "Can you tell me exactly when I will become rich?",
      hi: "क्या आप मुझे बता सकती हैं कि मैं ठीक कब अमीर बनूँगा/बनूँगी?",
      hinglish: "Kya aap mujhe bata sakti hain ki main theek kab ameer banunga/banungi?"
    },
    answers: {
      en: "I will not — it would be dishonest. No chart can reliably say when someone becomes rich, and giving an exact date would be a manipulation of your hopes. What I can do is discuss traditional chart symbolism with verified birth details, and I can suggest practical steps: increase income sources, build savings, reduce high-interest debt, invest within your risk tolerance. Would you like to start with one of those?",
      hi: "मैं नहीं बताऊँगी — यह बेईमानी होगी। कोई कुंडली विश्वसनीय रूप से यह नहीं कह सकती कि कोई कब अमीर बनेगा, और सटीक तारीख देना आपकी आशाओं से खिलवाड़ होगा। मैं सत्यापित जन्म विवरण के साथ पारंपरिक कुंडली प्रतीकात्मकता पर चर्चा कर सकती हूँ, और व्यावहारिक कदम सुझा सकती हूँ: आय-स्रोत बढ़ाएँ, बचत बनाएँ, उच्च-ब्याज कर्ज़ घटाएँ, जोखिम सहनशीलता के अनुसार निवेश करें। क्या इनमें से एक से शुरू करें?",
      hinglish: "Main nahi bataaungi — yeh dishonest hoga. Koi chart reliably nahi keh sakti ki koi kab ameer banega, aur exact date dena aapki hopes se khelna hoga. Main verified birth details ke saath traditional chart symbolism discuss kar sakti hoon, aur practical steps suggest kar sakti hoon: income sources badhayein, savings banayein, high-interest debt kam karein, risk tolerance ke according invest karein. Kya inme se ek se shuru karein?"
    },
    answer_type: "traditional_astrology",
    requires_personal_chart: true,
    requires_calculation: true,
    source_ids: [],
    confidence: "uncertain",
    disclaimer: D_EN
  },
  {
    id: "wealth_property_0077",
    category: "uncertainty_ethics",
    subcategory: "spiritual_vs_financial",
    difficulty: "beginner",
    questions: {
      en: "How do I hold astrology and financial planning together honestly?",
      hi: "मैं ज्योतिष और वित्तीय योजना को ईमानदारी से साथ कैसे रख सकता/सकती हूँ?",
      hinglish: "Main astrology aur financial planning ko honestly saath kaise rakh sakta/sakti hoon?"
    },
    answers: {
      en: "I love this question. My view: astrology can be a reflective, cultural and spiritual practice — it can prompt self-questioning, patience and perspective. Financial planning is a practical discipline based on verifiable information: income, expenses, savings, debt, insurance and goals. Keep them in separate rooms in your mind. Let astrology offer meaning, and let financial planning make decisions.",
      hi: "मुझे यह प्रश्न बहुत पसंद आया। मेरा दृष्टिकोण: ज्योतिष एक चिंतनशील, सांस्कृतिक और आध्यात्मिक अभ्यास हो सकता है — यह आत्म-प्रश्न, धैर्य और दृष्टिकोण प्रेरित कर सकता है। वित्तीय योजना सत्यापन योग्य जानकारी पर आधारित व्यावहारिक अनुशासन है: आय, खर्च, बचत, कर्ज़, बीमा और लक्ष्य। इन्हें मन में अलग-अलग कमरों में रखें। ज्योतिष अर्थ दे, और वित्तीय योजना निर्णय ले।",
      hinglish: "Mujhe yeh question bahut pasand aaya. Mera view: astrology ek reflective, cultural aur spiritual practice ho sakti hai — yeh self-questioning, patience aur perspective inspire kar sakti hai. Financial planning verifiable information par based practical discipline hai: income, expenses, savings, debt, insurance aur goals. Inhe mind mein alag-alag kamron mein rakhein. Astrology meaning de, aur financial planning decisions le."
    },
    answer_type: "spiritual_guidance",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: [],
    confidence: "general_education",
    disclaimer: D_EN
  },

  // ─────────── FRAUD (2) ───────────
  {
    id: "wealth_property_0078",
    category: "fraud",
    subcategory: "unrealistic_returns",
    difficulty: "beginner",
    questions: {
      en: "How can I recognise unrealistic investment return promises?",
      hi: "मैं अवास्तविक निवेश रिटर्न के वादों को कैसे पहचान सकता/सकती हूँ?",
      hinglish: "Main unrealistic investment return promises kaise pehchan sakta/sakti hoon?"
    },
    answers: {
      en: "Warning signs — guaranteed high returns, pressure to invest quickly, unclear or unregistered schemes, returns that do not match the stated risk, and requests for OTPs or personal details. SEBI/NISM investor-education material specifically discusses spotting Ponzi schemes. Risk and return generally move together. Verify the entity’s registration with the relevant regulator.",
      hi: "चेतावनी संकेत — गारंटीकृत उच्च रिटर्न, जल्दी निवेश का दबाव, अस्पष्ट या अपंजीकृत योजनाएँ, बताए गए जोखिम से मेल न खाने वाले रिटर्न, और ओटीपी या व्यक्तिगत विवरण की माँग। सेबी/एनआईएसएम निवेश-शिक्षा सामग्री पोंजी योजनाओं की पहचान पर चर्चा करती है। जोखिम और रिटर्न सामान्यतः साथ चलते हैं। संबंधित नियामक के साथ इकाई का पंजीकरण जाँचें।",
      hinglish: "Warning signs — guaranteed high returns, jaldi invest karne ka pressure, unclear ya unregistered schemes, stated risk se match na karne wale returns, aur OTPs ya personal details ki demand. SEBI/NISM investor-education material specifically Ponzi schemes pehchanne par discuss karti hai. Risk aur return generally saath chalte hain. Relevant regulator ke saath entity ka registration verify karein."
    },
    answer_type: "financial_education",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: ["sebi_homemaker_pdf", "nism_investor_education"],
    confidence: "source_supported",
    disclaimer: D_EN
  },
  {
    id: "wealth_property_0079",
    category: "fraud",
    subcategory: "astrologer_fraud",
    difficulty: "beginner",
    questions: {
      en: "How can I tell if an astrologer is trying to defraud me?",
      hi: "मैं कैसे जानूँ कि कोई ज्योतिषी मुझे ठगने की कोशिश कर रहा/रही है?",
      hinglish: "Main kaise jaanu ki koi astrologer mujhe defraud karne ki koshish kar raha/rahi hai?"
    },
    answers: {
      en: "Red flags — pressure to act urgently, promises of guaranteed wealth, large fees for ‘secret remedies’, fear-based language, asking for OTPs or bank details, and refusal to explain uncertainty. A responsible practitioner will acknowledge limits and never guarantee outcomes. Trust verifiable information and your own judgment over urgency and fear.",
      hi: "चेतावनी संकेत — तत्काल कार्रवाई का दबाव, गारंटीकृत धन के वादे, ‘गुप्त उपायों’ के लिए बड़ी फीस, भय-आधारित भाषा, ओटीपी या बैंक विवरण की माँग, और अनिश्चितता समझाने से इंकार। जिम्मेदार अभ्यासी सीमाएँ स्वीकार करेगा और कभी परिणाम की गारंटी नहीं देगा। तात्कालिकता और भय से अधिक सत्यापन योग्य जानकारी और अपने विवेक पर भरोसा करें।",
      hinglish: "Red flags — urgent action ka pressure, guaranteed wealth ke promises, ‘secret remedies’ ke liye large fees, fear-based language, OTPs ya bank details maangna, aur uncertainty explain karne se inkaar. Responsible practitioner limits acknowledge karega aur kabhi outcomes guarantee nahi karega. Urgency aur fear se zyada verifiable information aur apni judgment par trust karein."
    },
    answer_type: "spiritual_guidance",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: [],
    confidence: "general_education",
    disclaimer: D_EN
  },

  // ─────────── BEGINNER (3) ───────────
  {
    id: "wealth_property_0080",
    category: "beginner",
    subcategory: "learn_basics",
    difficulty: "beginner",
    questions: {
      en: "I am new to Vedic astrology. Where should I start for wealth topics?",
      hi: "मैं वैदिक ज्योतिष में नया/नई हूँ। धन विषयों के लिए कहाँ से शुरू करूँ?",
      hinglish: "Main Vedic astrology mein naya/nayi hoon. Wealth topics ke liye kahan se shuru karun?"
    },
    answers: {
      en: "I would start you on: (1) meanings of houses 2, 4, 10, 11; (2) the Sun through Saturn plus Rahu/Ketu; (3) how to read a simple birth chart; and (4) the concept of lords and aspects. Only after that should you study yogas and dashas. Keep a healthy curiosity — many ‘wealth formulas’ on social media are simplified or inaccurate.",
      hi: "मैं शुरुआत इनसे कराऊँगी: (1) भाव 2, 4, 10, 11 के अर्थ; (2) सूर्य से शनि तक और राहु/केतु; (3) सरल जन्म कुंडली पढ़ना; और (4) स्वामी और दृष्टि की अवधारणा। उसके बाद ही योग और दशाएँ पढ़ें। स्वस्थ जिज्ञासा रखें — सोशल मीडिया पर कई ‘धन सूत्र’ सरलीकृत या गलत हैं।",
      hinglish: "Main shuruaat inse karaaungi: (1) houses 2, 4, 10, 11 ke meanings; (2) Sun se Saturn tak aur Rahu/Ketu; (3) simple birth chart padhna; aur (4) lords aur aspects ka concept. Uske baad hi yogas aur dashas study karein. Healthy curiosity rakhein — social media par kayi ‘wealth formulas’ simplified ya incorrect hain."
    },
    answer_type: "traditional_astrology",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: ["dhana_yoga_overview"],
    confidence: "traditional_interpretation",
    disclaimer: D_EN
  },
  {
    id: "wealth_property_0081",
    category: "beginner",
    subcategory: "glossary",
    difficulty: "beginner",
    questions: {
      en: "What do common Vedic astrology terms for wealth mean?",
      hi: "धन के लिए सामान्य वैदिक ज्योतिष शब्दों का क्या अर्थ है?",
      hinglish: "Wealth ke liye common Vedic astrology terms ka kya matlab hai?"
    },
    answers: {
      en: "A few I use often — Dhana Bhava (2nd house, savings), Labha Bhava (11th house, income), Sukha Bhava (4th house, home and comfort), Karma Bhava (10th house, career), Yoga (planetary combination), Dasha (planetary period), Gochar (transit). Each term has a long tradition — knowing the words is the start of study, not the end.",
      hi: "मेरे अक्सर प्रयुक्त कुछ शब्द — धन भाव (दूसरा भाव, बचत), लाभ भाव (ग्यारहवाँ भाव, आय), सुख भाव (चौथा भाव, घर और सुख), कर्म भाव (दसवाँ भाव, करियर), योग (ग्रह-संयोजन), दशा (ग्रह-काल), गोचर (संचरण)। प्रत्येक शब्द की लंबी परंपरा है — शब्द जानना अध्ययन की शुरुआत है, अंत नहीं।",
      hinglish: "Kuch terms jo main often use karti hoon — Dhana Bhava (2nd house, savings), Labha Bhava (11th house, income), Sukha Bhava (4th house, home aur comfort), Karma Bhava (10th house, career), Yoga (planetary combination), Dasha (planetary period), Gochar (transit). Har term ki long tradition hai — words jaanna study ki shuruaat hai, end nahi."
    },
    answer_type: "traditional_astrology",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: [],
    confidence: "traditional_interpretation",
    disclaimer: D_EN
  },
  {
    id: "wealth_property_0082",
    category: "beginner",
    subcategory: "research",
    difficulty: "beginner",
    questions: {
      en: "Which classical texts should I study for wealth astrology?",
      hi: "धन ज्योतिष के लिए कौन से शास्त्रीय ग्रंथ पढ़ने चाहिए?",
      hinglish: "Wealth astrology ke liye kaun se classical texts padhne chahiye?"
    },
    answers: {
      en: "Traditionally, students start with Brihat Parashara Hora Shastra, Jaimini Sutras, and Phaladeepika. Please use properly licensed or public-domain editions, with translators you can verify. I would also encourage you to also study SEBI/NISM investor-education material — because the financial side is what actually protects real wealth. Astrology is a symbolic tradition; financial literacy is a practical one.",
      hi: "पारंपरिक रूप से छात्र बृहत् पाराशर होरा शास्त्र, जैमिनी सूत्र और फलदीपिका से शुरू करते हैं। कृपया उचित लाइसेंस्ड या पब्लिक-डोमेन संस्करण उपयोग करें, जिनके अनुवादक सत्यापन योग्य हों। मैं यह भी सुझाऊँगी कि सेबी/एनआईएसएम निवेश-शिक्षा सामग्री भी पढ़ें — क्योंकि वित्तीय पक्ष ही असली धन की रक्षा करता है। ज्योतिष प्रतीकात्मक परंपरा है; वित्तीय साक्षरता व्यावहारिक है।",
      hinglish: "Traditionally, students Brihat Parashara Hora Shastra, Jaimini Sutras aur Phaladeepika se shuru karte hain. Please properly licensed ya public-domain editions use karein, jinke translators verifiable hon. Main yeh bhi suggest karungi ki SEBI/NISM investor-education material bhi padhein — kyunki financial side hi real wealth protect karti hai. Astrology symbolic tradition hai; financial literacy practical hai."
    },
    answer_type: "traditional_astrology",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: ["nism_investor_education"],
    confidence: "general_education",
    disclaimer: D_EN
  }
];

export function getAllEntries(): WealthPropertyEntry[] {
  return SEED_ENTRIES;
}

export function getEntryById(id: string): WealthPropertyEntry | undefined {
  return SEED_ENTRIES.find((e) => e.id === id);
}
