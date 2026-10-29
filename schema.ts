import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  integer,
  jsonb,
  doublePrecision,
  date,
  index,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  googleId: text("google_id").unique(),
  email: text("email"),
  name: text("name"),
  language: text("language").notNull().default("en"),
  isGuest: boolean("is_guest").notNull().default(true),
  trialStartedAt: timestamp("trial_started_at", {
    withTimezone: true,
  }),
  premiumUntil: timestamp("premium_until", {
    withTimezone: true,
  }),
  createdAt: timestamp("created_at", {
    withTimezone: true,
  }).notNull().defaultNow(),
});

export const sessions = pgTable("sessions", {
  token: text("token").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
  }).notNull(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
  }).notNull().defaultNow(),
});

export const birthDetails = pgTable("birth_details", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  dob: date("dob").notNull(),
  birthTime: text("birth_time").notNull(),
  birthPlace: text("birth_place").notNull(),
  lat: doublePrecision("lat").notNull(),
  lng: doublePrecision("lng").notNull(),
  timeZone: text("time_zone").notNull(),
  consent: boolean("consent").notNull().default(false),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  }).notNull().defaultNow(),
});

export const charts = pgTable("charts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  data: jsonb("data").notNull(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
  }).notNull().defaultNow(),
});

export const conversations = pgTable("conversations", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull().default("New conversation"),
  topic: text("topic").notNull().default("general"),

  // Selected astrologer for this conversation.
  // Nullable so existing conversations remain compatible.
  persona: text("persona"),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  }).notNull().defaultNow(),
});

export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  conversationId: uuid("conversation_id")
    .notNull()
    .references(() => conversations.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  role: text("role").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
  }).notNull().defaultNow(),
});

export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  orderId: text("order_id").notNull().unique(),
  paymentId: text("payment_id"),
  amountPaise: integer("amount_paise").notNull(),
  currency: text("currency").notNull().default("INR"),
  status: text("status").notNull().default("created"),
  createdAt: timestamp("created_at", {
    withTimezone: true,
  }).notNull().defaultNow(),
  paidAt: timestamp("paid_at", {
    withTimezone: true,
  }),
});

export const webhookEvents = pgTable("webhook_events", {
  eventId: text("event_id").primaryKey(),
  processedAt: timestamp("processed_at", {
    withTimezone: true,
  }).notNull().defaultNow(),
});

export const remedies = pgTable("remedies", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  category: text("category").notNull().default("general"),
  completedDates: jsonb("completed_dates")
    .notNull()
    .$type<string[]>()
    .default([]),
  createdAt: timestamp("created_at", {
    withTimezone: true,
  }).notNull().defaultNow(),
});

export const palmReadings = pgTable("palm_readings", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  interpretation: text("interpretation").notNull(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
  }).notNull().defaultNow(),
});

export const aiResponseCache = pgTable(
  "ai_response_cache",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    questionKey: text("question_key").notNull().unique(),
    originalQuestion: text("original_question").notNull(),
    aiAnswer: text("ai_answer").notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
    }).notNull().defaultNow(),
  },
  (table) => [
    index("question_key_idx").on(table.questionKey),
  ],
);

export const astrologyKnowledgeBase = pgTable(
  "astrology_knowledge_base",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    category: text("category").notNull(),
    searchKey: text("search_key").notNull().unique(),
    title: text("title").notNull(),
    content: text("content").notNull(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    }).notNull().defaultNow(),
  },
  (table) => [
    index("search_key_idx").on(table.searchKey),
  ],
);

export const supportTickets = pgTable("support_tickets", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, {
    onDelete: "set null",
  }),
  email: text("email"),
  category: text("category").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: text("status").notNull().default("open"),
  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
});

// ==========================================
// NEW TABLE: ASTROLOGER REVIEWS (HUMAN-LIKE)
// ==========================================
export const astrologerReviews = pgTable(
  "astrologer_reviews",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    
    // यह फ़ील्ड conversations.persona (जैसे: "Gita", "Acharya Kriti") से जुड़ेगा
    persona: text("persona").notNull(),
    
    // यूज़र द्वारा सबमिट होने पर या मार्केटिंग बोट के लिए नाम
    reviewerName: text("reviewer_name").notNull(),
    
    // स्टार रेटिंग (1 से 5)
    stars: integer("stars").notNull().default(5),
    
    // यूज़र का वास्तविक या मार्केटिंग कमेंट टेक्स्ट
    comment: text("comment").notNull(),
    
    // कितने अन्य लोगों को यह रिव्यू काम का लगा (Real human engagement counter)
    helpfulCount: integer("helpful_count").notNull().default(0),
    
    // मार्केटिंग सेफ्टी के लिए: केवल स्वीकृत रिव्यूज ही फ्रंटएंड पर दिखेंगे
    isApproved: boolean("is_approved").notNull().default(true),
    
    createdAt: timestamp("created_at", {
      withTimezone: true,
    }).notNull().defaultNow(),
  },
  (table) => [
    index("persona_idx").on(table.persona),
    index("is_approved_idx").on(table.isApproved),
  ],
);
