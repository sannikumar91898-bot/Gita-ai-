// app/api/daily/route.ts
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// 12 राशियों का पूरी तरह से Personalized और Business-Hooked डेटाबेस
const FALLBACK_DATA: Record<string, Record<string, any>> = {
  Mesh: {
    hi: { focus: "आज ऊर्जा का स्तर ऊंचा रहेगा, लेकिन कार्यक्षेत्र में कोई गुप्त उलझन परेशान कर सकती है। घबराएं नहीं, हमारी महिला ज्योतिषी से दिल की बात कहें, वो सही मार्गदर्शन करेंगी।", luckyColour: { name: "लाल", hex: "#EF4444" }, luckyNumber: 9, affirmation: "मैं अपनी ऊर्जा को सही दिशा में लगा रहा हूँ।" },
    hinglish: { focus: "Aaj energy ka level high rahega, par workplace par koi hidden confusion pareshan kar sakti hai. Ghabrayein nahi, humari Mahila Jyotishi se dil ki baat kahein, wo sahi rasta dikhayengi.", luckyColour: { name: "Laal", hex: "#EF4444" }, luckyNumber: 9, affirmation: "Mein apni energy ko sahi direction mein laga raha hoon." },
    en: { focus: "Energy levels are high, but a workplace dilemma might trouble you. Don't worry, talk from the heart with our Female Astrologer for immediate and loving guidance.", luckyColour: { name: "Red", hex: "#EF4444" }, luckyNumber: 9, affirmation: "I direct my energy toward positive results." }
  },
  Vrishabh: {
    hi: { focus: "आर्थिक मामलों और निवेश को लेकर मन में दुविधा बनी रहेगी। कोई बड़ा कदम उठाने से पहले किसी अनुभवी महिला ज्योतिषी से परामर्श लेना आपके लिए अत्यंत शुभ रहेगा।", luckyColour: { name: "सफेद", hex: "#F3F4F6" }, luckyNumber: 6, affirmation: "मैं समृद्धि और शांति को आकर्षित करता हूँ।" },
    hinglish: { focus: "Financial matters aur investment ko lekar mann mein duvidha bani rahegi. Koi bada step uthane se pehle humari experienced Mahila Jyotishi se consult karna behad shubh rahega.", luckyColour: { name: "Safed", hex: "#F3F4F6" }, luckyNumber: 6, affirmation: "Mein samriddhi aur shanti ko attract karta hoon." },
    en: { focus: "Financial decisions or investments might feel confusing today. Consulting our experienced Female Astrologer before taking big steps will bring you clarity.", luckyColour: { name: "White", hex: "#F3F4F6" }, luckyNumber: 6, affirmation: "I welcome stability and abundance." }
  },
  Mithun: {
    hi: { focus: "रिश्तों या करियर में संवाद की कमी के कारण गलतफहमी हो सकती है। मन को हल्का करने और सटीक उपाय जानने के लिए तुरंत महिला ज्योतिषी से संपर्क करें, रास्ता आसान होगा।", luckyColour: { name: "हरा", hex: "#22C55E" }, luckyNumber: 5, affirmation: "मेरी वाणी में सकारात्मक प्रभाव है।" },
    hinglish: { focus: "Relationships ya career mein communication gap ki wajah se galatfahmi ho sakti hai. Mann ko halka karne aur sahi upaye janne ke liye turant Mahila Jyotishi se connect karein.", luckyColour: { name: "Hara", hex: "#22C55E" }, luckyNumber: 5, affirmation: "Meri vaani mein positive power hai." },
    en: { focus: "Communication gaps could cause misunderstandings in career or love. To ease your mind and get accurate remedies, connect with our Female Astrologer now.", luckyColour: { name: "Green", hex: "#22C55E" }, luckyNumber: 5, affirmation: "My communication is clear and effective." }
  },
  Kark: {
    hi: { focus: "आज आप भावनात्मक रूप से कमजोर महसूस कर सकते हैं। परिवार या साथी की कोई बात चुभ सकती है। इस मानसिक अशांति से निकलने के लिए हमारी एक्सपर्ट ज्योतिषी से मार्ग दर्शन लें।", luckyColour: { name: "सिल्वर", hex: "#9CA3AF" }, luckyNumber: 2, affirmation: "मैं अपनी भावनाओं को समझता हूँ और शांत हूँ।" },
    hinglish: { focus: "Aaj aap emotionally weak feel kar sakte hain. Parivaar ya partner ki koi baat chubh sakti hai. Is mental stress se nikalne ke liye humari expert Jyotishi se guide lein.", luckyColour: { name: "Silver", hex: "#9CA3AF" }, luckyNumber: 2, affirmation: "Mein apni emotions ko samajhta hoon aur shant hoon." },
    en: { focus: "You might feel emotionally vulnerable today over a family or relationship matter. Get peace of mind by consulting our expert Female Astrologer right away.", luckyColour: { name: "Silver", hex: "#9CA3AF" }, luckyNumber: 2, affirmation: "I am emotionally secure and balanced." }
  },
  Simha: {
    hi: { focus: "नेतृत्व क्षमता मजबूत रहेगी, लेकिन आपके सीधे स्वभाव के कारण कुछ लोग पीठ पीछे साजिश रच सकते हैं। अपनी कुंडली के ग्रहों की स्थिति जानने के लिए ज्योतिषी से परामर्श लें।", luckyColour: { name: "सुनहरा", hex: "#F59E0B" }, luckyNumber: 1, affirmation: "मैं एक स्वाभाविक लीडर हूँ और खुद पर भरोसा रखता हूँ।" },
    hinglish: { focus: "Leadership capacity strong rahegi, par aapke straight nature ki wajah se kuch log backbiting kar sakte hain. Apni kundli ke grah janne ke liye Jyotishi se consult karein.", luckyColour: { name: "Sunhera", hex: "#F59E0B" }, luckyNumber: 1, affirmation: "Mein ek natural leader hoon aur khud par trust rakhta hoon." },
    en: { focus: "Your leadership is strong, but hidden critics might create hurdles. Protect your energy and consult our astrologer to analyze your current planetary positions.", luckyColour: { name: "Gold", hex: "#F59E0B" }, luckyNumber: 1, affirmation: "I lead with confidence and courage." }
  },
  Kanya: {
    hi: { focus: "आज अत्यधिक सोच-विचार (overthinking) के कारण आप एक बेहतरीन अवसर खो सकते हैं। मन को शांत करें और सही निर्णय लेने के लिए हमारी अनुभवी महिला ज्योतिषी से बात करें।", luckyColour: { name: "गहरा हरा", hex: "#15803D" }, luckyNumber: 5, affirmation: "मैं व्यवस्थित हूँ और सफलता की ओर बढ़ रहा हूँ।" },
    hinglish: { focus: "Aaj overthinking ki wajah se aap ek behtareen opportunity kho sakte hain. Mann ko shant karein aur sahi decision ke liye humari experienced Mahila Jyotishi se baat karein.", luckyColour: { name: "Gahra Hara", hex: "#15803D" }, luckyNumber: 5, affirmation: "Mein organized hoon aur success ki taraf badh raha hoon." },
    en: { focus: "Overthinking might make you miss a great opportunity today. Calm your mind and talk to our experienced Female Astrologer to get clear direction.", luckyColour: { name: "Dark Green", hex: "#15803D" }, luckyNumber: 5, affirmation: "I am focused, organized, and capable." }
  },
  Tula: {
    hi: { focus: "निजी जीवन या पार्टनरशिप में सामंजस्य की कमी महसूस होगी। अगर मन में कोई शक या उलझन है, तो बिना देर किए हमारी महिला ज्योतिषी से शेयर करें, वो बहुत प्यार से रास्ता दिखा देंगी।", luckyColour: { name: "गुलाबी", hex: "#EC4899" }, luckyNumber: 6, affirmation: "मेरे जीवन के सभी रिश्तों में संतुलन और प्रेम है।" },
    hinglish: { focus: "Personal life ya partnership mein harmony ki kami feel hogi. Agar mann mein koi shak ya uljhan hai, toh bina der kiye humari Mahila Jyotishi se share karein.", luckyColour: { name: "Gulabi", hex: "#EC4899" }, luckyNumber: 6, affirmation: "Mere life ke sabhi relationships mein balance aur love hai." },
    en: { focus: "A lack of harmony might trouble your personal life or partnership. If you have doubts or confusion, share them with our Female Astrologer for a loving solution.", luckyColour: { name: "Pink", hex: "#EC4899" }, luckyNumber: 6, affirmation: "I bring balance and harmony wherever I go." }
  },
  Vrishchik: {
    hi: { focus: "अज्ञात भय या तनाव आपको घेरे रह सकता है। कोई पुरानी बात मन को परेशान करेगी। अपनी ऊर्जा को सकारात्मक करने और सटीक उपाय जानने के लिए तुरंत ज्योतिषी से कनेक्ट करें।", luckyColour: { name: "मैरून", hex: "#7F1D1D" }, luckyNumber: 9, affirmation: "मैं सुरक्षित और मानसिक रूप से मजबूत हूँ।" },
    hinglish: { focus: "Unknown fear ya stress aapko ghere rakh sakta hai. Koi purani baat mann ko pareshan karegi. Satih upaye janne ke liye turant humari Jyotishi se connect karein.", luckyColour: { name: "Maroon", hex: "#7F1D1D" }, luckyNumber: 9, affirmation: "Mein safe aur mentally strong hoon." },
    en: { focus: "An unknown anxiety or past issue might weigh heavily on your mind today. Connect with our astrologer immediately to realign your energies and get accurate remedies.", luckyColour: { name: "Maroon", hex: "#7F1D1D" }, luckyNumber: 9, affirmation: "I am strong, secure, and intuitive." }
  },
  Dhanu: {
    hi: { focus: "भाग्य का साथ मिलेगा, लेकिन गलत फैसलों से नुकसान भी हो सकता है। आज आपके लिए कौन सा मार्ग सर्वश्रेष्ठ है, यह जानने के लिए हमारी मुख्य महिला ज्योतिषी से परामर्श लें।", luckyColour: { name: "नारंगी", hex: "#F97316" }, luckyNumber: 3, affirmation: "भाग्य और अवसर हमेशा मेरा साथ देते हैं।" },
    hinglish: { focus: "Bhagya ka saath milega, par galat decisions se nuksan bhi ho sakta hai. Aaj aapke liye konsa rasta best hai, yeh janne ke liye humari Mahila Jyotishi se consult karein.", luckyColour: { name: "Narangi", hex: "#F97316" }, luckyNumber: 3, affirmation: "Luck aur opportunities hamesha mera saath dete hain." },
    en: { focus: "Luck is on your side, but wrong choices could undo it. To find out the absolute best path for your day, consult our senior Female Astrologer.", luckyColour: { name: "Orange", hex: "#F97316" }, luckyNumber: 3, affirmation: "I am open to new adventures and learning." }
  },
  Makar: {
    hi: { focus: "करियर में कड़ा संघर्ष या अड़चनें महसूस हो सकती हैं। मेहनत के अनुसार परिणाम न मिलने से निराशा होगी। अपनी कुंडली के दोषों का निवारण करने के लिए ज्योतिषी से दिल की बात कहें।", luckyColour: { name: "नीला", hex: "#2563EB" }, luckyNumber: 8, affirmation: "मेरी मेहनत मुझे सफलता की सीढ़ियों पर ले जा रही है।" },
    hinglish: { focus: "Career mein kadi mehnat ya hurdles feel ho sakte hain. Results na milne se nirasha hogi. Apni kundli ke dosh door karne ke liye humari Jyotishi se dil ki baat kahein.", luckyColour: { name: "Neela", hex: "#2563EB" }, luckyNumber: 8, affirmation: "Meri mehnat mujhe success ki seedhiyon par le ja rahi hai." },
    en: { focus: "Career transitions or hurdles might bring frustration today. If hard work isn't yielding results, talk directly with our Female Astrologer to find planetary remedies.", luckyColour: { name: "Blue", hex: "#2563EB" }, luckyNumber: 8, affirmation: "I am disciplined, resilient, and successful." }
  },
  Kumbh: {
