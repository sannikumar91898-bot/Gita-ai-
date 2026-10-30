import { NextRequest, NextResponse } from "next/server";
import { db } from "@/index"; // FIXED: आपके मुख्य प्रोजेक्ट के एक्सपोर्ट पाथ (@/index) के साथ सिंक किया
import { astrologerReviews } from "@/schema";
import { eq, and, desc } from "drizzle-orm";

// -------------------------------------------------------------------------
// HIGH-FIDELITY RAW DATA FOR DETERMINISTIC REALISTIC REVIEW GENERATION
// -------------------------------------------------------------------------

const FIRST_NAMES = [
  "Amit", "Rahul", "Priya", "Sneha", "Vikram", "Anjali", "Deepak", "Rohan", "Neha", "Rajesh",
  "Suresh", "Pooja", "Aarav", "Karan", "Divya", "Aditya", "Megha", "Sanjay", "Ritu", "Alok",
  "Manish", "Swati", "Vivek", "Kriti", "Gaurav", "Nisha", "Pranav", "Jyoti", "Abhishek", "Rani",
  "Sunil", "Arjun", "Neha", "Vikas", "Shweta", "Ravi", "Ankita", "Manoj", "Preeti", "Sandeep"
];

const LAST_NAMES = [
  "Sharma", "Verma", "Gupta", "Mishra", "Joshi", "Kumar", "Singh", "Yadav", "Patel", "Shah",
  "Choudhary", "Nair", "Reddy", "Rao", "Das", "Banerjee", "Chatterjee", "Dubey", "Tiwari", "Pandey",
  "Saxena", "Srivastava", "Aggarwal", "Gupta", "Malhotra", "Kapoor", "Mehta", "Grover", "Chawla", "Boshi"
];

const TEMPLATES_5_STAR = [
  "Bahut badhiya prediction tha! Guru ji ne jo bola bilkul waisa hi hua. Dhanyawad.",
  "Extremely accurate reading. She understood my career situation without me telling much.",
  "Mera man bht ashant tha, pr baat krke bht sukoon mila. Rmedies r very simple.",
  "Very polite and deep knowledge of Vedic astrology. Highly recommended!",
  "Sab kuch sahi bataya, shadi kab hogi aur kaisa rahega sab clear ho gya.",
  "Amazing experience! The guidance was very clear and precise. Will connect again soon.",
  "Bht badiya.. prblm ka solution mil gya mujhe. Simple upaay btaye h.",
  "Highly professional and empathetic. Felt like talking to an elder guide.",
  "Guruji is a blessing. His voice brings instant peace. Accurate timeline given.",
  "Perfect prediction regarding my business switch. I was so confused before this chat.",
  "Life changing advice! Simple remedies worked like magic within 2 weeks.",
  "Bahut achha swabhav hai aur prediction bhi exact thi. Shukriya!"
];

const TEMPLATES_4_STAR = [
  "Good guidance. Response was a bit delayed but calculations were highly accurate.",
  "Sahi jankari di h. Normal remedies hain jo dukan par mil jati hain easily.",
  "Satisfied with the session. Cleared all my doubts regarding my dynamic chart.",
  "Accurate prediction but text typing speed was a bit slow. Over all very good experience.",
  "Baat krke bht acha lga. Unhone bht dhairya se meri puri kundli dekhi.",
  "Good analysis of planetary dasha. Will follow the recommended chanting.",
  "Clear points and honest answers. No sugar coating at all.",
  "Predictions are accurate, explained things nicely in Hinglish. Value for money session."
];

const TEMPLATES_3_STAR = [
  "Predictions were okay. Some points matched but waiting time in queue was long.",
  "Average reading, hope remedies work out. Will update after a few weeks.",
  "Thik thak thaa.. thoda general response lga par dasha calculations sahi thi.",
  "Calculation was alright, but prediction was very mixed. Let's see what happens."
];

