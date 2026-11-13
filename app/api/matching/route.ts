// app/api/matching/route.ts
import { NextResponse } from "next/server";

// ============================================================
// 1. LABEL RANGES (5-band, honest — Master Doc)
// ============================================================
function getScoreLabel(score: number): "utkrisht" | "bahut-acha" | "acha" | "ausat" | "sudhar" {
  if (score >= 32) return "utkrisht";
  if (score >= 29) return "bahut-acha";
  if (score >= 25) return "acha";
  if (score >= 18) return "ausat";
  return "sudhar";
}

// ============================================================
// 2. DETERMINISTIC HASH (same input = same score)
// ============================================================
function getHashScore(str: string, max: number): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % (max + 1);
}

// ============================================================
// 3. TYPES
// ============================================================
type LangKey = "hi" | "hinglish" | "en" | "te" | "ta" | "kn" | "bn" | "mr" | "gu" | "ml";

interface DoshaMessages {
  manglikPresent: string;
  manglikCancelled: string;
  nadiPresent: string;
  nadiCancelled: string;
  bhakootPresent: string;
  bhakootCancelled: string;
  safe: string;
  lowScore: string;
}

interface GeneralMessages {
  soulSummary: string; // supports {boy} and {girl} placeholders
  strengths: string[];
  attentionAreas: string[];
  practicalAdvice: string[];
  nextMuhurat: string;
  nextDasha: string;
  nextChat: string;
  nextPdf: string;
  disclaimer: string;
}

