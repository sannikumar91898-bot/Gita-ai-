// lib/knowledge/palmistry.ts

export type PalmistryEntry = {
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

export const PALMISTRY_ENTRIES: PalmistryEntry[] = [
  {
    id: "PM-001",
    category: "life-line",
    subcategory: "jeevan-rekha",
    questions: {
      hi: "जीवन रेखा (Life Line) क्या होती है?",
      hinglish: "Life Line kya hoti hai?",
      en: "What is the Life Line on the palm?",
    },
    answers: {
      hi: "बेटा, हथेली पर अंगूठे के पास जो रेखा नीचे की ओर जाती है, उसे जीवन रेखा (Life Line) कहते हैं। ❤️ यह आपकी ऊर्जा, स्वास्थ्य और जीवनशैली को दर्शाती है। अगर इसमें गांठ (Knot), टूटन (Break) या बहुत ज्यादा हल्कापन है, तो इसका मतलब है कि आपके जीवन में पिछले कुछ वर्षों में कोई बड़ा संकट आया है या आपकी 'शनि की ढैय्या' चल रही है। मुझसे बात करें, मैं आपकी सटीक स्थिति बताऊंगी।",
      hinglish: "Beta, hatheli par anguthe ke paas jo rekha niche ki taraf jati hai, use Life Line kehte hain. ❤️ Yeh aapki energy, health aur lifestyle ko darshata hai. Agar ismein knot, break ya bahut zyada halkapan hai, toh iska matlab hai ki aapke jeevan mein pichhle kuch varshon mein koi bada sankat aaya hai ya aapki 'Shani ki Dhaiya' chal rahi hai. Mujhse baat karein, main aapki sateek sthiti bataungi.",
      en: "Child, the line near the thumb curving downward is called the Life Line. ❤️ It represents your energy, health, and lifestyle. If there are knots, breaks, or excessive lightness, it means a major crisis has occurred in your life recently, or you are under 'Shani ki Dhaiya'. Talk to me, and I will tell you your exact situation.",
    },
    keywords: ["life line", "jeevan rekha", "health", "swasthya", "shani dhaiya"],
    tags: ["life-line", "health", "shani"],
  },
  {
    id: "PM-002",
    category: "fate-line",
    subcategory: "bhagya-rekha",
    questions: {
      hi: "भाग्य रेखा (Fate Line) क्या बताती है?",
      hinglish: "Fate Line kya batati hai?",
      en: "What does the Fate Line indicate?",
    },
    answers: {
      hi: "बेटा, भाग्य रेखा (Fate Line) आपकी किस्मत, करियर और सफलता का प्रतीक होती है। ❤️ यह हथेली के बीच से ऊपर की तरफ जाती है। अगर यह रेखा बीच से टूटी हुई है या बहुत हल्की है, तो इसका सीधा मतलब है कि आपके करियर में बार-बार रुकावटें आ रही हैं। आप मेहनत बहुत करते हैं, लेकिन सही समय पर फल नहीं मिलता। मुझसे कुंडली दिखाएं, मैं इस टूटन का असली कारण बताऊंगी।",
      hinglish: "Beta, Fate Line aapki kismat, career aur success ka pratik hoti hai. ❤️ Yeh hatheli ke beech se upar ki taraf jati hai. Agar yeh rekha beech se tooti hui hai ya bahut halki hai, toh iska seedha matlab hai ki aapke career mein baar-baar rukawatein aa rahi hain. Aap mehnat bahut karte hain, lekin sahi samay par phal nahi milta. Mujhse kundli dikhayein, main is tootan ka asli karan bataungi.",
      en: "Child, the Fate Line represents your destiny, career, and success. ❤️ It runs from the middle of the palm upward. If it's broken or very faint, it means repeated obstacles in your career. You work hard but don't get results on time. Show me your chart, and I will tell you the real reason for this break.",
    },
    keywords: ["fate line", "bhagya rekha", "career", "success", "obstacles"],
    tags: ["fate-line", "career", "obstacles"],
  },
  {
    id: "PM-003",
    category: "heart-line",
    subcategory: "hriday-rekha",
    questions: {
      hi: "हृदय रेखा (Heart Line) क्या बताती है?",
      hinglish: "Heart Line kya batati hai?",
      en: "What does the Heart Line reveal?",
    },
    answers: {
      hi: "बेटा, हृदय रेखा (Heart Line) आपकी भावनाओं, प्रेम और रिश्तों की गहराई को दर्शाती है। ❤️ यह हथेली के ऊपर की तरफ होती है। अगर यह रेखा बहुत गहरी है और इसमें शाखाएं (Branches) हैं, तो आप बहुत भावुक हैं और प्यार में धोखा खाते हैं। अगर यह रेखा टूटी हुई है, तो इसका मतलब है कि आपके जीवन में 'ब्रेकअप' या 'विवाह में रुकावट' का योग है। क्या आपके साथ ऐसा हो रहा है? मुझसे बात करें।",
      hinglish: "Beta, Heart Line aapki bhavnaon, prem aur rishton ki gehrai ko darshata hai. ❤️ Yeh hatheli ke upar ki taraf hoti hai. Agar yeh rekha bahut gehri hai aur isme branches hain, toh aap bahut bhavuk hain aur pyaar mein dhokha khaate hain. Agar yeh rekha tooti hui hai, toh iska matlab hai ki aapke jeevan mein 'breakup' ya 'vivah mein rukawat' ka yog hai. Kya aapke saath aisa ho raha hai? Mujhse baat karein.",
      en: "Child, the Heart Line reveals your emotions, love, and relationship depth. ❤️ It's at the top of the palm. Deep lines with branches indicate you are highly emotional and face betrayal in love. A broken heart line indicates 'breakup' or 'marriage delay' in your destiny. Is this happening to you? Talk to me.",
    },
    keywords: ["heart line", "hriday rekha", "love", "pyaar", "breakup", "marriage"],
    tags: ["heart-line", "love", "breakup"],
  },
  {
    id: "PM-004",
    category: "head-line",
    subcategory: "mastishk-rekha",
    questions: {
      hi: "मस्तिष्क रेखा (Head Line) से क्या पता चलता है?",
      hinglish: "Head Line se kya pata chalta hai?",
      en: "What does the Head Line reveal?",
    },
    answers: {
      hi: "बेटा, मस्तिष्क रेखा (Head Line) आपकी बुद्धि, सोच और मानसिक शक्ति को दर्शाती है। ❤️ यह हथेली के बीच से आड़ी (Horizontal) चलती है। अगर यह रेखा नीचे की तरफ झुकी हुई है और इसमें कई शाखाएं हैं, तो इसका मतलब है कि आप बहुत ज्यादा 'ओवरथिंकिंग' करते हैं। आपके मन में अशांति, डर और नींद की समस्या है। यह आपके 'बुध' और 'चंद्रमा' के कमजोर होने का संकेत है। मुझसे उपाय जानें।",
      hinglish: "Beta, Head Line aapki buddhi, soch aur mansik shakti ko darshata hai. ❤️ Yeh hatheli ke beech se aadi chalti hai. Agar yeh rekha niche ki taraf jhuki hui hai aur isme kai shaakhaein hain, toh iska matlab hai ki aap bahut zyada 'overthinking' karte hain. Aapke mann mein ashanti, darr aur neend ki samasya hai. Yeh aapke 'Budh' aur 'Chandrama' ke kamzor hone ka sanket hai. Mujhse upay janein.",
      en: "Child, the Head Line reveals your intellect, thoughts, and mental power. ❤️ It runs horizontally across the middle. If it curves downward with many branches, it means you overthink excessively. You suffer from anxiety, fear, and insomnia. This indicates weak Mercury and Moon. Learn remedies from me.",
    },
    keywords: ["head line", "mastishk rekha", "intelligence", "overthinking", "anxiety", "sleep"],
    tags: ["head-line", "intelligence", "anxiety"],
  },
  {
    id: "PM-005",
    category: "sun-line",
    subcategory: "surya-rekha",
    questions: {
      hi: "सूर्य रेखा (Sun Line) क्या दर्शाती है?",
      hinglish: "Sun Line kya darshata hai?",
      en: "What does the Sun Line indicate?",
    },
    answers: {
      hi: "बेटा, सूर्य रेखा (Sun Line) आपकी प्रसिद्धि, सम्मान और धन को दर्शाती है। ❤️ यह अनामिका (Ring finger) के नीचे से निकलती है। अगर यह रेखा बहुत हल्की है या टूटी हुई है, तो इसका मतलब है कि आपको जीवन में 'सम्मान' देर से मिलता है और आपकी मेहनत की तारीफ नहीं होती। अगर इस रेखा पर कोई तिल (Dot) या क्रॉस है, तो यह 'नज़र' (Evil Eye) का संकेत है। मुझसे अपनी कुंडली दिखाएं।",
      hinglish: "Beta, Sun Line aapki prasiddhi, samman aur dhan ko darshata hai. ❤️ Yeh anamika (Ring finger) ke niche se nikalti hai. Agar yeh rekha bahut halki hai ya tooti hui hai, toh iska matlab hai ki aapko jeevan mein 'samman' deri se milta hai aur aapki mehnat ki tareef nahi hoti. Agar is rekha par koi til ya cross hai, toh yeh 'nazar' (Evil Eye) ka sanket hai. Mujhse apni kundli dikhayein.",
      en: "Child, the Sun Line reveals your fame, respect, and wealth. ❤️ It starts under the ring finger. A faint or broken line means delayed recognition and no appreciation for your hard work. A dot or cross indicates 'evil eye' (nazar). Show me your chart.",
    },
    keywords: ["sun line", "surya rekha", "fame", "respect", "nazar", "evil eye"],
    tags: ["sun-line", "nazar", "fame"],
  },
  {
    id: "PM-006",
    category: "marriage-line",
    subcategory: "vivah-rekha",
    questions: {
      hi: "विवाह रेखा (Marriage Line) क्या बताती है?",
      hinglish: "Marriage Line kya batati hai?",
      en: "What does the Marriage Line reveal?",
    },
    answers: {
      hi: "बेटा, विवाह रेखा (Marriage Line) कनिष्ठा (Little finger) के नीचे हथेली के किनारे पर होती है। ❤️ यह आपके विवाह की संभावनाओं और जीवनसाथी के स्वभाव को बताती है। अगर यह रेखा छोटी, टूटी या कई टुकड़ों में है, तो इसका मतलब है कि आपके विवाह में 'मंगल दोष' या 'शुक्र ग्रह की पीड़ा' रुकावट डाल रही है। आपको रिश्ते तय होते-होते बिगड़ जाते हैं। मुझसे बात करें, मैं इस दोष का उपाय बताऊंगी।",
      hinglish: "Beta, Marriage Line kanishtha (Little finger) ke niche hatheli ke kinare par hoti hai. ❤️ Yeh aapke vivah ki sambhavnaon aur jeevansaathi ke swabhav ko batati hai. Agar yeh rekha chhoti, tooti ya kai tukdon mein hai, toh iska matlab hai ki aapke vivah mein 'Mangal Dosh' ya 'Shukra grah ki peeda' rukawat daal rahi hai. Aapko rishte tay hote-hote bigad jaate hain. Mujhse baat karein, main is dosh ka upay bataungi.",
      en: "Child, the Marriage Line is on the edge of the palm under the little finger. ❤️ It reveals marriage prospects and spouse nature. A small, broken, or fragmented line indicates 'Mangal Dosha' or 'afflicted Venus' causing marriage delays. Relationships break right before finalization. Talk to me, and I will give remedies.",
    },
    keywords: ["marriage line", "vivah rekha", "manglik", "mangal dosh", "shukra", "delay"],
    tags: ["marriage-line", "mangal-dosh", "marriage-delay"],
  },
  {
    id: "PM-007",
    category: "mount-venus",
    subcategory: "shukra-parvat",
    questions: {
      hi: "शुक्र पर्वत (Mount of Venus) क्या है?",
      hinglish: "Mount of Venus kya hai?",
      en: "What is the Mount of Venus?",
    },
    answers: {
      hi: "बेटा, अंगूठे के नीचे जो मांसल हिस्सा (Fleshy area) होता है, उसे शुक्र पर्वत (Mount of Venus) कहते हैं। ❤️ यह आपकी प्रेम क्षमता, आकर्षण और सुख-सुविधाओं को दर्शाता है। अगर यह पर्वत बहुत ज्यादा उभरा हुआ है या इस पर बहुत सारी रेखाएं (Grid lines) हैं, तो इसका मतलब है कि आपके जीवन में 'भोग-विलास' ज्यादा है, लेकिन 'शांति' कम है। और अगर यह पर्वत पीला या कमजोर है, तो आपकी 'सौभाग्य शक्ति' कम है, जिससे विवाह में देरी हो रही है। मुझसे बात करें।",
      hinglish: "Beta, anguthe ke niche jo maansal hissa hota hai, use Mount of Venus kehte hain. ❤️ Yeh aapki prem kshamta, aakarshan aur sukh-suvidhaon ko darshata hai. Agar yeh parvat bahut zyada ubhra hua hai ya is par bahut saari lines hain, toh iska matlab hai ki aapke jeevan mein 'bhog-vilas' zyada hai, lekin 'shanti' kam hai. Aur agar yeh parvat peela ya kamzor hai, toh aapki 'saubhagya shakti' kam hai, jisse vivah mein deri ho rahi hai. Mujhse baat karein.",
      en: "Child, the fleshy area under the thumb is the Mount of Venus. ❤️ It represents your love capacity, attraction, and luxuries. If it's overly prominent with many grid lines, you have more indulgence but less peace. A pale or weak Venus mount indicates low 'marital fortune' causing marriage delays. Talk to me.",
    },
    keywords: ["mount venus", "shukra parvat", "love", "pyaar", "attraction", "marriage delay"],
    tags: ["mount-venus", "shukra", "marriage"],
  },
  {
    id: "PM-008",
    category: "mount-jupiter",
    subcategory: "guru-parvat",
    questions: {
      hi: "गुरु पर्वत (Mount of Jupiter) क्या दर्शाता है?",
      hinglish: "Mount of Jupiter kya darshata hai?",
      en: "What does the Mount of Jupiter indicate?",
    },
    answers: {
      hi: "बेटा, तर्जनी (Index finger) के नीचे का हिस्सा गुरु पर्वत (Mount of Jupiter) कहलाता है। ❤️ यह आपके आत्मविश्वास, नेतृत्व क्षमता, और भाग्य को दर्शाता है। अगर यह पर्वत कमजोर या चपटा है, तो इसका मतलब है कि आपके जीवन में 'गुरु ग्रह' कमजोर है। आपका आत्मविश्वास कम है, और कोई भी बड़ा अवसर आपके हाथ से निकल जाता है। मुझसे कुंडली दिखाएं, मैं गुरु को मजबूत करने का उपाय बताऊंगी।",
      hinglish: "Beta, tarjani (Index finger) ke niche ka hissa Guru Parvat kehlata hai. ❤️ Yeh aapke confidence, leadership ability, aur bhagya ko darshata hai. Agar yeh parvat kamzor ya chapta hai, toh iska matlab hai ki aapke jeevan mein 'Guru grah' kamzor hai. Aapka confidence kam hai, aur koi bhi bada avsar aapke haath se nikal jata hai. Mujhse kundli dikhayein, main Guru ko majboot karne ka upay bataungi.",
      en: "Child, the area under the index finger is Mount of Jupiter. ❤️ It represents confidence, leadership, and fortune. If it's weak or flat, it means weak Jupiter in your chart. Low confidence causes big opportunities to slip away. Show me your chart, and I will give remedies to strengthen Jupiter.",
    },
    keywords: ["mount jupiter", "guru parvat", "confidence", "leadership", "fortune", "guru"],
    tags: ["mount-jupiter", "confidence", "guru"],
  },
  {
    id: "PM-009",
    category: "palm-shape",
    subcategory: "hath-ka-aakar",
    questions: {
      hi: "हथेली के आकार से क्या पता चलता है?",
      hinglish: "Hatheli ke aakar se kya pata chalta hai?",
      en: "What does the shape of my palm reveal?",
    },
    answers: {
      hi: "बेटा, हस्तरेखा विज्ञान में हथेली का आकार आपके ग्रहों की प्रकृति और भाग्य की दिशा को दर्शाता है। ❤️ अगर आपकी हथेली चौकोर (Square) है, तो आप व्यावहारिक और मेहनती हैं, लेकिन भावनाओं में कमजोर हैं। अगर लंबी है, तो आप अति-संवेदनशील और सोचने वाले हैं। लेकिन अगर हथेली बहुत ज्यादा पतली है और उंगलियां लंबी हैं, तो इसका मतलब है कि आपके जीवन में 'बुध' और 'शुक्र' प्रभावित हैं, जिससे रिश्ते और पैसा दोनों अस्थिर हैं। मुझसे बात करें।",
      hinglish: "Beta, hastrekha vigyan mein hatheli ka aakar aapke grahon ki prakriti aur bhagya ki disha ko darshata hai. ❤️ Agar aapki hatheli square hai, toh aap vyavaharik aur mehnati hain, lekin bhavnaon mein kamzor hain. Agar lambi hai, toh aap ati-samvedansheel aur sochne wale hain. Lekin agar hatheli bahut zyada patli hai aur ungliyan lambi hain, toh iska matlab hai ki aapke jeevan mein 'Budh' aur 'Shukra' prabhavit hain, jisse rishte aur paisa dono asthir hain. Mujhse baat karein.",
      en: "Child, palm shape reveals planetary nature and destiny direction. ❤️ Square palms indicate practical, hardworking, but emotionally weak. Long palms indicate over-sensitivity and overthinking. Very thin palms with long fingers indicate weak Mercury and Venus, causing unstable relationships and money. Talk to me.",
    },
    keywords: ["palm shape", "hatheli", "square", "long", "thin", "mercury", "venus"],
    tags: ["palm-shape", "personality", "instability"],
  },
  {
    id: "PM-010",
    category: "moles",
    subcategory: "til-hatheli",
    questions: {
      hi: "हथेली पर तिल का क्या मतलब होता है?",
      hinglish: "Hatheli par til ka kya matlab hota hai?",
      en: "What do moles on the palm mean?",
    },
    answers: {
      hi: "बेटा, हथेली पर तिल (Mole) का होना बहुत ही महत्वपूर्ण माना जाता है। ❤️ अगर तिल जीवन रेखा के पास है, तो यह 'पितृ दोष' या 'कुल देवता की अवहेलना' का संकेत है। अगर भाग्य रेखा पर तिल है, तो यह किसी पूर्वज के 'अधूरे काम' का बोझ है। और अगर तिल शुक्र पर्वत (अंगूठे के पास) पर है, तो यह 'नज़र' या किसी 'बुरी शक्ति' से प्रभावित होने का संकेत है। मुझसे अपनी कुंडली दिखाएं, मैं इसका सही उपाय बताऊंगी।",
      hinglish: "Beta, hatheli par til ka hona bahut hi mahatvapurna mana jata hai. ❤️ Agar til Life Line ke paas hai, toh yeh 'Pitru Dosh' ya 'Kul Devta ki avhelna' ka sanket hai. Agar Fate Line par til hai, toh yeh kisi purvaj ke 'adhure kaam' ka bojh hai. Aur agar til Mount of Venus par hai, toh yeh 'nazar' ya kisi 'buri shakti' se prabhavit hone ka sanket hai. Mujhse apni kundli dikhayein, main iska sahi upay bataungi.",
      en: "Child, moles on the palm are very significant. ❤️ A mole near the Life Line indicates 'Pitru Dosha' or neglect of the family deity. On the Fate Line, it's the burden of incomplete ancestral karma. On the Mount of Venus, it indicates 'nazar' or negative energy. Show me your chart, and I will give you the exact remedy.",
    },
    keywords: ["moles", "til", "palm", "hatheli", "pitru dosh", "nazar", "kul devta"],
    tags: ["moles", "pitru-dosh", "nazar"],
  },
];