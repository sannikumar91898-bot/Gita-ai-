// app/api/daily/route.ts
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// 🔥 10 Languages Support
const SUPPORTED_LANGUAGES = ["hi", "hinglish", "en", "te", "ta", "kn", "bn", "mr", "gu", "ml"];

type DailyReading = {
  focus: string;
  luckyColour: { name: string; hex: string };
  luckyNumber: number;
  affirmation: string;
};

// 12 राशियों का पूरी तरह से Personalized और Business-Hooked डेटाबेस (10 Languages)
const FALLBACK_DATA: Record<string, Record<string, DailyReading>> = {
  Mesh: {
    hi: { focus: "आज ऊर्जा का स्तर ऊंचा रहेगा, लेकिन कार्यक्षेत्र में कोई गुप्त उलझन परेशान कर सकती है। घबराएं नहीं, हमारी महिला ज्योतिषी से दिल की बात कहें।", luckyColour: { name: "लाल", hex: "#EF4444" }, luckyNumber: 9, affirmation: "मैं अपनी ऊर्जा को सही दिशा में लगा रहा हूँ।" },
    hinglish: { focus: "Aaj energy ka level high rahega, par workplace par koi hidden confusion pareshan kar sakti hai. Ghabrayein nahi, humari Mahila Jyotishi se dil ki baat kahein.", luckyColour: { name: "Laal", hex: "#EF4444" }, luckyNumber: 9, affirmation: "Mein apni energy ko sahi direction mein laga raha hoon." },
    en: { focus: "Energy levels are high, but a workplace dilemma might trouble you. Don't worry, talk from the heart with our Female Astrologer for guidance.", luckyColour: { name: "Red", hex: "#EF4444" }, luckyNumber: 9, affirmation: "I direct my energy toward positive results." },
    te: { focus: "ఈరోజు శక్తి స్థాయి ఎక్కువగా ఉంటుంది, కానీ పని ప్రదేశంలో ఏదో గందరగోళం మీకు ఇబ్బంది కలిగించవచ్చు. భయపడకండి, మా మహిళా జ్యోతిష్యురాలితో మీ మనసులోని మాట చెప్పండి.", luckyColour: { name: "ఎరుపు", hex: "#EF4444" }, luckyNumber: 9, affirmation: "నేను నా శక్తిని సరైన దిశలో ఉపయోగిస్తున్నాను." },
    ta: { focus: "இன்று ஆற்றல் அளவு அதிகமாக இருக்கும், ஆனால் பணியிடத்தில் ஏதோ குழப்பம் உங்களை பாதிக்கலாம். பயப்பட வேண்டாம், எங்கள் பெண் ஜோதிடருடன் மனதில் உள்ளதை பேசுங்கள்.", luckyColour: { name: "சிவப்பு", hex: "#EF4444" }, luckyNumber: 9, affirmation: "என் ஆற்றலை சரியான திசையில் செலுத்துகிறேன்." },
    kn: { focus: "ಇಂದು ಶಕ್ತಿಯ ಮಟ್ಟ ಹೆಚ್ಚಾಗಿರುತ್ತದೆ, ಆದರೆ ಕೆಲಸದ ಸ್ಥಳದಲ್ಲಿ ಏನೋ ಗೊಂದಲ ನಿಮ್ಮನ್ನು ಕಾಡಬಹುದು. ಹೆದರಬೇಡಿ, ನಮ್ಮ ಮಹಿಳಾ ಜ್ಯೋತಿಷಿಯೊಂದಿಗೆ ಮನಸ್ಸಿನ ಮಾತು ಹೇಳಿ.", luckyColour: { name: "ಕೆಂಪು", hex: "#EF4444" }, luckyNumber: 9, affirmation: "ನಾನು ನನ್ನ ಶಕ್ತಿಯನ್ನು ಸರಿಯಾದ ದಿಕ್ಕಿನಲ್ಲಿ ಬಳಸುತ್ತಿದ್ದೇನೆ." },
    bn: { focus: "আজ শক্তির মাত্রা বেশি থাকবে, তবে কর্মক্ষেত্রে কিছু বিভ্রান্তি আপনাকে বিরক্ত করতে পারে। ভয় পাবেন না, আমাদের মহিলা জ্যোতিষীর সাথে মনের কথা বলুন।", luckyColour: { name: "লাল", hex: "#EF4444" }, luckyNumber: 9, affirmation: "আমি আমার শক্তি সঠিক দিকে ব্যবহার করছি।" },
    mr: { focus: "आज ऊर्जा पातळी उच्च राहील, परंतु कार्यक्षेत्रात काही गोंधळ तुम्हाला त्रास देऊ शकतो. घाबरू नका, आमच्या महिला ज्योतिषाशी मनातील गोष्ट बोला.", luckyColour: { name: "लाल", hex: "#EF4444" }, luckyNumber: 9, affirmation: "मी माझी ऊर्जा योग्य दिशेने वापरत आहे." },
    gu: { focus: "આજે ઊર્જાનું સ્તર ઊંચું રહેશે, પરંતુ કાર્યસ્થળે કોઈ ગૂંચવણ તમને પરેશાન કરી શકે છે. ગભરાશો નહીં, અમારા મહિલા જ્યોતિષી સાથે મનની વાત કરો.", luckyColour: { name: "લાલ", hex: "#EF4444" }, luckyNumber: 9, affirmation: "હું મારી ઊર્જાનો યોગ્ય દિશામાં ઉપયોગ કરું છું." },
    ml: { focus: "ഇന്ന് ഊർജ്ജ നില ഉയർന്നതായിരിക്കും, പക്ഷേ ജോലിസ്ഥലത്ത് എന്തെങ്കിലും ആശയക്കുഴപ്പം നിങ്ങളെ അലട്ടിയേക്കാം. ഭയപ്പെടേണ്ട, ഞങ്ങളുടെ വനിതാ ജ്യോതിഷിയുമായി മനസ്സിലുള്ളത് പറയുക.", luckyColour: { name: "ചുവപ്പ്", hex: "#EF4444" }, luckyNumber: 9, affirmation: "ഞാൻ എന്റെ ഊർജ്ജം ശരിയായ ദിശയിൽ ഉപയോഗിക്കുന്നു." },
  },
  Vrishabh: {
    hi: { focus: "आज मन थोड़ा अस्थिर रहेगा। आर्थिक मामलों में जल्दबाजी न करें। हमारी महिला ज्योतिषी से परामर्श लें।", luckyColour: { name: "सफ़ेद", hex: "#FFFFFF" }, luckyNumber: 6, affirmation: "मैं धैर्य के साथ सही निर्णय लेता हूँ।" },
    hinglish: { focus: "Aaj mann thoda unstable rahega. Financial matters mein jaldbaazi na karein. Humari Mahila Jyotishi se consult karein.", luckyColour: { name: "Safed", hex: "#FFFFFF" }, luckyNumber: 6, affirmation: "Mein patience ke sath sahi decision leta hoon." },
    en: { focus: "Your mind might feel restless today. Avoid rushing into financial decisions. Talk to our Female Astrologer for guidance.", luckyColour: { name: "White", hex: "#FFFFFF" }, luckyNumber: 6, affirmation: "I make wise decisions with patience." },
    te: { focus: "ఈరోజు మీ మనస్సు కొంచెం అస్థిరంగా ఉంటుంది. ఆర్థిక విషయాల్లో తొందరపడకండి. మా మహిళా జ్యోతిష్యురాలిని సంప్రదించండి.", luckyColour: { name: "తెలుపు", hex: "#FFFFFF" }, luckyNumber: 6, affirmation: "నేను ఓపికతో సరైన నిర్ణయం తీసుకుంటాను." },
    ta: { focus: "இன்று உங்கள் மனம் சற்று அமைதியற்றதாக இருக்கும். நிதி விஷயங்களில் அவசரப்பட வேண்டாம். எங்கள் பெண் ஜோதிடரை அணுகவும்.", luckyColour: { name: "வெள்ளை", hex: "#FFFFFF" }, luckyNumber: 6, affirmation: "நான் பொறுமையுடன் சரியான முடிவு எடுக்கிறேன்." },
    kn: { focus: "ಇಂದು ನಿಮ್ಮ ಮನಸ್ಸು ಸ್ವಲ್ಪ ಅಸ್ಥಿರವಾಗಿರುತ್ತದೆ. ಆರ್ಥಿಕ ವಿಷಯಗಳಲ್ಲಿ ಆತುರಪಡಬೇಡಿ. ನಮ್ಮ ಮಹಿಳಾ ಜ್ಯೋತಿಷಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ.", luckyColour: { name: "ಬಿಳಿ", hex: "#FFFFFF" }, luckyNumber: 6, affirmation: "ನಾನು ತಾಳ್ಮೆಯಿಂದ ಸರಿಯಾದ ನಿರ್ಧಾರ ತೆಗೆದುಕೊಳ್ಳುತ್ತೇನೆ." },
    bn: { focus: "আজ আপনার মন কিছুটা অস্থির থাকবে। আর্থিক বিষয়ে তাড়াহুড়ো করবেন না। আমাদের মহিলা জ্যোতিষীর সাথে পরামর্শ করুন।", luckyColour: { name: "সাদা", hex: "#FFFFFF" }, luckyNumber: 6, affirmation: "আমি ধৈর্যের সাথে সঠিক সিদ্ধান্ত নিই।" },
    mr: { focus: "आज तुमचे मन थोडे अस्थिर राहील. आर्थिक बाबींमध्ये घाई करू नका. आमच्या महिला ज्योतिषाशी सल्ला घ्या.", luckyColour: { name: "पांढरा", hex: "#FFFFFF" }, luckyNumber: 6, affirmation: "मी संयमाने योग्य निर्णय घेतो." },
    gu: { focus: "આજે તમારું મન થોડું અસ્થિર રહેશે. આર્થિક બાબતોમાં ઉતાવળ ન કરો. અમારા મહિલા જ્યોતિષીની સલાહ લો.", luckyColour: { name: "સફેદ", hex: "#FFFFFF" }, luckyNumber: 6, affirmation: "હું ધીરજથી સાચો નિર્ણય લઉં છું." },
    ml: { focus: "ഇന്ന് നിങ്ങളുടെ മനസ്സ് അൽപ്പം അസ്ഥിരമായിരിക്കും. സാമ്പത്തിക കാര്യങ്ങളിൽ തിരക്ക് കാണിക്കരുത്. ഞങ്ങളുടെ വനിതാ ജ്യോതിഷിയെ സമീപിക്കുക.", luckyColour: { name: "വെള്ള", hex: "#FFFFFF" }, luckyNumber: 6, affirmation: "ഞാൻ ക്ഷമയോടെ ശരിയായ തീരുമാനം എടുക്കുന്നു." },
  },
  Mithun: {
    hi: { focus: "संचार क्षमता आज प्रबल रहेगी। रिश्तों में पुरानी गलतफहमी हो सकती है। इसे दूर करने के लिए ज्योतिषी से बात करें।", luckyColour: { name: "हरा", hex: "#22C55E" }, luckyNumber: 5, affirmation: "मैं स्पष्ट और ईमानदारी से बात करता हूँ।" },
    hinglish: { focus: "Communication power aaj strong rahegi. Rishton mein kisi purani baat ko lekar galatfehmi ho sakti hai. Ise door karne ke liye Jyotishi se baat karein.", luckyColour: { name: "Hara", hex: "#22C55E" }, luckyNumber: 5, affirmation: "Mein clear aur imandari se baat karta hoon." },
    en: { focus: "Communication is your strength today. A past misunderstanding might resurface. Connect with our experienced Astrologer to clear the air.", luckyColour: { name: "Green", hex: "#22C55E" }, luckyNumber: 5, affirmation: "I communicate with clarity and honesty." },
    te: { focus: "సంభాషణ శక్తి ఈరోజు బలంగా ఉంటుంది. సంబంధాలలో పాత అపార్థం తలెత్తవచ్చు. దీన్ని తొలగించడానికి జ్యోతిష్యుడిని సంప్రదించండి.", luckyColour: { name: "ఆకుపచ్చ", hex: "#22C55E" }, luckyNumber: 5, affirmation: "నేను స్పష్టంగా మరియు నిజాయితీగా మాట్లాడుతాను." },
    ta: { focus: "தொடர்பு திறன் இன்று வலுவாக இருக்கும். உறவுகளில் பழைய தவறான புரிதல் மீண்டும் வரலாம். அதை அகற்ற எங்கள் ஜோதிடரை அணுகவும்.", luckyColour: { name: "பச்சை", hex: "#22C55E" }, luckyNumber: 5, affirmation: "நான் தெளிவாகவும் நேர்மையாகவும் பேசுகிறேன்." },
    kn: { focus: "ಸಂವಹನ ಶಕ್ತಿ ಇಂದು ಪ್ರಬಲವಾಗಿರುತ್ತದೆ. ಸಂಬಂಧಗಳಲ್ಲಿ ಹಳೆಯ ತಪ್ಪುಗ್ರಹಿಕೆ ಮತ್ತೆ ಮೇಲೆ ಬರಬಹುದು. ಅದನ್ನು ನಿವಾರಿಸಲು ನಮ್ಮ ಜ್ಯೋತಿಷಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ.", luckyColour: { name: "ಹಸಿರು", hex: "#22C55E" }, luckyNumber: 5, affirmation: "ನಾನು ಸ್ಪಷ್ಟವಾಗಿ ಮತ್ತು ಪ್ರಾಮಾಣಿಕವಾಗಿ ಮಾತನಾಡುತ್ತೇನೆ." },
    bn: { focus: "যোগাযোগের ক্ষমতা আজ প্রবল থাকবে। সম্পর্কে পুরনো ভুল বোঝাবুঝি আবার উঠে আসতে পারে। এটি দূর করতে আমাদের জ্যোতিষীর সাথে কথা বলুন।", luckyColour: { name: "সবুজ", hex: "#22C55E" }, luckyNumber: 5, affirmation: "আমি স্পষ্টভাবে এবং সততার সাথে কথা বলি।" },
    mr: { focus: "संवाद क्षमता आज प्रबळ राहील. नात्यांमध्ये जुनी गैरसमजूत पुन्हा उभी राहू शकते. ती दूर करण्यासाठी आमच्या ज्योतिषाशी बोला.", luckyColour: { name: "हिरवा", hex: "#22C55E" }, luckyNumber: 5, affirmation: "मी स्पष्ट आणि प्रामाणिकपणे बोलतो." },
    gu: { focus: "સંચાર શક્તિ આજે પ્રબળ રહેશે. સંબંધોમાં જૂની ગેરસમજ ફરી ઊભી થઈ શકે છે. તેને દૂર કરવા અમારા જ્યોતિષી સાથે વાત કરો.", luckyColour: { name: "લીલો", hex: "#22C55E" }, luckyNumber: 5, affirmation: "હું સ્પષ્ટ અને પ્રામાણિકતાથી વાત કરું છું." },
    ml: { focus: "ആശയവിനിമയ ശേഷി ഇന്ന് ശക്തമായിരിക്കും. ബന്ധങ്ങളിൽ പഴയ തെറ്റിദ്ധാരണ വീണ്ടും ഉയർന്നേക്കാം. അത് ഒഴിവാക്കാൻ ഞങ്ങളുടെ ജ്യോതിഷിയുമായി സംസാരിക്കുക.", luckyColour: { name: "പച്ച", hex: "#22C55E" }, luckyNumber: 5, affirmation: "ഞാൻ വ്യക്തമായും സത്യസന്ധമായും സംസാരിക്കുന്നു." },
  },
  Kark: {
    hi: { focus: "भावनाएं आज प्रबल रहेंगी। मन में कोई डर बना रह सकता है। अपने मन की बात हमारी महिला ज्योतिषी को बताएं।", luckyColour: { name: "चांदी", hex: "#C0C0C0" }, luckyNumber: 2, affirmation: "मैं अपनी भावनाओं को सुरक्षित महसूस करता हूँ।" },
    hinglish: { focus: "Bhavnaein aaj strong rahengi. Mann mein koi darr reh sakta hai. Apne mann ki baat humari Mahila Jyotishi ko batayein.", luckyColour: { name: "Chandi", hex: "#C0C0C0" }, luckyNumber: 2, affirmation: "Mein apni feelings ko safe feel karta hoon." },
    en: { focus: "Emotions run high today. An inner fear might linger. Share your heart with our Female Astrologer to find emotional stability.", luckyColour: { name: "Silver", hex: "#C0C0C0" }, luckyNumber: 2, affirmation: "I feel safe and secure with my emotions." },
    te: { focus: "భావోద్వేగాలు ఈరోజు బలంగా ఉంటాయి. లోపల ఏదో భయం ఉండవచ్చు. మీ మనసులోని మాట మా మహిళా జ్యోతిష్యురాలికి చెప్పండి.", luckyColour: { name: "వెండి", hex: "#C0C0C0" }, luckyNumber: 2, affirmation: "నేను నా భావోద్వేగాలతో సురక్షితంగా ఉన్నాను." },
    ta: { focus: "இன்று உணர்வுகள் அதிகமாக இருக்கும். உள்ளே ஏதோ பயம் இருக்கலாம். எங்கள் பெண் ஜோதிடருடன் மனதில் உள்ளதை பகிருங்கள்.", luckyColour: { name: "வெள்ளி", hex: "#C0C0C0" }, luckyNumber: 2, affirmation: "என் உணர்வுகளுடன் நான் பாதுகாப்பாக உணர்கிறேன்." },
    kn: { focus: "ಇಂದು ಭಾವನೆಗಳು ತೀವ್ರವಾಗಿರುತ್ತವೆ. ಒಳಗೆ ಏನೋ ಭಯವಿರಬಹುದು. ನಿಮ್ಮ ಮನಸ್ಸಿನ ಮಾತು ನಮ್ಮ ಮಹಿಳಾ ಜ್ಯೋತಿಷಿಯೊಂದಿಗೆ ಹಂಚಿಕೊಳ್ಳಿ.", luckyColour: { name: "ಬೆಳ್ಳಿ", hex: "#C0C0C0" }, luckyNumber: 2, affirmation: "ನಾನು ನನ್ನ ಭಾವನೆಗಳೊಂದಿಗೆ ಸುರಕ್ಷಿತವಾಗಿದ್ದೇನೆ." },
    bn: { focus: "আজ আবেগ প্রবল থাকবে। ভেতরে কিছু ভয় থাকতে পারে। আপনার মনের কথা আমাদের মহিলা জ্যোতিষীর সাথে শেয়ার করুন।", luckyColour: { name: "রুপালি", hex: "#C0C0C0" }, luckyNumber: 2, affirmation: "আমি আমার আবেগের সাথে নিরাপদ বোধ করি।" },
    mr: { focus: "आज भावना प्रबळ राहतील. आत काही भीती असू शकते. तुमच्या मनातील गोष्ट आमच्या महिला ज्योतिषाशी शेअर करा.", luckyColour: { name: "चांदी", hex: "#C0C0C0" }, luckyNumber: 2, affirmation: "मी माझ्या भावनांसह सुरक्षित वाटतो." },
    gu: { focus: "આજે લાગણીઓ પ્રબળ રહેશે. અંદર કોઈ ડર હોઈ શકે છે. તમારા મનની વાત અમારા મહિલા જ્યોતિષી સાથે શેર કરો.", luckyColour: { name: "ચાંદી", hex: "#C0C0C0" }, luckyNumber: 2, affirmation: "હું મારી લાગણીઓ સાથે સુરક્ષિત અનુભવું છું." },
    ml: { focus: "ഇന്ന് വികാരങ്ങൾ തീവ്രമായിരിക്കും. ഉള്ളിൽ എന്തെങ്കിലും ഭയം ഉണ്ടായേക്കാം. നിങ്ങളുടെ മനസ്സിലുള്ളത് ഞങ്ങളുടെ വനിതാ ജ്യോതിഷിയുമായി പങ്കുവെക്കുക.", luckyColour: { name: "വെള്ളി", hex: "#C0C0C0" }, luckyNumber: 2, affirmation: "ഞാൻ എന്റെ വികാരങ്ങളോട് സുരക്ഷിതമായി അനുഭവിക്കുന്നു." },
  },
  Simha: {
    hi: { focus: "आत्मविश्वास से भरा दिन है। करियर में नेतृत्व का अवसर मिलेगा। रुके कार्यों को पूरा करने के लिए ज्योतिषी से संपर्क करें।", luckyColour: { name: "सुनहरा", hex: "#F59E0B" }, luckyNumber: 1, affirmation: "मैं अपने आत्मविश्वास पर भरोसा करता हूँ।" },
    hinglish: { focus: "Self-confidence se bhara din hai. Career mein leadership ka mauka milega. Ruke hue kaamo ke liye Jyotishi se contact karein.", luckyColour: { name: "Sunehra", hex: "#F59E0B" }, luckyNumber: 1, affirmation: "Mein apne confidence par bharosa karta hoon." },
    en: { focus: "A day full of confidence. Leadership opportunities may arise. Reach out to our Astrologer for remedies on stalled projects.", luckyColour: { name: "Golden", hex: "#F59E0B" }, luckyNumber: 1, affirmation: "I trust in my own confidence." },
    te: { focus: "ఆత్మవిశ్వాసంతో నిండిన రోజు. కెరీర్‌లో నాయకత్వ అవకాశం వస్తుంది. ఆగిపోయిన పనులకు పరిహారం కోసం జ్యోతిష్యుడిని సంప్రదించండి.", luckyColour: { name: "బంగారు", hex: "#F59E0B" }, luckyNumber: 1, affirmation: "నేను నా ఆత్మవిశ్వాసంపై నమ్మకం ఉంచుతాను." },
    ta: { focus: "நம்பிக்கையுடன் கூடிய நாள். தொழிலில் தலைமை வாய்ப்பு வரலாம். தேங்கிய வேலைகளுக்கு பரிகாரம் அறிய ஜோதிடரை அணுகவும்.", luckyColour: { name: "தங்கம்", hex: "#F59E0B" }, luckyNumber: 1, affirmation: "என் நம்பிக்கையில் நான் நம்புகிறேன்." },
    kn: { focus: "ಆತ್ಮವಿಶ್ವಾಸದಿಂದ ತುಂಬಿದ ದಿನ. ವೃತ್ತಿಯಲ್ಲಿ ನಾಯಕತ್ವದ ಅವಕಾಶ ಸಿಗುತ್ತದೆ. ನಿಂತಿರುವ ಕೆಲಸಗಳಿಗೆ ಪರಿಹಾರಕ್ಕಾಗಿ ಜ್ಯೋತಿಷಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ.", luckyColour: { name: "ಚಿನ್ನದ", hex: "#F59E0B" }, luckyNumber: 1, affirmation: "ನಾನು ನನ್ನ ಆತ್ಮವಿಶ್ವಾಸವನ್ನು ನಂಬುತ್ತೇನೆ." },
    bn: { focus: "আত্মবিশ্বাসে ভরা দিন। কর্মক্ষেত্রে নেতৃত্বের সুযোগ আসবে। আটকে থাকা কাজের প্রতিকারের জন্য জ্যোতিষীর সাথে যোগাযোগ করুন।", luckyColour: { name: "সোনালী", hex: "#F59E0B" }, luckyNumber: 1, affirmation: "আমি আমার আত্মবিশ্বাসে বিশ্বাস করি।" },
    mr: { focus: "आत्मविश्वासाने भरलेला दिवस. करिअरमध्ये नेतृत्वाची संधी मिळेल. रखडलेल्या कामांसाठी उपाय जाणून घेण्यासाठी ज्योतिषाशी संपर्क साधा.", luckyColour: { name: "सोनेरी", hex: "#F59E0B" }, luckyNumber: 1, affirmation: "मी माझ्या आत्मविश्वासावर विश्वास ठेवतो." },
    gu: { focus: "આત્મવિશ્વાસથી ભરેલો દિવસ. કારકિર્દીમાં નેતૃત્વની તક મળશે. અટકેલા કામો માટે જ્યોતિષીનો સંપર્ક કરો.", luckyColour: { name: "સોનેરી", hex: "#F59E0B" }, luckyNumber: 1, affirmation: "હું મારા આત્મવિશ્વાસ પર વિશ્વાસ કરું છું." },
    ml: { focus: "ആത്മവിശ്വാസത്തിൽ നിറഞ്ഞ ദിവസം. കരിയറിൽ നേതൃത്വത്തിനുള്ള അവസരം ലഭിച്ചേക്കാം. തടഞ്ഞുനിൽക്കുന്ന ജോലികൾക്ക് പരിഹാരത്തിനായി ജ്യോതിഷിയെ ബന്ധപ്പെടുക.", luckyColour: { name: "സ്വർണ്ണ", hex: "#F59E0B" }, luckyNumber: 1, affirmation: "ഞാൻ എന്റെ ആത്മവിശ്വാസത്തിൽ വിശ്വസിക്കുന്നു." },
  },
  Kanya: {
    hi: { focus: "कार्यक्षेत्र में बारीकियों पर ध्यान देंगे। सेहत में हल्की गिरावट हो सकती है। ज्योतिषी से जीवनशैली और उपायों पर चर्चा करें।", luckyColour: { name: "हल्का पीला", hex: "#FEF08A" }, luckyNumber: 5, affirmation: "मैं अपने स्वास्थ्य और कार्यों का ध्यान रखता हूँ।" },
    hinglish: { focus: "Workplace par details par dhyan denge. Health mein halki girawat feel ho sakti hai. Jyotishi se lifestyle aur upayon par charcha karein.", luckyColour: { name: "Halka Peela", hex: "#FEF08A" }, luckyNumber: 5, affirmation: "Mein apne health aur kaam ka dhyan rakhta hoon." },
    en: { focus: "Your attention to detail will shine at work. Minor health issues might cause discomfort. Consult our Astrologer for remedies.", luckyColour: { name: "Light Yellow", hex: "#FEF08A" }, luckyNumber: 5, affirmation: "I take care of my health and my tasks." },
    te: { focus: "పని ప్రదేశంలో వివరాలపై శ్రద్ధ పెడతారు. ఆరోగ్యంలో స్వల్ప పతనం సంభవించవచ్చు. జీవనశైలి మరియు పరిహారాల కోసం జ్యోతిష్యుడిని సంప్రదించండి.", luckyColour: { name: "లేత పసుపు", hex: "#FEF08A" }, luckyNumber: 5, affirmation: "నేను నా ఆరోగ్యం మరియు పనులపై శ్రద్ధ వహిస్తాను." },
    ta: { focus: "பணியிடத்தில் விவரங்களில் கவனம் செலுத்துவீர்கள். உடல்நலத்தில் சிறு சரிவு ஏற்படலாம். வாழ்க்கை முறை மற்றும் பரிகாரங்களுக்கு ஜோதிடரை அணுகவும்.", luckyColour: { name: "வெளிர் மஞ்சள்", hex: "#FEF08A" }, luckyNumber: 5, affirmation: "என் உடல்நலனையும் வேலைகளையும் நான் கவனித்துக்கொள்கிறேன்." },
    kn: { focus: "ಕೆಲಸದ ಸ್ಥಳದಲ್ಲಿ ವಿವರಗಳಿಗೆ ಗಮನ ಕೊಡುತ್ತೀರಿ. ಆರೋಗ್ಯದಲ್ಲಿ ಸ್ವಲ್ಪ ಕುಸಿತ ಕಾಣಬಹುದು. ಜೀವನಶೈಲಿ ಮತ್ತು ಪರಿಹಾರಗಳಿಗಾಗಿ ಜ್ಯೋತಿಷಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ.", luckyColour: { name: "ತಿಳಿ ಹಳದಿ", hex: "#FEF08A" }, luckyNumber: 5, affirmation: "ನಾನು ನನ್ನ ಆರೋಗ್ಯ ಮತ್ತು ಕೆಲಸಗಳನ್ನು ನೋಡಿಕೊಳ್ಳುತ್ತೇನೆ." },
    bn: { focus: "কর্মক্ষেত্রে বিবরণে মনোযোগ দেবেন। স্বাস্থ্যে সামান্য অবনতি হতে পারে। জীবনধারা ও প্রতিকারের জন্য জ্যোতিষীর সাথে পরামর্শ করুন।", luckyColour: { name: "হালকা হলুদ", hex: "#FEF08A" }, luckyNumber: 5, affirmation: "আমি আমার স্বাস্থ্য ও কাজের যত্ন নিই।" },
    mr: { focus: "कार्यक्षेत्रात तपशीलांवर लक्ष द्याल. आरोग्यात सौम्य घट होऊ शकते. जीवनशैली आणि उपायांवर ज्योतिषाशी चर्चा करा.", luckyColour: { name: "फिकट पिवळा", hex: "#FEF08A" }, luckyNumber: 5, affirmation: "मी माझ्या आरोग्याची आणि कामांची काळजी घेतो." },
    gu: { focus: "કાર્યસ્થળે વિગતો પર ધ્યાન આપશો. આરોગ્યમાં સહેજ ઘટાડો થઈ શકે છે. જીવનશૈલી અને ઉપાયો માટે જ્યોતિષીની સલાહ લો.", luckyColour: { name: "આછો પીળો", hex: "#FEF08A" }, luckyNumber: 5, affirmation: "હું મારા સ્વાસ્થ્ય અને કાર્યોની કાળજી રાખું છું." },
    ml: { focus: "ജോലിസ്ഥലത്ത് വിശദാംശങ്ങളിൽ ശ്രദ്ധ ചെലുത്തും. ആരോഗ്യത്തിൽ നേരിയ ഇടിവ് ഉണ്ടായേക്കാം. ജീവിതശൈലിയും പരിഹാരങ്ങളും സംബന്ധിച്ച് ജ്യോതിഷിയെ സമീപിക്കുക.", luckyColour: { name: "ഇളം മഞ്ഞ", hex: "#FEF08A" }, luckyNumber: 5, affirmation: "ഞാൻ എന്റെ ആരോഗ്യവും ജോലികളും ശ്രദ്ധിക്കുന്നു." },
  },
  Tula: {
    hi: { focus: "संतुलन बनाए रखने का दिन है। साझेदारी में कोई निर्णय टल सकता है। सही दिशा पाने के लिए ज्योतिषी से बात करें।", luckyColour: { name: "नीला", hex: "#3B82F6" }, luckyNumber: 6, affirmation: "मैं अपने जीवन में संतुलन लाता हूँ।" },
    hinglish: { focus: "Balance banaye rakhne ka din hai. Partnership mein koi decision tal sakta hai. Sahi direction ke liye Jyotishi se baat karein.", luckyColour: { name: "Neela", hex: "#3B82F6" }, luckyNumber: 6, affirmation: "Mein apne life mein balance laata hoon." },
    en: { focus: "A day to maintain balance. Partnership decisions might face delays. Talk to our Astrologer to get clarity.", luckyColour: { name: "Blue", hex: "#3B82F6" }, luckyNumber: 6, affirmation: "I bring balance into my life." },
    te: { focus: "సమతుల్యతను కొనసాగించే రోజు. భాగస్వామ్య నిర్ణయాలు ఆలస్యం కావచ్చు. సరైన దిశ కోసం జ్యోతిష్యుడిని సంప్రదించండి.", luckyColour: { name: "నీలం", hex: "#3B82F6" }, luckyNumber: 6, affirmation: "నేను నా జీవితంలో సమతుల్యతను తెస్తాను." },
    ta: { focus: "சமநிலையை பராமரிக்கும் நாள். கூட்டாண்மை முடிவுகள் தாமதமாகலாம். சரியான திசையறிய ஜோதிடரை அணுகவும்.", luckyColour: { name: "நீலம்", hex: "#3B82F6" }, luckyNumber: 6, affirmation: "என் வாழ்க்கையில் சமநிலையை கொண்டு வருகிறேன்." },
    kn: { focus: "ಸಮತೋಲನ ಕಾಪಾಡಿಕೊಳ್ಳುವ ದಿನ. ಪಾಲುದಾರಿಕೆ ನಿರ್ಧಾರಗಳು ವಿಳಂಬವಾಗಬಹುದು. ಸರಿಯಾದ ದಿಕ್ಕಿಗಾಗಿ ಜ್ಯೋತಿಷಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ.", luckyColour: { name: "ನೀಲಿ", hex: "#3B82F6" }, luckyNumber: 6, affirmation: "ನಾನು ನನ್ನ ಜೀವನದಲ್ಲಿ ಸಮತೋಲನ ತರುತ್ತೇನೆ." },
    bn: { focus: "ভারসাম্য বজায় রাখার দিন। অংশীদারিত্বের সিদ্ধান্ত বিলম্বিত হতে পারে। সঠিক দিকের জন্য জ্যোতিষীর সাথে কথা বলুন।", luckyColour: { name: "নীল", hex: "#3B82F6" }, luckyNumber: 6, affirmation: "আমি আমার জীবনে ভারসাম্য আনি।" },
    mr: { focus: "संतुलन राखण्याचा दिवस. भागीदारीतील निर्णय लांबू शकतो. योग्य दिशेसाठी ज्योतिषाशी बोला.", luckyColour: { name: "निळा", hex: "#3B82F6" }, luckyNumber: 6, affirmation: "मी माझ्या जीवनात संतुलन आणतो." },
    gu: { focus: "સંતુલન જાળવવાનો દિવસ. ભાગીદારીના નિર્ણયોમાં વિલંબ થઈ શકે છે. સાચી દિશા માટે જ્યોતિષી સાથે વાત કરો.", luckyColour: { name: "વાદળી", hex: "#3B82F6" }, luckyNumber: 6, affirmation: "હું મારા જીવનમાં સંતુલન લાવું છું." },
    ml: { focus: "സന്തുലിതാവസ്ഥ നിലനിർത്താനുള്ള ദിവസം. പങ്കാളിത്ത തീരുമാനങ്ങൾ വൈകിയേക്കാം. ശരിയായ ദിശയ്ക്കായി ജ്യോതിഷിയുമായി സംസാരിക്കുക.", luckyColour: { name: "നീല", hex: "#3B82F6" }, luckyNumber: 6, affirmation: "ഞാൻ എന്റെ ജീവിതത്തിൽ സന്തുലനം കൊണ്ടുവരുന്നു." },
  },
  Vrishchik: {
    hi: { focus: "गहरी अंतर्दृष्टि का दिन है। गुप्त शत्रुओं से सावधान रहें। बड़े नुकसान से बचने के लिए ज्योतिषी से सलाह लें।", luckyColour: { name: "गहरा लाल", hex: "#991B1B" }, luckyNumber: 8, affirmation: "मैं अपनी आंतरिक शक्ति से सुरक्षित हूँ।" },
    hinglish: { focus: "Gehri insight ka din hai. Hidden shatruon se sawdhan rahein. Bade nuksan se bachne ke liye Jyotishi se salah lein.", luckyColour: { name: "Gehra Laal", hex: "#991B1B" }, luckyNumber: 8, affirmation: "Mein apni inner power se safe hoon." },
    en: { focus: "A day of deep intuition. Be cautious of hidden enemies. Protect yourself from losses by seeking advice from our Astrologer.", luckyColour: { name: "Dark Red", hex: "#991B1B" }, luckyNumber: 8, affirmation: "I am protected by my inner strength." },
    te: { focus: "లోతైన అంతర్దృష్టి రోజు. దాచిన శత్రువుల పట్ల జాగ్రత్తగా ఉండండి. పెద్ద నష్టాలను నివారించడానికి జ్యోతిష్యుడిని సంప్రదించండి.", luckyColour: { name: "ముదురు ఎరుపు", hex: "#991B1B" }, luckyNumber: 8, affirmation: "నేను నా అంతర్గత శక్తితో సురక్షితంగా ఉన్నాను." },
    ta: { focus: "ஆழ்ந்த உள்ளுணர்வு நாள். மறைவான எதிரிகளை கவனியுங்கள். பெரிய இழப்புகளை தவிர்க்க ஜோதிடரை அணுகவும்.", luckyColour: { name: "அடர் சிவப்பு", hex: "#991B1B" }, luckyNumber: 8, affirmation: "என் உள் சக்தியால் நான் பாதுகாக்கப்படுகிறேன்." },
    kn: { focus: "ಆಳವಾದ ಒಳನೋಟದ ದಿನ. ಗುಪ್ತ ಶತ್ರುಗಳ ಬಗ್ಗೆ ಜಾಗ್ರತೆ ವಹಿಸಿ. ದೊಡ್ಡ ನಷ್ಟಗಳನ್ನು ತಪ್ಪಿಸಲು ಜ್ಯೋತಿಷಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ.", luckyColour: { name: "ಗಾಢ ಕೆಂಪು", hex: "#991B1B" }, luckyNumber: 8, affirmation: "ನಾನು ನನ್ನ ಆಂತರಿಕ ಶಕ್ತಿಯಿಂದ ಸುರಕ್ಷಿತವಾಗಿದ್ದೇನೆ." },
    bn: { focus: "গভীর অন্তর্দৃষ্টির দিন। গোপন শত্রুদের ব্যাপারে সতর্ক থাকুন। বড় ক্ষতি এড়াতে জ্যোতিষীর পরামর্শ নিন।", luckyColour: { name: "গাঢ় লাল", hex: "#991B1B" }, luckyNumber: 8, affirmation: "আমি আমার অন্তর্গত শক্তি দ্বারা সুরক্ষিত।" },
    mr: { focus: "सखोल अंतर्दृष्टीचा दिवस. गुप्त शत्रूंपासून सावध राहा. मोठ्या नुकसानीपासून बचण्यासाठी ज्योतिषाचा सल्ला घ्या.", luckyColour: { name: "गडद लाल", hex: "#991B1B" }, luckyNumber: 8, affirmation: "मी माझ्या आंतरिक शक्तीने सुरक्षित आहे." },
    gu: { focus: "ઊંડી આંતરદૃષ્ટિનો દિવસ. છૂપા શત્રુઓથી સાવધાન રહો. મોટા નુકસાનથી બચવા જ્યોતિષીની સલાહ લો.", luckyColour: { name: "ઘેરો લાલ", hex: "#991B1B" }, luckyNumber: 8, affirmation: "હું મારી આંતરિક શક્તિથી સુરક્ષિત છું." },
    ml: { focus: "ആഴത്തിലുള്ള ഉൾക്കാഴ്ചയുടെ ദിവസം. രഹസ്യ ശത്രുക്കളെ സൂക്ഷിക്കുക. വലിയ നഷ്ടങ്ങൾ ഒഴിവാക്കാൻ ജ്യോതിഷിയെ സമീപിക്കുക.", luckyColour: { name: "കടും ചുവപ്പ്", hex: "#991B1B" }, luckyNumber: 8, affirmation: "ഞാൻ എന്റെ ആന്തരിക ശക്തിയാൽ സംരക്ഷിക്കപ്പെടുന്നു." },
  },
  Dhanu: {
    hi: { focus: "उत्साह और यात्रा के योग हैं। करियर के लक्ष्यों को स्पष्ट करने के लिए ज्योतिषीय परामर्श लें।", luckyColour: { name: "पीला", hex: "#EAB308" }, luckyNumber: 3, affirmation: "मैं सकारात्मकता के साथ आगे बढ़ता हूँ।" },
    hinglish: { focus: "Utsah aur yatra ke yog hain. Career goals ko clear karne ke liye Jyotishiye paramarsh lein.", luckyColour: { name: "Peela", hex: "#EAB308" }, luckyNumber: 3, affirmation: "Mein positivity ke sath aage badhta hoon." },
    en: { focus: "High enthusiasm and travel opportunities. Book a consultation with our Astrologer to clarify your career path.", luckyColour: { name: "Yellow", hex: "#EAB308" }, luckyNumber: 3, affirmation: "I move forward with positivity." },
    te: { focus: "ఉత్సాహం మరియు ప్రయాణ అవకాశాలు. కెరీర్ లక్ష్యాలను స్పష్టం చేయడానికి జ్యోతిష్య సలహా తీసుకోండి.", luckyColour: { name: "పసుపు", hex: "#EAB308" }, luckyNumber: 3, affirmation: "నేను సానుకూలతతో ముందుకు సాగుతాను." },
    ta: { focus: "உற்சாகமும் பயண வாய்ப்புகளும். தொழில் இலக்குகளை தெளிவுபடுத்த ஜோதிட ஆலோசனை பெறுங்கள்.", luckyColour: { name: "மஞ்சள்", hex: "#EAB308" }, luckyNumber: 3, affirmation: "நான் நேர்மறையாக முன்னேறுகிறேன்." },
    kn: { focus: "ಉತ್ಸಾಹ ಮತ್ತು ಪ್ರಯಾಣದ ಅವಕಾಶಗಳು. ವೃತ್ತಿ ಗುರಿಗಳನ್ನು ಸ್ಪಷ್ಟಪಡಿಸಲು ಜ್ಯೋತಿಷ್ಯ ಸಲಹೆ ಪಡೆಯಿರಿ.", luckyColour: { name: "ಹಳದಿ", hex: "#EAB308" }, luckyNumber: 3, affirmation: "ನಾನು ಸಕಾರಾತ್ಮಕತೆಯಿಂದ ಮುನ್ನಡೆಯುತ್ತೇನೆ." },
    bn: { focus: "উদ্দীপনা ও ভ্রমণের যোগ। কর্মজীবনের লক্ষ্য স্পষ্ট করতে জ্যোতিষ পরামর্শ নিন।", luckyColour: { name: "হলুদ", hex: "#EAB308" }, luckyNumber: 3, affirmation: "আমি ইতিবাচকতার সাথে এগিয়ে যাই।" },
    mr: { focus: "उत्साह आणि प्रवासाचे योग. करिअरची उद्दिष्टे स्पष्ट करण्यासाठी ज्योतिष सल्ला घ्या.", luckyColour: { name: "पिवळा", hex: "#EAB308" }, luckyNumber: 3, affirmation: "मी सकारात्मकतेने पुढे जातो." },
    gu: { focus: "ઉત્સાહ અને મુસાફરીના યોગ. કારકિર્દીના લક્ષ્યો સ્પષ્ટ કરવા જ્યોતિષ સલાહ લો.", luckyColour: { name: "પીળો", hex: "#EAB308" }, luckyNumber: 3, affirmation: "હું સકારાત્મકતા સાથે આગળ વધું છું." },
    ml: { focus: "ഉത്സാഹവും യാത്രാ അവസരങ്ങളും. കരിയർ ലക്ഷ്യങ്ങൾ വ്യക്തമാക്കാൻ ജ്യോതിഷ ഉപദേശം തേടുക.", luckyColour: { name: "മഞ്ഞ", hex: "#EAB308" }, luckyNumber: 3, affirmation: "ഞാൻ പോസിറ്റീവായി മുന്നോട്ട് പോകുന്നു." },
  },
  Makar: {
    hi: { focus: "कड़ी मेहनत का फल दिखेगा। करियर में बाधाएं महसूस हो सकती हैं। कुंडली दोष दूर करने के लिए ज्योतिषी से बात करें।", luckyColour: { name: "भूरा", hex: "#78350F" }, luckyNumber: 8, affirmation: "मेरी मेहनत मुझे सफलता दिलाएगी।" },
    hinglish: { focus: "Kadi mehnat ka phal dikhega. Career mein hurdles feel ho sakte hain. Kundli doshon ko door karne ke liye Jyotishi se baat karein.", luckyColour: { name: "Bhura", hex: "#78350F" }, luckyNumber: 8, affirmation: "Meri mehnat mujhe success dilayegi." },
    en: { focus: "Hard work begins to pay off. You might feel stuck in your career. Talk to our Astrologer to remove planetary obstacles.", luckyColour: { name: "Brown", hex: "#78350F" }, luckyNumber: 8, affirmation: "My hard work will bring me success." },
    te: { focus: "కఠిన కృషి ఫలితం కనిపిస్తుంది. కెరీర్‌లో అడ్డంకులు అనిపించవచ్చు. కుండలి దోషాలను తొలగించడానికి జ్యోతిష్యుడిని సంప్రదించండి.", luckyColour: { name: "గోధుమ", hex: "#78350F" }, luckyNumber: 8, affirmation: "నా కృషి నాకు విజయాన్ని తెస్తుంది." },
    ta: { focus: "கடின உழைப்பின் பலன் தெரியும். தொழிலில் தடைகள் உணரலாம். ஜாதக தோஷங்களை நீக்க ஜோதிடரை அணுகவும்.", luckyColour: { name: "பழுப்பு", hex: "#78350F" }, luckyNumber: 8, affirmation: "என் உழைப்பு வெற்றியை தரும்." },
    kn: { focus: "ಕಠಿಣ ಪರಿಶ್ರಮದ ಫಲ ಕಾಣುತ್ತದೆ. ವೃತ್ತಿಯಲ್ಲಿ ಅಡೆತಡೆಗಳು ಅನಿಸಬಹುದು. ಕುಂಡಲಿ ದೋಷಗಳನ್ನು ನಿವಾರಿಸಲು ಜ್ಯೋತಿಷಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ.", luckyColour: { name: "ಕಂದು", hex: "#78350F" }, luckyNumber: 8, affirmation: "ನನ್ನ ಶ್ರಮ ನನಗೆ ಯಶಸ್ಸು ತರುತ್ತದೆ." },
    bn: { focus: "কঠোর পরিশ্রমের ফল দেখা যাবে। কর্মজীবনে বাধা অনুভব হতে পারে। কুণ্ডলী দোষ দূর করতে জ্যোতিষীর সাথে কথা বলুন।", luckyColour: { name: "বাদামী", hex: "#78350F" }, luckyNumber: 8, affirmation: "আমার পরিশ্রম আমাকে সাফল্য দেবে।" },
    mr: { focus: "कठोर परिश्रमाचे फळ दिसेल. करिअरमध्ये अडथळे जाणवू शकतात. कुंडलीतील दोष दूर करण्यासाठी ज्योतिषाशी बोला.", luckyColour: { name: "तपकिरी", hex: "#78350F" }, luckyNumber: 8, affirmation: "माझी मेहनत मला यश देईल." },
    gu: { focus: "કઠોર પરિશ્રમનું ફળ દેખાશે. કારકિર્દીમાં અવરોધો અનુભવાઈ શકે છે. કુંડળી દોષ દૂર કરવા જ્યોતિષી સાથે વાત કરો.", luckyColour: { name: "કથ્થઈ", hex: "#78350F" }, luckyNumber: 8, affirmation: "મારી મહેનત મને સફળતા આપશે." },
    ml: { focus: "കഠിനാധ്വാനത്തിന്റെ ഫലം കാണാം. കരിയറിൽ തടസ്സങ്ങൾ അനുഭവപ്പെടാം. ജാതക ദോഷങ്ങൾ ഒഴിവാക്കാൻ ജ്യോതിഷിയുമായി സംസാരിക്കുക.", luckyColour: { name: "തവിട്ട്", hex: "#78350F" }, luckyNumber: 8, affirmation: "എന്റെ കഠിനാധ്വാനം എനിക്ക് വിജയം നൽകും." },
  },
  Kumbh: {
    hi: { focus: "नए विचार और सामाजिक जुड़ाव प्रमुख रहेंगे। भावनात्मक अकेलापन महसूस हो सकता है। मन की शांति के लिए ज्योतिषी से परामर्श लें।", luckyColour: { name: "आसमानी", hex: "#0EA5E9" }, luckyNumber: 4, affirmation: "मैं नए विचारों के लिए खुला हूँ।" },
    hinglish: { focus: "Naye vichar aur social connection prominent rahenge. Emotionally akelapan feel ho sakta hai. Mann ki shanti ke liye Jyotishi se paramarsh lein.", luckyColour: { name: "Aasmani", hex: "#0EA5E9" }, luckyNumber: 4, affirmation: "Mein naye ideas ke liye khula hoon." },
    en: { focus: "New ideas and social connections take the spotlight. You might feel emotionally isolated. Connect with our Astrologer to find peace.", luckyColour: { name: "Sky Blue", hex: "#0EA5E9" }, luckyNumber: 4, affirmation: "I am open to new ideas." },
    te: { focus: "కొత్త ఆలోచనలు మరియు సామాజిక అనుబంధాలు ప్రధానంగా ఉంటాయి. భావోద్వేగ ఒంటరితనం అనిపించవచ్చు. మనశ్శాంతి కోసం జ్యోతిష్యుడిని సంప్రదించండి.", luckyColour: { name: "ఆకాశ నీలం", hex: "#0EA5E9" }, luckyNumber: 4, affirmation: "నేను కొత్త ఆలోచనలకు తెరిచి ఉన్నాను." },
    ta: { focus: "புதிய யோசனைகள் மற்றும் சமூக இணைப்புகள் முக்கியமாக இருக்கும். உணர்வுபூர்வ தனிமை உணரலாம். மன அமைதிக்காக ஜோதிடரை அணுகவும்.", luckyColour: { name: "வான நீலம்", hex: "#0EA5E9" }, luckyNumber: 4, affirmation: "நான் புதிய யோசனைகளுக்கு திறந்திருக்கிறேன்." },
    kn: { focus: "ಹೊಸ ಆಲೋಚನೆಗಳು ಮತ್ತು ಸಾಮಾಜಿಕ ಸಂಪರ್ಕಗಳು ಪ್ರಮುಖವಾಗಿರುತ್ತವೆ. ಭಾವನಾತ್ಮಕ ಏಕಾಂಗಿತನ ಅನಿಸಬಹುದು. ಮನಸ್ಸಿನ ಶಾಂತಿಗಾಗಿ ಜ್ಯೋತಿಷಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ.", luckyColour: { name: "ಆಕಾಶ ನೀಲಿ", hex: "#0EA5E9" }, luckyNumber: 4, affirmation: "ನಾನು ಹೊಸ ಆಲೋಚನೆಗಳಿಗೆ ತೆರೆದಿದ್ದೇನೆ." },
    bn: { focus: "নতুন ধারণা এবং সামাজিক সংযোগ প্রধান হবে। আবেগগত একাকীত্ব অনুভব হতে পারে। মনের শান্তির জন্য জ্যোতিষীর সাথে পরামর্শ করুন।", luckyColour: { name: "আকাশী", hex: "#0EA5E9" }, luckyNumber: 4, affirmation: "আমি নতুন ধারণার জন্য উন্মুক্ত।" },
    mr: { focus: "नवीन कल्पना आणि सामाजिक जोडणी प्रमुख राहील. भावनिक एकटेपणा जाणवू शकतो. मनःशांतीसाठी ज्योतिषाशी सल्ला घ्या.", luckyColour: { name: "आकाशी", hex: "#0EA5E9" }, luckyNumber: 4, affirmation: "मी नवीन कल्पनांसाठी खुला आहे." },
    gu: { focus: "નવા વિચારો અને સામાજિક જોડાણ મુખ્ય રહેશે. ભાવનાત્મક એકલતા અનુભવાઈ શકે છે. મનની શાંતિ માટે જ્યોતિષીની સલાહ લો.", luckyColour: { name: "આકાશી", hex: "#0EA5E9" }, luckyNumber: 4, affirmation: "હું નવા વિચારો માટે ખુલ્લો છું." },
    ml: { focus: "പുതിയ ആശയങ്ങളും സാമൂഹിക ബന്ധങ്ങളും പ്രധാനമായിരിക്കും. വൈകാരിക ഏകാന്തത അനുഭവപ്പെടാം. മനസ്സമാധാനത്തിനായി ജ്യോതിഷിയെ സമീപിക്കുക.", luckyColour: { name: "ആകാശ നീല", hex: "#0EA5E9" }, luckyNumber: 4, affirmation: "ഞാൻ പുതിയ ആശയങ്ങൾക്ക് തുറന്നിരിക്കുന്നു." },
  },
  Meen: {
    hi: { focus: "भावनात्मक रूप से संवेदनशील दिन। खर्चों पर नियंत्रण रखें। जीवन की रुकावटों को दूर करने के लिए ज्योतिषी से मार्गदर्शन प्राप्त करें।", luckyColour: { name: "पीला", hex: "#FDE047" }, luckyNumber: 7, affirmation: "मैं ब्रह्मांड पर भरोसा करता हूँ।" },
    hinglish: { focus: "Emotionally sensitive din rahega. Karchon par control rakhein. Life ki rukawaton ko door karne ke liye Jyotishi se guidance prapt karein.", luckyColour: { name: "Peela", hex: "#FDE047" }, luckyNumber: 7, affirmation: "Mein universe par bharosa karta hoon." },
    en: { focus: "Today will be emotionally sensitive. Keep a check on your expenses. Reach out to our Astrologer to clear the blockages.", luckyColour: { name: "Yellow", hex: "#FDE047" }, luckyNumber: 7, affirmation: "I trust the universe." },
    te: { focus: "భావోద్వేగపరంగా సున్నితమైన రోజు. ఖర్చులపై నియంత్రణ ఉంచండి. జీవిత అడ్డంకులను తొలగించడానికి జ్యోతిష్యుడి మార్గదర్శకత్వం పొందండి.", luckyColour: { name: "పసుపు", hex: "#FDE047" }, luckyNumber: 7, affirmation: "నేను విశ్వాన్ని నమ్ముతాను." },
    ta: { focus: "உணர்வுபூர்வமான நாள். செலவுகளை கட்டுப்படுத்துங்கள். வாழ்க்கை தடைகளை நீக்க ஜோதிடரின் வழிகாட்டுதலை பெறுங்கள்.", luckyColour: { name: "மஞ்சள்", hex: "#FDE047" }, luckyNumber: 7, affirmation: "நான் பிரபஞ்சத்தை நம்புகிறேன்." },
    kn: { focus: "ಭಾವನಾತ್ಮಕವಾಗಿ ಸೂಕ್ಷ್ಮ ದಿನ. ಖರ್ಚುಗಳನ್ನು ನಿಯಂತ್ರಿಸಿ. ಜೀವನದ ಅಡೆತಡೆಗಳನ್ನು ನಿವಾರಿಸಲು ಜ್ಯೋತಿಷಿಯ ಮಾರ್ಗದರ್ಶನ ಪಡೆಯಿರಿ.", luckyColour: { name: "ಹಳದಿ", hex: "#FDE047" }, luckyNumber: 7, affirmation: "ನಾನು ಬ್ರಹ್ಮಾಂಡವನ್ನು ನಂಬುತ್ತೇನೆ." },
    bn: { focus: "আবেগগতভাবে সংবেদনশীল দিন। খরচ নিয়ন্ত্রণ করুন। জীবনের বাধা দূর করতে জ্যোতিষীর নির্দেশনা নিন।", luckyColour: { name: "হলুদ", hex: "#FDE047" }, luckyNumber: 7, affirmation: "আমি মহাবিশ্বকে বিশ্বাস করি।" },
    mr: { focus: "भावनिकदृष्ट्या संवेदनशील दिवस. खर्चांवर नियंत्रण ठेवा. जीवनातील अडथळे दूर करण्यासाठी ज्योतिषाचे मार्गदर्शन घ्या.", luckyColour: { name: "पिवळा", hex: "#FDE047" }, luckyNumber: 7, affirmation: "मी विश्वावर विश्वास ठेवतो." },
    gu: { focus: "ભાવનાત્મક રીતે સંવેદનશીલ દિવસ. ખર્ચ પર નિયંત્રણ રાખો. જીવનના અવરોધો દૂર કરવા જ્યોતિષીનું માર્ગદર્શન લો.", luckyColour: { name: "પીળો", hex: "#FDE047" }, luckyNumber: 7, affirmation: "હું બ્રહ્માંડ પર વિશ્વાસ કરું છું." },
    ml: { focus: "വൈകാരികമായി സംവേദനക്ഷമമായ ദിവസം. ചെലവുകൾ നിയന്ത്രിക്കുക. ജീവിതത്തിലെ തടസ്സങ്ങൾ ഒഴിവാക്കാൻ ജ്യോതിഷിയുടെ മാർഗ്ഗനിർദ്ദേശം തേടുക.", luckyColour: { name: "മഞ്ഞ", hex: "#FDE047" }, luckyNumber: 7, affirmation: "ഞാൻ പ്രപഞ്ചത്തിൽ വിശ്വസിക്കുന്നു." },
  },
  General: {
    hi: { focus: "आज का दिन मिलाजुला रहेगा। जीवन के किसी भी क्षेत्र में चल रही अनबन या दुविधा को टालें नहीं। ज्योतिषी से परामर्श लें।", luckyColour: { name: "पीला", hex: "#FDE047" }, luckyNumber: 7, affirmation: "शांति मन में है, बाहर नहीं।" },
    hinglish: { focus: "Aaj ka din mixed rahega. Life ke kisi bhi area mein chal rahi dikkat ya duvidha ko avoid na karein. Jyotishi se consult karein.", luckyColour: { name: "Peela", hex: "#FDE047" }, luckyNumber: 7, affirmation: "Shanti mann mein hai, bahar nahi." },
    en: { focus: "Today brings mixed influences. Don't ignore lingering dilemmas. Connect with our experienced Female Astrologer to navigate through them.", luckyColour: { name: "Yellow", hex: "#FDE047" }, luckyNumber: 7, affirmation: "Peace is within, not outside." },
    te: { focus: "ఈరోజు మిశ్రమ ప్రభావాలు ఉంటాయి. జీవితంలోని ఏ రంగంలోనైనా ఉన్న సమస్యలను విస్మరించవద్దు. మా అనుభవజ్ఞురాలైన మహిళా జ్యోతిష్యురాలిని సంప్రదించండి.", luckyColour: { name: "పసుపు", hex: "#FDE047" }, luckyNumber: 7, affirmation: "శాంతి లోపల ఉంది, బయట కాదు." },
    ta: { focus: "இன்று கலவையான தாக்கங்கள். வாழ்க்கையில் உள்ள சிக்கல்களை புறக்கணிக்காதீர்கள். எங்கள் அனுபவம் வாய்ந்த பெண் ஜோதிடரை அணுகவும்.", luckyColour: { name: "மஞ்சள்", hex: "#FDE047" }, luckyNumber: 7, affirmation: "அமைதி உள்ளே உள்ளது, வெளியே இல்லை." },
    kn: { focus: "ಇಂದು ಮಿಶ್ರ ಪ್ರಭಾವಗಳು. ಜೀವನದಲ್ಲಿನ ಸಮಸ್ಯೆಗಳನ್ನು ನಿರ್ಲಕ್ಷಿಸಬೇಡಿ. ನಮ್ಮ ಅನುಭವಿ ಮಹಿಳಾ ಜ್ಯೋತಿಷಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ.", luckyColour: { name: "ಹಳದಿ", hex: "#FDE047" }, luckyNumber: 7, affirmation: "ಶಾಂತಿ ಒಳಗಿದೆ, ಹೊರಗಿಲ್ಲ." },
    bn: { focus: "আজ মিশ্র প্রভাব। জীবনের সমস্যাগুলি উপেক্ষা করবেন না। আমাদের অভিজ্ঞ মহিলা জ্যোতিষীর সাথে যোগাযোগ করুন।", luckyColour: { name: "হলুদ", hex: "#FDE047" }, luckyNumber: 7, affirmation: "শান্তি ভেতরে, বাইরে নয়।" },
    mr: { focus: "आज मिश्र प्रभाव. जीवनातील समस्या दुर्लक्षित करू नका. आमच्या अनुभवी महिला ज्योतिषाशी संपर्क साधा.", luckyColour: { name: "पिवळा", hex: "#FDE047" }, luckyNumber: 7, affirmation: "शांती आत आहे, बाहेर नाही." },
    gu: { focus: "આજે મિશ્ર પ્રભાવો. જીવનની સમસ્યાઓને અવગણો નહીં. અમારા અનુભવી મહિલા જ્યોતિષીનો સંપર્ક કરો.", luckyColour: { name: "પીળો", hex: "#FDE047" }, luckyNumber: 7, affirmation: "શાંતિ અંદર છે, બહાર નહીં." },
    ml: { focus: "ഇന്ന് മിശ്രിത സ്വാധീനങ്ങൾ. ജീവിതത്തിലെ പ്രശ്നങ്ങൾ അവഗണിക്കരുത്. ഞങ്ങളുടെ അനുഭവപരിചയമുള്ള വനിതാ ജ്യോതിഷിയെ സമീപിക്കുക.", luckyColour: { name: "മഞ്ഞ", hex: "#FDE047" }, luckyNumber: 7, affirmation: "സമാധാനം ഉള്ളിലാണ്, പുറത്തല്ല." },
  },
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sign = searchParams.get("sign") || "General";
  const lang = searchParams.get("lang") || "hinglish";

  // Bracket aur case ko normalize kiya (Mesh (Aries) -> Mesh)
  const formattedSign = sign.split("(")[0].trim().toLowerCase().replace(/^./, (char) => char.toUpperCase());
  
  // Language validate kiya (10 languages)
  const safeLang = SUPPORTED_LANGUAGES.includes(lang) ? lang : "hinglish";

  try {
    const signBucket = FALLBACK_DATA[formattedSign] || FALLBACK_DATA.General;
    // Agar us language me data hai to wahi, warna English fallback
    const fallback = signBucket[safeLang] || signBucket.en || signBucket.hinglish;
    
    const reading = {
      ...fallback,
      signName: sign,
      source: "Local Fallback",
    };

    return NextResponse.json({ reading, source: "local" });
  } catch (error) {
    console.error("Daily API Error:", error);
    
    const signBucket = FALLBACK_DATA[formattedSign] || FALLBACK_DATA.General;
    const fallback = signBucket[safeLang] || signBucket.en || signBucket.hinglish;
    return NextResponse.json(
      { 
        reading: { ...fallback, signName: sign },
        source: "fallback" 
      },
      { status: 200 }
    );
  }
}