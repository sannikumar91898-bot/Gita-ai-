import { db } from "./db"; // आपका Drizzle DB इंस्टेंस
import { astrologerReviews } from "./schema";

// 1. आपके अलग-अलग ज्योतिषियों (Personas) की पूरी लिस्ट
const PERSONAS = ["Gita", "Acharya Kriti", "Pandit Vikram", "Swami Anand"];

// 2. शुद्ध 100% मार्केटिंग माइंडसेट वाले रियलिस्टिक कमेंट्स का पूल (Hinglish + Hindi)
const MARKETING_COMMENTS = [
  "Pandit ji ne jo upay bataya tha, usse meri shadi ki rukawat bilkul door ho gayi! Highly recommended.",
  "Mera business 6 mahine se manda chal raha tha. Gemstone suggest kiya aur sach me fayda hua.",
  "Bohot hi comforting baatein karte hain. Stress bilkul khatam ho jata hai inse baat karke.",
  "December 2026 wali timeline bilkul accurate nikli! Shadi fix ho gayi meri. Thank you so much!",
  "Aise upay bataye jo ghar pe aaram se ho sakein. Koi faltu ka kharcha nahi karwaya.",
  "Pehle mujhe vishwas nahi tha, par inki baaton me jo confidence hai usne mera dil jeet liya.",
  "Dhan labh ke liye pooja batayi thi, 15 din me hi asar dikhna shuru ho gaya. Best astrologer on this app.",
  "Career ko lekar bohot confusion tha, par ab rasta bilkul clear hai. Bohot gyan hai inke paas.",
  "Maine apni poori family ka chart dikhaya, sabhi predictions ekdum sahi baith rahi hain.",
  "Bohot welcoming tone hai. Aisa lagta hai kisi bade buzurg se baat kar rahe hain.",
  "Inke upay bohot saral aur asardar hote hain. Jai Mata Di!",
  "Meri naukri lagne ki timeline unhone bilkul sahi batayi thi. Bohot dhanyawad pandit ji.",
  "Inse baat karke man ko bohot shanti milti hai, lagta hai koi dil se sun raha hai.",
  "Sahi rasta dikhane ke liye dhanyawad. Inka har ek shabd sach lagta hai.",
  "Mera divorce ka case chal raha tha, pandit ji ke upay se sab kuch thik ho gaya."
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
