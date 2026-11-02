import { db } from "./index"; // 👈 Render बिल्ड पास करने के लिए पाथ ठीक कर दिया गया है
import { astrologerReviews } from "./schema";

// 1. आपके अलग-अलग ज्योतिषियों (Personas) की पूरी लिस्ट
const PERSONAS = ["Gita", "Acharya Kriti", "Pandit Vikram", "Swami Anand"];

// 2. मनोवैज्ञानिक ट्रिगर्स वाले 100% असली दिखने वाले कनवर्टिंग कमेंट्स (Hinglish + Hindi)
const MARKETING_COMMENTS = [
  // DISBELIEF TO BELIEF TRIGGER (पहले शक था, फिर भरोसा हुआ)
  "Pehle laga sab fake hai aur paise barbad honge, par app free tha toh try kiya. Pandit ji ne jo bataya wo sach me match hua. Shocked hoon!",
  "Mujhe in sab cheezon pe bilkul bharosa nahi tha. Par inki baaton me jo confidence aur details thi, usne mera opinion badal diya.",
  "Online platforms pe trust karna mushkil hota hai, par yahan baat karke laga ki koi sach me aapki dikkat samajh raha hai.",
  
  // SPECIFIC TIMELINE TRIGGER (तारीख और समय का सटीक उल्लेख - माइंडसेट कनवर्टर)
  "Swami Anand ne bola tha ki 3 mahine ke andar job change ka yog banega. Dec 2026 me lagta tha impossible hai, par January aate aate achha offer aa gaya!",
  "Shadi ko lekar 2 saal se pareshan tha. Acharya Kriti ne March tak ka time diya tha, aur Feb end me hi rishta pakka ho gaya. Koti koti pranam.",
  "Unhone jo timeline di thi, 10-12 din aage peeche hua par kaam bilkul waisa hi hua jaisa bola tha. Accurate predictions!",
  
  // EMOTIONAL RELIEF & COMFORT TRIGGER (मानसिक शांति और डिप्रेशन से राहत)
  "Career aur family ko lekar bohot zyada anxiety ho rahi thi. Inse baat karke man ko jo shanti mili hai, wo shabdon me bayan nahi ho sakti.",
  "Aisa lagta hai koi bada buzurg aapka hath pakad kar sahi rasta dikha raha ho. Bohot hi comforting experience tha.",
  "Breakup ke baad mai bohot disturb tha. Gita AI ke remedies aur counseling se mujhe move on karne me bohot help mili.",
  
  // VALUE FOR MONEY / NO GREED TRIGGER (कोई फालतू का खर्चा नहीं)
  "Sabse achhi baat ye hai ki baaki panditon ki tarah hazaron ki pooja ya mehnge stone nahi bataye. Ghar ke aam upay bataye jo asardar rahe.",
  "Mera business thapp pad gaya tha. Upay bohot saral the, koi faltu ka kharcha nahi karwaya aur 15 din me hi dhandha chal pada.",
  
  // CRITICAL BUT POSITIVE TRIGGER (हल्की सी कमी जो रिव्यू को 100% असली बनाती है)
  "Response me 2 minute ki deri hui shayad server load ki wajah se, par guidance ekdum top-notch thi. 5 stars for the accuracy!",
  "App ka UI thoda simple hai, par Pandit Vikram ji ki baaton ne dil jeet liya. Ek ek prediction bilkul sahi baithi.",
  
  // URGENCY & CONVERSION TRIGGER (तुरंत रिलीफ और रिजल्ट्स)
  "Dhan labh ke liye pooja batayi thi, 15 din me hi asar dikhna shuru ho gaya. Best astrologer on this app.",
  "Career ko lekar bohot confusion tha, par ab rasta bilkul clear hai. Bohot gyan hai inke paas.",
  "Maine apni poori family ka chart dikhaya, sabhi predictions ekdum sahi baith rahi hain."
];

// 3. रैंडम भारतीय नाम (Real Human Feel के लिए)
const INDIAN_NAMES = [
  "Amit Sharma", "Priya Patel", "Rahul Verma", "Sneha Reddy", 
  "Vikram Singh", "Anjali Gupta", "Deepak Mishra", "Neha Joshi",
  "Rajesh Kumar", "Kiran Rao", "Sanjay Dutt", "Pooja Choudhary",
  "Aakash Mehta", "Ritu Jha", "Manish Tiwari", "Divya Nair"
];

/**
 * डेटाबेस में ऑटोमेटेड सोशल प्रूफ (रिव्यूज) भरने का मुख्य फंक्शन
 * @param reviewsPerPersona हर ज्योतिषी के लिए कितने रिव्यूज बनाने हैं
 */
export async function seedMarketingReviews(reviewsPerPersona: number = 20) {
  console.log("⏳ सोशल प्रूफ जेनरेट होना शुरू हो रहा है (100% Marketing Mode)...");
  
  const itemsToInsert: Array<typeof astrologerReviews.$inferInsert> = [];

  for (const persona of PERSONAS) {
    for (let i = 0; i < reviewsPerPersona; i++) {
      // रैंडम नाम और कमेंट चुनना
      const randomName = INDIAN_NAMES[Math.floor(Math.random() * INDIAN_NAMES.length)];
      const randomComment = MARKETING_COMMENTS[Math.floor(Math.random() * MARKETING_COMMENTS.length)];
      
      // मार्केटिंग कन्वर्शन के लिए रेटिंग हमेशा 4 या 5 स्टार होनी चाहिए (Real Look के लिए 85% 5-Star)
      const randomStars = Math.random() > 0.15 ? 5 : 4; 
      
      // सोशल प्रूफ की क्रेडिबिलिटी बढ़ाने के लिए 'Helpful' काउंटर को रैंडम नंबर देना
      const randomHelpfulCount = Math.floor(Math.random() * 80) + 5;

      // पिछले 30 दिनों के भीतर एक रैंडम तारीख जेनरेट करना (ताकि सारे रिव्यूज एक ही दिन के न दिखें)
      const randomDaysAgo = Math.floor(Math.random() * 30);
      const fakeCreatedAt = new Date();
      fakeCreatedAt.setDate(fakeCreatedAt.getDate() - randomDaysAgo);

      itemsToInsert.push({
        persona: persona,
        reviewerName: randomName,
        stars: randomStars,
        comment: randomComment,
        helpfulCount: randomHelpfulCount,
        isApproved: true, // सीधे अप्रूव्ड ताकि फ्रंटएंड पर तुरंत लाइव दिखे
        createdAt: fakeCreatedAt,
      });
    }
  }

  try {
    // बल्क इंसर्ट (Bulk Insert) ताकि एक ही बार में पूरा डेटा सेव हो जाए
    await db.insert(astrologerReviews).values(itemsToInsert);
    console.log(`✅ सफलतापूर्वक सभी ज्योतिषियों के लिए कुल ${itemsToInsert.length} रिव्यूज इंसर्ट कर दिए गए हैं!`);
  } catch (error) {
    console.error("❌ रिव्यूज सीड करने में एरर आया:", error);
  }
}

// स्क्रिप्ट को टर्मिनल से सीधे रन करने के लिए (जैसे: ts-node seedReviews.ts)
if (require.main === module) {
  seedMarketingReviews(25); // हर पंडित जी के लिए 25 कड़क रिव्यूज
}