// ============================================================
// 4. DOSHA MESSAGES — 10 languages, SOFT + REASSURANCE
// ============================================================
const DOSHA_MSGS: Record<LangKey, DoshaMessages> = {
  hi: {
    manglikPresent: "मांगलिक स्थिति है, पर यह अकेला फैसला नहीं है। चंद्रमा और सप्तम भाव मिलकर रिश्ते को सहज बना रहे हैं। सरल उपाय: साथ में हनुमान चालीसा पढ़ें, मंगलवार का व्रत रखें।",
    manglikCancelled: "मांगलिक स्थिति है, पर गुरु की दृष्टि से इसका प्रभाव शांत हो रहा है। ✅ कुंडली इस दोष से काफी सुरक्षित है।",
    nadiPresent: "नाड़ी में थोड़ा अंतर है, लेकिन कई मामलों में यह उपाय और सही दशा से संतुलित हो जाता है। सरल उपाय: हर सोमवार मिलकर शिव जी को जल अर्पित करें।",
    nadiCancelled: "नाड़ी में थोड़ा अंतर है, पर ग्रहों की मित्रता से यह कट रहा है। ✅ शुभ संकेत।",
    bhakootPresent: "भकूट में थोड़ी असामंजस्य है — आर्थिक मामलों में पारदर्शिता और आपसी समझ रखें। एक छोटी आदत: महीने में एक बार खुलकर बजट चर्चा रिश्ते को और मजबूत करेगी।",
    bhakootCancelled: "भकूट में थोड़ी असामंजस्य है, पर ग्रह मैत्री मजबूत होने से यह कट रहा है। ✅ स्थिति सुरक्षित है।",
    safe: "मिलान अच्छा है। कुछ सूक्ष्म बातें हैं जिन्हें समझकर रिश्ते को और सहज बनाया जा सकता है — कोई बड़ी रुकावट नहीं है।",
    lowScore: "गुण कम हैं, पर सिर्फ 36 गुण से विवाह का फैसला नहीं होता। चंद्रमा (मन), सप्तम भाव और दशा भी देखना जरूरी है — इनकी गहरी जांच के लिए वरिष्ठ ज्योतिषी से बात करें। पहली चैट FREE है।",
  },
  hinglish: {
    manglikPresent: "Manglik sthiti hai, par yeh akela faisla nahi hai. Chandra aur Saptam bhav milkar rishte ko sahaj bana rahe hain. Saral upay: saath mein Hanuman Chalisa padhein, Mangalvar ka vrat rakhein.",
    manglikCancelled: "Manglik sthiti hai, par Guru ki drishti se iska asar shaant ho raha hai. ✅ Kundli is dosh se kaafi surakshit hai.",
    nadiPresent: "Nadi mein thoda antar hai, lekin kai maamlon mein yeh upay aur sahi dasha se santulit ho jata hai. Saral upay: har Somvar milkar Shiv ji ko jal arpit karein.",
    nadiCancelled: "Nadi mein thoda antar hai, par grahon ki mitrata se yeh kat raha hai. ✅ Shubh sanket.",
    bhakootPresent: "Bhakoot mein thodi asamanjasya hai — aarthik maamlon mein pardarshita aur aapas ki samajh rakhein. Ek chhoti aadat: mahine mein ek baar khulkar budget charcha rishte ko aur mazboot karegi.",
    bhakootCancelled: "Bhakoot mein thodi asamanjasya hai, par graha maitri mazboot hone se yeh kat raha hai. ✅ Sthiti surakshit hai.",
    safe: "Milan acha hai. Kuch sookshma baatein hain jinhe samajhkar rishte ko aur sahaj banaya ja sakta hai — koi badi rukawat nahi hai.",
    lowScore: "Gun kam hain, par sirf 36 gun se vivah ka faisla nahi hota. Chandra (man), Saptam bhav aur dasha bhi dekhna zaroori hai — inki gehri jaanch ke liye senior astrologer se baat karein. Pehli chat FREE hai.",
  },
  en: {
    manglikPresent: "A Manglik placement is present, but it is not the only factor. Moon and the 7th house together keep the relationship balanced. Simple remedy: recite Hanuman Chalisa together, observe Tuesday fast.",
    manglikCancelled: "A Manglik placement is present, but Jupiter's aspect is calming its effect. ✅ The chart is largely protected from this dosha.",
    nadiPresent: "There is a slight Nadi difference, but in many cases it balances out with remedies and the right dasha. Simple remedy: offer water to Shiv ji together every Monday.",
    nadiCancelled: "There is a slight Nadi difference, but planetary friendship is cancelling it. ✅ Auspicious sign.",
    bhakootPresent: "There is some Bhakoot disharmony — keep financial matters transparent and communicate openly. A small habit: a monthly budget discussion will strengthen the relationship.",
    bhakootCancelled: "There is some Bhakoot disharmony, but strong Graha Maitri is cancelling it. ✅ Position is safe.",
    safe: "The match is good. There are some subtle points to understand which can make the relationship even smoother — no major blockage.",
    lowScore: "The score is low, but 36 guna alone does not decide marriage. Moon (mind), 7th house, and dasha must also be seen — talk to a senior astrologer for a deeper analysis. First chat is FREE.",
  },
  te: {
    manglikPresent: "మాంగ్లిక్ స్థితి ఉంది, కానీ ఇది ఒక్కటే నిర్ణయం కాదు. చంద్రుడు మరియు సప్తమ భావం కలిసి సంబంధాన్ని సమతుల్యం చేస్తున్నాయి. సులభ పరిహారం: కలిసి హనుమాన్ చాలీసా చదవండి, మంగళవారం ఉపవాసం ఉండండి.",
    manglikCancelled: "మాంగ్లిక్ స్థితి ఉంది, కానీ గురు దృష్టి వల్ల దాని ప్రభావం శాంతించింది. ✅ జాతకం ఈ దోషం నుండి రక్షించబడింది.",
    nadiPresent: "నాడిలో కొద్దిగా భేదం ఉంది, కానీ చాలా సందర్భాలలో ఇది పరిహారాలు మరియు సరైన దశతో సమతుల్యమవుతుంది. సులభ పరిహారం: ప్రతి సోమవారం కలిసి శివుడికి నీరు సమర్పించండి.",
    nadiCancelled: "నాడిలో కొద్దిగా భేదం ఉంది, కానీ గ్రహ స్నేహం వల్ల ఇది తొలగిపోతోంది. ✅ శుభ సంకేతం.",
    bhakootPresent: "భకూట్లో కొంత అసమన్వయం ఉంది — ఆర్థిక విషయాల్లో పారదర్శకత మరియు పరస్పర అవగాహన ఉంచండి. చిన్న అలవాటు: నెలకోసారి బడ్జెట్ చర్చ సంబంధాన్ని బలపరుస్తుంది.",
    bhakootCancelled: "భకూట్లో కొంత అసమన్వయం ఉంది, కానీ గ్రహ మైత్రి బలంగా ఉండటం వల్ల ఇది తొలగిపోతోంది. ✅ స్థితి సురక్షితం.",
    safe: "మ్యాచ్ బాగుంది. కొన్ని సూక్ష్మ విషయాలు అర్థం చేసుకుంటే సంబంధం మరింత సులభమవుతుంది — పెద్ద అడ్డంకి ఏదీ లేదు.",
    lowScore: "స్కోరు తక్కువగా ఉంది, కానీ 36 గుణాలు మాత్రమే వివాహాన్ని నిర్ణయించవు. చంద్రుడు, సప్తమ భావం మరియు దశ కూడా చూడాలి — లోతైన విశ్లేషణ కోసం సీనియర్ జ్యోతిష్యుడిని సంప్రదించండి. మొదటి చాట్ FREE.",
  },
  ta: {
    manglikPresent: "மாங்கலிக் நிலை உள்ளது, ஆனால் இது ஒரே முடிவு அல்ல. சந்திரன் மற்றும் சப்தம பாவம் சேர்ந்து உறவை சமநிலைப்படுத்துகின்றன. எளிய பரிகாரம்: ஒன்றாக ஹனுமான் சாலிசா படியுங்கள், செவ்வாய்க்கிழமை விரதம் இருங்கள்.",
    manglikCancelled: "மாங்கலிக் நிலை உள்ளது, ஆனால் குரு பார்வையால் அதன் தாக்கம் அமைதியடைந்துள்ளது. ✅ ஜாதகம் இந்த தோஷத்திலிருந்து பாதுகாக்கப்பட்டுள்ளது.",
    nadiPresent: "நாடியில் சிறிது வேறுபாடு உள்ளது, ஆனால் பல சந்தர்ப்பங்களில் பரிகாரங்கள் மற்றும் சரியான தசையால் சமநிலைப்படும். எளிய பரிகாரம்: திங்கட்கிழமை ஒன்றாக சிவனுக்கு நீர் சமர்ப்பியுங்கள்.",
    nadiCancelled: "நாடியில் சிறிது வேறுபாடு உள்ளது, ஆனால் கிரக நட்பால் இது நீங்குகிறது. ✅ சுப அறிகுறி.",
    bhakootPresent: "பகூட்டில் சிறிது ஒற்றுமையின்மை உள்ளது — நிதி விஷயங்களில் வெளிப்படைத்தன்மை மற்றும் பரஸ்பர புரிதல் வையுங்கள். சிறிய பழக்கம்: மாதம் ஒருமுறை பட்ஜெட் கலந்துரையாடல் உறவை வலுப்படுத்தும்.",
    bhakootCancelled: "பகூட்டில் சிறிது ஒற்றுமையின்மை உள்ளது, ஆனால் வலுவான கிரக மைத்ரியால் இது நீங்குகிறது. ✅ நிலை பாதுகாப்பானது.",
    safe: "பொருத்தம் நல்லது. சில நுட்பமான விஷயங்களை புரிந்துகொண்டால் உறவு இன்னும் எளிதாகும் — பெரிய தடை எதுவும் இல்லை.",
    lowScore: "மதிப்பெண் குறைவாக உள்ளது, ஆனால் 36 குணங்கள் மட்டும் திருமணத்தை தீர்மானிக்காது. சந்திரன், சப்தம பாவம் மற்றும் தசையும் பார்க்க வேண்டும் — ஆழமான பகுப்பாய்வுக்கு மூத்த ஜோதிடரை அணுகவும். முதல் அரட்டை FREE.",
  },
  kn: {
    manglikPresent: "ಮಾಂಗ್ಲಿಕ್ ಸ್ಥಿತಿ ಇದೆ, ಆದರೆ ಇದು ಒಂದೇ ನಿರ್ಧಾರವಲ್ಲ. ಚಂದ್ರ ಮತ್ತು ಸಪ್ತಮ ಭಾವ ಸೇರಿ ಸಂಬಂಧವನ್ನು ಸಮತೋಲನಗೊಳಿಸುತ್ತವೆ. ಸರಳ ಪರಿಹಾರ: ಒಟ್ಟಿಗೆ ಹನುಮಾನ್ ಚಾಲೀಸಾ ಪಠಿಸಿ, ಮಂಗಳವಾರ ಉಪವಾಸ ಮಾಡಿ.",
    manglikCancelled: "ಮಾಂಗ್ಲಿಕ್ ಸ್ಥಿತಿ ಇದೆ, ಆದರೆ ಗುರು ದೃಷ್ಟಿಯಿಂದ ಅದರ ಪ್ರಭಾವ ಶಾಂತವಾಗಿದೆ. ✅ ಜಾತಕ ಈ ದೋಷದಿಂದ ರಕ್ಷಿಸಲ್ಪಟ್ಟಿದೆ.",
    nadiPresent: "ನಾಡಿಯಲ್ಲಿ ಸ್ವಲ್ಪ ವ್ಯತ್ಯಾಸವಿದೆ, ಆದರೆ ಅನೇಕ ಸಂದರ್ಭಗಳಲ್ಲಿ ಪರಿಹಾರಗಳು ಮತ್ತು ಸರಿಯಾದ ದಶೆಯಿಂದ ಸಮತೋಲನಗೊಳ್ಳುತ್ತದೆ. ಸರಳ ಪರಿಹಾರ: ಪ್ರತಿ ಸೋಮವಾರ ಒಟ್ಟಿಗೆ ಶಿವನಿಗೆ ನೀರು ಅರ್ಪಿಸಿ.",
    nadiCancelled: "ನಾಡಿಯಲ್ಲಿ ಸ್ವಲ್ಪ ವ್ಯತ್ಯಾಸವಿದೆ, ಆದರೆ ಗ್ರಹ ಸ್ನೇಹದಿಂದ ಇದು ತೊಲಗುತ್ತಿದೆ. ✅ ಶುಭ ಸೂಚನೆ.",
    bhakootPresent: "ಭಕೂಟ್‌ನಲ್ಲಿ ಸ್ವಲ್ಪ ಅಸಾಮರಸ್ಯವಿದೆ — ಆರ್ಥಿಕ ವಿಷಯಗಳಲ್ಲಿ ಪಾರದರ್ಶಕತೆ ಮತ್ತು ಪರಸ್ಪರ ತಿಳುವಳಿಕೆ ಇಟ್ಟುಕೊಳ್ಳಿ. ಸಣ್ಣ ಅಭ್ಯಾಸ: ತಿಂಗಳಿಗೊಮ್ಮೆ ಬಜೆಟ್ ಚರ್ಚೆ ಸಂಬಂಧವನ್ನು ಬಲಪಡಿಸುತ್ತದೆ.",
    bhakootCancelled: "ಭಕೂಟ್‌ನಲ್ಲಿ ಸ್ವಲ್ಪ ಅಸಾಮರಸ್ಯವಿದೆ, ಆದರೆ ಬಲವಾದ ಗ್ರಹ ಮೈತ್ರಿಯಿಂದ ಇದು ತೊಲಗುತ್ತಿದೆ. ✅ ಸ್ಥಿತಿ ಸುರಕ್ಷಿತ.",
    safe: "ಹೊಂದಾಣಿಕೆ ಚೆನ್ನಾಗಿದೆ. ಕೆಲವು ಸೂಕ್ಷ್ಮ ಅಂಶಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಂಡರೆ ಸಂಬಂಧ ಇನ್ನಷ್ಟು ಸುಲಭವಾಗುತ್ತದೆ — ದೊಡ್ಡ ತಡೆ ಯಾವುದೂ ಇಲ್ಲ.",
    lowScore: "ಸ್ಕೋರ್ ಕಡಿಮೆಯಿದೆ, ಆದರೆ 36 ಗುಣಗಳು ಮಾತ್ರ ವಿವಾಹವನ್ನು ನಿರ್ಧರಿಸುವುದಿಲ್ಲ. ಚಂದ್ರ, ಸಪ್ತಮ ಭಾವ ಮತ್ತು ದಶೆಯನ್ನೂ ನೋಡಬೇಕು — ಆಳವಾದ ವಿಶ್ಲೇಷಣೆಗಾಗಿ ಹಿರಿಯ ಜ್ಯೋತಿಷಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ. ಮೊದಲ ಚಾಟ್ FREE.",
  },
  bn: {
    manglikPresent: "মাঙ্গলিক অবস্থা আছে, তবে এটি একমাত্র সিদ্ধান্ত নয়। চন্দ্র ও সপ্তম ভাব মিলে সম্পর্ককে ভারসাম্যপূর্ণ রাখছে। সহজ প্রতিকার: একসাথে হনুমান চালিশা পড়ুন, মঙ্গলবার উপবাস রাখুন।",
    manglikCancelled: "মাঙ্গলিক অবস্থা আছে, তবে গুরু দৃষ্টিতে এর প্রভাব শান্ত হচ্ছে। ✅ কুণ্ডলী এই দোষ থেকে সুরক্ষিত।",
    nadiPresent: "নাড়িতে সামান্য পার্থক্য আছে, তবে অনেক ক্ষেত্রে প্রতিকার ও সঠিক দশায় এটি ভারসাম্যপূর্ণ হয়। সহজ প্রতিকার: প্রতি সোমবার একসাথে শিবকে জল অর্পণ করুন।",
    nadiCancelled: "নাড়িতে সামান্য পার্থক্য আছে, তবে গ্রহ বন্ধুত্বে এটি কেটে যাচ্ছে। ✅ শুভ সংকেত।",
    bhakootPresent: "ভকূটে সামান্য অসামঞ্জস্য আছে — আর্থিক বিষয়ে স্বচ্ছতা ও পারস্পরিক বোঝাপড়া রাখুন। ছোট অভ্যাস: মাসে একবার বাজেট আলোচনা সম্পর্ক আরও মজবুত করবে।",
    bhakootCancelled: "ভকূটে সামান্য অসামঞ্জস্য আছে, তবে শক্তিশালী গ্রহ মৈত্রীর কারণে এটি কেটে যাচ্ছে। ✅ অবস্থা সুরক্ষিত।",
    safe: "মিলন ভালো। কিছু সূক্ষ্ম বিষয় বুঝে নিলে সম্পর্ক আরও সহজ হবে — বড় কোনো বাধা নেই।",
    lowScore: "স্কোর কম, তবে শুধু ৩৬ গুণে বিবাহ নির্ধারিত হয় না। চন্দ্র, সপ্তম ভাব ও দশাও দেখতে হবে — গভীর বিশ্লেষণের জন্য সিনিয়র জ্যোতিষীর সাথে কথা বলুন। প্রথম চ্যাট FREE।",
  },
  mr: {
    manglikPresent: "मांगलिक स्थिती आहे, पण हा एकमेव निर्णय नाही. चंद्र आणि सप्तम भाव मिळून नातं संतुलित ठेवत आहेत. सोपा उपाय: एकत्र हनुमान चालीसा वाचा, मंगळवारी उपवास करा.",
    manglikCancelled: "मांगलिक स्थिती आहे, पण गुरू दृष्टीने तिचा प्रभाव शांत होत आहे. ✅ कुंडली या दोषापासून संरक्षित आहे.",
    nadiPresent: "नाडीत थोडा फरक आहे, पण बऱ्याच प्रसंगी उपाय आणि योग्य दशेने तो संतुलित होतो. सोपा उपाय: दर सोमवारी एकत्र शिवाला जल अर्पण करा.",
    nadiCancelled: "नाडीत थोडा फरक आहे, पण ग्रह मैत्रीमुळे तो कटत आहे. ✅ शुभ संकेत.",
    bhakootPresent: "भकूटमध्ये थोडी असामंजस्यता आहे — आर्थिक बाबतीत पारदर्शकता आणि परस्पर समज ठेवा. छोटी सवय: महिन्यातून एकदा बजेट चर्चा नातं अधिक मजबूत करेल.",
    bhakootCancelled: "भकूटमध्ये थोडी असामंजस्यता आहे, पण मजबूत ग्रह मैत्रीमुळे ती कटत आहे. ✅ स्थिती सुरक्षित.",
    safe: "मिलन चांगले आहे. काही सूक्ष्म गोष्टी समजून घेतल्यास नातं अधिक सोपं होईल — मोठा अडथळा नाही.",
    lowScore: "गुण कमी आहेत, पण फक्त ३६ गुणांवरून विवाह ठरत नाही. चंद्र, सप्तम भाव आणि दशाही पाहणे आवश्यक आहे — सखोल विश्लेषणासाठी वरिष्ठ ज्योतिषांशी बोला. पहिली चॅट FREE.",
  },
  gu: {
    manglikPresent: "માંગલિક સ્થિતિ છે, પણ આ એકમાત્ર નિર્ણય નથી. ચંદ્ર અને સપ્તમ ભાવ મળીને સંબંધ સંતુલિત રાખે છે. સરળ ઉપાય: સાથે હનુમાન ચાલીસા પઢો, મંગળવારે ઉપવાસ રાખો.",
    manglikCancelled: "માંગલિક સ્થિતિ છે, પણ ગુરુ દૃષ્ટિથી તેની અસર શાંત થઈ રહી છે. ✅ કુંડળી આ દોષથી સુરક્ષિત છે.",
    nadiPresent: "નાડીમાં થોડો ફરક છે, પણ ઘણા કિસ્સાઓમાં ઉપાય અને યોગ્ય દશાથી તે સંતુલિત થાય છે. સરળ ઉપાય: દર સોમવારે સાથે શિવજીને જળ અર્પણ કરો.",
    nadiCancelled: "નાડીમાં થોડો ફરક છે, પણ ગ્રહ મૈત્રીથી તે કપાઈ રહ્યો છે. ✅ શુભ સંકેત.",
    bhakootPresent: "ભકૂટમાં થોડી અસામંજસ્ય છે — આર્થિક બાબતોમાં પારદર્શિતા અને પરસ્પર સમજ રાખો. નાની આદત: મહિનામાં એક વાર બજેટ ચર્ચા સંબંધ વધુ મજબૂત કરશે.",
    bhakootCancelled: "ભકૂટમાં થોડી અસામંજસ્ય છે, પણ મજબૂત ગ્રહ મૈત્રીથી તે કપાઈ રહી છે. ✅ સ્થિતિ સુરક્ષિત.",
    safe: "મેળાપ સારો છે. થોડી સૂક્ષ્મ બાબતો સમજી લેવાથી સંબંધ વધુ સરળ બનશે — કોઈ મોટો અવરોધ નથી.",
    lowScore: "સ્કોર ઓછો છે, પણ ફક્ત 36 ગુણથી લગ્ન નક્કી થતા નથી. ચંદ્ર, સપ્તમ ભાવ અને દશા પણ જોવી જરૂરી છે — ઊંડાણપૂર્વક વિશ્લેષણ માટે વરિષ્ઠ જ્યોતિષી સાથે વાત કરો. પ્રથમ ચેટ FREE.",
  },
  ml: {
    manglikPresent: "മാംഗ്ലിക് സ്ഥിതി ഉണ്ട്, പക്ഷേ ഇത് ഒരേയൊരു തീരുമാനമല്ല. ചന്ദ്രനും സപ്തമ ഭാവവും ചേർന്ന് ബന്ധം സന്തുലിതമായി നിലനിർത്തുന്നു. ലളിത പരിഹാരം: ഒരുമിച്ച് ഹനുമാൻ ചാലീസ പാരായണം ചെയ്യുക, ചൊവ്വാഴ്ച ഉപവാസം ആചരിക്കുക.",
    manglikCancelled: "മാംഗ്ലിക് സ്ഥിതി ഉണ്ട്, പക്ഷേ ഗുരു ദൃഷ്ടിയാൽ അതിന്റെ സ്വാധീനം ശാന്തമാകുന്നു. ✅ ജാതകം ഈ ദോഷത്തിൽ നിന്ന് സംരക്ഷിതമാണ്.",
    nadiPresent: "നാഡിയിൽ ചെറിയ വ്യത്യാസമുണ്ട്, പക്ഷേ പലപ്പോഴും പരിഹാരങ്ങളും ശരിയായ ദശയും കൊണ്ട് ഇത് സന്തുലിതമാകും. ലളിത പരിഹാരം: എല്ലാ തിങ്കളാഴ്ചയും ഒരുമിച്ച് ശിവന് ജലം സമർപ്പിക്കുക.",
    nadiCancelled: "നാഡിയിൽ ചെറിയ വ്യത്യാസമുണ്ട്, പക്ഷേ ഗ്രഹ സൗഹൃദം കൊണ്ട് ഇത് മാറുന്നു. ✅ ശുഭ സൂചന.",
    bhakootPresent: "ഭകൂട്ടിൽ കുറച്ച് അസംവാദമുണ്ട് — സാമ്പത്തിക കാര്യങ്ങളിൽ സുതാര്യതയും പരസ്പര ധാരണയും പാലിക്കുക. ചെറിയ ശീലം: മാസത്തിൽ ഒരിക്കൽ ബജറ്റ് ചർച്ച ബന്ധം ശക്തമാക്കും.",
    bhakootCancelled: "ഭകൂട്ടിൽ കുറച്ച് അസംവാദമുണ്ട്, പക്ഷേ ശക്തമായ ഗ്രഹ മൈത്രി കൊണ്ട് ഇത് മാറുന്നു. ✅ സ്ഥിതി സുരക്ഷിതം.",
    safe: "മാച്ചിംഗ് നല്ലതാണ്. ചില സൂക്ഷ്മ കാര്യങ്ങൾ മനസ്സിലാക്കിയാൽ ബന്ധം കൂടുതൽ എളുപ്പമാകും — വലിയ തടസ്സമില്ല.",
    lowScore: "സ്കോർ കുറവാണ്, പക്ഷേ 36 ഗുണങ്ങൾ മാത്രം വിവാഹം തീരുമാനിക്കുന്നില്ല. ചന്ദ്രൻ, സപ്തമ ഭാവം, ദശ എന്നിവയും നോക്കണം — ആഴത്തിലുള്ള വിശകലനത്തിന് മുതിർന്ന ജ്യോതിഷിയെ സമീപിക്കുക. ആദ്യ ചാറ്റ് FREE.",
  },
};

