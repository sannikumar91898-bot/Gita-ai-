
export type KnowledgeLanguage = "hi" | "hinglish" | "en";

export type KnowledgeEntry = {
  id: string;
  topic: string;
  question: string;
  aliases: string[];
  answers: Record<KnowledgeLanguage, string>;
};

const SEEDS: Omit<KnowledgeEntry, "id">[] = [
  {
    topic: "vedic-astrology",
    question: "वैदिक ज्योतिष क्या है?",
    aliases: ["vedic astrology", "jyotish kya hai", "ज्योतिष क्या है"],
    answers: {
      hi: "वैदिक ज्योतिष भारतीय परंपरा की एक पद्धति है, जिसमें ग्रहों, राशियों, नक्षत्रों और जन्म के समय की स्थिति का प्रतीकात्मक अध्ययन किया जाता है। इसे निश्चित भविष्यवाणी या वैज्ञानिक रूप से प्रमाणित परिणाम न मानें।",
      hinglish: "Vedic astrology Bharatiya parampara ki ek paddhati hai. Ismein grah, rashi, nakshatra aur birth time ki position ka symbolic study hota hai. Ise guaranteed future prediction ya scientifically proven result na samjhein.",
      en: "Vedic astrology is a traditional Indian system that symbolically interprets planetary positions, signs, nakshatras and birth details. It should not be treated as a guaranteed prediction or scientifically established method."
    }
  },
  {
    topic: "kundli",
    question: "जन्म कुंडली क्या होती है?",
    aliases: ["kundli kya hai", "birth chart", "janam patri", "जन्मपत्री"],
    answers: {
      hi: "जन्म कुंडली जन्म की तारीख, सही समय और जन्म स्थान के आधार पर बनाया गया ज्योतिषीय चार्ट है। व्यक्तिगत कुंडली के लिए सही जन्म विवरण और वास्तविक गणना आवश्यक है।",
      hinglish: "Janam kundli birth date, accurate time aur birthplace ke basis par banne wala astrology chart hai. Personal kundli ke liye sahi details aur actual calculation zaroori hai.",
      en: "A birth chart is an astrological chart based on birth date, accurate birth time and birthplace. A personal chart requires those details and actual calculations."
    }
  },
  {
    topic: "kundli",
    question: "लग्न क्या होता है?",
    aliases: ["ascendant", "lagna meaning", "lagna kya hota hai"],
    answers: {
      hi: "लग्न जन्म के समय पूर्वी क्षितिज पर उदित राशि को कहा जाता है। इसकी गणना जन्म समय और स्थान पर निर्भर करती है।",
      hinglish: "Lagna woh rashi hai jo birth ke waqt eastern horizon par rise kar rahi hoti hai. Iski calculation birth time aur place par depend karti hai.",
      en: "The ascendant is the sign rising on the eastern horizon at birth. Its calculation depends on the exact birth time and location."
    }
  },
  {
    topic: "graha",
    question: "नवग्रह कौन-कौन से हैं?",
    aliases: ["nine planets", "navgrah names", "navagraha"],
    answers: {
      hi: "परंपरागत वैदिक ज्योतिष के नवग्रह सूर्य, चंद्र, मंगल, बुध, बृहस्पति, शुक्र, शनि, राहु और केतु हैं। राहु और केतु को खगोलीय छाया-बिंदु माना जाता है, भौतिक ग्रह नहीं।",
      hinglish: "Vedic astrology ke Navgrah hain Surya, Chandra, Mangal, Budh, Brihaspati, Shukra, Shani, Rahu aur Ketu. Rahu-Ketu astronomical shadow points hain, physical planets nahi.",
      en: "The nine grahas in traditional Vedic astrology are the Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu and Ketu. Rahu and Ketu are astronomical nodes, not physical planets."
    }
  },
  {
    topic: "graha",
    question: "शनि ग्रह का ज्योतिष में क्या अर्थ है?",
    aliases: ["saturn meaning", "shani ka prabhav", "shani grah"],
    answers: {
      hi: "ज्योतिषीय परंपरा में शनि को अनुशासन, जिम्मेदारी, धैर्य और कर्म से जोड़ा जाता है। किसी व्यक्ति के जीवन पर इसका निश्चित प्रभाव बताने के लिए कुंडली की गणना चाहिए, और ज्योतिषीय व्याख्याएँ निश्चित तथ्य नहीं हैं।",
      hinglish: "Astrology mein Shani ko discipline, responsibility, patience aur karma se joda jata hai. Personal effect batane ke liye chart calculation chahiye; astrology ki interpretations guaranteed facts nahi hain.",
      en: "In astrology, Saturn is associated with discipline, responsibility, patience and work. A personal interpretation requires chart calculations, and astrological interpretations are not established facts."
    }
  },
  {
    topic: "graha",
    question: "बृहस्पति ग्रह किसका प्रतीक है?",
    aliases: ["guru grah", "jupiter astrology", "brihaspati meaning"],
    answers: {
      hi: "वैदिक ज्योतिष में बृहस्पति को ज्ञान, शिक्षा, मार्गदर्शन और विस्तार का प्रतीक माना जाता है। यह एक पारंपरिक व्याख्या है, किसी परिणाम की गारंटी नहीं।",
      hinglish: "Vedic astrology mein Brihaspati ko knowledge, education, guidance aur growth se joda jata hai. Yeh traditional interpretation hai, guarantee nahi.",
      en: "In Vedic astrology, Jupiter is associated with knowledge, education, guidance and growth. This is a traditional interpretation, not a guarantee."
    }
  },
  {
    topic: "rashi",
    question: "बारह राशियों के नाम क्या हैं?",
    aliases: ["12 zodiac signs", "all rashis", "rashi names"],
    answers: {
      hi: "बारह राशियाँ हैं: मेष, वृषभ, मिथुन, कर्क, सिंह, कन्या, तुला, वृश्चिक, धनु, मकर, कुंभ और मीन।",
      hinglish: "12 rashiyan hain: Mesh, Vrishabh, Mithun, Kark, Singh, Kanya, Tula, Vrishchik, Dhanu, Makar, Kumbh aur Meen.",
      en: "The twelve zodiac signs are Aries, Taurus, Gemini, Cancer, Leo, Virgo, Libra, Scorpio, Sagittarius, Capricorn, Aquarius and Pisces."
    }
  },
  {
    topic: "rashi",
    question: "चंद्र राशि क्या होती है?",
    aliases: ["moon sign", "chandra rashi", "moon rashi"],
    answers: {
      hi: "चंद्र राशि वह राशि है जिसमें जन्म के समय चंद्रमा स्थित माना जाता है। इसे निकालने के लिए जन्म तारीख, समय, स्थान और संबंधित गणना-पद्धति चाहिए।",
      hinglish: "Chandra rashi woh sign hai jisme birth ke waqt Moon hota hai. Isse calculate karne ke liye birth date, time, place aur calculation system chahiye.",
      en: "The Moon sign is the zodiac sign occupied by the Moon at birth. Calculating it requires birth date, time, location and a defined calculation system."
    }
  },
  {
    topic: "nakshatra",
    question: "नक्षत्र क्या होता है?",
    aliases: ["nakshatra meaning", "27 nakshatra", "birth star"],
    answers: {
      hi: "वैदिक ज्योतिष में आकाशीय पथ को 27 मुख्य नक्षत्रों में बाँटा जाता है। जन्म नक्षत्र निकालने के लिए जन्म समय और स्थान के आधार पर चंद्रमा की स्थिति की गणना की जाती है।",
      hinglish: "Vedic astrology mein sky ke path ko 27 main nakshatron mein divide kiya jata hai. Janma nakshatra ke liye birth details se Moon ki position calculate karni hoti hai.",
      en: "Vedic astrology divides the lunar path into 27 principal nakshatras. Finding a birth nakshatra requires calculating the Moon's position from birth details."
    }
  },
  {
    topic: "dasha",
    question: "विंशोत्तरी दशा क्या है?",
    aliases: ["vimshottari dasha", "mahadasha meaning", "dasha system"],
    answers: {
      hi: "विंशोत्तरी दशा वैदिक ज्योतिष की एक समय-चक्र प्रणाली है, जिसमें ग्रहों से जुड़े अलग-अलग काल बताए जाते हैं। व्यक्तिगत दशा जानने के लिए जन्म नक्षत्र और गणना आवश्यक है।",
      hinglish: "Vimshottari Dasha Vedic astrology ka ek planetary period system hai. Personal dasha ke liye birth nakshatra aur proper calculation zaroori hai.",
      en: "Vimshottari Dasha is a planetary-period system used in Vedic astrology. A personal dasha calculation requires the birth nakshatra and appropriate calculations."
    }
  },
  {
    topic: "yog",
    question: "राजयोग क्या होता है?",
    aliases: ["raj yoga", "raajyog meaning", "kundli yog"],
    answers: {
      hi: "ज्योतिष में राजयोग कुछ ग्रहों और भावों के विशेष संबंधों के लिए इस्तेमाल किया जाने वाला नाम है। केवल योग का नाम देखकर सफलता या धन की गारंटी नहीं दी जा सकती।",
      hinglish: "Astrology mein Rajyog kuch grahon aur houses ke specific combinations ko kehte hain. Sirf yog ke naam se success ya wealth guarantee nahi hoti.",
      en: "Raj Yoga is an astrological term for certain planetary and house relationships. Its presence does not guarantee success or wealth."
    }
  },
  {
    topic: "dosha",
    question: "मंगल दोष क्या है?",
    aliases: ["manglik dosh", "mangal dosha", "manglik meaning"],
    answers: {
      hi: "मंगल दोष पारंपरिक ज्योतिष में कुंडली में मंगल की कुछ स्थितियों के लिए प्रयुक्त शब्द है। इसके आधार पर विवाह का डर या जल्दबाजी में निर्णय न लें; रिश्ते में संवाद, सम्मान और अनुकूलता अधिक महत्वपूर्ण हैं।",
      hinglish: "Mangal dosh traditional astrology mein Mars ki kuch chart positions ke liye use hota hai. Isse dar kar marriage decision na lein; communication, respect aur compatibility zyada important hain.",
      en: "Mangal Dosha is a traditional astrological label for certain Mars placements. Avoid fear-based marriage decisions; communication, respect and compatibility matter more."
    }
  },
  {
    topic: "love",
    question: "प्रेम संबंध में अनुकूलता कैसे समझें?",
    aliases: ["love compatibility", "relationship match", "love life"],
    answers: {
      hi: "स्वस्थ रिश्ते में आपसी सम्मान, भरोसा, खुला संवाद, सहमति और समान अपेक्षाएँ महत्वपूर्ण हैं। राशि या कुंडली किसी रिश्ते के सफल होने की गारंटी नहीं देती।",
      hinglish: "Healthy relationship mein mutual respect, trust, honest communication, consent aur shared expectations important hain. Rashi ya kundli relationship success guarantee nahi karti.",
      en: "Healthy relationships depend on mutual respect, trust, honest communication, consent and shared expectations. Zodiac signs or birth charts cannot guarantee relationship success."
    }
  },
  {
    topic: "marriage",
    question: "विवाह का सही समय कैसे पता चलता है?",
    aliases: ["marriage timing", "shaadi kab hogi", "vivah yog"],
    answers: {
      hi: "ज्योतिष में विवाह के समय के लिए कुंडली, दशा और गोचर की व्याख्या की जाती है, लेकिन इससे विवाह की तारीख निश्चित रूप से नहीं बताई जा सकती। व्यक्तिगत ज्योतिषीय विश्लेषण के लिए वास्तविक गणना चाहिए।",
      hinglish: "Astrology mein marriage timing ke liye kundli, dasha aur transit dekhe jate hain, lekin exact shaadi date guarantee nahi ki ja sakti. Personal analysis ke liye actual calculations chahiye.",
      en: "Astrologers may interpret charts, planetary periods and transits for marriage timing, but these cannot reliably guarantee a wedding date. Personal analysis requires actual chart calculations."
    }
  },
  {
    topic: "career",
    question: "करियर चुनते समय क्या ध्यान रखें?",
    aliases: ["career guidance", "job selection", "career advice"],
    answers: {
      hi: "करियर चुनने में अपनी रुचि, योग्यता, उपलब्ध अवसर, आर्थिक स्थिति और तैयारी के समय को देखें। ज्योतिष को चाहें तो व्यक्तिगत चिंतन का एक माध्यम मानें, लेकिन निर्णय वास्तविक जानकारी पर लें।",
      hinglish: "Career choose karte waqt interest, skills, available opportunities, finances aur preparation time dekhein. Astrology ko optional reflection samjhein; decision practical information ke basis par lein.",
      en: "Consider your interests, skills, available opportunities, finances and preparation time when choosing a career. Treat astrology as optional reflection, not a substitute for practical evidence."
    }
  },
  {
    topic: "money",
    question: "धन प्रबंधन कैसे बेहतर करें?",
    aliases: ["money problems", "financial growth", "wealth advice"],
    answers: {
      hi: "आय और खर्च लिखें, जरूरी खर्चों को प्राथमिकता दें, नियमित बचत करें और कर्ज की शर्तें समझें। कोई ज्योतिषीय उपाय धन मिलने की गारंटी नहीं देता।",
      hinglish: "Income aur expenses track karein, essential spending ko priority dein, regular saving karein aur loan terms samjhein. Koi astrological remedy paisa milne ki guarantee nahi deti.",
      en: "Track income and expenses, prioritize essentials, save regularly and understand loan terms. No astrological remedy can guarantee financial gain."
    }
  },
  {
    topic: "remedies",
    question: "क्या ज्योतिषीय उपाय जरूरी हैं?",
    aliases: ["astrology remedies", "upay", "grah shanti"],
    answers: {
      hi: "मंत्र, प्रार्थना, ध्यान या दान कुछ लोगों के लिए व्यक्तिगत आस्था और मानसिक शांति का माध्यम हो सकते हैं। महँगे उपायों, डर दिखाने वाले दावों और चमत्कारी परिणामों के वादों से सावधान रहें।",
      hinglish: "Mantra, prayer, meditation ya charity kuch logon ke liye faith aur peace ka source ho sakte hain. Expensive remedies, fear-based claims aur miracle guarantees se bachkar rahein.",
      en: "Prayer, meditation, chanting or charity may offer personal meaning or peace. Be cautious of expensive remedies, fear-based claims and promises of miraculous results."
    }
  },
  {
    topic: "palmistry",
    question: "हस्तरेखा विज्ञान क्या है?",
    aliases: ["palm reading", "palmistry meaning", "haath ki rekha"],
    answers: {
      hi: "हस्तरेखा पढ़ना हाथ की रेखाओं और आकारों की पारंपरिक व्याख्या है। इससे भविष्य, स्वास्थ्य या जीवन की घटनाओं को विश्वसनीय रूप से निश्चित नहीं किया जा सकता।",
      hinglish: "Palmistry haath ki lines aur shapes ki traditional interpretation hai. Isse future, health ya life events reliably confirm nahi kiye ja sakte.",
      en: "Palmistry is a traditional interpretation of palm lines and shapes. It cannot reliably establish future events, health outcomes or life circumstances."
    }
  },
  {
    topic: "daily-horoscope",
    question: "दैनिक राशिफल कितना सही होता है?",
    aliases: ["daily horoscope", "aaj ka rashifal", "today horoscope"],
    answers: {
      hi: "दैनिक राशिफल आम तौर पर व्यापक और सामान्य व्याख्या होता है। इसे मनोरंजन या आत्मचिंतन की तरह पढ़ें, न कि नौकरी, स्वास्थ्य, पैसे या रिश्तों के बड़े निर्णयों का आधार।",
      hinglish: "Daily horoscope usually general interpretation hota hai. Ise entertainment ya self-reflection ki tarah lein, major job, health, money ya relationship decisions ka basis na banayein.",
      en: "Daily horoscopes are generally broad interpretations. Treat them as entertainment or reflection, not as the basis for major health, financial, career or relationship decisions."
    }
  },
  {
    topic: "gita",
    question: "भगवद्गीता का मुख्य संदेश क्या है?",
    aliases: ["bhagavad gita meaning", "gita teachings", "गीता का संदेश"],
    answers: {
      hi: "भगवद्गीता कर्तव्य, विवेक, आत्मसंयम, भक्ति और कर्म के महत्व पर चर्चा करती है। इसका एक प्रसिद्ध संदेश है कि अपना कर्तव्य पूरी निष्ठा से करें और फल के प्रति आसक्ति कम रखें।",
      hinglish: "Bhagavad Gita duty, wisdom, self-control, devotion aur karma ki importance samjhati hai. Ek central teaching hai apna kartavya sincerely karna aur result ke attachment ko kam rakhna.",
      en: "The Bhagavad Gita discusses duty, discernment, self-discipline, devotion and action. A central teaching is to perform one's duty sincerely without excessive attachment to outcomes."
    }
  },
  {
    topic: "gita",
    question: "कठिन समय में गीता से क्या सीख सकते हैं?",
    aliases: ["gita for difficult times", "stress and gita", "गीता की सीख"],
    answers: {
      hi: "गीता की शिक्षाएँ कठिन समय में धैर्य, विवेक और अपने नियंत्रण में मौजूद कार्यों पर ध्यान देने की प्रेरणा दे सकती हैं। जरूरत पड़ने पर भरोसेमंद व्यक्ति या योग्य पेशेवर से सहायता लेना भी उचित है।",
      hinglish: "Gita ki teachings tough times mein patience, clarity aur apne control wale actions par focus karna sikha sakti hain. Zarurat par trusted person ya qualified professional se help lena bhi sahi hai.",
      en: "The Gita can encourage patience, discernment and focus on actions within your control. Seeking help from a trusted person or qualified professional is also appropriate when needed."
    }
  },
  {
    topic: "wellbeing",
    question: "क्या कुंडली से स्वास्थ्य की बीमारी पता चल सकती है?",
    aliases: ["health astrology", "health prediction", "disease in kundli"],
    answers: {
      hi: "कुंडली से किसी बीमारी का विश्वसनीय निदान नहीं किया जा सकता। लक्षण या स्वास्थ्य संबंधी चिंता हो तो योग्य डॉक्टर से सलाह लें; ज्योतिष चिकित्सा का विकल्प नहीं है।",
      hinglish: "Kundli se disease ka reliable diagnosis nahi ho sakta. Symptoms ya health concern ho to qualified doctor se consult karein; astrology medical care ka replacement nahi hai.",
      en: "A birth chart cannot reliably diagnose illness. Consult a qualified medical professional about symptoms or health concerns; astrology is not a substitute for medical care."
    }
  },
  {
    topic: "health-prevention",
    question: "स्वास्थ्य की देखभाल और बीमारी से बचाव कैसे करें?",
    aliases: ["health prevention", "health care tips", "bimari se bachav", "sehat ka dhyan", "स्वास्थ्य की सावधानियां"],
    answers: {
      hi: "अपनी सेहत का ध्यान रखने के लिए नियमित नींद, संतुलित भोजन, पर्याप्त पानी, रोज़ाना हल्की गतिविधि और जरूरत के अनुसार डॉक्टर की सलाह को प्राथमिकता दें। कोई भी लक्षण लगातार बना रहे या बढ़े, तो उसे केवल ग्रहों से जोड़कर न टालें।",
      hinglish: "Apni health ke liye regular sleep, balanced food, enough water, daily light activity aur zarurat par doctor ki advice ko priority dein. Koi symptom persist kare ya badhe, to use sirf grahon se jodkar ignore na karein.",
      en: "Support your health with regular sleep, balanced meals, enough water, daily movement and medical advice when needed. Do not attribute persistent or worsening symptoms only to planetary influences."
    }
  },
  {
    topic: "health-anxiety",
    question: "अगर मुझे बीमारी का डर बार-बार लगता है तो क्या करूं?",
    aliases: ["fear of illness", "health anxiety", "bimari ka dar", "mujhe bimari ka darr hai", "health ko lekar tension"],
    answers: {
      hi: "मैं समझ सकती हूँ कि सेहत को लेकर बार-बार डर लगना कितना थका देने वाला हो सकता है। अभी धीरे-धीरे साँस लें और अपने डर को बिना जज किए पहचानें। अगर यह चिंता बार-बार आती है या रोज़मर्रा की ज़िंदगी प्रभावित करती है, तो डॉक्टर या मानसिक स्वास्थ्य विशेषज्ञ से बात करना मददगार हो सकता है।",
      hinglish: "Main samajh sakti hoon ki health ko lekar baar-baar darr lagna kitna exhausting ho sakta hai. Abhi dheere saans lein aur apne fear ko bina judge kiye notice karein. Agar anxiety baar-baar aaye ya daily life affect kare, to doctor ya mental-health professional se baat karna helpful ho sakta hai.",
      en: "Repeated fear about illness can feel exhausting. Take a few slow breaths and notice the worry without judging yourself. If it keeps returning or affects daily life, consider speaking with a doctor or mental-health professional."
    }
  },
  {
    topic: "mental-wellbeing",
    question: "तनाव और ज्यादा सोचने पर मन को शांत कैसे करें?",
    aliases: ["stress and overthinking", "mind ko shant kaise karein", "overthinking help", "tension kam karna", "anxiety calming"],
    answers: {
      hi: "चलो, पहले एक छोटा कदम लेते हैं। आराम से बैठें, साँस को धीरे अंदर लें और धीरे बाहर छोड़ें। फिर अपने मन की बात लिखें और देखें कि अभी कौन-सा एक छोटा काम आपके नियंत्रण में है। अगर तनाव लंबे समय तक रहे या संभालना कठिन लगे, तो किसी भरोसेमंद व्यक्ति या विशेषज्ञ से सहायता लें।",
      hinglish: "Chaliye, pehle ek chhota step lete hain. Aaram se baithkar dheere saans andar lein aur dheere bahar chhodein. Phir apni thoughts likhein aur dekhein ki abhi kaunsa ek chhota kaam aapke control mein hai. Stress lambe time tak rahe ya manage karna mushkil ho, to trusted person ya professional se help lein.",
      en: "Let's start with one small step. Sit comfortably and breathe in and out slowly. Write down what is on your mind, then identify one small thing within your control. If stress persists or feels hard to manage, seek support from someone you trust or a professional."
    }
  },
  {
    topic: "age-and-longevity",
    question: "क्या कुंडली से आयु या मृत्यु का समय पता चल सकता है?",
    aliases: ["life expectancy astrology", "death prediction", "meri umar kitni hogi", "ayu in kundli", "death age prediction", "longevity prediction"],
    answers: {
      hi: "मैं आपकी आयु या मृत्यु का समय कुंडली से निश्चित रूप से नहीं बता सकती, और ऐसी भविष्यवाणी भरोसेमंद नहीं होती। ऐसी बातों से डरने के बजाय आज की सेहत, सुरक्षित आदतों और अपने प्रिय लोगों के साथ समय पर ध्यान देना अधिक उपयोगी है। यदि इस विचार से बहुत घबराहट हो रही है, तो किसी भरोसेमंद व्यक्ति से बात करें।",
      hinglish: "Main kundli se aapki exact age ya death ka time reliably nahi bata sakti. Aisi predictions par darne ke bajay present health, safe habits aur apno ke saath waqt par focus karna zyada useful hai. Agar is thought se bahut anxiety ho rahi hai, to kisi trusted person se baat karein.",
      en: "A birth chart cannot reliably determine your lifespan or time of death. Rather than fear such predictions, focus on current health, safe habits and time with people you care about. If this thought causes intense anxiety, talk with someone you trust."
    }
  },
  {
    topic: "emotional-support",
    question: "अगर मैं अकेला या भावनात्मक रूप से परेशान महसूस करूं तो क्या करूं?",
    aliases: ["feeling lonely", "emotional support", "akela mehsoos karna", "dil pareshan hai", "i feel alone", "need someone to talk to"],
    answers: {
      hi: "आपको हर बात अकेले सहने की ज़रूरत नहीं है। मैं आपकी बात ध्यान से सुनने और विचारों को व्यवस्थित करने में मदद कर सकती हूँ। अगर संभव हो, किसी भरोसेमंद दोस्त या परिवार के सदस्य से भी खुलकर बात करें। आपकी भावनाएँ मायने रखती हैं, और मदद माँगना कमजोरी नहीं है।",
      hinglish: "Aapko har baat akele sehne ki zarurat nahi hai. Main aapki baat dhyan se sunne aur thoughts ko sort karne mein help kar sakti hoon. Agar possible ho, kisi trusted friend ya family member se bhi khulkar baat karein. Aapki feelings matter karti hain; help maangna weakness nahi hai.",
      en: "You do not have to carry everything alone. I can listen and help you sort through your thoughts. If possible, speak openly with a trusted friend or family member too. Your feelings matter, and asking for help is not a weakness."
    }
  },
  {
    topic: "astrology-health-safety",
    question: "क्या ज्योतिष डॉक्टर की सलाह का विकल्प हो सकता है?",
    aliases: ["astrology instead of doctor", "kundli doctor replacement", "medical advice astrology", "doctor ki jagah jyotish", "health remedy guarantee"],
    answers: {
      hi: "नहीं, ज्योतिष डॉक्टर की जाँच, निदान या इलाज का विकल्प नहीं है। प्रार्थना या ध्यान आपको भावनात्मक सहारा दे सकते हैं, लेकिन दवा बंद करना या इलाज टालना सुरक्षित नहीं है। स्वास्थ्य संबंधी निर्णय योग्य चिकित्सा विशेषज्ञ के साथ लें।",
      hinglish: "Nahi, astrology doctor ki examination, diagnosis ya treatment ka replacement nahi hai. Prayer ya meditation emotional support de sakte hain, lekin medicine band karna ya treatment delay karna safe nahi. Health decisions qualified medical professional ke saath lein.",
      en: "No. Astrology cannot replace medical examination, diagnosis or treatment. Prayer or meditation may offer emotional comfort, but stopping medication or delaying care can be unsafe. Make health decisions with a qualified medical professional."
    }
  }
];

