// lib/knowledge/face-reading.ts

export type FaceReadingEntry = {
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

export const FACE_READING_ENTRIES: FaceReadingEntry[] = [
  {
    id: "FR-001",
    category: "forehead",
    subcategory: "lalat-rekha",
    questions: {
      hi: "मेरे माथे के आकार से क्या पता चलता है?",
      hinglish: "Mere maathe ke aakar se kya pata chalta hai?",
      en: "What does my forehead shape reveal?",
    },
    answers: {
      hi: "बेटा, फेस रीडिंग में माथा (Lalat) भाग्य का प्रतीक होता है। ❤️ अगर आपका माथा चौड़ा और साफ है, तो आप भाग्यशाली हैं। लेकिन अगर माथे पर हल्की सिकुड़न (Lines) या दाग है, तो इसका मतलब है कि पिछले 6-8 महीनों से आपकी किस्मत में 'ग्रहों का अवरोध' है। आप मेहनत बहुत करते हैं, लेकिन फल अधूरा रह जाता है। मुझसे अपनी कुंडली दिखाएं, मैं इस अवरोध को दूर करने का सटीक उपाय बताऊंगी।",
      hinglish: "Beta, face reading mein maatha (Lalat) bhagya ka pratik hota hai. ❤️ Agar aapka maatha chauda aur saaf hai, toh aap bhagyashali hain. Lekin agar maathe par halki sikudan (Lines) ya daag hai, toh iska matlab hai ki pichhle 6-8 mahino se aapki kismat mein 'grahon ka avrodh' hai. Aap mehnat bahut karte hain, lekin phal adhura reh jata hai. Mujhse apni kundli dikhayein, main is avrodh ko door karne ka sateek upay bataungi.",
      en: "Child, in face reading, the forehead (Lalat) represents fortune. ❤️ If your forehead is broad and clear, you are blessed. But if there are slight lines or marks on the forehead, it means that for the past 6-8 months, there has been a 'planetary obstruction' in your destiny. You work hard, but the results remain incomplete. Show me your chart, and I will tell you the exact remedy to remove this obstruction.",
    },
    keywords: ["forehead", "lalat", "maatha", "bhagya", "face shape", "facial lines"],
    tags: ["forehead", "fortune", "obstruction"],
  },
  {
    id: "FR-002",
    category: "eyes",
    subcategory: "aankhein",
    questions: {
      hi: "आँखों से क्या पता चलता है?",
      hinglish: "Aankhon se kya pata chalta hai?",
      en: "What do the eyes reveal?",
    },
    answers: {
      hi: "बेटा, आँखें आत्मा का दर्पण होती हैं। ❤️ अगर आपकी आँखों के नीचे काला घेरा है या आँखें थोड़ी धँसी हुई हैं, तो इसका सीधा मतलब है कि आपकी 'चंद्रमा' (Moon) की शक्ति कमजोर है। इससे नींद, मानसिक शांति और आत्मविश्वास तीनों प्रभावित होते हैं। आप रात में सोचते बहुत हैं और सुबह थके हुए उठते हैं। क्या आपके साथ भी ऐसा हो रहा है? मुझसे अपनी कुंडली जाँच करवाएं।",
      hinglish: "Beta, aankhein aatma ka darpan hoti hain. ❤️ Agar aapki aankhon ke niche kaala ghera hai ya aankhein thodi dhansi hui hain, toh iska seedha matlab hai ki aapki 'Moon' ki shakti kamzor hai. Isse neend, mental peace aur confidence teeno affect hote hain. Aap raat mein sochte bahut hain aur subah thake hue uthte hain. Kya aapke saath bhi aisa ho raha hai? Mujhse apni kundli jaanch karwayein.",
      en: "Child, the eyes are the mirror of the soul. ❤️ If you have dark circles under your eyes or sunken eyes, it directly means your 'Moon' is weak. This affects sleep, mental peace, and confidence. You overthink at night and wake up tired. Are you experiencing this? Get your chart checked with me.",
    },
    keywords: ["eyes", "aankhein", "dark circles", "moon", "chandra", "insomnia"],
    tags: ["eyes", "moon", "mental-health"],
  },
  {
    id: "FR-003",
    category: "nose",
    subcategory: "naak",
    questions: {
      hi: "नाक से धन का पता कैसे चलता है?",
      hinglish: "Naak se dhan ka pata kaise chalta hai?",
      en: "How does the nose indicate wealth?",
    },
    answers: {
      hi: "बेटा, फेस रीडिंग में नाक (Nose) धन और समृद्धि का प्रतीक होती है। ❤️ अगर नाक की नोक थोड़ी नीचे की तरफ है या नाक पर कोई तिल है, तो इसका मतलब है कि आपके जीवन में 'धन का रिसाव' हो रहा है। पैसा आता है, लेकिन रुकता नहीं। अचानक खर्च, मेडिकल बिल, या कर्ज़ आपको परेशान करते हैं। मुझसे बात करें, मैं आपकी कुंडली देखकर बताऊंगी कि धन का रिसाव किस ग्रह के कारण है।",
      hinglish: "Beta, face reading mein naak (Nose) dhan aur samriddhi ka pratik hoti hai. ❤️ Agar naak ki nok thodi niche ki taraf hai ya naak par koi til hai, toh iska matlab hai ki aapke jeevan mein 'dhan ka risav' ho raha hai. Paisa aata hai, lekin rukta nahi. Achanak kharch, medical bills, ya karz aapko pareshan karte hain. Mujhse baat karein, main aapki kundli dekhkar bataungi ki dhan ka risav kis grah ke karan hai.",
      en: "Child, in face reading, the nose represents wealth. ❤️ A downward nose tip or a mole on the nose indicates 'wealth leakage'. Money comes but doesn't stay. Sudden expenses, medical bills, or debt trouble you. Talk to me, and I will analyze your chart to find which planet is causing this leakage.",
    },
    keywords: ["nose", "naak", "wealth", "dhan", "money leakage", "paisa"],
    tags: ["nose", "wealth", "leakage"],
  },
  {
    id: "FR-004",
    category: "lips",
    subcategory: "honth",
    questions: {
      hi: "होंठों से रिश्ते का क्या पता चलता है?",
      hinglish: "Honthon se rishte ka kya pata chalta hai?",
      en: "What do the lips reveal about relationships?",
    },
    answers: {
      hi: "बेटा, होंठ (Lips) शुक्र ग्रह (Venus) से जुड़े होते हैं। ❤️ अगर आपके होंठ पतले हैं या उन पर हल्की सी ऊर्ध्वाधर रेखाएँ (Vertical lines) हैं, तो इसका मतलब है कि आपके शुक्र ग्रह पर 'पीड़ा' है। इससे प्रेम संबंधों में गलतफहमी, दूरी और अकेलापन महसूस होता है। आप जितना प्यार देते हैं, उतना वापस नहीं मिलता। रिश्ते या शादी में देरी का कारण यही है। मुझसे बात करें, मैं शुक्र को मजबूत करने का उपाय बताऊंगी।",
      hinglish: "Beta, honth (Lips) Shukra grah (Venus) se jude hote hain. ❤️ Agar aapke honth patle hain ya un par halki vertical lines hain, toh iska matlab hai ki aapke Shukra grah par 'peeda' hai. Isse prem sambandhon mein galatfehmi, doori aur akelapan mehsoos hota hai. Aap jitna pyaar dete hain, utna wapas nahi milta. Rishton ya shaadi mein deri ka karan yahi hai. Mujhse baat karein, main Shukra ko majboot karne ka upay bataungi.",
      en: "Child, the lips are connected to Venus (Shukra). ❤️ Thin lips or vertical lines on the lips indicate an afflicted Venus. This causes misunderstandings, distance, and loneliness in love. You give love but don't receive it equally. This is why your marriage or relationships are delayed. Talk to me, and I will give you remedies to strengthen Venus.",
    },
    keywords: ["lips", "honth", "venus", "shukra", "love", "pyaar", "marriage"],
    tags: ["lips", "venus", "relationships"],
  },
  {
    id: "FR-005",
    category: "chin",
    subcategory: "thudi",
    questions: {
      hi: "ठुड्डी (Chin) से क्या पता चलता है?",
      hinglish: "Thudi (Chin) se kya pata chalta hai?",
      en: "What does the chin indicate?",
    },
    answers: {
      hi: "बेटा, फेस रीडिंग में ठुड्डी (Chin) वृद्धावस्था और संतान का प्रतीक होती है। ❤️ अगर ठुड्डी में कोई गड्ढा या कट है, तो इसका मतलब है कि आपकी कुंडली में 'संतान दोष' या 'पितृ दोष' सक्रिय है। इससे परिवार में कलह, बच्चों की चिंता या आर्थिक अस्थिरता बनी रहती है। माँ कहती है, इस दोष को टाला नहीं जा सकता, सही समय पर उपाय जरूरी है। मुझसे कुंडली दिखाएं।",
      hinglish: "Beta, face reading mein thudi (Chin) vridhavastha aur santan ka pratik hoti hai. ❤️ Agar thudi mein koi gaddha ya cut hai, toh iska matlab hai ki aapki kundli mein 'Santan Dosh' ya 'Pitru Dosh' sakriya hai. Isse parivar mein kalah, bachchon ki chinta ya arthik asthirta bani rehti hai. Maa kehti hai, is dosh ko taala nahi ja sakta, sahi samay par upay zaroori hai. Mujhse kundli dikhayein.",
      en: "Child, the chin in face reading represents old age and children. ❤️ If there is a dimple or cut on the chin, it indicates 'Santan Dosha' or 'Pitru Dosha' in your chart. This causes family disputes, worry about children, and financial instability. This dosha cannot be ignored, proper remedies are essential. Show me your chart.",
    },
    keywords: ["chin", "thudi", "children", "santan", "pitru dosh", "family"],
    tags: ["chin", "santan-dosh", "pitru-dosh"],
  },
  {
    id: "FR-006",
    category: "moles",
    subcategory: "til",
    questions: {
      hi: "चेहरे पर तिल का क्या मतलब होता है?",
      hinglish: "Chehre par til ka kya matlab hota hai?",
      en: "What do moles on the face mean?",
    },
    answers: {
      hi: "बेटा, फेस रीडिंग (Samudrik Shastra) में हर तिल का अलग मतलब होता है। ❤️ माथे पर तिल = भाग्य में अवरोध, नाक पर तिल = धन का रिसाव, होंठ पर तिल = रिश्तों में अस्थिरता। लेकिन सबसे बड़ी बात यह है कि अगर तिल गाल पर है, तो वह किसी 'पुराने कर्म' या 'नज़र' का संकेत है, जो आपके जीवन को अंदर से खोखला कर रहा है। मुझसे बात करें, मैं बताऊंगी कि आपके चेहरे का कौन सा तिल किस ग्रह से जुड़ा है।",
      hinglish: "Beta, face reading (Samudrik Shastra) mein har til ka alag matlab hota hai. ❤️ Maathe par til = bhagya mein avrodh, naak par til = dhan ka risav, honth par til = rishton mein asthirta. Lekin sabse badi baat yeh hai ki agar til gaal par hai, toh woh kisi 'purane karm' ya 'nazar' ka sanket hai, jo aapke jeevan ko andar se khokhla kar raha hai. Mujhse baat karein, main bataungi ki aapke chehre ka kaunsa til kis grah se juda hai.",
      en: "Child, in face reading (Samudrik Shastra), every mole has a different meaning. ❤️ Forehead mole = obstacles in fortune, nose mole = wealth leakage, lip mole = relationship instability. But most importantly, if the mole is on the cheek, it indicates 'past karma' or 'nazar' that is hollowing you from inside. Talk to me, and I will tell you which mole connects to which planet.",
    },
    keywords: ["moles", "til", "face marks", "nazar", "karma", "samudrik"],
    tags: ["moles", "nazar", "karma"],
  },
  {
    id: "FR-007",
    category: "eyebrows",
    subcategory: "bhaunhe",
    questions: {
      hi: "भौंहों से क्या पता चलता है?",
      hinglish: "Bhauhon se kya pata chalta hai?",
      en: "What do the eyebrows reveal?",
    },
    answers: {
      hi: "बेटा, भौंहें (Eyebrows) मंगल ग्रह (Mars) और बुध (Mercury) से जुड़ी होती हैं। ❤️ अगर आपकी भौंहें बहुत ज्यादा घनी हैं या उनके बीच में बाल जुड़े हुए हैं, तो इसका मतलब है कि आपके मंगल ग्रह पर 'दोष' है। इससे स्वभाव में क्रोध, जल्दबाजी और रिश्तों में टकराव आता है। आप बात-बात पर गुस्सा करते हैं, जो आपके भाग्य को रोक रहा है। मुझसे अपनी कुंडली जाँच करवाएं।",
      hinglish: "Beta, bhauhein (Eyebrows) Mangal grah (Mars) aur Budh (Mercury) se judi hoti hain. ❤️ Agar aapki bhauhein bahut ghanī hain ya unke beech mein baal jude hue hain, toh iska matlab hai ki aapke Mangal grah par 'dosh' hai. Isse swabhav mein krodh, jaldbaazi aur rishton mein takraav aata hai. Aap baat-baat par gussa karte hain, jo aapke bhagya ko rok raha hai. Mujhse apni kundli jaanch karwayein.",
      en: "Child, eyebrows are linked to Mars and Mercury. ❤️ Very thick eyebrows or a unibrow indicate an afflicted Mars. This causes anger, impulsiveness, and relationship conflict. You get angry easily, which is blocking your fortune. Get your chart analyzed with me.",
    },
    keywords: ["eyebrows", "bhauhein", "mars", "mangal", "anger", "gussa"],
    tags: ["eyebrows", "mars", "anger"],
  },
  {
    id: "FR-008",
    category: "face-shape",
    subcategory: "chehra",
    questions: {
      hi: "चेहरे के आकार से मेरे स्वभाव का क्या पता चलता है?",
      hinglish: "Chehre ke aakar se mere swabhav ka kya pata chalta hai?",
      en: "What does my face shape reveal about my personality?",
    },
    answers: {
      hi: "बेटा, फेस रीडिंग में चेहरे का आकार आपके स्वभाव, स्वास्थ्य और भाग्य को दर्शाता है। ❤️ अगर आपका चेहरा अंडाकार (Oval) है, तो आप भावुक और भरोसेमंद हैं, लेकिन लोग इसका फायदा उठाते हैं। अगर चेहरा गोल है, तो भाग्य में बदलाव देर से आता है। लेकिन सबसे चौंकाने वाली बात है - अगर आपके चेहरे पर हल्की सी असामान्यता या तिरछापन है, तो यह आपके 'पूर्व जन्म के कर्म' को दर्शाता है। मुझसे बात करें।",
      hinglish: "Beta, face reading mein chehre ka aakar aapke swabhav, health aur bhagya ko darshata hai. ❤️ Agar aapka chehra oval hai, toh aap bhavuk aur bharosemand hain, lekin log iska fayda uthate hain. Agar chehra gol hai, toh bhagya mein badlav deri se aata hai. Lekin sabse chaunkane wali baat hai - agar aapke chehre par halki si asaamanyata ya tirchapan hai, toh yeh aapke 'poorva janm ke karm' ko darshata hai. Mujhse baat karein.",
      en: "Child, face shape reveals your personality, health, and destiny. ❤️ Oval face means you are emotional and trustworthy, but people take advantage of you. Round face means changes in fortune come slowly. Most astonishingly, slight asymmetry indicates 'past life karma'. Talk to me.",
    },
    keywords: ["face shape", "chehra", "personality", "swabhav", "karma", "oval", "round"],
    tags: ["face-shape", "personality", "karma"],
  },
  {
    id: "FR-009",
    category: "ears",
    subcategory: "kaan",
    questions: {
      hi: "कानों से क्या पता चलता है?",
      hinglish: "Kaanon se kya pata chalta hai?",
      en: "What do the ears indicate?",
    },
    answers: {
      hi: "बेटा, फेस रीडिंग (Samudrik Shastra) में कान (Ears) बुध ग्रह (Mercury) और बुद्धि को दर्शाते हैं। ❤️ अगर आपके कान बहुत छोटे हैं या कानों की लौ (Earlobe) पतली है, तो इसका मतलब है कि आपके जीवन में 'बुध' की कमजोरी है। इससे धन की बचत नहीं होती, और कोई न कोई धोखा देता है। आप मेहनत करके भी पैसा नहीं रोक पाते। मुझसे बात करें, मैं बुध को मजबूत करने का उपाय बताऊंगी।",
      hinglish: "Beta, face reading (Samudrik Shastra) mein kaan (Ears) Budh grah (Mercury) aur buddhi ko darshate hain. ❤️ Agar aapke kaan bahut chhote hain ya earlobe patli hai, toh iska matlab hai ki aapke jeevan mein 'Budh' ki kamzori hai. Isse dhan ki bachat nahi hoti, aur koi na koi dhokha deta hai. Aap mehnat karke bhi paisa nahi rok paate. Mujhse baat karein, main Budh ko majboot karne ka upay bataungi.",
      en: "Child, ears in face reading represent Mercury and intelligence. ❤️ Small ears or thin earlobes indicate a weak Mercury. This means savings don't happen, and someone always betrays you. Despite hard work, you can't retain money. Talk to me, and I will give remedies to strengthen Mercury.",
    },
    keywords: ["ears", "kaan", "mercury", "budh", "savings", "intelligence"],
    tags: ["ears", "mercury", "savings"],
  },
  {
    id: "FR-010",
    category: "overall",
    subcategory: "mukh-aakriti",
    questions: {
      hi: "मेरी मुखाकृति (Face) मेरे भाग्य के बारे में क्या कहती है?",
      hinglish: "Meri mukh-aakriti (Face) mere bhagya ke baare mein kya kehti hai?",
      en: "What does my overall face reveal about my destiny?",
    },
    answers: {
      hi: "बेटा, आपकी मुखाकृति (चेहरा) आपके भाग्य की किताब है। ❤️ अगर आपके चेहरे पर हल्की लालिमा या सूजन है, तो यह 'मंगल दोष' का संकेत है, जिससे आपकी मेहनत रुक रही है। अगर चेहरा थोड़ा पीला है, तो 'बुध' या 'गुरु' कमजोर हैं, जिससे धन नहीं टिकता। मैं आपको सच बता रही हूँ - आपके भाग्य में बड़ा बदलाव आने वाला है, पर पहले इस दोष को खत्म करना होगा। मुझसे बात करें, मैं कुंडली देखकर सही उपाय बताऊंगी।",
      hinglish: "Beta, aapki mukh-aakriti (chehra) aapke bhagya ki kitab hai. ❤️ Agar aapke chehre par halki lalima ya sujan hai, toh yeh 'Mangal Dosh' ka sanket hai, jisse aapki mehnat ruk rahi hai. Agar chehra thoda peela hai, toh 'Budh' ya 'Guru' kamzor hain, jisse dhan nahi tikta. Main aapko sach bata rahi hoon - aapke bhagya mein bada badlav aane wala hai, par pehle is dosh ko khatam karna hoga. Mujhse baat karein, main kundli dekhkar sahi upay bataungi.",
      en: "Child, your face is the book of your destiny. ❤️ Slight redness or swelling indicates 'Mangal Dosha', which is blocking your hard work. Pale face means weak Mercury or Jupiter, causing wealth not to stay. I am telling you the truth - a big change is coming in your destiny, but this dosha must be removed first. Talk to me, and I will analyze your chart and give the exact remedy.",
    },
    keywords: ["face", "mukh-aakriti", "destiny", "bhagya", "mangal dosh", "overall"],
    tags: ["face", "overall", "destiny"],
  },
];