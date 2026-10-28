// lib/knowledge/marriage-relationships-001.ts
import { MarriageRelationshipEntry } from "./marriage-relationships.types";
import {
  STANDARD_DISCLAIMER,
  SAFETY_DISCLAIMER,
} from "./marriage-relationships-shared";

export const MARRIAGE_RELATIONSHIPS_001: MarriageRelationshipEntry[] = [
  {
    id: "MR-001",
    category: "emotional_compatibility",
    subcategory: "what_makes_two_people_compatible",
    difficulty: "beginner",
    questions: {
      en: "How do I know if my partner and I are emotionally compatible?",
      hi: "मैं कैसे समझूँ कि मेरा साथी और मैं भावनात्मक रूप से एक-दूसरे से मेल खाते हैं?",
      hinglish:
        "Main kaise samjhoon ki mera partner aur main emotionally compatible hain?",
    },
    answers: {
      en:
        "It is such a thoughtful question to sit with. Compatibility is less about liking the same songs and more about how safe you feel being honest with each other. Ask yourself gently: when I am upset, do I feel I can tell them — or do I hide it? After a fight, do we find our way back, or do we leave each other feeling alone? Two very different people can still be deeply compatible when there is warmth, curiosity and a real wish to understand each other.",
      hi:
        "यह सवाल अपने आप में बहुत सुंदर है। तालमेल का मतलब यह नहीं है कि आपको हर बात एक जैसी पसंद हो। असली बात यह है कि जब आप सच बोलते हैं, तो आप कितने सुरक्षित महसूस करते हैं। धीरे से खुद से पूछिए: जब मैं उदास होती/होता हूँ, क्या मैं उन्हें बता पाती/पाता हूँ, या छुपा लेती/लेता हूँ? झगड़े के बाद हम फिर जुड़ पाते हैं या दोनों अकेले रह जाते हैं? दो बहुत अलग लोग भी एक-दूसरे से गहराई से जुड़ सकते हैं, जब उनमें गर्मजोशी, जिज्ञासा और समझने की सच्ची इच्छा हो।",
      hinglish:
        "Yeh sawaal hi bahut pyaara hai. Compatibility ka matlab yeh nahi hai ki aapko har cheez ek jaisi pasand ho. Asli baat yeh hai ki jab aap sach bolte ho, toh kitne safe feel karte ho. Dheere se khud se poochiye: jab main upset hoti/ta hoon, kya main unhe bata paati/ta hoon, ya chhupa leti/ta hoon? Jhagde ke baad hum wapas jud paate hain ya dono akela reh jaate hain? Do bahut different log bhi deeply compatible ho sakte hain, agar unme warmth, curiosity aur samajhne ki sachchi ichha ho.",
    },
    answer_type: "reflective_exploration",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: ["gottman-repair-attempts", "eft-sue-johnson"],
    confidence: "high",
    disclaimer: STANDARD_DISCLAIMER,
    tags: ["compatibility", "emotional_safety", "reflection"],
  },
  {
    id: "MR-002",
    category: "attachment",
    subcategory: "anxious_attachment_pattern",
    difficulty: "intermediate",
    questions: {
      en:
        "I get very anxious when my partner does not reply quickly. Is something wrong with me?",
      hi:
        "जब मेरा साथी जल्दी जवाब नहीं देता, तो मुझे बहुत बेचैनी होती है। क्या मुझमें कोई कमी है?",
      hinglish:
        "Jab mera partner jaldi reply nahi karta, mujhe bahut anxiety hoti hai. Kya mujhme koi kami hai?",
    },
    answers: {
      en:
        "Please hear this first — nothing is wrong with you. Feeling anxious when someone you love goes quiet is a very human response, and often it points to an anxious attachment pattern, not a personal flaw. It usually grows from early experiences where love felt uncertain and you learned to stay alert to keep it close. Gentle things help: naming the feeling out loud (\"I notice I am feeling scared, not just annoyed\"), giving yourself a small soothing ritual before you reach for your phone, and — when you are calm — telling your partner which kind of reassurance actually helps you.",
      hi:
        "पहले यह सुन लीजिए — आपमें कोई कमी नहीं है। जब कोई अपना चुप हो जाए, तो बेचैनी होना बहुत इंसानी बात है। अक्सर यह anxious attachment की ओर इशारा करता है, किसी व्यक्तिगत कमी की ओर नहीं। यह अक्सर बचपन के उन अनुभवों से बनता है जहाँ प्यार अनिश्चित लगा और आपने उसे करीब रखने के लिए सतर्क रहना सीखा। कुछ कोमल उपाय मदद करते हैं: भावना को नाम देना (\"मुझे डर लग रहा है, सिर्फ़ झुंझलाहट नहीं\"), फ़ोन उठाने से पहले खुद को शांत करने की छोटी आदत, और — शांत होकर — अपने साथी को बताना कि किस तरह का भरोसा आपको सच में मदद करता है।",
      hinglish:
        "Pehle yeh sun lijiye — aapme koi kami nahi hai. Jab koi apna chup ho jaye, toh anxiety hona bahut insaani baat hai. Aksar yeh anxious attachment ki taraf ishara karta hai, koi personal flaw nahi. Yeh aksar bachpan ke un experiences se banta hai jahan love uncertain laga aur aapne use close rakhne ke liye alert rehna seekha. Kuch gentle cheezein help karti hain: feeling ko naam dena (\"mujhe dar lag raha hai, sirf chidh nahi\"), phone uthane se pehle khud ko soothe karne ki chhoti habit, aur — calm hoke — apne partner ko batana ki kis tarah ka reassurance aapko sach me help karta hai.",
    },
    answer_type: "psychoeducation",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: ["attachment-theory-bowlby-ainsworth", "eft-sue-johnson"],
    confidence: "high",
    disclaimer: STANDARD_DISCLAIMER,
    tags: ["attachment", "anxiety", "reassurance", "self_compassion"],
  },
  {
    id: "MR-003",
    category: "attachment",
    subcategory: "avoidant_attachment_pattern",
    difficulty: "intermediate",
    questions: {
      en:
        "My partner pulls away when things get emotionally close. Does that mean they do not love me?",
      hi:
        "जब बातें भावनात्मक रूप से करीब आती हैं, तो मेरा साथी दूर हो जाता है। क्या इसका मतलब है कि वह मुझसे प्यार नहीं करता?",
      hinglish:
        "Jab baatein emotionally close aati hain, toh mera partner door ho jata hai. Kya iska matlab hai ki woh mujhse pyaar nahi karta?",
    },
    answers: {
      en:
        "When someone pulls away at the moment you most want closeness, it hurts — and I want to hold that gently. It does not automatically mean they do not love you. Sometimes it is an avoidant pattern: closeness once felt unsafe, so the nervous system treats intimacy as something to step back from. What matters is whether they can notice this in themselves and stay in the conversation. You can say, without blame: \"I notice you go quiet when we get close. I am not asking you to change today, I am asking to understand you.\" If they keep stonewalling and never engage, that is also real information — and you deserve a partnership where your warmth is welcome.",
      hi:
        "जब आपको सबसे ज़्यादा करीबी चाहिए, ठीक उसी वक़्त कोई दूर हो जाए, तो बहुत दुख होता है — और मैं उस दुख को कोमलता से थामे रखना चाहती हूँ। इसका सीधा मतलब यह नहीं कि वह आपसे प्यार नहीं करता। कभी-कभी यह avoidant पैटर्न होता है: करीबी कभी असुरक्षित लगी, इसलिए मन उसे दूरी से देखता है। असली सवाल यह है कि क्या वह इसे खुद में पहचान पाता है और बातचीत में बना रह पाता है। बिना इल्ज़ाम कहिए: \"जब हम करीब आते हैं, तो तुम चुप हो जाते हो — मैं आज तुम्हें बदलने को नहीं कह रही, सिर्फ़ समझना चाहती हूँ।\" अगर वह हमेशा दीवार बनाकर बात से बचता रहे, तो वह भी असली जानकारी है — और आप ऐसा साथी deserve करती/करते हैं जहाँ आपकी गर्मजोशी का स्वागत हो।",
      hinglish:
        "Jab aapko sabse zyada closeness chahiye, thik us waqt koi door ho jaye, toh bahut dukh hota hai — aur main us dukh ko gentleness se thaame rakhna chahti hoon. Iska seedha matlab yeh nahi ki woh aapse pyaar nahi karta. Kabhi-kabhi yeh avoidant pattern hota hai: closeness kabhi unsafe lagi, isliye nervous system usse doori se dekhta hai. Asli sawaal yeh hai ki kya woh ise khud me pehchan paata hai aur conversation me bana reh paata hai. Bina blame ke kehiye: \"Jab hum close aate hain, tum chup ho jaate ho — main aaj tumhe badalne ko nahi keh rahi, sirf samajhna chahti hoon.\" Agar woh hamesha stonewall kare aur baat se bache, toh woh bhi asli information hai — aur aap aisa partner deserve karte ho jahan aapki warmth ka swagat ho.",
    },
    answer_type: "empathic_guidance",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: ["attachment-theory-bowlby-ainsworth", "gottman-four-horsemen"],
    confidence: "high",
    disclaimer: STANDARD_DISCLAIMER,
    tags: ["attachment", "avoidance", "communication", "boundaries"],
  },
  {
    id: "MR-004",
    category: "emotional_compatibility",
    subcategory: "love_languages",
    difficulty: "beginner",
    questions: {
      en:
        "How do I explain to my partner what makes me feel loved, without sounding demanding?",
      hi:
        "मैं अपने साथी को कैसे समझाऊँ कि किस चीज़ से मुझे प्यार महसूस होता है, बिना माँग जैसा लगे?",
      hinglish:
        "Main apne partner ko kaise samjhaoon ki kis cheez se mujhe pyaar feel hota hai, bina demanding lage?",
    },
    answers: {
      en:
        "It is such a caring thing to want to say this clearly. Love languages are not rules — they are simply the ways each of us most easily feels seen: words of affection, time together, small acts of care, gentle touch, thoughtful gifts. You can open the conversation softly: \"Something that makes me feel really loved is when you ___ — I am not asking for it every day, I just want you to know me.\" Then invite the same from them. This is not a demand; it is a doorway into knowing each other better, and most partners feel relieved when they finally know exactly what helps.",
      hi:
        "यह बात साफ़ कह पाना अपने आप में बहुत प्यार भरा काम है। love languages कोई नियम नहीं हैं — ये बस वे तरीके हैं जिनसे हमें सबसे आसानी से 'देखा गया' महसूस होता है: प्यार भरे शब्द, साथ बिताया समय, छोटे-छोटे ख्याल, कोमल स्पर्श, सोच-समझकर दिए तोहफ़े। आप बात बहुत कोमलता से शुरू कर सकते हैं: \"मुझे सबसे ज़्यादा प्यार महसूस होता है जब तुम ___ — मैं यह रोज़ नहीं माँग रही, बस चाहती हूँ कि तुम मुझे जानो।\" फिर वही सवाल उनसे भी पूछिए। यह कोई माँग नहीं, एक दरवाज़ा है एक-दूसरे को और गहराई से जानने का, और ज़्यादातर साथी राहत महसूस करते हैं जब उन्हें साफ़ पता चलता है कि क्या काम करता है।",
      hinglish:
        "Yeh baat saaf keh paana apne aap me bahut pyaar bhara kaam hai. Love languages koi rules nahi hain — ye bas woh tareeke hain jinse humein sabse aasani se 'seen' feel hota hai: pyaar bhare shabd, saath bitaya waqt, chhote-chhote khayal, gentle touch, soch-samajh ke diye gifts. Aap baat bahut softness se shuru kar sakte ho: \"Mujhe sabse zyada loved feel hota hai jab tum ___ — main ye roz nahi maang rahi, bas chahti hoon ki tum mujhe jaano.\" Phir wahi sawaal unse bhi poochiye. Yeh koi demand nahi, ek darwaza hai ek-doosre ko aur deeply jaanne ka, aur zyada partners ko relief feel hota hai jab unhe saaf pata chalta hai ki kya kaam karta hai.",
    },
    answer_type: "practical_steps",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: ["five-love-languages-chapman"],
    confidence: "medium",
    disclaimer: STANDARD_DISCLAIMER,
    tags: ["love_languages", "communication", "needs"],
  },
  {
    id: "MR-005",
    category: "communication",
    subcategory: "active_listening",
    difficulty: "beginner",
    questions: {
      en: "My partner says I do not listen. How can I actually listen better?",
      hi: "मेरा साथी कहता है कि मैं सुनता/सुनती नहीं। मैं सच में बेहतर कैसे सुन सकता/सकती हूँ?",
      hinglish:
        "Mera partner kehta hai ki main sunta/sunti nahi. Main sach me better kaise sun sakta/sakti hoon?",
    },
    answers: {
      en:
        "Listening is such a rare gift, and the fact that you are asking this already tells me a lot about your heart. Real listening is not waiting for your turn to reply — it is trying to understand before you try to be understood. One small practice: after your partner finishes, say back what you heard in your own words — \"So what I am hearing is that you felt really alone when I was on my phone, right?\" Ask before giving advice: \"Do you want me to help fix this, or do you just want me to be here with you?\" These two moves alone change a home very gently.",
      hi:
        "सच में सुनना बहुत दुर्लभ और खूबसूरत चीज़ है, और यह सवाल पूछना ही बता देता है कि आपका दिल कितना अच्छा है। असली सुनना जवाब देने की बारी का इंतज़ार नहीं है — पहले समझना है, फिर समझाया जाना है। एक छोटा अभ्यास: साथी की बात ख़त्म होने पर अपने शब्दों में दोहराइए — \"तो मैं यह समझ रहा/रही हूँ कि जब मैं फ़ोन पर था/थी, तो तुम बहुत अकेला महसूस कर रहे थे, सही?\" सलाह देने से पहले पूछिए: \"क्या तुम चाहते हो कि मैं इसे सुलझाने में मदद करूँ, या बस तुम्हारे साथ यहाँ रहूँ?\" ये दो छोटी आदतें घर का माहौल बहुत कोमलता से बदल देती हैं।",
      hinglish:
        "Sach me sunna bahut rare aur beautiful cheez hai, aur yeh sawaal poochhna hi bata deta hai ki aapka dil kitna achha hai. Real listening jawab dene ki baari ka wait nahi hai — pehle samajhna hai, phir samjhaya jaana hai. Ek chhota practice: partner ki baat khatam hone par apne shabdon me dohraaiye — \"Toh main ye samajh raha/rahi hoon ki jab main phone pe tha/thi, toh tum bahut akela feel kar rahe the, sahi?\" Advice dene se pehle poochiye: \"Kya tum chahte ho ki main ise solve karne me help karoon, ya bas tumhare saath yahan rahoon?\" Ye do chhoti habits ghar ka mahaul bahut gently badal deti hain.",
    },
    answer_type: "practical_steps",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: ["gottman-active-listening", "nonviolent-communication-rosenberg"],
    confidence: "high",
    disclaimer: STANDARD_DISCLAIMER,
    tags: ["listening", "communication", "empathy"],
  },
  {
    id: "MR-006",
    category: "communication",
    subcategory: "expressing_needs_without_conflict",
    difficulty: "intermediate",
    questions: {
      en:
        "Whenever I try to express what I need, it turns into a fight. How can I say things differently?",
      hi:
        "जब भी मैं अपनी ज़रूरत बताने की कोशिश करता/करती हूँ, बात झगड़े में बदल जाती है। मैं कैसे अलग तरीके से कहूँ?",
      hinglish:
        "Jab bhi main apni need batane ki koshish karta/karti hoon, baat jhagde me badal jaati hai. Main kaise alag tarike se kahoon?",
    },
    answers: {
      en:
        "Saying what you need can feel scary, especially if you grew up being told your needs were too much. One gentle structure helps a lot: \"When ___ happened, I felt ___. What I need is ___.\" For example: \"When you answered your mother before me, I felt small. What I need is for us to decide together, not in the moment.\" Avoid \"you always\" and \"you never\" — they sound like an attack, even when the feeling is real. Start sentences with \"I\" and keep one issue at a time. You are not asking too much; you are asking for a partnership where both hearts have room.",
      hi:
        "अपनी ज़रूरत कहना डरावना लग सकता है, ख़ासकर अगर बचपन में आपको लगा हो कि आपकी ज़रूरतें 'ज़्यादा' हैं। एक कोमल ढाँचा बहुत मदद करता है: \"जब ___ हुआ, तब मुझे ___ महसूस हुआ। मुझे ज़रूरत है ___ की।\" जैसे: \"जब तुमने माँ को मुझसे पहले जवाब दिया, तो मुझे छोटा महसूस हुआ। मुझे ज़रूरत है कि हम साथ में फैसला करें, उस पल में नहीं।\" \"तुम हमेशा\" और \"तुम कभी नहीं\" से बचिए — भावना सच्ची होने पर भी वे हमले जैसे लगते हैं। वाक्य \"मैं\" से शुरू कीजिए और एक बार में एक बात रखिए। आप बहुत ज़्यादा नहीं माँग रहे; आप ऐसी साझेदारी माँग रहे हैं जहाँ दोनों दिलों के लिए जगह हो।",
      hinglish:
        "Apni need kehna darawna lag sakta hai, khaaskar agar bachpan me aapko laga ho ki aapki needs 'zyada' hain. Ek gentle structure bahut help karta hai: \"Jab ___ hua, tab mujhe ___ feel hua. Mujhe zaroorat hai ___ ki.\" Jaise: \"Jab tumne mummy ko mujhse pehle jawab diya, toh mujhe chhota feel hua. Mujhe zaroorat hai ki hum saath me decide karein, us pal me nahi.\" \"Tum hamesha\" aur \"tum kabhi nahi\" se bachiye — feeling sachchi hone par bhi woh attack jaise lagte hain. Sentences \"main\" se shuru keejiye aur ek time pe ek issue rakhiye. Aap bahut zyada nahi maang rahe; aap aisi partnership maang rahe ho jahan dono dilon ke liye jagah ho.",
    },
    answer_type: "practical_steps",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: ["nonviolent-communication-rosenberg", "gottman-softened-startup"],
    confidence: "high",
    disclaimer: STANDARD_DISCLAIMER,
    tags: ["needs", "i_statements", "communication", "conflict"],
  },
  {
    id: "MR-007",
    category: "trust",
    subcategory: "building_trust_slowly",
    difficulty: "beginner",
    questions: {
      en: "How is trust actually built in a relationship?",
      hi: "रिश्ते में भरोसा असल में कैसे बनता है?",
      hinglish: "Relationship me trust asal me kaise banta hai?",
    },
    answers: {
      en:
        "Trust is not one big moment — it is many small ones, stitched together over time. It is built when you say you will call and you call, when you keep a small promise, when you tell the truth even when it is inconvenient, and when your partner learns that your words match your actions. It is also rebuilt in repair — after a mistake, when you take responsibility instead of defending. If trust feels shaky today, do not try to fix it in one grand gesture. Choose one small, honest consistency, and let it repeat. Trust listens to patterns, not to promises.",
      hi:
        "भरोसा कोई एक बड़ा पल नहीं होता — यह कई छोटे-छोटे पलों से बुना जाता है। यह तब बनता है जब आप कहते हैं कि फ़ोन करूँगा और करते हैं, जब छोटा वादा निभाते हैं, जब असुविधा में भी सच कहते हैं, और जब आपका साथी देखता है कि आपके शब्द और काम एक जैसे हैं। यह टूटे हुए भरोसे की मरम्मत में भी बनता है — ग़लती के बाद जब आप बचाव की जगह ज़िम्मेदारी लेते हैं। अगर आज भरोसा डगमगा रहा है, तो उसे किसी एक बड़े इशारे से ठीक करने की कोशिश मत कीजिए। एक छोटी, ईमानदार आदत चुनिए और उसे दोहराए जाने दीजिए। भरोसा वादों को नहीं, पैटर्न को सुनता है।",
      hinglish:
        "Trust koi ek bada moment nahi hota — yeh kai chhote-chhote moments se bunta hai. Yeh tab banta hai jab aap kehte ho phone karunga aur karte ho, jab chhota promise nibhate ho, jab inconvenience me bhi sach bolte ho, aur jab aapka partner dekhta hai ki aapke words aur actions match karte hain. Yeh repair me bhi banta hai — galti ke baad jab aap defense ki jagah responsibility lete ho. Agar aaj trust shaky feel ho raha hai, toh use kisi ek bade gesture se fix karne ki koshish mat keejiye. Ek chhoti, honest consistency chuniye aur use repeat hone dijiye. Trust promises ko nahi, patterns ko sunta hai.",
    },
    answer_type: "psychoeducation",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: ["gottman-trust", "eft-sue-johnson"],
    confidence: "high",
    disclaimer: STANDARD_DISCLAIMER,
    tags: ["trust", "consistency", "integrity"],
  },
  {
    id: "MR-008",
    category: "trust",
    subcategory: "jealousy_and_insecurity",
    difficulty: "intermediate",
    questions: {
      en: "I feel jealous very easily. Does that make me a bad partner?",
      hi: "मुझे बहुत जल्दी जलन हो जाती है। क्या इससे मैं बुरा साथी बनता/बनती हूँ?",
      hinglish:
        "Mujhe bahut jaldi jealousy ho jaati hai. Kya isse main bura partner ban jaata/jaati hoon?",
    },
    answers: {
      en:
        "Jealousy is not a sin — it is information. It usually tells us that something feels unsafe, unseen, or precious. Feeling it does not make you a bad partner; what we do with it matters. Begin by slowing the story down: \"Is this a real threat, or is this an old fear waking up?\" Then share it as a feeling, not an accusation: \"I felt a little shaken when I saw that message — I am not accusing you, I am telling you where I am.\" If jealousy is turning into checking phones, controlling clothes, or isolating your partner, that is a signal to bring in a counsellor — for your own peace as much as the relationship's.",
      hi:
        "जलन कोई पाप नहीं है — यह जानकारी है। यह अक्सर बताती है कि कुछ असुरक्षित, अनदेखा, या बहुत क़ीमती लग रहा है। इसे महसूस करना आपको बुरा साथी नहीं बनाता; इसके साथ हम क्या करते हैं, वह मायने रखता है। पहले कहानी को धीमा कीजिए: \"क्या यह असली ख़तरा है, या कोई पुराना डर जाग रहा है?\" फिर इसे भावना की तरह कहिए, आरोप की तरह नहीं: \"वह संदेश देखकर मैं थोड़ा हिल गया/गई — मैं तुम पर इल्ज़ाम नहीं लगा रहा/रही, बस बता रहा/रही हूँ कि मैं कहाँ हूँ।\" अगर जलन फ़ोन चेक करने, कपड़ों पर रोक लगाने, या साथी को अलग-थलग करने में बदल रही है, तो यह किसी परामर्शदाता को शामिल करने का संकेत है — अपनी शांति के लिए भी और रिश्ते के लिए भी।",
      hinglish:
        "Jealousy koi paap nahi hai — yeh information hai. Yeh aksar batati hai ki kuch unsafe, unseen, ya bahut precious lag raha hai. Ise feel karna aapko bura partner nahi banata; iske saath hum kya karte hain, woh matter karta hai. Pehle story ko slow keejiye: \"Kya yeh real threat hai, ya koi purana darr jaag raha hai?\" Phir ise feeling ki tarah kahiye, accusation ki tarah nahi: \"Woh message dekh ke main thoda hil gaya/gayi — main tumpe ilzaam nahi laga raha/rahi, bas bata raha/rahi hoon ki main kahan hoon.\" Agar jealousy phone check karne, kapdon pe rok lagane, ya partner ko isolate karne me badal rahi hai, toh yeh kisi counsellor ko involve karne ka signal hai — apni peace ke liye bhi aur relationship ke liye bhi.",
    },
    answer_type: "psychoeducation",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: ["gottman-trust", "attachment-theory-bowlby-ainsworth"],
    confidence: "high",
    disclaimer: STANDARD_DISCLAIMER,
    tags: ["jealousy", "insecurity", "trust", "boundaries"],
  },
  {
    id: "MR-009",
    category: "trust",
    subcategory: "self_worth_and_insecurity",
    difficulty: "intermediate",
    questions: {
      en:
        "I always feel like I am not good enough for my partner. How do I stop this feeling?",
      hi: "मुझे हमेशा लगता है कि मैं अपने साथी के लायक नहीं हूँ। यह एहसास कैसे रुके?",
      hinglish:
        "Mujhe hamesha lagta hai ki main apne partner ke layak nahi hoon. Yeh feeling kaise ruke?",
    },
    answers: {
      en:
        "I want to say this very softly: the voice telling you that you are not enough is not the truth about you — it is usually an old wound looking for a safe place to land. When we grow up with love that felt conditional, we carry a quiet fear of being \"too much\" or \"not enough.\" Begin by noticing the voice without arguing with it: \"There it is again, the old story.\" Then ask a kinder question: \"What would I say to a friend who felt this?\" You are not trying to earn love through perfection; you are learning to receive it while you are still becoming. If this feeling runs very deep, a therapist is a beautiful place to unpack it — not because something is wrong with you, but because you deserve care.",
      hi:
        "यह मैं बहुत कोमलता से कहना चाहती हूँ: जो आवाज़ कहती है कि तुम 'काफ़ी नहीं' हो, वह तुम्हारे बारे में सच नहीं है — वह अक्सर एक पुराना घाव है जो सुरक्षित जगह ढूँढ रहा है। जब प्यार शर्तों पर मिला हो, तो मन में यह डर बैठ जाता है कि हम 'ज़्यादा' या 'काफ़ी नहीं' हैं। पहले उस आवाज़ को बिना लड़े पहचानिए: \"अरे, फिर वही पुरानी बात।\" फिर एक नरम सवाल पूछिए: \"अगर कोई दोस्त ऐसा महसूस करता, तो मैं उससे क्या कहता/कहती?\" आप प्यार को परफेक्शन से कमाने की कोशिश नहीं कर रहे; आप बनते हुए भी प्यार स्वीकार करना सीख रहे हैं। अगर यह एहसास बहुत गहरा है, तो थेरेपिस्ट एक खूबसूरत जगह है — इसलिए नहीं कि आपमें कुछ गड़बड़ है, बल्कि इसलिए कि आप देखभाल के हक़दार हैं।",
      hinglish:
        "Yeh main bahut softness se kehna chahti hoon: jo awaaz kehti hai ki tum 'kaafi nahi' ho, woh tumhare baare me sach nahi hai — woh aksar ek purana wound hai jo safe jagah dhoondh raha hai. Jab pyaar conditions pe mila ho, toh mann me yeh darr baith jaata hai ki hum 'zyada' ya 'kaafi nahi' hain. Pehle us awaaz ko bina laday pehchaniye: \"Arre, phir wahi purani baat.\" Phir ek softer sawaal poochiye: \"Agar koi dost aisa feel karta, toh main usse kya kehta/kehti?\" Aap pyaar ko perfection se kamaane ki koshish nahi kar rahe; aap bante hue bhi pyaar receive karna seekh rahe ho. Agar yeh feeling bahut deep hai, toh therapist ek beautiful jagah hai — isliye nahi ki aapme kuch kharab hai, balki isliye ki aap care deserve karte ho.",
    },
    answer_type: "empathic_guidance",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: ["attachment-theory-bowlby-ainsworth", "self-compassion-neff"],
    confidence: "high",
    disclaimer: STANDARD_DISCLAIMER,
    tags: ["self_worth", "insecurity", "self_compassion", "healing"],
  },
  {
    id: "MR-010",
    category: "breakups",
    subcategory: "grief_after_breakup",
    difficulty: "beginner",
    questions: {
      en: "We broke up two months ago and I still cry every day. Is that normal?",
      hi: "दो महीने पहले हमारा ब्रेकअप हो गया और मैं आज भी रोज़ रोता/रोती हूँ। क्या यह सामान्य है?",
      hinglish:
        "Do mahine pehle humara breakup ho gaya aur main aaj bhi roz rota/roti hoon. Kya yeh normal hai?",
    },
    answers: {
      en:
        "I am so sorry you are carrying this — and yes, what you are feeling is deeply normal. A breakup is a grief, and grief does not follow a calendar. Two months is still very early; you are not behind, you are not weak, and there is nothing wrong with you for still crying. Let yourself feel it in small doses, keep gentle routines around sleep and food, and let one safe person know what you are going through. Healing is not a straight line — some days will surprise you with joy, and some will ache again. Both are allowed. Please be as kind to yourself as you would be to a close friend in this same pain.",
      hi:
        "मुझे बहुत दुख है कि आप यह सब सह रहे हैं — और हाँ, आप जो महसूस कर रहे हैं वह बहुत सामान्य है। ब्रेकअप एक शोक है, और शोक कैलेंडर नहीं देखता। दो महीने अभी बहुत कम हैं; आप पीछे नहीं हैं, कमज़ोर नहीं हैं, और अभी भी रोना किसी गड़बड़ की निशानी नहीं है। भावनाओं को छोटे-छोटे हिस्सों में महसूस होने दीजिए, नींद और खाने की कोमल दिनचर्या बनाइए, और किसी एक भरोसेमंद इंसान को बताइए कि आप किस दौर से गुज़र रहे हैं। हीलिंग सीधी रेखा नहीं होती — कुछ दिन खुशी से चौंका देंगे, कुछ दिन फिर दुखेंगे। दोनों ठीक हैं। जितनी दया आप किसी करीबी दोस्त पर इस दर्द में करते, उतनी ही खुद पर कीजिए।",
      hinglish:
        "Mujhe bahut dukh hai ki aap ye sab seh rahe ho — aur haan, jo aap feel kar rahe ho woh bahut normal hai. Breakup ek grief hai, aur grief calendar nahi dekhta. Do mahine abhi bahut kam hain; aap peeche nahi ho, weak nahi ho, aur abhi bhi rona kisi kharabi ki nishani nahi hai. Feelings ko chhote-chhote doses me feel hone dijiye, neend aur khane ki gentle routine banaaiye, aur kisi ek safe insaan ko bataiye ki aap kis daur se guzar rahe ho. Healing straight line nahi hoti — kuch din khushi se chauka denge, kuch din phir dukhenge. Dono allowed hain. Jitni daya aap kisi close friend pe is dard me karte, utni hi khud pe keejiye.",
    },
    answer_type: "empathic_guidance",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: ["grief-worden", "attachment-theory-bowlby-ainsworth"],
    confidence: "high",
    disclaimer: STANDARD_DISCLAIMER,
    tags: ["breakup", "grief", "self_compassion", "healing"],
  },
  {
    id: "MR-011",
    category: "breakups",
    subcategory: "seeking_closure",
    difficulty: "intermediate",
    questions: {
      en: "I never got an apology from my ex. How do I move on without closure?",
      hi: "मेरे पूर्व साथी ने कभी माफ़ी नहीं माँगी। बिना किसी 'क्लोज़र' के मैं कैसे आगे बढ़ूँ?",
      hinglish:
        "Mere ex ne kabhi apology nahi maangi. Bina kisi 'closure' ke main kaise aage badhoon?",
    },
    answers: {
      en:
        "Sometimes we never get the apology we deserved, and yet we still need to heal — that is one of the hardest truths of being human. Closure, in the deepest sense, is not something the other person gives you; it is something you slowly give yourself. It can start with a letter you never send, where you say everything you needed to say. It can be saying out loud: \"What happened was not okay. I am choosing to stop waiting for them to understand.\" You are allowed to grieve both the person and the apology. And if the waiting feels impossible to let go of, please let a counsellor sit with you — you should not have to carry this alone.",
      hi:
        "कभी-कभी जो माफ़ी हमारी हक़ थी, वह कभी नहीं मिलती, और फिर भी हमें ठीक होना होता है — यह इंसान होने की सबसे कठिन सच्चाइयों में से एक है। गहरे अर्थ में 'क्लोज़र' कोई दूसरा नहीं देता; वह धीरे-धीरे आप खुद को देते हैं। शुरुआत एक ऐसे ख़त से हो सकती है जो कभी भेजा न जाए, जिसमें आप वह सब कहें जो कहना था। यह भी कहा जा सकता है: \"जो हुआ वह ठीक नहीं था। मैं उनके समझने का इंतज़ार करना बंद कर रहा/रही हूँ।\" आपको उस इंसान का भी शोक करने का हक़ है और उस माफ़ी का भी। और अगर इंतज़ार छोड़ना नामुमकिन लगे, तो किसी परामर्शदाता को अपने साथ बैठाइए — यह बोझ आपको अकेले नहीं उठाना चाहिए।",
      hinglish:
        "Kabhi-kabhi woh apology jo hamara haq thi, woh kabhi nahi milti, aur phir bhi humein theek hona hota hai — yeh insaan hone ki sabse mushkil sachchaiyon me se ek hai. Gehre arth me 'closure' koi doosra nahi deta; woh dheere-dheere aap khud ko dete ho. Shuruaat ek aise letter se ho sakti hai jo kabhi bheja na jaye, jisme aap woh sab kahein jo kehna tha. Yeh bhi kaha ja sakta hai: \"Jo hua woh theek nahi tha. Main unke samajhne ka intezaar karna band kar raha/rahi hoon.\" Aapko us insaan ka bhi shok karne ka haq hai aur us apology ka bhi. Aur agar intezaar chhodna impossible lage, toh kisi counsellor ko apne saath bithaiye — yeh bojh aapko akele nahi uthana chahiye.",
    },
    answer_type: "empathic_guidance",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: ["grief-worden", "narrative-therapy-white"],
    confidence: "high",
    disclaimer: STANDARD_DISCLAIMER,
    tags: ["breakup", "closure", "grief", "letting_go"],
  },
  {
    id: "MR-012",
    category: "breakups",
    subcategory: "healing_after_harmful_relationship",
    difficulty: "advanced",
    questions: {
      en: "I left a relationship that was hurting me. Why do I still miss him?",
      hi: "जो रिश्ता मुझे चोट पहुँचा रहा था, उसे मैंने छोड़ दिया। फिर भी उसकी याद क्यों आती है?",
      hinglish:
        "Jo relationship mujhe hurt kar raha tha, woh maine chhod diya. Phir bhi uski yaad kyun aati hai?",
    },
    answers: {
      en:
        "Leaving a relationship that hurt you is an act of quiet courage, and I want you to hear that first. Missing someone who was harmful is not a sign that you were wrong to leave — it is a sign that the bond was real, and that the good moments were real too. Our hearts often remember the warmth before the wound. Be gentle with the part of you that misses him: \"I see you. I am not going back, I am just sad.\" Please give yourself space to rebuild your sense of safety — therapy, journaling, prayer, or a trusted friend. And if he ever tries to pull you back, remember: love does not require you to shrink or to be hurt.",
      hi:
        "जिस रिश्ते ने चोट पहुँचाई, उसे छोड़ना एक शांत साहस है, और मैं चाहती हूँ कि आप यह पहले सुन लें। जिसने नुक़सान पहुँचाया उसकी याद आना यह नहीं दिखाता कि आपने छोड़कर ग़लती की — यह दिखाता है कि वह बंधन सच था, और अच्छे पल भी सच थे। हमारा दिल अक्सर घाव से पहले की गर्माहट याद रखता है। जो हिस्सा उसे याद करता है उससे कोमलता से कहिए: \"मैं तुम्हें देख रहा/रही हूँ। मैं लौट नहीं रहा/रही, बस उदास हूँ।\" खुद को सुरक्षा का एहसास फिर से बनाने की जगह दीजिए — थेरेपी, डायरी, प्रार्थना, या कोई भरोसेमंद दोस्त। और अगर वह कभी वापस खींचने की कोशिश करे, याद रखिए: सच्चा प्यार आपसे छोटा होने या चोट सहने की माँग नहीं करता।",
      hinglish:
        "Jis relationship ne hurt kiya, use chhodna ek shaant courage hai, aur main chahti hoon ki aap yeh pehle sun lein. Jisne nuksaan pahunchaya uski yaad aana yeh nahi dikhata ki aapne chhod ke galti ki — yeh dikhata hai ki woh bond real tha, aur achhe pal bhi real the. Hamara dil aksar wound se pehle ki warmth yaad rakhta hai. Jo hissa use yaad karta hai usse gentleness se kehiye: \"Main tumhe dekh raha/rahi hoon. Main wapas nahi ja raha/rahi, bas udaas hoon.\" Khud ko safety ka feel dobara banane ki jagah dijiye — therapy, journaling, prayer, ya koi trusted friend. Aur agar woh kabhi wapas kheenchne ki koshish kare, yaad rakhiye: sachcha pyaar aapse chhota hone ya chot sehne ki maang nahi karta.",
    },
    answer_type: "safety_and_referral",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: ["trauma-informed-care-herman", "attachment-theory-bowlby-ainsworth"],
    confidence: "high",
    disclaimer: SAFETY_DISCLAIMER,
    tags: ["breakup", "harmful_relationship", "healing", "safety", "self_worth"],
  },
  {
    id: "MR-013",
    category: "family_pressure",
    subcategory: "marriage_pressure_from_family",
    difficulty: "intermediate",
    questions: {
      en: "My parents are pressuring me to marry soon. I feel suffocated. What do I do?",
      hi: "मेरे माता-पिता जल्दी शादी के लिए दबाव डाल रहे हैं। मुझे घुटन महसूस होती है। मैं क्या करूँ?",
      hinglish:
        "Mere parents jaldi shaadi ke liye pressure daal rahe hain. Mujhe suffocated feel hota hai. Main kya karoon?",
    },
    answers: {
      en:
        "It makes complete sense that you feel suffocated — family love and family pressure can arrive in the same breath, and it is a lot to hold. First, remember that a marriage decision is a life decision, and it is yours; respecting your parents does not mean surrendering your voice. Find one calm moment (not during a fight) and speak from love, not defense: \"I love you both, and I want to choose well. That is why I need a little more time.\" Be ready for them to repeat themselves — consistency, not volume, usually helps. If the pressure becomes threats or forced-meeting situations, please tell a trusted adult or counsellor. You deserve to make this decision with a clear heart, not a frightened one.",
      hi:
        "यह बिलकुल समझ में आता है कि आपको घुटन हो रही है — परिवार का प्यार और परिवार का दबाव एक ही साँस में आ सकते हैं, और यह बहुत भारी होता है। पहले याद रखिए कि शादी का फैसला जीवन का फैसला है, और वह आपका है; माता-पिता का सम्मान करने का मतलब अपनी आवाज़ खो देना नहीं है। एक शांत पल चुनिए (झगड़े के बीच नहीं) और प्यार से बोलिए, बचाव से नहीं: \"माँ-पापा, मैं आपसे प्यार करता/करती हूँ, और मैं सही चुनाव करना चाहता/चाहती हूँ। इसीलिए मुझे थोड़ा और समय चाहिए।\" उनके दोहराने के लिए तैयार रहिए — ज़्यादातर मामलों में तीव्रता नहीं, निरंतरता मदद करती है। अगर दबाव धमकियों या ज़बरदस्ती की मुलाक़ातों में बदल जाए, तो किसी भरोसेमंद बड़े या परामर्शदाता को बताइए। आप इस फैसले को साफ़ दिल से लेने के हक़दार हैं, डरे हुए दिल से नहीं।",
      hinglish:
        "Yeh bilkul samajh aata hai ki aap suffocated feel kar rahe ho — family ka pyaar aur family ka pressure ek hi saans me aa sakte hain, aur yeh bahut heavy hota hai. Pehle yaad rakhiye ki shaadi ka decision life ka decision hai, aur woh aapka hai; parents ka respect karne ka matlab apni awaaz kho dena nahi hai. Ek calm moment chuniye (jhagde ke beech nahi) aur pyaar se boliye, defense se nahi: \"Mummy-Papa, main aapse pyaar karta/karti hoon, aur main sahi choice karna chahta/chahti hoon. Isiliye mujhe thoda aur time chahiye.\" Unke repeat karne ke liye ready rahiye — zyadatar cases me volume nahi, consistency madad karti hai. Agar pressure threats ya forced meetings me badal jaye, toh kisi trusted elder ya counsellor ko bataiye. Aap yeh decision saaf dil se lene ke haqdaar ho, dare hue dil se nahi.",
    },
    answer_type: "empathic_guidance",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: ["family-systems-bowen", "nonviolent-communication-rosenberg"],
    confidence: "high",
    disclaimer: SAFETY_DISCLAIMER,
    tags: ["family_pressure", "marriage_decision", "boundaries", "communication"],
  },
  {
    id: "MR-014",
    category: "family_pressure",
    subcategory: "parents_disapprove_partner",
    difficulty: "advanced",
    questions: {
      en:
        "My parents do not approve of the person I love. I feel torn between them and my partner.",
      hi:
        "जिसे मैं प्यार करता/करती हूँ, मेरे माता-पिता उसे स्वीकार नहीं करते। मैं उनके और अपने साथी के बीच बँटा/बँटी हुआ महसूस करता/करती हूँ।",
      hinglish:
        "Jise main pyaar karta/karti hoon, mere parents usse accept nahi karte. Main unke aur apne partner ke beech bata/bati hua feel karta/karti hoon.",
    },
    answers: {
      en:
        "This is one of the most painful places to stand, and I want to acknowledge that before saying anything else. Feeling torn does not mean you are weak or disloyal — it means you love deeply on both sides. Please do not rush the decision out of fear. Take time to understand your parents' real concerns (sometimes it is fear, not hate), and separately ask yourself what you truly want and what your partner is truly like under stress. Do not use astrology, charts, or pressure to force an answer on yourself or them. And — very important — do not let anyone, on either side, isolate you from the other. A counsellor who understands family dynamics can help you hold this with more steadiness than any single person can.",
      hi:
        "यह खड़े होने की सबसे दर्दभरी जगहों में से एक है, और कुछ और कहने से पहले मैं इसे स्वीकार करना चाहती हूँ। बँटा हुआ महसूस करना यह नहीं दिखाता कि आप कमज़ोर या बेवफ़ा हैं — यह दिखाता है कि आप दोनों तरफ़ गहराई से प्यार करते हैं। कृपया डर से जल्दबाज़ी में फैसला न कीजिए। समय लेकर माता-पिता की असली चिंता समझिए (कभी-कभी वह नफ़रत नहीं, डर होता है), और अलग से खुद से पूछिए कि आप सच में क्या चाहते हैं और तनाव में आपका साथी असल में कैसा है। ज्योतिष, कुंडली या दबाव का सहारा लेकर खुद पर या उन पर जवाब मत थोपिए। और — यह बहुत ज़रूरी है — किसी को भी, किसी भी तरफ़ से, आपको दूसरी तरफ़ से अलग-थलग करने मत दीजिए। परिवार की गतिशीलता समझने वाला परामर्शदाता इस स्थिति को किसी एक इंसान से ज़्यादा स्थिरता से थामने में मदद कर सकता है।",
      hinglish:
        "Yeh khade hone ki sabse dardbhari jagahon me se ek hai, aur kuch aur kehne se pehle main ise acknowledge karna chahti hoon. Bata hua feel karna yeh nahi dikhata ki aap weak ya bewafa ho — yeh dikhata hai ki aap dono taraf se gehraai se pyaar karte ho. Kripya darr se jaldbaazi me decision mat leejiye. Time leke parents ki asli concern samjhiye (kabhi-kabhi woh hate nahi, darr hota hai), aur alag se khud se poochiye ki aap sach me kya chahte ho aur stress me aapka partner asal me kaisa hai. Astrology, kundli ya pressure ka sahara leke khud pe ya unpe jawab mat thopiye. Aur — yeh bahut important hai — kisi ko bhi, kisi bhi taraf se, aapko doosri taraf se isolate karne mat dijiye. Family dynamics samajhne wala counsellor is situation ko kisi ek insaan se zyada steadiness se thaamne me help kar sakta hai.",
    },
    answer_type: "empathic_guidance",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: ["family-systems-bowen", "nonviolent-communication-rosenberg"],
    confidence: "high",
    disclaimer: SAFETY_DISCLAIMER,
    tags: ["family", "parents", "partner_choice", "torn_loyalty"],
  },
  {
    id: "MR-015",
    category: "boundaries",
    subcategory: "in_law_boundaries",
    difficulty: "intermediate",
    questions: {
      en: "How do I set boundaries with in-laws without causing drama?",
      hi: "ससुराल में बिना नाटक किए सीमाएँ कैसे बनाऊँ?",
      hinglish: "Sasural me bina drama kiye boundaries kaise banaoon?",
    },
    answers: {
      en:
        "In-laws are family, and family — like any garden — needs gentle boundaries to stay healthy. The kindest way is often the calmest: pick one issue at a time, speak in the moment it matters (not months later), and use \"we\" instead of \"you.\" For example: \"We have decided not to discuss our finances at dinner — not because we do not trust you, but because it keeps our home peaceful.\" Please make sure you and your partner agree in private before you speak in public; boundaries presented as a couple are much easier to honour. If a boundary is repeatedly crossed, repeat it kindly, not louder. Boundaries are not rejection — they are the fences that keep love from being trampled.",
      hi:
        "ससुराल परिवार है, और परिवार को — किसी भी बगीचे की तरह — स्वस्थ रहने के लिए कोमल सीमाएँ चाहिए। सबसे दयालु तरीक़ा अक्सर सबसे शांत होता है: एक बार में एक मुद्दा चुनिए, उसी पल बोलिए (महीनों बाद नहीं), और \"आप\" की जगह \"हम\" कहिए। जैसे: \"हमने तय किया है कि खाने की मेज़ पर पैसों की बात नहीं होगी — इसलिए नहीं कि हम आप पर भरोसा नहीं करते, बल्कि इसलिए कि घर शांत रहे।\" सार्वजनिक रूप से बोलने से पहले अकेले में अपने साथी से सहमति बनाइए; जोड़े के रूप में रखी गई सीमाएँ निभाना बहुत आसान होता है। अगर कोई सीमा बार-बार पार हो, तो उसे ज़ोर से नहीं, कोमलता से दोहराइए। सीमाएँ अस्वीकार नहीं हैं — वे वे बाड़ हैं जो प्यार को रौंदे जाने से बचाती हैं।",
      hinglish:
        "Sasural family hai, aur family ko — kisi bhi garden ki tarah — healthy rehne ke liye gentle boundaries chahiye. Sabse kind tareeka aksar sabse calm hota hai: ek time pe ek issue chuniye, usi pal boliye (mahino baad nahi), aur \"aap\" ki jagah \"hum\" keejiye. Jaise: \"Humne decide kiya hai ki dinner table pe paison ki baat nahi hogi — isliye nahi ki hum aap pe bharosa nahi karte, balki isliye ki ghar shaant rahe.\" Publicly bolne se pehle akele me apne partner se agree keejiye; couple ke roop me rakhi boundaries nibhana bahut aasan hota hai. Agar boundary baar-baar cross ho, toh use louder nahi, gentler dohraaiye. Boundaries rejection nahi hain — woh woh fences hain jo pyaar ko ronde jaane se bachati hain.",
    },
    answer_type: "practical_steps",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: ["boundaries-cloud-townsend", "family-systems-bowen"],
    confidence: "high",
    disclaimer: STANDARD_DISCLAIMER,
    tags: ["boundaries", "in_laws", "family", "couple_alignment"],
  },
  {
    id: "MR-016",
    category: "boundaries",
    subcategory: "consent_in_intimacy",
    difficulty: "intermediate",
    questions: {
      en: "How do we talk about consent as a couple without it feeling awkward?",
      hi: "कपल के तौर पर सहमति पर बात कैसे करें जो अजीब न लगे?",
      hinglish: "Couple ke taur pe consent pe baat kaise karein jo awkward na lage?",
    },
    answers: {
      en:
        "It is beautiful that you are even asking this — most couples do not, and that silence is where hurt hides. Consent is not a one-time yes; it is a living conversation, and it can be warm and even loving. Try small sentences in low-pressure moments (not in bed): \"You can always tell me if you are not in the mood — I would rather hear a no than be lied to.\" Also: \"If I ever go quiet, please ask me again.\" Consent includes the small things — being touched, being teased, being photographed, being talked about. A relationship where both people can say no without fear is one where both people can say yes more freely. This is not a lecture; it is a gift you give each other.",
      hi:
        "यह बहुत सुंदर बात है कि आप यह सवाल पूछ रहे हैं — ज़्यादातर जोड़े नहीं पूछते, और उसी ख़ामोशी में चोट छुपी रहती है। सहमति एक बार का 'हाँ' नहीं है; यह जीवित बातचीत है, और यह गर्मजोशी भरी और प्यार भरी हो सकती है। कम दबाव वाले पलों में (बिस्तर पर नहीं) छोटे वाक्य कहिए: \"जब तुम्हारा मन न हो तो तुम मुझे हमेशा बता सकते हो — मैं झूठ से बेहतर 'ना' सुनना पसंद करूँगा/करूँगी।\" और: \"अगर मैं कभी चुप हो जाऊँ, तो मुझसे फिर पूछना।\" सहमति में छोटी-छोटी चीज़ें भी शामिल हैं — छुआ जाना, चिढ़ाया जाना, फ़ोटो खींची जाना, किसी के बारे में बात की जाना। जिस रिश्ते में दोनों बिना डर 'ना' कह सकें, वहाँ दोनों ज़्यादा आज़ादी से 'हाँ' कह पाते हैं। यह उपदेश नहीं, एक तोहफ़ा है जो आप एक-दूसरे को देते हैं।",
      hinglish:
        "Yeh bahut beautiful baat hai ki aap yeh sawaal pooch rahe ho — zyadatar couples nahi poochte, aur usi silence me chot chhupi hoti hai. Consent ek baar ka 'haan' nahi hai; yeh living conversation hai, aur yeh warm aur loving ho sakti hai. Low-pressure moments me (bed pe nahi) chhote sentences kehiye: \"Jab tumhara mann na ho toh tum mujhe hamesha bata sakte ho — main jhooth se better 'na' sunna prefer karunga/karungi.\" Aur: \"Agar main kabhi chup ho jaaon, toh mujhse phir poochna.\" Consent me chhoti-chhoti cheezein bhi shamil hain — chhua jaana, chidhaya jaana, photo khichi jaana, kisi ke baare me baat ki jaana. Jis relationship me dono bina darr 'na' keh sakte hain, wahan dono zyada azaadi se 'haan' keh paate hain. Yeh lecture nahi, ek gift hai jo aap ek-doosre ko dete ho.",
    },
    answer_type: "psychoeducation",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: ["consent-planned-parenthood", "gottman-trust"],
    confidence: "high",
    disclaimer: STANDARD_DISCLAIMER,
    tags: ["consent", "intimacy", "respect", "communication"],
  },
  {
    id: "MR-017",
    category: "healthy_relationship",
    subcategory: "signs_of_health",
    difficulty: "beginner",
    questions: {
      en: "How do I know if my relationship is healthy?",
      hi: "मैं कैसे जानूँ कि मेरा रिश्ता स्वस्थ है?",
      hinglish: "Main kaise jaanon ki mera relationship healthy hai?",
    },
    answers: {
      en:
        "A healthy relationship is not one without conflict — it is one where conflict does not break the bond. Signs of health are quiet: you can disagree without being afraid, you can say no without being punished, you feel more like yourself around them, not less, and small repairs happen after hard moments. You both take responsibility sometimes; neither of you has to be perfect. Ask yourself: \"After I spend time with them, do I feel a little more whole, or a little smaller?\" One answer does not define everything, but the pattern over weeks and months will tell you a lot. And if the pattern feels wrong, please trust that feeling enough to speak with a counsellor.",
      hi:
        "स्वस्थ रिश्ता वह नहीं जिसमें झगड़े न हों — वह है जहाँ झगड़ा बंधन को नहीं तोड़ता। सेहत के संकेत शांत होते हैं: आप बिना डर असहमत हो सकते हैं, आप बिना सज़ा के 'ना' कह सकते हैं, उनके साथ आप खुद को ज़्यादा 'अपने जैसा' महसूस करते हैं, कम नहीं, और कठिन पलों के बाद छोटी-छोटी मरम्मतें हो जाती हैं। कभी आप ज़िम्मेदारी लेते हैं, कभी वे; किसी को भी परफेक्ट नहीं होना है। खुद से पूछिए: \"उनके साथ समय बिताने के बाद मैं थोड़ा और पूरा महसूस करता/करती हूँ, या थोड़ा और छोटा?\" एक जवाब सब कुछ तय नहीं करता, लेकिन हफ़्तों-महीनों का पैटर्न बहुत कुछ बता देगा। और अगर वह पैटर्न गलत लगे, तो कृपया उस एहसास पर भरोसा कीजिए और किसी परामर्शदाता से बात कीजिए।",
      hinglish:
        "Healthy relationship woh nahi jisme jhagde na hon — woh hai jahan jhagda bond ko nahi todta. Health ke signs quiet hote hain: aap bina darr disagree kar sakte ho, aap bina punishment 'na' keh sakte ho, unke saath aap khud ko zyada 'apne jaisa' feel karte ho, kam nahi, aur mushkil moments ke baad chhoti-chhoti repairs ho jaati hain. Kabhi aap responsibility lete ho, kabhi woh; kisi ko bhi perfect nahi hona hai. Khud se poochiye: \"Unke saath time bitane ke baad main thoda aur whole feel karta/karti hoon, ya thoda aur chhota?\" Ek jawab sab kuch decide nahi karta, lekin hafton-mahino ka pattern bahut kuch bata dega. Aur agar woh pattern galat lage, toh kripya us feeling pe bharosa keejiye aur kisi counsellor se baat keejiye.",
    },
    answer_type: "psychoeducation",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: ["gottman-four-horsemen", "eft-sue-johnson"],
    confidence: "high",
    disclaimer: STANDARD_DISCLAIMER,
    tags: ["healthy_relationship", "signs", "self_reflection"],
  },
  {
    id: "MR-018",
    category: "conflict_resolution",
    subcategory: "repair_after_fight",
    difficulty: "intermediate",
    questions: {
      en: "We fight well but we do not repair well. How do we come back to each other after a fight?",
      hi: "हम झगड़ते अच्छा हैं, लेकिन झगड़े के बाद जुड़ना नहीं आता। झगड़े के बाद एक-दूसरे के पास कैसे लौटें?",
      hinglish:
        "Hum jhagadte achha hain, lekin jhagde ke baad repair nahi kar paate. Jhagde ke baad ek-doosre ke paas kaise lautte hain?",
    },
    answers: {
      en:
        "Fighting is not the opposite of love — contempt is. The fact that you fight but still want to repair tells me the bond is alive and asking for care. Repair is small and specific: a hand on the shoulder, a cup of chai left on the table, a soft \"I did not mean to say it like that.\" Gottman calls these 'repair attempts' — small invitations to reconnect. Try agreeing in advance on one signal, like a pause word or a gentle tap, that means \"I need a few minutes, not a divorce.\" After both of you are calm, revisit the issue in 20 minutes, not in the heat of it. Repair is not about who was right — it is about coming back to the same side of the table.",
      hi:
        "झगड़ा प्यार का उल्टा नहीं होता — उल्टा है तिरस्कार। यह बात कि आप झगड़ते हैं लेकिन फिर भी जुड़ना चाहते हैं, बताती है कि बंधन जीवित है और देखभाल माँग रहा है। मरम्मत छोटी और ठोस होती है: कंधे पर हाथ, मेज़ पर रखी एक कप चाय, कोमल \"मैं ऐसा कहना नहीं चाहता/चाहती था।\" गॉटमैन इन्हें 'repair attempts' कहते हैं — जुड़ने के छोटे न्योते। पहले से एक संकेत तय कर लीजिए, जैसे कोई विराम-शब्द या कोमल स्पर्श, जिसका मतलब हो \"मुझे कुछ मिनट चाहिए, तलाक़ नहीं।\" दोनों के शांत होने पर, 20 मिनट बाद उसी मुद्दे पर लौटिए, गर्मी के पल में नहीं। मरम्मत इस बारे में नहीं है कि कौन सही था — यह मेज़ के एक ही तरफ़ लौटने के बारे में है।",
      hinglish:
        "Jhagda pyaar ka ulta nahi hota — ulta hai contempt. Yeh baat ki aap jhagadte ho lekin phir bhi repair chahte ho, batati hai ki bond zinda hai aur care maang raha hai. Repair chhoti aur specific hoti hai: kandhe pe haath, table pe rakhi ek cup chai, soft \"main aisa kehna nahi chahta/chahti tha.\" Gottman inhe 'repair attempts' kehte hain — reconnection ke chhote invitations. Pehle se ek signal decide kar leejiye, jaise koi pause-word ya gentle tap, jiska matlab ho \"mujhe kuch minutes chahiye, divorce nahi.\" Dono ke calm hone par, 20 minute baad usi issue pe lautiye, heat of the moment me nahi. Repair is baare me nahi ki kaun sahi tha — yeh table ke ek hi side pe lautne ke baare me hai.",
    },
    answer_type: "practical_steps",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: ["gottman-repair-attempts", "gottman-four-horsemen"],
    confidence: "high",
    disclaimer: STANDARD_DISCLAIMER,
    tags: ["conflict", "repair", "reconnection", "communication"],
  },
  {
    id: "MR-019",
    category: "conflict_resolution",
    subcategory: "apology_and_forgiveness",
    difficulty: "intermediate",
    questions: {
      en: "How do I apologise in a way that actually helps, not just ends the fight?",
      hi: "मैं ऐसी माफ़ी कैसे माँगूँ जो सच में मदद करे, सिर्फ़ झगड़ा ख़त्म न करे?",
      hinglish:
        "Main aisi apology kaise maangoon jo sach me help kare, sirf jhagda khatam na kare?",
    },
    answers: {
      en:
        "What a tender and brave question. A real apology is not \"sorry you felt that way\" — that quietly moves the blame to them. A real apology has four parts: name what you did, name its impact, say what you will do differently, and then — most importantly — change the thing. For example: \"I raised my voice and it scared you. I am sorry. Next time I feel that rising, I will step out for two minutes instead of shouting.\" Forgiveness is not the same as forgetting, and it does not have to arrive the same day. You are not asking for instant absolution; you are offering a small, honest repair.",
      hi:
        "यह कितना कोमल और बहादुर सवाल है। सच्ची माफ़ी \"सॉरी, तुम्हें ऐसा लगा\" नहीं होती — वह चुपचाप इल्ज़ाम उन पर डाल देती है। सच्ची माफ़ी के चार हिस्से होते हैं: जो किया उसे नाम देना, उसका असर बताना, आगे क्या अलग करेंगे यह कहना, और फिर — सबसे ज़रूरी — उसे बदलना। जैसे: \"मैंने आवाज़ ऊँची की और उससे तुम डर गए। मुझे माफ़ करो। अगली बार जब वह उठता महसूस हो, मैं दो मिनट के लिए बाहर चला/चली जाऊँगा/जाऊँगी, चिल्लाऊँगा/चिल्लाऊँगी नहीं।\" माफ़ करना भूलना नहीं है, और ज़रूरी नहीं कि उसी दिन हो। आप तुरंत मुक्ति नहीं माँग रहे; आप एक छोटी, ईमानदार मरम्मत दे रहे हैं।",
      hinglish:
        "Yeh kitna tender aur brave sawaal hai. Real apology \"sorry tumhe aisa laga\" nahi hoti — woh chupchaap blame unpe daal deti hai. Real apology ke chaar hisse hote hain: jo kiya use naam dena, uska impact batana, aage kya alag karenge yeh kehna, aur phir — sabse zaroori — usse badalna. Jaise: \"Maine awaaz oonchi ki aur usse tum darr gaye. Mujhe maaf karo. Next time jab woh uthta feel ho, main do minute ke liye bahar chala/chali jaaunga/jaungi, chillaunga/Chillaungi nahi.\" Forgiveness bhoolna nahi hai, aur zaroori nahi ki usi din ho. Aap instant absolution nahi maang rahe; aap ek chhoti, honest repair de rahe ho.",
    },
    answer_type: "practical_steps",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: ["gottman-repair-attempts", "nonviolent-communication-rosenberg"],
    confidence: "high",
    disclaimer: STANDARD_DISCLAIMER,
    tags: ["apology", "forgiveness", "repair", "accountability"],
  },
  {
    id: "MR-020",
    category: "trust",
    subcategory: "rebuilding_trust_after_betrayal",
    difficulty: "advanced",
    questions: {
      en: "My partner betrayed my trust. Is it possible to rebuild?",
      hi: "मेरे साथी ने मेरा भरोसा तोड़ा। क्या उसे फिर से बनाया जा सकता है?",
      hinglish: "Mere partner ne mera trust toda. Kya use phir se build kiya ja sakta hai?",
    },
    answers: {
      en:
        "I want to first say this very gently: what you are carrying is heavy, and you do not have to decide today whether it can be rebuilt. Yes, trust can sometimes be rebuilt — but only under specific conditions: the person who broke it takes full responsibility without excuses, is willing to be transparent for as long as it takes, and accepts that your healing will not follow a schedule. Rebuilding is not a single apology; it is a thousand small choices over months. It is also okay if, after honest trying, you decide this is not a place you can feel safe. Please — this is important — do not try to do this alone. A couples counsellor, or a personal therapist, can hold this with more steadiness than either of you can right now. If the betrayal involved harm, abuse, or a threat to your safety, please reach out to someone you trust.",
      hi:
        "पहले यह मैं बहुत कोमलता से कहना चाहती हूँ: आप जो सह रहे हैं वह भारी है, और आज ही तय करना ज़रूरी नहीं कि इसे फिर बनाया जा सकता है या नहीं। हाँ, भरोसा कभी-कभी फिर बन सकता है — लेकिन कुछ ख़ास शर्तों पर: जिसने तोड़ा वह बिना बहाने पूरी ज़िम्मेदारी ले, जितना समय लगे उतना पारदर्शी रहने को तैयार हो, और यह स्वीकार करे कि आपका ठीक होना किसी शेड्यूल पर नहीं चलेगा। भरोसा फिर बनाना एक माफ़ी नहीं, महीनों में हज़ार छोटे चुनाव हैं। और अगर ईमानदारी से कोशिश करने के बाद आप तय करें कि यह वह जगह नहीं जहाँ आप सुरक्षित महसूस कर सकते हैं, तो यह भी ठीक है। कृपया — यह ज़रूरी है — इसे अकेले करने की कोशिश मत कीजिए। कपल्स काउंसलर या निजी थेरेपिस्ट इसे अभी आप दोनों से ज़्यादा स्थिरता से थाम सकते हैं। अगर विश्वासघात में नुक़सान, दुर्व्यवहार या सुरक्षा का ख़तरा शामिल था, तो कृपया किसी भरोसेमंद इंसान से संपर्क कीजिए।",
      hinglish:
        "Pehle yeh main bahut softness se kehna chahti hoon: jo aap seh rahe ho woh heavy hai, aur aaj hi decide karna zaroori nahi ki ise phir se build kiya ja sakta hai ya nahi. Haan, trust kabhi-kabhi phir ban sakta hai — lekin kuch specific conditions pe: jisne toda woh bina excuses poori responsibility le, jitna time lage utna transparent rehne ko ready ho, aur yeh accept kare ki aapka healing kisi schedule pe nahi chalega. Trust rebuild karna ek apology nahi, mahino me hazaar chhote choices hain. Aur agar honest trying ke baad aap decide karein ki yeh woh jagah nahi jahan aap safe feel kar sakte ho, toh yeh bhi okay hai. Kripya — yeh important hai — ise akele karne ki koshish mat keejiye. Couples counsellor ya personal therapist ise abhi aap dono se zyada steadiness se thaam sakte hain. Agar betrayal me harm, abuse ya safety ka threat tha, toh kripya kisi trusted insaan se contact keejiye.",
    },
    answer_type: "safety_and_referral",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: ["gottman-trust", "trauma-informed-care-herman"],
    confidence: "high",
    disclaimer: SAFETY_DISCLAIMER,
    tags: ["trust", "betrayal", "rebuilding", "safety", "professional_help"],
  },
  {
    id: "MR-021",
    category: "long_distance",
    subcategory: "communication_rhythm",
    difficulty: "intermediate",
    questions: {
      en: "How do we stay close in a long-distance relationship?",
      hi: "लॉन्ग-डिस्टेंस रिश्ते में हम करीब कैसे रहें?",
      hinglish: "Long-distance relationship me hum close kaise rahein?",
    },
    answers: {
      en:
        "Distance can feel like it is testing everything, and it can also deepen a bond when the two of you are intentional. What helps most is rhythm, not volume — a small daily check-in (even ten minutes, same time), one longer call each week, and small rituals that belong only to you two (a shared playlist, a Sunday-night voice note). Talk about the ordinary things, not only the emotional ones — being part of each other's small day is what makes closeness survive distance. And when one of you is having a hard week, say it out loud instead of going quiet. Distance does not weaken a love that is tended; it simply makes the tending more visible.",
      hi:
        "दूरी ऐसा लग सकता है कि वह सब कुछ परख रही है, और यह तब बंधन को और गहरा भी कर सकती है जब आप दोनों जानबूझकर कोशिश करें। सबसे ज़्यादा मदद करता है लय, आवाज़ की मात्रा नहीं — छोटी रोज़ की बात (दस मिनट भी, एक ही समय), हफ़्ते में एक लंबी कॉल, और कुछ छोटे रिवाज़ जो सिर्फ़ आप दोनों के हों (साझा प्लेलिस्ट, रविवार रात का वॉइस नोट)। सिर्फ़ भावनात्मक बातें नहीं, रोज़मर्रा की बातें भी कीजिए — एक-दूसरे के छोटे दिन का हिस्सा होना ही दूरी को पार करने वाली करीबी बनाता है। और जब किसी का हफ़्ता कठिन हो, तो चुप होने की जगह बोलिए। दूरी उस प्यार को कमज़ोर नहीं करती जिसकी देखभाल होती है; वह सिर्फ़ देखभाल को और दिखने लगती है।",
      hinglish:
        "Distance aisa lag sakta hai ki woh sab kuch test kar rahi hai, aur yeh tab bond ko aur gehra bhi kar sakti hai jab aap dono intentionally koshish karein. Sabse zyada help karta hai rhythm, volume nahi — chhoti daily check-in (das minute bhi, same time), hafte me ek lambi call, aur kuch chhote rituals jo sirf aap dono ke hon (shared playlist, Sunday-night voice note). Sirf emotional baatein nahi, ordinary cheezein bhi keejiye — ek-doosre ke chhote din ka hissa hona hi distance ko cross karne wali closeness banata hai. Aur jab kisi ka hafta mushkil ho, toh chup hone ki jagah boliye. Distance us pyaar ko weak nahi karti jiski tending hoti hai; woh sirf tending ko aur visible bana deti hai.",
    },
    answer_type: "practical_steps",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: ["gottman-rituals-of-connection", "attachment-theory-bowlby-ainsworth"],
    confidence: "high",
    disclaimer: STANDARD_DISCLAIMER,
    tags: ["long_distance", "rituals", "communication", "closeness"],
  },
  {
    id: "MR-022",
    category: "long_distance",
    subcategory: "trust_and_reassurance",
    difficulty: "intermediate",
    questions: {
      en: "How do we build trust when we cannot see each other every day?",
      hi: "जब हम रोज़ एक-दूसरे को नहीं देख सकते, तो भरोसा कैसे बनाएँ?",
      hinglish:
        "Jab hum roz ek-doosre ko nahi dekh sakte, toh trust kaise banayein?",
    },
    answers: {
      en:
        "Trust in long-distance is built on small consistencies, not grand promises. It is the \"I reached home safely\" message, the call you said you would make, the small honesty about your day even when it was boring. Please do not turn reassurance into surveillance — asking for location-tracking, phone checks or constant updates usually grows the fear, it does not calm it. Instead, agree on what safety feels like for both of you: how often you check in, what you share about your social life, what a hard week looks like. And when the fear rises, tell your partner — \"I am feeling a little insecure today, can you say something kind?\" — instead of acting on it. Trust survives distance when both people are predictable in the smallest, kindest ways.",
      hi:
        "लॉन्ग-डिस्टेंस में भरोसा बड़े वादों पर नहीं, छोटी निरंतरताओं पर बनता है। वह \"मैं सुरक्षित घर पहुँच गया/गई\" वाला संदेश है, वह कॉल जो कहा था कि करूँगा, आपके दिन की छोटी ईमानदारी भले वह उबाऊ रहा हो। कृपया reassurance को निगरानी मत बनाइए — location tracking, फ़ोन चेक या लगातार updates माँगना अक्सर डर को बढ़ाता है, शांत नहीं करता। इसके बजाय तय कीजिए कि आप दोनों के लिए सुरक्षा कैसी दिखती है: कितनी बार बात होगी, सामाजिक जीवन के बारे में क्या बताएँगे, कठिन हफ़्ता कैसा दिखेगा। और जब डर उठे, तो साथी को बताइए — \"आज मैं थोड़ा असुरक्षित महसूस कर रहा/रही हूँ, कुछ अच्छा कह सकते हो?\" — उस पर काम करने के बजाय। दूरी में भरोसा तब बचता है जब दोनों सबसे छोटी, सबसे कोमल बातों में भरोसेमंद होते हैं।",
      hinglish:
        "Long-distance me trust bade promises pe nahi, chhoti consistencies pe banta hai. Woh \"main safe ghar pahunch gaya/gayi\" wala message hai, woh call jo kaha tha karunga, aapke din ki chhoti honesty bhale woh boring raha ho. Kripya reassurance ko surveillance mat banao — location-tracking, phone check ya constant updates maangna aksar darr ko badhata hai, shaant nahi karta. Iske bajay decide keejiye ki aap dono ke liye safety kaisi dikhti hai: kitni baar baat hogi, social life ke baare me kya share karoge, mushkil hafta kaisa dikhega. Aur jab darr uthe, toh partner ko bataiye — \"aaj main thoda insecure feel kar raha/rahi hoon, kuch achha keh sakte ho?\" — uspe act karne ke bajay. Distance me trust tab bachta hai jab dono sabse chhoti, sabse gentle cheezon me bharose-mand hote hain.",
    },
    answer_type: "psychoeducation",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: ["gottman-trust", "attachment-theory-bowlby-ainsworth"],
    confidence: "high",
    disclaimer: STANDARD_DISCLAIMER,
    tags: ["long_distance", "trust", "reassurance", "boundaries"],
  },
  {
    id: "MR-023",
    category: "self_worth",
    subcategory: "rejection_and_worth",
    difficulty: "beginner",
    questions: {
      en: "Someone I loved rejected me. How do I stop feeling like I am not enough?",
      hi: "जिसे मैंने प्यार किया उसने मुझे ठुकरा दिया। मुझे यह महसूस होना कैसे रुके कि मैं 'काफ़ी नहीं' हूँ?",
      hinglish:
        "Jise maine pyaar kiya usne mujhe reject kar diya. Mujhe yeh feel hona kaise ruke ki main 'kaafi nahi' hoon?",
    },
    answers: {
      en:
        "Rejection is one of the most painful human experiences, and I want to hold this moment with you very gently. Please hear this: someone not choosing you is not evidence that you are unworthy. Sometimes two good people simply do not fit, sometimes the other person is carrying something they have not healed, and sometimes the timing is wrong. Their choice is about them too. You do not have to earn the right to be loved by becoming someone else. For now, let one small truth stay close: your worth was never on the table. What was on the table was compatibility — and that is a different, kinder conversation.",
      hi:
        "अस्वीकृति इंसान के सबसे दर्दभरे अनुभवों में से एक है, और मैं इस पल को आपके साथ बहुत कोमलता से थामना चाहती हूँ। यह सुन लीजिए: किसी का आपको न चुनना इस बात का सबूत नहीं है कि आप अयोग्य हैं। कभी-कभी दो अच्छे लोग बस मेल नहीं खाते, कभी-कभी सामने वाला कुछ ऐसा उठाए हुए है जो उसने ठीक नहीं किया, और कभी-कभी समय गलत होता है। उनका चुनाव उनके बारे में भी है। प्यार पाने का हक़ कमाने के लिए आपको कोई और बनना नहीं है। अभी के लिए एक छोटा सच पास रखिए: आपकी क़ीमत कभी दाँव पर नहीं थी। दाँव पर था तालमेल — और वह एक अलग, ज़्यादा कोमल बातचीत है।",
      hinglish:
        "Rejection insaan ke sabse dardbhare experiences me se ek hai, aur main is pal ko aapke saath bahut softness se thaamna chahti hoon. Yeh sun lijiye: kisi ka aapko na chunna is baat ka proof nahi hai ki aap unworthy ho. Kabhi-kabhi do achhe log bas fit nahi hote, kabhi-kabhi saamne wala kuch aisa uthaye hue hai jo usne theek nahi kiya, aur kabhi-kabhi timing galat hoti hai. Unka choice unke baare me bhi hai. Pyaar paane ka haq kamaane ke liye aapko koi aur banna nahi hai. Abhi ke liye ek chhota sach paas rakhiye: aapki worth kabhi daanv pe nahi thi. Daanv pe tha compatibility — aur woh ek alag, zyada gentle baat hai.",
    },
    answer_type: "empathic_guidance",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: ["self-compassion-neff", "attachment-theory-bowlby-ainsworth"],
    confidence: "high",
    disclaimer: STANDARD_DISCLAIMER,
    tags: ["rejection", "self_worth", "grief", "self_compassion"],
  },
  {
    id: "MR-024",
    category: "self_worth",
    subcategory: "loneliness_inside_relationship",
    difficulty: "intermediate",
    questions: {
      en: "I feel lonely even though I have a partner. Is that okay to admit?",
      hi: "मेरा साथी है फिर भी मैं अकेला/अकेली महसूस करता/करती हूँ। क्या यह कहना ठीक है?",
      hinglish:
        "Mera partner hai phir bhi main akela/akeli feel karta/karti hoon. Kya yeh kehna okay hai?",
    },
    answers: {
      en:
        "Yes — it is more than okay to admit. Feeling lonely inside a relationship is a particular kind of ache, and it does not mean your partner is bad or that you are ungrateful. It often means something quiet is missing: being truly seen, being asked about your day, being known without having to explain yourself each time. Please say it to your partner, softly: \"I love being with you, and there are moments I feel alone with you. Can we talk about that?\" — not as an accusation, as an invitation. If the loneliness runs deeper and older, please consider a counsellor; sometimes the ache predates the relationship, and it deserves its own gentle space.",
      hi:
        "हाँ — यह कहना बिलकुल ठीक है। रिश्ते के अंदर अकेलापन एक ख़ास तरह का दर्द है, और इसका मतलब यह नहीं कि आपका साथी बुरा है या आप अकृतज्ञ हैं। अक्सर इसका मतलब होता है कि कुछ शांत सा छूट रहा है: सच में देखा जाना, आपके दिन के बारे में पूछा जाना, बिना हर बार खुद को समझाए जाना। कृपया अपने साथी से कोमलता से कहिए: \"मुझे तुम्हारे साथ रहना अच्छा लगता है, और कुछ पल ऐसे भी हैं जब मैं तुम्हारे साथ भी अकेला महसूस करता/करती हूँ। क्या हम इस पर बात कर सकते हैं?\" — इल्ज़ाम की तरह नहीं, न्योते की तरह। अगर यह अकेलापन और गहरा या पुराना हो, तो किसी परामर्शदाता के बारे में सोचिए; कभी-कभी दर्द रिश्ते से भी पहले का होता है और उसे अपनी कोमल जगह मिलनी चाहिए।",
      hinglish:
        "Haan — yeh kehna bilkul okay hai. Relationship ke andar loneliness ek specific tarah ka dard hai, aur iska matlab yeh nahi ki aapka partner bura hai ya aap ungrateful ho. Aksar iska matlab hota hai ki kuch shaant sa missing hai: sach me dekha jaana, aapke din ke baare me poocha jaana, bina har baar khud ko explain kiye jaana. Kripya apne partner se softness se kehiye: \"Mujhe tumhare saath rehna achha lagta hai, aur kuch moments aise bhi hain jab main tumhare saath bhi akela feel karta/karti hoon. Kya hum ispe baat kar sakte hain?\" — accusation ki tarah nahi, invitation ki tarah. Agar yeh loneliness aur deep ya purani ho, toh kisi counsellor ke baare me sochiye; kabhi-kabhi dard relationship se bhi pehle ka hota hai aur use apni gentle jagah milni chahiye.",
    },
    answer_type: "empathic_guidance",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: ["eft-sue-johnson", "self-compassion-neff"],
    confidence: "high",
    disclaimer: STANDARD_DISCLAIMER,
    tags: ["loneliness", "relationship", "communication", "self_worth"],
  },
  {
    id: "MR-025",
    category: "premarital",
    subcategory: "expectations_and_life_goals",
    difficulty: "intermediate",
    questions: {
      en:
        "What important conversations should we have before getting married?",
      hi: "शादी से पहले हमें कौन-सी ज़रूरी बातें कर लेनी चाहिए?",
      hinglish:
        "Shaadi se pehle humein kaunsi important baatein kar leni chahiye?",
    },
    answers: {
      en:
        "What a wise and caring question to ask before the wedding, not after. Please talk honestly — and gently — about: how you both handle money and debt; how you imagine family and children (yes, no, when, how many, and what if the plan changes); how close parents and in-laws will be day to day; how you each handle conflict and repair; what intimacy means to each of you; work and career dreams for the next five years; faith and rituals; and how you will divide the ordinary load of the house. Do not aim for total agreement — aim for full honesty, and for knowing how you will face disagreements. One long walk and three short, kind conversations before the wedding can spare you three years of surprises.",
      hi:
        "यह शादी से पहले पूछना, बाद में नहीं — कितना समझदारी और प्यार भरा सवाल है। कृपया ईमानदारी से — और कोमलता से — इन पर बात कीजिए: पैसा और क़र्ज़ आप दोनों कैसे सँभालते हैं; परिवार और बच्चों की कल्पना (हाँ, नहीं, कब, कितने, और योजना बदले तो क्या); माता-पिता और ससुराल रोज़मर्रा में कितने पास रहेंगे; झगड़े और मरम्मत आप कैसे करते हैं; शारीरिक निकटता का आप दोनों के लिए क्या अर्थ है; अगले पाँच साल के काम और करियर के सपने; आस्था और रीति-रिवाज; और घर का रोज़ का बोझ कैसे बाँटा जाएगा। लक्ष्य पूरी सहमति नहीं है — पूरी ईमानदारी है, और यह जानना है कि असहमति का सामना आप कैसे करेंगे। शादी से पहले एक लंबी सैर और तीन छोटी, कोमल बातचीत आपको तीन साल के आश्चर्यों से बचा सकती हैं।",
      hinglish:
        "Yeh shaadi se pehle poochna, baad me nahi — kitna wise aur caring sawaal hai. Kripya honesty se — aur gentleness se — inpe baat keejiye: paisa aur debt aap dono kaise handle karte ho; family aur bachchon ki kalpana (haan, nahi, kab, kitne, aur plan badle toh kya); parents aur in-laws rozmarra me kitne paas rahenge; jhagde aur repair aap kaise karte ho; physical intimacy ka aap dono ke liye kya arth hai; agle paanch saal ke kaam aur career ke sapne; faith aur rituals; aur ghar ka roz ka bojh kaise baanta jayega. Aim total agreement nahi hai — aim poori honesty hai, aur yeh jaanna ki disagreement ka saamna aap kaise karoge. Shaadi se pehle ek lambi walk aur teen chhoti, gentle baatein aapko teen saal ke surprises se bacha sakti hain.",
    },
    answer_type: "practical_steps",
    requires_personal_chart: false,
    requires_calculation: false,
    source_ids: ["gottman-relationship-checklist", "nonviolent-communication-rosenberg"],
    confidence: "high",
    disclaimer: STANDARD_DISCLAIMER,
    tags: ["premarital", "expectations", "communication", "marriage"],
  },
];