const QUESTION_PREFIXES: Record<KnowledgeLanguage, string[]> = {
  hi: [
    "क्या",
    "मुझे बताइए",
    "समझाइए",
    "जानना चाहता हूं",
    "इसके बारे में बताएं",
    "इसका अर्थ क्या है",
    "कैसे समझें",
    "मुझे समझाएं",
    "कृपया बताएं",
    "इसका मतलब"
  ],
  hinglish: [
    "kya hai",
    "mujhe batao",
    "samjhao",
    "meaning",
    "iske baare mein",
    "kaise samjhein",
    "please explain",
    "iska matlab",
    "mujhe samjhao",
    "details batao"
  ],
  en: [
    "what is",
    "explain",
    "tell me about",
    "meaning of",
    "how does",
    "please explain",
    "help me understand",
    "what does it mean",
    "give me details",
    "can you explain"
  ]
};

const normalize = (value: string): string =>
  value
    .toLocaleLowerCase()
    .normalize("NFKC")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

const PERSONAL_PATTERNS = [
  /\bmy kundli\b/i,
  /\bmy birth chart\b/i,
  /\bmeri kundli\b/i,
  /\bmeri shaadi kab\b/i,
  /\bmera future\b/i,
  /\bmy future\b/i,
  /\bmy dasha\b/i,
  /\bmy nakshatra\b/i,
  /\bmy lagna\b/i,
  /मेरी कुंडली/,
  /मेरे भविष्य/,
  /मेरी शादी कब/,
  /मेरा लग्न/,
  /मेरी दशा/,
  /मेरा नक्षत्र/
];

