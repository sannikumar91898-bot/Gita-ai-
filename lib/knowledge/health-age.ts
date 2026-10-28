
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
      hi: "बेटा, सबसे पहले अपने शरीर के साथ प्यार और सम्मान से पेश आइए। नियमित नींद, संतुलित भोजन, पर्याप्त पानी और अपनी क्षमता के अनुसार शारीरिक गतिविधि से शुरुआत कीजिए। हर व्यक्ति का शरीर अलग होता है, इसलिए दूसरों से अपनी तुलना मत कीजिए। अगर कोई परेशानी लगातार बनी रहती है, तो डॉक्टर से सलाह लेना समझदारी है।",
      hinglish: "Beta, sabse pehle apni body ke saath pyaar aur respect se pesh aaiye. Regular sleep, balanced food, enough paani aur apni capacity ke hisaab se physical activity se shuru kijiye. Har body alag hoti hai, isliye khud ko doosron se compare mat kijiye. Koi problem lagatar rahe to doctor se consult karna samajhdari hai.",
      en: "Please treat your body with kindness and respect. Begin with regular sleep, balanced meals, enough water and physical activity suited to your ability. Every body is different, so avoid comparing yourself with others. If a concern persists, speak with a healthcare professional."
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
      hi: "बेटा, आपकी चिंता को मैं हल्के में नहीं लूँगी। बीमारी का डर कभी-कभी मन को बहुत थका देता है, लेकिन डर आना इस बात का प्रमाण नहीं कि कोई गंभीर बीमारी है। अपने लक्षणों पर ध्यान दें, इंटरनेट पर बार-बार खोजने से बचें और जरूरत हो तो डॉक्टर से जाँच कराएँ। धीरे-धीरे साँस लें और खुद को याद दिलाएँ कि आपको हर आशंका का जवाब इसी क्षण ढूँढ़ना जरूरी नहीं है।",
      hinglish: "Beta, main aapki concern ko lightly nahi loongi. Bimari ka darr kabhi-kabhi mind ko bahut thaka deta hai, lekin darr aana is baat ka proof nahi ki serious disease hai. Symptoms ko notice karein, baar-baar internet par search karne se bachein aur zarurat ho to doctor se check-up karayein. Dheere saans lein aur khud ko yaad dilayein ki har fear ka answer isi moment mein dhoondhna zaroori nahi.",
      en: "Your concern deserves to be taken seriously. Fear of illness can be exhausting, but fear alone does not prove that you have a serious condition. Notice your symptoms, avoid repeatedly searching online for reassurance, and seek medical assessment when appropriate. Take a slow breath and remember that you do not have to solve every worry immediately."
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
      hi: "प्यारे बच्चे, आपको हर समय मजबूत बने रहने की जरूरत नहीं है। कभी-कभी मन को भी आराम, समझ और सहारे की जरूरत होती है। आज सिर्फ एक छोटा कदम उठाइए—कुछ मिनट शांति से बैठिए, अपनी चिंताओं को लिखिए और उनमें से एक ऐसी बात चुनिए जिस पर आप अभी काम कर सकते हैं। नींद, पढ़ाई, काम या रोजमर्रा की जिंदगी प्रभावित हो रही हो, तो मानसिक स्वास्थ्य विशेषज्ञ से बात करना अच्छा कदम है।",
      hinglish: "Pyare bachche, aapko har waqt strong rehne ki zaroorat nahi hai. Kabhi-kabhi mind ko bhi rest, understanding aur support chahiye. Aaj bas ek chhota step lijiye—kuch minute shaant baithiye, apni worries likhiye aur unmein se ek aisi baat chuniye jis par abhi kaam kar sakte hain. Agar sleep, studies, work ya daily life affect ho rahi hai, to mental health professional se baat karna achha step hai.",
      en: "You do not have to be strong every moment. Sometimes the mind needs rest, understanding and support too. Try sitting quietly for a few minutes, writing down your worries, and choosing one manageable next step. If stress affects your sleep, studies, work or daily life, consider speaking with a mental health professional."
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
      hi: "बेटा, मैं आपको डराने वाला कोई अनुमान नहीं दूँगी। कुंडली से किसी व्यक्ति की मृत्यु की उम्र या जीवनकाल का भरोसेमंद निर्धारण नहीं किया जा सकता। आपका भविष्य किसी एक डरावनी बात में सीमित नहीं है। अभी अपने स्वास्थ्य, सुरक्षित आदतों, रिश्तों और उन कामों पर ध्यान दीजिए जो जीवन को अर्थपूर्ण बनाते हैं। अगर मृत्यु का डर बार-बार परेशान करता है, तो किसी भरोसेमंद व्यक्ति या मानसिक स्वास्थ्य विशेषज्ञ से बात कीजिए।",
      hinglish: "Beta, main aapko daraane wala koi prediction nahi doongi. Kundli se kisi insaan ki death age ya lifespan reliably determine nahi ki ja sakti. Aapka future kisi ek frightening baat tak limited nahi hai. Abhi health, safe habits, relationships aur un kaamon par dhyan dijiye jo life ko meaningful banate hain. Agar death ka fear baar-baar pareshan karta hai, to trusted person ya mental health professional se baat karein.",
      en: "I will not give you a frightening prediction. A birth chart cannot reliably determine someone's age at death or lifespan. Your future should not be reduced to a frightening claim. Focus on your health, safe habits, relationships and meaningful goals. If fear of death repeatedly troubles you, consider talking with someone you trust or a mental health professional."
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
      hi: "बेटा, अपनी सेहत की देखभाल डर से नहीं, प्यार से कीजिए। नियमित और संतुलित भोजन, पर्याप्त नींद, साफ पानी, व्यक्तिगत स्वच्छता, अपनी क्षमता के अनुसार व्यायाम और उचित टीकाकरण पर ध्यान दें। जरूरत के अनुसार नियमित स्वास्थ्य-जाँच कराएँ। कोई नया या लगातार बना रहने वाला लक्षण हो तो उसे केवल ग्रहों का प्रभाव समझकर नजरअंदाज न करें।",
      hinglish: "Beta, apni health ka khayal darr se nahi, pyaar se rakhiye. Balanced meals, enough sleep, clean water, personal hygiene, apni capacity ke hisaab se exercise aur recommended vaccinations par dhyan dein. Zaroorat ke hisaab se health check-up karayein. Koi naya ya persistent symptom ho to use sirf grahon ka effect samajhkar ignore mat karein.",
      en: "Care for your health out of kindness, not fear. Focus on balanced meals, adequate sleep, clean water, personal hygiene, appropriate physical activity and recommended vaccinations. Arrange health checks when appropriate. Do not dismiss new or persistent symptoms as planetary influences."
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
      hi: "बेटा, वैदिक ज्योतिष की परंपरा में कुछ भावों और ग्रहों को स्वास्थ्य से प्रतीकात्मक रूप से जोड़ा जाता है। लेकिन ये व्याख्याएँ वैज्ञानिक चिकित्सा-जाँच का विकल्प नहीं हैं और इनसे बीमारी का पता नहीं लगाया जा सकता। यदि आप चाहें, तो हम इस परंपरा को सांस्कृतिक और आध्यात्मिक दृष्टिकोण से समझ सकते हैं—बिना डर पैदा किए और बिना किसी बीमारी की भविष्यवाणी किए।",
      hinglish: "Beta, Vedic astrology ki tradition mein kuch houses aur grahon ko health se symbolically joda jata hai. Lekin yeh interpretations medical examination ka replacement nahi hain aur inse disease diagnose nahi ki ja sakti. Aap chahein to hum is tradition ko cultural aur spiritual perspective se samajh sakte hain—bina fear create kiye aur bina disease predict kiye.",
      en: "In traditional Vedic astrology, certain houses and planets are symbolically associated with health. These interpretations are not a substitute for medical evaluation and cannot diagnose disease. We can explore the tradition as a cultural and spiritual perspective without creating fear or predicting illness."
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
      hi: "मेरे प्यारे बच्चे, मदद की जरूरत होना कमजोरी नहीं है। आपको सब कुछ अकेले संभालने की जरूरत भी नहीं है। आज अपने लिए एक आसान काम चुनिए—समय पर खाना, थोड़ी सैर, आराम या किसी अपने से बात करना। अगर कमजोरी शारीरिक है और बनी रहती है, तो डॉक्टर से कारण की जाँच कराएँ। छोटे कदम भी देखभाल का हिस्सा हैं, और आप सहारा पाने के हकदार हैं।",
      hinglish: "Mere pyare bachche, help ki zaroorat hona weakness nahi hai. Aapko sab kuch akele manage karne ki zaroorat bhi nahi. Aaj apne liye ek simple step chuniye—time par khana, thodi walk, rest ya kisi apne se baat karna. Agar physical weakness lagatar bani rahe, to doctor se cause check karayein. Chhote steps bhi self-care hain, aur aap support deserve karte hain.",
      en: "Needing help is not weakness, and you do not have to manage everything alone. Choose one simple act of care today: eating on time, taking a gentle walk, resting or talking to someone you trust. If physical weakness persists, ask a healthcare professional to assess it. Small steps count, and you deserve support."
    },
    tags: ["self-compassion", "encouragement", "support"],
    answer_type: "wellbeing_guidance"
  }
];

export { HEALTH_SAFETY_NOTE };