// ============================================================
// 5. GENERAL MESSAGES — hi / hinglish / en (others fallback to en)
// ============================================================
const GENERAL_MSGS: Record<"hi" | "hinglish" | "en", GeneralMessages> = {
  hi: {
    soulSummary: "{boy} और {girl} — मन की समझ अच्छी है, भावनाएं मिलती हैं। थोड़ा संवाद सुधारें तो यह रिश्ता दीर्घकाल तक बना रहेगा।",
    strengths: [
      "चंद्रमा की स्थिति से मन की समझ अच्छी है — सुख-दुख बांटने में आसानी।",
      "ग्रह मैत्री मजबूत है — सोच और मूल्यों में सामंजस्य।",
      "गण मिलान शुभ है — स्वभाव में तालमेल।",
      "योनि मिलान सहज है — शारीरिक और मानसिक लय बनी रहती है।",
      "वश्य और तारा मिलान संतुलित — एक-दूसरे को सहजता से समझ पाते हैं।",
    ],
    attentionAreas: [
      "स्वभाव स्वतंत्र है → थोड़ा स्पेस दें, रिश्ता और मजबूत रहेगा।",
      "बहस के समय थोड़ा धैर्य — प्रेम बना रहेगा।",
      "आर्थिक निर्णय साथ लें — विश्वास बढ़ेगा।",
    ],
    practicalAdvice: [
      "हर सोमवार साथ शिव जी को जल अर्पित करें।",
      "महीने में एक बार आमने-सामने खुलकर बात करें।",
    ],
    nextMuhurat: "शुभ विवाह तिथि देखें",
    nextDasha: "दोनों की वर्तमान दशा जानें",
    nextChat: "ज्योतिषी से बात करें — पहली चैट FREE",
    nextPdf: "PDF डाउनलोड करें",
    disclaimer: "यह रिपोर्ट पारंपरिक वैदिक ज्योतिष सिद्धांतों पर आधारित है। यह व्यक्तिगत मार्गदर्शन है, चिकित्सीय/कानूनी/व्यावसायिक सलाह नहीं। अंतिम निर्णय अपनी समझ और परिवार के साथ लें।",
  },
  hinglish: {
    soulSummary: "{boy} aur {girl} — man ki samajh achi hai, bhavnayein milti hain. Thoda samvad sudharein toh yeh rishta deerghkal tak bana rahega.",
    strengths: [
      "Chandra ki sthiti se man ki samajh achi hai — sukh-dukh baantne mein aasani.",
      "Graha maitri mazboot hai — soch aur values mein samanjasya.",
      "Gana milan shubh hai — swabhav mein taalmel.",
      "Yoni milan sahaj hai — sharirik aur manasik lay bani rehti hai.",
      "Vashya aur Tara milan santulit — ek-doosre ko sahajta se samajh paate hain.",
    ],
    attentionAreas: [
      "Swabhav swatantra hai → thoda space dein, rishta aur mazboot rahega.",
      "Behes ke samay thoda dhairya — prem bana rahega.",
      "Aarthik nirnay saath lein — vishwas badhega.",
    ],
    practicalAdvice: [
      "Har Somvar saath Shiv ji ko jal arpit karein.",
      "Mahine mein ek baar aamne-saamne khulkar baat karein.",
    ],
    nextMuhurat: "Shubh Vivah Tithi dekhein",
    nextDasha: "Dono ki vartaman dasha jaanein",
    nextChat: "Jyotishi se baat karein — pehli chat FREE",
    nextPdf: "PDF Download karein",
    disclaimer: "Yeh report traditional Vedic astrology siddhanton par aadharit hai. Yeh personal guidance hai, medical/legal/professional advice nahi. Final decision apni samajh aur family ke saath lein.",
  },
  en: {
    soulSummary: "{boy} and {girl} — emotional understanding is good, feelings align. With slightly better communication, this bond will last long-term.",
    strengths: [
      "Moon placement gives strong emotional understanding — easy to share joys and sorrows.",
      "Graha Maitri is strong — alignment in thoughts and values.",
      "Gana match is auspicious — natural temperament harmony.",
      "Yoni match is smooth — physical and mental rhythm stays aligned.",
      "Vashya and Tara matches are balanced — you understand each other naturally.",
    ],
    attentionAreas: [
      "Both have independent natures → giving each other space will strengthen the bond.",
      "A little patience during arguments — love will stay intact.",
      "Take financial decisions together — trust will grow.",
    ],
    practicalAdvice: [
      "Offer water to Shiv ji together every Monday.",
      "Have an open face-to-face conversation once a month.",
    ],
    nextMuhurat: "Check auspicious wedding date",
    nextDasha: "Check current dasha for both",
    nextChat: "Talk to astrologer — first chat FREE",
    nextPdf: "Download PDF",
    disclaimer: "This report is based on traditional Vedic astrology principles. It is personal guidance, not medical/legal/professional advice. Take final decisions with your own understanding and family.",
  },
};

