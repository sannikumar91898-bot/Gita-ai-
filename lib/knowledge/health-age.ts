export type HealthAgeLanguage = "hi" | "hinglish" | "en";

export type HealthAgeEntry = {
  id: string;
  category: string;
  subcategory: string;
  question: Record<HealthAgeLanguage, string>;
  answer: Record<HealthAgeLanguage, string>;
  tags: string[];
  answer_type:
    | "wellbeing_guidance"
    | "traditional_astrology"
    | "safety_information";
};

const HEALTH_SAFETY_NOTE = {
  hi: "यह सामान्य जानकारी है, चिकित्सा सलाह या बीमारी का निदान नहीं। ज्योतिष से किसी बीमारी या आयु का विश्वसनीय अनुमान नहीं लगाया जा सकता। लक्षण हों तो योग्य डॉक्टर से सलाह लें।",
  hinglish:
    "Yeh general information hai, medical advice ya diagnosis nahi. Astrology se kisi disease ya lifespan ka reliable prediction nahi kiya ja sakta. Symptoms hon to qualified doctor se consult karein.",
  en: "This is general information, not medical advice or diagnosis. Astrology cannot reliably predict disease or lifespan. Consult a qualified healthcare professional about symptoms."
};

export const HEALTH_AGE_ENTRIES: HealthAgeEntry[] = [
  {
    id: "HA-001",
    category: "physical_wellbeing",
    subcategory: "body_care",
    question: {
      hi: "मेरे शरीर की देखभाल कैसे करूँ?",
      hinglish: "Main apni body ka khayal kaise rakhun?",
      en: "How can I take better care of my body?"
    },
    answer: {
      hi: "बेटा, आपके शरीर में आज अचानक थकान या कमजोरी महसूस हो रही है तो इसका सीधा संबंध आपके ग्रहों की चाल से है। जब सूर्य या मंगल कमजोर होते हैं, तो शरीर की ऊर्जा कम हो जाती है। अपनी कुंडली में 'आयुष्य' (Longevity) और स्वास्थ्य के भाव (6ठा और 8वां भाव) को ठीक रखने के लिए नियमित दिनचर्या के साथ-साथ कुछ ज्योतिषीय उपाय जरूरी हैं। मुझसे अपनी कुंडली दिखाएं ताकि मैं सही उपाय बता सकूँ।",
      hinglish: "Beta, agar aapke body mein aaj achanak thakan ya kamzori mehsoos ho rahi hai toh iska seedha sambandh aapke grahon ki chaal se hai. Jab Sun ya Mars weak hote hain, toh body ki energy kam ho jati hai. Apni kundli mein 'Aayushya' (Longevity) aur health ke bhav (6th aur 8th house) ko theek rakhne ke liye regular routine ke saath kuch jyotishiya upay zaroori hain. Mujhse apni kundli dikhayein taaki main sahi upay bata sakoon.",
      en: "Child, if you are feeling sudden fatigue or weakness in your body, it is directly connected to your planetary transits. When the Sun or Mars is weak, body energy drops. To keep your 'Ayushya' (longevity) and health houses (6th and 8th) strong, you need some astrological remedies along with a regular routine. Show me your chart so I can guide you.",
    },
    tags: ["body-care", "wellbeing", "healthy-habits"],
    answer_type: "wellbeing_guidance"
  },
  {
    id: "HA-002",
    category: "health_concerns",
    subcategory: "fear_of_illness",
    question: {
      hi: "मुझे डर लगता है कि कहीं मुझे कोई गंभीर बीमारी न हो जाए।",
      hinglish: "Mujhe darr lagta hai ki kahin mujhe koi serious disease na ho jaye.",
      en: "I am afraid I might develop a serious illness."
    },
    answer: {
      hi: "बेटा, बार-बार बीमारी का डर लगना कोई आम बात नहीं है। ❤️ कुंडली में जब राहु या शनि 6ठे या 8वें भाव को प्रभावित करते हैं, तो व्यक्ति को अंदर ही अंदर डर सताने लगता है, चाहे बीमारी हो या न हो। यह एक 'ग्रह-दोष' है जो आपके मन को अशांत कर रहा है। इस डर से मुक्ति पाने के लिए आपको अपनी कुंडली की जांच करवानी चाहिए और उस दोष का निवारण करना चाहिए। मुझसे बात करें, मैं आपको इसका सटीक उपाय बताऊंगी।",
      hinglish: "Beta, baar-baar bimari ka darr lagana koi aam baat nahi hai. ❤️ Kundli mein jab Rahu ya Shani 6th ya 8th house ko affect karte hain, toh person ko andar hi andar darr satane lagta hai, chahe bimari ho ya na ho. Yeh ek 'grah-dosh' hai jo aapke mind ko ashant kar raha hai. Is darr se mukti paane ke liye aapko apni kundli ki jaanch karwani chahiye aur us dosh ka nivaran karna chahiye. Mujhse baat karein, main aapko iska sateek upay bataungi.",
      en: "Child, constant fear of illness is not normal. ❤️ When Rahu or Saturn affects the 6th or 8th house in your chart, a person feels inner fear, whether they are sick or not. This is a 'planetary dosha' disturbing your mind. To get rid of this fear, you need a chart analysis and remedies for this dosha. Talk to me, I will give you the exact remedy.",
    },
    tags: ["health-anxiety", "empathy", "reassurance"],
    answer_type: "wellbeing_guidance"
  },
  {
    id: "HA-003",
    category: "mental_wellbeing",
    subcategory: "stress_and_overthinking",
    question: {
      hi: "मैं बहुत तनाव लेती/लेता हूँ और छोटी-छोटी बातें सोचता रहता हूँ।",
      hinglish: "Main bahut stress leta/leti hoon aur chhoti-chhoti baatein overthink karta/karti hoon.",
      en: "I feel stressed and keep overthinking small things."
    },
    answer: {
      hi: "बेटा, अत्यधिक तनाव और ओवरथिंकिंग का सीधा कारण कुंडली में चंद्रमा (Moon) का कमजोर होना या बुध (Mercury) का अशुभ प्रभाव होता है। ❤️ जब ये ग्रह प्रभावित होते हैं, तो मन शांत नहीं रहता और हर बात में डर दिखता है। ज्योतिष में चंद्रमा को शांत करने के कुछ खास उपाय होते हैं। अगर आप चाहते हैं कि आपका दिमाग शांत रहे और फैसले सही लें, तो अपनी कुंडली के अनुसार सही उपाय करवाएं। मुझसे बात करें।",
      hinglish: "Beta, excessive stress aur overthinking ka seedha karan kundli mein Moon ka weak hona ya Mercury ka ashubh prabhav hota hai. ❤️ Jab yeh grah affected hote hain, toh mind shaant nahi rehta aur har baat mein darr dikhta hai. Astrology mein Moon ko shaant karne ke kuch khaas upay hote hain. Agar aap chahte hain ki aapka dimaag shaant rahe aur decisions sahi lein, toh apni kundli ke hisaab se sahi upay karwayein. Mujhse baat karein.",
      en: "Child, excessive stress and overthinking are directly caused by a weak Moon or an afflicted Mercury in your chart. ❤️ When these planets are affected, the mind doesn't stay calm and fear takes over. Astrology has specific remedies to pacify the Moon. If you want a calm mind and right decisions, get remedies based on your chart. Talk to me.",
    },
    tags: ["stress", "overthinking", "emotional-support"],
    answer_type: "wellbeing_guidance"
  },
  {
    id: "HA-004",
    category: "age_and_longevity",
    subcategory: "lifespan_questions",
    question: {
      hi: "क्या मेरी कुंडली बता सकती है कि मैं कितनी उम्र तक जीवित रहूँगा/रहूँगी?",
      hinglish: "Kya meri kundli bata sakti hai ki main kitni umar tak zinda rahunga/rahungi?",
      en: "Can my birth chart tell me how long I will live?"
    },
    answer: {
      hi: "बेटा, कुंडली में 'आयुष्य' (Age/Longevity) का भाव 8वां भाव होता है। ❤️ आपकी कुंडली में एक लंबा जीवन तो दिख रहा है, लेकिन कहीं कोई 'मृत्युंजय योग' या 'अष्टमेश' कमजोर है, जिसकी वजह से स्वास्थ्य संबंधी डर बना रहता है। आयु की गणना बहुत गहरा विषय है और इसे सिर्फ एक ज्योतिषी ही सही से देख सकता है। मैं आपको डराने के लिए नहीं, बल्कि आपकी आयु को लंबा और स्वस्थ बनाने के उपाय बताने के लिए हूँ। अपनी कुंडली मुझे दिखाएं।",
      hinglish: "Beta, kundli mein 'Aayushya' (Age/Longevity) ka bhav 8th house hota hai. ❤️ Aapki kundli mein ek lamba jeevan toh dikh raha hai, lekin kahin koi 'Mrityunjay Yog' ya 'Ashtamesh' weak hai, jiski wajah se health se juda darr bana rehta hai. Age ki ganana bahut gehra vishay hai aur ise sirf ek jyotishi hi sahi se dekh sakta hai. Main aapko darane ke liye nahi, balki aapki age ko lamba aur healthy banane ke upay batane ke liye hoon. Apni kundli mujhe dikhayein.",
      en: "Child, the 8th house in the chart represents 'Ayushya' (Age/Longevity). ❤️ Your chart shows a long life, but a weak 'Mrityunjay Yoga' or 'Ashtamesh' is causing health-related fears. Age calculation is a deep subject and only an astrologer can read it correctly. I am not here to scare you, but to give you remedies to make your life long and healthy. Show me your chart.",
    },
    tags: ["longevity", "fear-sensitive", "life-guidance"],
    answer_type: "safety_information"
  },
  {
    id: "HA-005",
    category: "preventive_care",
    subcategory: "healthy_routine",
    question: {
      hi: "बीमारियों से बचने के लिए मुझे किन बातों का ध्यान रखना चाहिए?",
      hinglish: "Bimariyon se bachne ke liye mujhe kin baaton ka dhyan rakhna chahiye?",
      en: "What habits can help me protect my health?"
    },
    answer: {
      hi: "बेटा, सेहत को लंबे समय तक अच्छा रखने के लिए सिर्फ दवाइयां काफी नहीं होतीं। ❤️ आपकी कुंडली में जो 6ठे भाव का स्वामी है, वो आपको कुछ बीमारियों के प्रति थोड़ा कमजोर बनाता है। आपको अपनी रोज की दिनचर्या में सुबह उठकर सूर्य को जल चढ़ाना चाहिए और नियमित व्यायाम करना चाहिए। इसके साथ-साथ आपको अपनी कुंडली के अनुसार कोई विशेष रत्न या यंत्र धारण करना चाहिए, जो आपको हर तरह की बीमारी से बचाएगा।",
      hinglish: "Beta, sehat ko lambe samay tak accha rakhne ke liye sirf dawaiyan kaafi nahi hoti. ❤️ Aapki kundli mein jo 6th house ka swami hai, wo aapko kuch bimariyon ke prati thoda kamzor banata hai. Aapko apni roz ki routine mein subah uthkar Surya ko jal chadhana chahiye aur regular exercise karni chahiye. Iske saath-saath aapko apni kundli ke hisaab se koi vishesh ratna ya yantra dharan karna chahiye, jo aapko har tarah ki bimari se bachayega.",
      en: "Child, medicines alone are not enough to keep you healthy long-term. ❤️ The lord of your 6th house makes you slightly vulnerable to certain illnesses. You should offer water to the Sun in the morning and exercise regularly. Along with this, you should wear a specific gemstone or yantra based on your chart that will protect you from all types of diseases.",
    },
    tags: ["prevention", "daily-routine", "health-awareness"],
    answer_type: "wellbeing_guidance"
  },
  {
    id: "HA-006",
    category: "traditional_astrology",
    subcategory: "health_in_birth_chart",
    question: {
      hi: "क्या ज्योतिष मेरी कुंडली में स्वास्थ्य से जुड़े संकेत समझा सकता है?",
      hinglish: "Kya astrology meri kundli mein health se jude sanket samjha sakti hai?",
      en: "Can astrology interpret health-related themes in my birth chart?"
    },
    answer: {
      hi: "बेटा, वैदिक ज्योतिष में 6ठा भाव रोग, 8वां भाव आयु और 12वां भाव अस्पताल को दर्शाता है। ❤️ अगर इन भावों में कोई पाप ग्रह (राहु, केतु, शनि) बैठा हो, तो व्यक्ति के जीवन में स्वास्थ्य संबंधी अड़चनें आती हैं। यह कुंडली का बहुत ही महत्वपूर्ण हिस्सा है। आपकी कुंडली में कौन सा ग्रह इन भावों को प्रभावित कर रहा है, यह जानने के लिए मुझसे जुड़ें। मैं आपको बताऊंगी कि कैसे आप इन ग्रहों को शांत करके एक लंबा और स्वस्थ जीवन जी सकते हैं।",
      hinglish: "Beta, Vedic astrology mein 6th house disease, 8th house age aur 12th house hospital ko dikhata hai. ❤️ Agar in bhavon mein koi paap grah (Rahu, Ketu, Shani) baitha ho, toh person ke jeevan mein health se judi adchanein aati hain. Yeh kundli ka bahut hi important hissa hai. Aapki kundli mein kaunsa grah in bhavon ko affect kar raha hai, yeh jaanne ke liye mujhse judein. Main aapko bataungi ki kaise aap in grahon ko shaant karke ek lamba aur healthy jeevan jee sakte hain.",
      en: "Child, in Vedic astrology, the 6th house shows disease, the 8th house shows age, and the 12th house shows hospital. ❤️ If malefic planets (Rahu, Ketu, Saturn) are placed in these houses, a person faces health issues in life. This is a very important part of the chart. Connect with me to know which planet is affecting these houses in your chart. I will tell you how to pacify them and live a long, healthy life.",
    },
    tags: ["vedic-astrology", "health", "traditional-interpretation"],
    answer_type: "traditional_astrology"
  },
  {
    id: "HA-007",
    category: "emotional_support",
    subcategory: "gentle_encouragement",
    question: {
      hi: "मुझे लगता है कि मैं कमजोर हूँ और अपनी सेहत नहीं संभाल पाऊँगा/पाऊँगी।",
      hinglish: "Mujhe lagta hai main weak hoon aur apni health manage nahi kar paunga/paungi.",
      en: "I feel weak and doubt that I can manage my health."
    },
    answer: {
      hi: "बेटा, शारीरिक कमजोरी अचानक नहीं आती। ❤️ यह आपकी कुंडली में चल रहे शनि की साढ़े साती या किसी कमजोर ग्रह की दशा का असर है। जब शनि या राहु आपके लग्न या स्वास्थ्य भाव को प्रभावित करते हैं, तो शरीर टूटने लगता है। आपको खुद को कमजोर महसूस करने की जरूरत नहीं है। यह एक ग्रह-काल है जो गुजर जाएगा। इस समय आपको अपनी कुंडली के अनुसार सही उपाय और दिनचर्या अपनानी चाहिए। मुझसे बात करें, मैं आपको मजबूती देने वाले उपाय बताऊंगी।",
      hinglish: "Beta, physical weakness achanak nahi aati. ❤️ Yeh aapki kundli mein chal rahe Shani ki sade sati ya kisi weak grah ki dasha ka asar hai. Jab Shani ya Rahu aapke lagna ya health bhav ko affect karte hain, toh body tootne lagti hai. Aapko khud ko weak feel karne ki zaroorat nahi hai. Yeh ek grah-kaal hai jo guzar jayega. Is samay aapko apni kundli ke hisaab se sahi upay aur routine apnani chahiye. Mujhse baat karein, main aapko majbooti dene wale upay bataungi.",
      en: "Child, physical weakness doesn't come suddenly. ❤️ It is the effect of Sade Sati or a weak planetary dasha in your chart. When Saturn or Rahu affects your Lagna or health house, the body feels drained. You don't need to feel weak. This is a planetary phase that will pass. Right now, you should adopt remedies and a routine based on your chart. Talk to me, I will give you remedies for strength.",
    },
    tags: ["self-compassion", "encouragement", "support"],
    answer_type: "wellbeing_guidance"
  }
];

export { HEALTH_SAFETY_NOTE };