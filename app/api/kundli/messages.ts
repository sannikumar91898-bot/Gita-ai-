export type KundliErrorType =
  | "invalid_req"
  | "consent"
  | "missing_fields"
  | "bad_details"
  | "future_date"
  | "place_not_found"
  | "calc_failed"
  | "guest_blocked"
  | "wallet_recharge";

const dict: Record<string, Record<string, string>> = {
  hi: {
    invalid_req: "अमान्य अनुरोध। कृपया पुनः प्रयास करें।",
    consent: "कुंडली बनाने के लिए सहमति आवश्यक है।",
    missing_fields: "कृपया सभी जन्म विवरण भरें।",
    bad_details: "कृपया अपने जन्म विवरण की जाँच करें।",
    future_date: "जन्म तिथि भविष्य की नहीं हो सकती।",
    place_not_found: "जन्म स्थान नहीं मिला। शहर और राज्य साफ लिखें।",
    calc_failed: "कुंडली गणना नहीं हो सकी।",
    guest_blocked: "कुंडली बनाने के लिए लॉगिन या रजिस्टर करें।",
    wallet_recharge:
      "आपकी 2 मुफ्त कुंडली समाप्त हो गई हैं। अगली कुंडली ₹2 में बन सकती है। वॉलेट रिचार्ज करें।",
  },

  hinglish: {
    invalid_req: "Invalid request. Kripya phir try karein.",
    consent: "Kundli banane ke liye consent zaroori hai.",
    missing_fields: "Kripya sabhi birth details bharein.",
    bad_details: "Kripya birth details check karein.",
    future_date: "Birth date future ki nahi ho sakti.",
    place_not_found: "Birth place nahi mila. City aur state clear likhein.",
    calc_failed: "Kundli calculate nahi ho saki.",
    guest_blocked: "Kundli ke liye login ya register karein.",
    wallet_recharge:
      "Aapki 2 free Kundli khatam ho gayi hain. Next Kundli ₹2 mein hai. Wallet recharge karein.",
  },

  en: {
    invalid_req: "Invalid request. Please try again.",
    consent: "Consent is required to generate Kundli.",
    missing_fields: "Please fill in all birth details.",
    bad_details: "Please check your birth details.",
    future_date: "Birth date cannot be in the future.",
    place_not_found: "Birth location not found. Enter city and state clearly.",
    calc_failed: "Could not calculate Kundli.",
    guest_blocked: "Please login or register to generate Kundli.",
    wallet_recharge:
      "Your 2 free Kundlis are over. The next Kundli costs ₹2. Please recharge your wallet.",
  },

  te: {
    invalid_req: "చెల్లని అభ్యర్థన. మళ్లీ ప్రయత్నించండి.",
    consent: "కుండలి రూపొందించడానికి సమ్మతి అవసరం.",
    missing_fields: "అన్ని పుట్టిన వివరాలను పూరించండి.",
    bad_details: "పుట్టిన వివరాలను తనిఖీ చేయండి.",
    future_date: "పుట్టిన తేదీ భవిష్యత్తులో ఉండకూడదు.",
    place_not_found: "పుట్టిన ప్రదేశం కనుగొనబడలేదు.",
    calc_failed: "కుండలి లెక్కించలేకపోయాము.",
    guest_blocked: "దయచేసి లాగిన్ లేదా నమోదు చేసుకోండి.",
    wallet_recharge: "మీ 2 ఉచిత కుండలులు పూర్తయ్యాయి. తదుపరిది ₹2.",
  },

  ta: {
    invalid_req: "தவறான கோரிக்கை. மீண்டும் முயற்சிக்கவும்.",
    consent: "ஜாதகம் உருவாக்க ஒப்புதல் தேவை.",
    missing_fields: "அனைத்து பிறப்பு விவரங்களையும் நிரப்பவும்.",
    bad_details: "பிறப்பு விவரங்களைச் சரிபார்க்கவும்.",
    future_date: "பிறந்த தேதி எதிர்காலத்தில் இருக்க முடியாது.",
    place_not_found: "பிறந்த இடம் கிடைக்கவில்லை.",
    calc_failed: "ஜாதகத்தை கணக்கிட முடியவில்லை.",
    guest_blocked: "உள்நுழையவும் அல்லது பதிவு செய்யவும்.",
    wallet_recharge: "உங்கள் 2 இலவச ஜாதகங்கள் முடிந்துவிட்டன. அடுத்தது ₹2.",
  },

  kn: {
    invalid_req: "ಅಮಾನ್ಯ ವಿನಂತಿ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
    consent: "ಕುಂಡಲಿ ರಚಿಸಲು ಒಪ್ಪಿಗೆ ಅಗತ್ಯ.",
    missing_fields: "ಎಲ್ಲಾ ಜನ್ಮ ವಿವರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ.",
    bad_details: "ಜನ್ಮ ವಿವರಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.",
    future_date: "ಜನ್ಮ ದಿನಾಂಕ ಭವಿಷ್ಯದಲ್ಲಿರಲು ಸಾಧ್ಯವಿಲ್ಲ.",
    place_not_found: "ಜನ್ಮ ಸ್ಥಳ ಕಂಡುಬಂದಿಲ್ಲ.",
    calc_failed: "ಕುಂಡಲಿ ಲೆಕ್ಕಹಾಕಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.",
    guest_blocked: "ದಯವಿಟ್ಟು ಲಾಗಿನ್ ಅಥವಾ ನೋಂದಾಯಿಸಿ.",
    wallet_recharge: "ನಿಮ್ಮ 2 ಉಚಿತ ಕುಂಡಲಿಗಳು ಮುಗಿದಿವೆ. ಮುಂದಿನದು ₹2.",
  },

  bn: {
    invalid_req: "অবৈধ অনুরোধ। আবার চেষ্টা করুন।",
    consent: "কুণ্ডলী তৈরি করতে সম্মতি প্রয়োজন।",
    missing_fields: "সমস্ত জন্ম বিবরণ পূরণ করুন।",
    bad_details: "জন্ম বিবরণ পরীক্ষা করুন।",
    future_date: "জন্ম তারিখ ভবিষ্যতে হতে পারে না।",
    place_not_found: "জন্মস্থান পাওয়া যায়নি।",
    calc_failed: "কুণ্ডলী গণনা করা যায়নি।",
    guest_blocked: "কুণ্ডলী তৈরি করতে লগইন বা নিবন্ধন করুন।",
    wallet_recharge: "আপনার 2টি ফ্রি কুণ্ডলী শেষ। পরেরটি মাত্র ₹2।",
  },

  mr: {
    invalid_req: "अवैध विनंती. पुन्हा प्रयत्न करा.",
    consent: "कुंडली तयार करण्यासाठी संमती आवश्यक आहे.",
    missing_fields: "सर्व जन्म तपशील भरा.",
    bad_details: "जन्म तपशील तपासा.",
    future_date: "जन्म तारीख भविष्यातील असू शकत नाही.",
    place_not_found: "जन्मस्थान सापडले नाही.",
    calc_failed: "कुंडली गणना करता आली नाही.",
    guest_blocked: "कृपया लॉगिन किंवा नोंदणी करा.",
    wallet_recharge: "तुमच्या 2 मोफत कुंडल्या संपल्या. पुढची फक्त ₹2.",
  },

  gu: {
    invalid_req: "અમાન્ય વિનંતી. ફરી પ્રયાસ કરો.",
    consent: "કુંડળી બનાવવા સંમતિ જરૂરી છે.",
    missing_fields: "બધી જન્મ વિગતો ભરો.",
    bad_details: "જન્મ વિગતો તપાસો.",
    future_date: "જન્મ તારીખ ભવિષ્યની હોઈ શકે નહીં.",
    place_not_found: "જન્મ સ્થળ મળ્યું નથી.",
    calc_failed: "કુંડળીની ગણતરી થઈ શકી નથી.",
    guest_blocked: "કૃપા કરીને લોગિન અથવા નોંધણી કરો.",
    wallet_recharge: "તમારી 2 મફત કુંડળી પૂરી થઈ. આગળની માત્ર ₹2.",
  },

  ml: {
    invalid_req: "അസാധുവായ അഭ്യർത്ഥന. വീണ്ടും ശ്രമിക്കുക.",
    consent: "കുണ്ഡലി സൃഷ്ടിക്കാൻ സമ്മതം ആവശ്യമാണ്.",
    missing_fields: "എല്ലാ ജനന വിവരങ്ങളും പൂരിപ്പിക്കുക.",
    bad_details: "ജനന വിവരങ്ങൾ പരിശോധിക്കുക.",
    future_date: "ജനന തീയതി ഭാവിയിൽ ആകാൻ കഴിയില്ല.",
    place_not_found: "ജനന സ്ഥലം കണ്ടെത്തിയില്ല.",
    calc_failed: "കുണ്ഡലി കണക്കാക്കാൻ കഴിഞ്ഞില്ല.",
    guest_blocked: "ദയവായി ലോഗിൻ അല്ലെങ്കിൽ രജിസ്റ്റർ ചെയ്യുക.",
    wallet_recharge: "നിങ്ങളുടെ 2 സൗജന്യ കുണ്ഡലികൾ തീർന്നു. അടുത്തത് ₹2.",
  },
};

export function getKundliError(lang: string, type: KundliErrorType): string {
  return dict[lang]?.[type] ?? dict.en[type];
}