function isPersonalCalculationRequest(question: string): boolean {
  return PERSONAL_PATTERNS.some((pattern) => pattern.test(question));
}

function buildKnowledgeBase(): KnowledgeEntry[] {
  const entries: KnowledgeEntry[] = [];
  const seen = new Set<string>();

  for (let seedIndex = 0; seedIndex < SEEDS.length; seedIndex++) {
    const seed = SEEDS[seedIndex];

    const candidates = [
      seed.question,
      ...seed.aliases,
      ...seed.aliases.map((alias) => `${alias}?`),
      ...seed.aliases.map((alias) => `${alias} explained`),
      ...seed.aliases.map((alias) => `${alias} meaning`),
      ...seed.aliases.map((alias) => `tell me about ${alias}`),
      ...seed.aliases.map((alias) => `explain ${alias}`),
      ...seed.aliases.map((alias) => `what is ${alias}`),
      ...seed.aliases.map((alias) => `please explain ${alias}`)
    ];

    for (const candidate of candidates) {
      const key = normalize(candidate);

      if (!key || seen.has(`${seed.topic}:${key}`)) {
        continue;
      }

      seen.add(`${seed.topic}:${key}`);

      entries.push({
        ...seed,
        id: `${seed.topic}-${entries.length + 1}`,
        question: candidate
      });
    }
  }

  // These are searchable phrasing variants, not 1000 independently researched answers.
  const originalEntries = [...entries];

  for (const seed of originalEntries) {
    if (entries.length >= 1000) break;

    for (const language of ["hi", "hinglish", "en"] as const) {
      for (const prefix of QUESTION_PREFIXES[language]) {
        if (entries.length >= 1000) break;

        const candidate = `${prefix} ${seed.question}`;
        const key = normalize(candidate);

        if (!key || seen.has(`${seed.topic}:${key}`)) {
          continue;
        }

        seen.add(`${seed.topic}:${key}`);

        entries.push({
          ...seed,
          id: `${seed.topic}-${entries.length + 1}`,
          question: candidate
        });
      }
    }
  }

  return entries.slice(0, 1000);
}