function seededRandom(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
  }
  return function () {
    h = Math.imul(h ^ h >>> 16, 2246822507);
    h = Math.imul(h ^ h >>> 13, 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

function generateDeterministicReviews(persona: string, count: number = 1250) {
  const reviews = [];
  const rand = seededRandom(persona + "_review_seed_v4");
  const totalOrders = Math.floor(25000 + rand() * 35000);
  
  for (let i = 0; i < count; i++) {
    const firstName = FIRST_NAMES[Math.floor(rand() * FIRST_NAMES.length)];
    const lastName = LAST_NAMES[Math.floor(rand() * LAST_NAMES.length)];
    const reviewerName = `${firstName} ${lastName.charAt(0)}.`;

    const roll = rand();
    let stars = 5;
    let comment = TEMPLATES_5_STAR[Math.floor(rand() * TEMPLATES_5_STAR.length)];

    if (roll > 0.75 && roll <= 0.95) {
      stars = 4;
      comment = TEMPLATES_4_STAR[Math.floor(rand() * TEMPLATES_4_STAR.length)];
    } else if (roll > 0.95) {
      stars = 3;
      comment = TEMPLATES_3_STAR[Math.floor(rand() * TEMPLATES_3_STAR.length)];
    }

    const daysAgo = rand() * 120;
    const createdAt = new Date();
    createdAt.setMilliseconds(createdAt.getMilliseconds() - daysAgo * 24 * 60 * 60 * 1000);
    const helpfulCount = Math.floor(rand() * 45);

    reviews.push({
      id: `virtual-rev-${persona}-${i}`,
      persona,
      reviewerName,
      stars,
      comment,
      helpfulCount,
      isApproved: true,
      createdAt,
    });
  }

  return {
    reviews: reviews.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
    totalOrders,
  };
}

/* =========================================================
   GET: MIX LIVE & DYNAMIC HIGH-VOLUME POOL REVIEWS cleanly
========================================================= */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const persona = searchParams.get("persona");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    if (!persona) {
      return NextResponse.json(
        { success: false, error: "Query parameter 'persona' is required." },
        { status: 400 }
      );
    }

    // 1. Fetch only verified approved rows directly from PostgreSQL database
    const realReviews = await db
      .select()
      .from(astrologerReviews)
      .where(
        and(
          eq(astrologerReviews.persona, persona),
          eq(astrologerReviews.isApproved, true) // Approved review check logic enforced
        )
      )
      .orderBy(desc(astrologerReviews.createdAt));

    // 2. Generate high volume baseline array to completely resolve cold start conversion barriers
    const { reviews: virtualPool, totalOrders } = generateDeterministicReviews(persona, 1250);

    // 3. Merge real verified user content behind baseline pool seamlessly
    const combinedPool = [...realReviews, ...virtualPool];

    const totalReviewsCount = combinedPool.length;
    const totalStarsSum = combinedPool.reduce((acc, curr) => acc + curr.stars, 0);
    const averageRating = totalReviewsCount > 0 ? parseFloat((totalStarsSum / totalReviewsCount).toFixed(2)) : 5.0;

    const starDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    combinedPool.forEach((r) => {
      if (r.stars >= 1 && r.stars <= 5) {
        starDistribution[r.stars as 1 | 2 | 3 | 4 | 5]++;
      }
    });

    const offset = (page - 1) * limit;
    const paginatedReviews = combinedPool.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      metrics: {
        averageRating,
        totalReviewsCount,
        totalOrdersProcessed: totalOrders + realReviews.length,
        starDistribution,
      },
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(totalReviewsCount / limit),
      },
      reviews: paginatedReviews,
    });
  } catch (error: any) {
    console.error("CRITICAL ERROR IN REVIEWS API:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error occurred while processing reviews." },
      { status: 500 }
    );
  }
}

/* =========================================================
   POST: SECURE INSERTS UNDER STRICT ADMINISTRATIVE MODERATION
========================================================= */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { persona, reviewerName, stars, comment } = body;

    if (!persona || !reviewerName || !stars || !comment) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: persona, reviewerName, stars, comment." },
        { status: 400 }
      );
    }

    // FIXED: यूजर द्वारा सबमिट किए गए रिव्यू को सीधे पब्लिश होने से रोका (isApproved: false)
    // अब जब तक आप मैन्युअली डेटाबेस में जाकर इसे 'true' नहीं करेंगे, यह आपके ऐप पर लाइव नहीं दिखेगा।
    const [insertedReview] = await db
      .insert(astrologerReviews)
      .values({
        persona,
        reviewerName: reviewerName.trim().slice(0, 100),
        stars: Math.max(1, Math.min(5, Math.floor(Number(stars)))),
        comment: comment.trim().slice(0, 500),
        helpfulCount: 0,
        isApproved: false, // SAFE PIPELINE: Sent for administrative approval status check
      })
      .returning();

    return NextResponse.json({
      success: true,
      message: "Review submitted successfully and is currently under administrative moderation flow.",
      review: insertedReview,
    });
  } catch (error: any) {
    console.error("ERROR CAPTURING REVIEWS:", error);
    return NextResponse.json(
      { success: false, error: "Failed to persist submitted review." },
      { status: 500 }
    );
  }
}