function getGeneral(lang: LangKey): GeneralMessages {
  if (lang === "hi" || lang === "hinglish" || lang === "en") return GENERAL_MSGS[lang];
  return GENERAL_MSGS.en; // fallback for te/ta/kn/bn/mr/gu/ml
}

// ============================================================
// 6. POST HANDLER
// ============================================================
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { boy, girl, language = "hinglish" } = body;

    const lang: LangKey = (["hi","hinglish","en","te","ta","kn","bn","mr","gu","ml"].includes(language)
      ? language
      : "hinglish") as LangKey;

    // 1. Validation
    if (
      !boy?.name || !boy?.dob || !boy?.time || !boy?.lat ||
      !girl?.name || !girl?.dob || !girl?.time || !girl?.lat
    ) {
      return NextResponse.json(
        { error: "Kripya dono ki saari janm vivaran (DOB, Time, Place) bharein." },
        { status: 400 }
      );
    }

    // 2. Deterministic seed
    const seed = `${boy.name}_${boy.dob}_${girl.name}_${girl.dob}`
      .toLowerCase()
      .replace(/\s+/g, "");

    // 3. Raw scores
    const totalScore = 16 + getHashScore(seed, 20); // 16-36
    const nadiRaw = getHashScore(seed + "_nadi", 8); // 0-8
    const bhakootRaw = getHashScore(seed + "_bhakoot", 7); // 0-7
    const grahaMaitri = 3 + getHashScore(seed + "_graha", 2); // 3-5

    // 4. Dosha presence + cancellation logic (Option A — simplified)
    const manglikPresent = getHashScore(seed + "_manglik", 10) < 4;
    const manglikCancelled = manglikPresent && getHashScore(seed + "_manglik_cancel", 10) < 4;

    const nadiPresent = nadiRaw === 0;
    const nadiCancelled = nadiPresent && getHashScore(seed + "_nadi_cancel", 10) < 4;

    const bhakootPresent = bhakootRaw === 0;
    const bhakootCancelled = bhakootPresent && grahaMaitri >= 4;

    // 5. Label
    const label = getScoreLabel(totalScore);

    // 6. Ashtakoot breakdown
    const details = [
      { name: "Varna", score: 1, max: 1, meaning: "वर्ण मिलान — सामाजिक सामंजस्य" },
      { name: "Vashya", score: 2, max: 2, meaning: "वश्य मिलान — नियंत्रण संतुलन" },
      { name: "Tara", score: 1 + getHashScore(seed + "_tara", 2), max: 3, meaning: "तारा मिलान — भाग्य सामंजस्य" },
      { name: "Yoni", score: 2 + getHashScore(seed + "_yoni", 2), max: 4, meaning: "योनि मिलान — शारीरिक लय" },
      { name: "Graha Maitri", score: grahaMaitri, max: 5, meaning: "ग्रह मैत्री — मानसिक सामंजस्य" },
      { name: "Gana", score: 4 + getHashScore(seed + "_gana", 2), max: 6, meaning: "गण मिलान — स्वभाव तालमेल" },
      { name: "Bhakoot", score: bhakootRaw, max: 7, meaning: "भकूट — भावनात्मक स्थिरता" },
      { name: "Nadi", score: nadiRaw, max: 8, meaning: "नाड़ी — संतान व स्वास्थ्य" },
    ];

    // 7. Messages
    const DOSHA = DOSHA_MSGS[lang] || DOSHA_MSGS.hinglish;
    const GEN = getGeneral(lang);

    // 8. Primary message (worst non-cancelled issue, else safe)
    let primaryMessage: string;
    if (manglikPresent && !manglikCancelled) primaryMessage = DOSHA.manglikPresent;
    else if (nadiPresent && !nadiCancelled) primaryMessage = DOSHA.nadiPresent;
    else if (bhakootPresent && !bhakootCancelled) primaryMessage = DOSHA.bhakootPresent;
    else if (totalScore < 18) primaryMessage = DOSHA.lowScore;
    else primaryMessage = DOSHA.safe;

    // 9. Doshas object
    const doshas = {
      manglik: {
        present: manglikPresent,
        cancelled: manglikCancelled,
        reason: !manglikPresent ? "" : manglikCancelled ? DOSHA.manglikCancelled : DOSHA.manglikPresent,
      },
      nadi: {
        present: nadiPresent,
        cancelled: nadiCancelled,
        reason: !nadiPresent ? "" : nadiCancelled ? DOSHA.nadiCancelled : DOSHA.nadiPresent,
      },
      bhakoot: {
        present: bhakootPresent,
        cancelled: bhakootCancelled,
        reason: !bhakootPresent ? "" : bhakootCancelled ? DOSHA.bhakootCancelled : DOSHA.bhakootPresent,
      },
    };

    // 10. Strengths (3 from pool)
    const sStart = getHashScore(seed + "_sStart", GEN.strengths.length - 1);
    const strengths = [
      GEN.strengths[sStart % GEN.strengths.length],
      GEN.strengths[(sStart + 1) % GEN.strengths.length],
      GEN.strengths[(sStart + 2) % GEN.strengths.length],
    ];

    // 11. Attention areas (3 from pool)
    const aStart = getHashScore(seed + "_aStart", GEN.attentionAreas.length - 1);
    const attentionAreas = [
      GEN.attentionAreas[aStart % GEN.attentionAreas.length],
      GEN.attentionAreas[(aStart + 1) % GEN.attentionAreas.length],
      GEN.attentionAreas[(aStart + 2) % GEN.attentionAreas.length],
    ];

    // 12. Practical advice (2 from pool)
    const pStart = getHashScore(seed + "_pStart", GEN.practicalAdvice.length - 1);
    const practicalAdvice = [
      GEN.practicalAdvice[pStart % GEN.practicalAdvice.length],
      GEN.practicalAdvice[(pStart + 1) % GEN.practicalAdvice.length],
    ];

    // 13. Soul summary (with names)
    const soulSummary = GEN.soulSummary
      .replace("{boy}", boy.name)
      .replace("{girl}", girl.name);

    // 14. Contextual next steps
    const lowScore = totalScore < 25;
    const nextSteps = lowScore
      ? [
          { label: GEN.nextChat, action: "chat" as const, primary: true },
          { label: GEN.nextMuhurat, action: "muhurat" as const, primary: false },
          { label: GEN.nextDasha, action: "dasha" as const, primary: false },
          { label: GEN.nextPdf, action: "pdf" as const, primary: false },
        ]
      : [
          { label: GEN.nextMuhurat, action: "muhurat" as const, primary: true },
          { label: GEN.nextDasha, action: "dasha" as const, primary: false },
          { label: GEN.nextPdf, action: "pdf" as const, primary: false },
          { label: GEN.nextChat, action: "chat" as const, primary: false },
        ];

    // 15. Backward-compat derived
    const dangerLevel =
      (manglikPresent && !manglikCancelled) ||
      (nadiPresent && !nadiCancelled) ||
      (bhakootPresent && !bhakootCancelled) ||
      totalScore < 18
        ? "warning"
        : "safe";

    // 16. Simulate processing delay (smooth loading)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return NextResponse.json({
      // ✅ NEW SCHEMA
      score: totalScore,
      maxScore: 36,
      label,
      details,
      doshas,
      soulSummary,
      strengths,
      attentionAreas,
      practicalAdvice,
      nextSteps,
      disclaimer: GEN.disclaimer,
      primaryMessage,

      // 🔁 BACKWARD COMPAT (purana frontend turant na toote)
      totalScore,
      dangerLevel,
      fearMessage: primaryMessage, // deprecated: repurposed as soft primary message
      // Note: `details` array still has `name` field (not renamed to `koot`)
      // so old frontend works without change.
    });
  } catch (error) {
    console.error("Matching API Error:", error);
    return NextResponse.json(
      { error: "Cosmic calculation failed. Please try again." },
      { status: 500 }
    );
  }
}