export const KNOWLEDGE_BASE = buildKnowledgeBase();

export function findKnowledgeAnswer(
  question: string,
  language: KnowledgeLanguage = "hi",
  topic = "general"
): KnowledgeEntry | null {
  const normalizedQuestion = normalize(question);

  if (normalizedQuestion.length < 3) return null;

  // Personal chart requests must be handled by real calculations and/or AI.
  if (isPersonalCalculationRequest(question)) return null;

  const candidates = KNOWLEDGE_BASE.filter(
    (entry) => topic === "general" || entry.topic === topic
  );

  let best: KnowledgeEntry | null = null;
  let bestScore = 0;

  for (const entry of candidates) {
    const phrases = [entry.question, ...entry.aliases];

    for (const phrase of phrases) {
      const normalizedPhrase = normalize(phrase);
      if (!normalizedPhrase) continue;

      let score = 0;

      if (normalizedQuestion === normalizedPhrase) {
        score = 100;
      } else if (normalizedQuestion.includes(normalizedPhrase)) {
        score = 75;
      } else if (normalizedPhrase.includes(normalizedQuestion)) {
        score = 45;
      } else {
        const questionWords = new Set(normalizedQuestion.split(" "));
        const phraseWords = normalizedPhrase.split(" ");
        const matched = phraseWords.filter((word) =>
          questionWords.has(word)
        );

        score =
          (matched.length / Math.max(phraseWords.length, 1)) * 40;
      }

      if (score > bestScore) {
        bestScore = score;
        best = entry;
      }
    }
  }

  // Avoid weak matches that could return an unrelated answer.
  if (!best || bestScore < 65) return null;

  return {
    ...best,
    answers: {
      hi: best.answers.hi,
      hinglish: best.answers.hinglish,
      en: best.answers.en
    }
  };
}

export function getKnowledgeAnswerText(
  question: string,
  language: KnowledgeLanguage = "hi",
  topic = "general"
): string | null {
  const match = findKnowledgeAnswer(question, language, topic);
  return match ? match.answers[language] : null;
}

export function getKnowledgeBaseStats() {
  return {
    totalEntries: KNOWLEDGE_BASE.length,
    topics: [...new Set(KNOWLEDGE_BASE.map((entry) => entry.topic))],
    languages: ["hi", "hinglish", "en"] as KnowledgeLanguage[]
  };
}
