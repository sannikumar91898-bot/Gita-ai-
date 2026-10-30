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
  language: text("language").notNull().default("en"), // en, hi, hinglish
  isGuest: boolean("is_guest").notNull().default(true),
  trialStartedAt: timestamp("trial_started_at", { withTimezone: true }),
  premiumUntil: timestamp("premium_until", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const sessions = pgTable("sessions", {
  token: text("token").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
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
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const charts = pgTable("charts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  data: jsonb("data").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const conversations = pgTable("conversations", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull().default("New conversation"),
  topic: text("topic").notNull().default("general"),
  persona: text("persona").notNull().default("Gita"), // Gita, Acharya Kriti, Dr. Devaki Shastri, Gargi Maa
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("conv_user_idx").on(table.userId),
]);

export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  conversationId: uuid("conversation_id")
    .notNull()
    .references(() => conversations.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  role: text("role").notNull(), // user, assistant, system
  content: text("content").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("msg_conv_idx").on(table.conversationId),
]);

export const remedies = pgTable("remedies", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  category: text("category").notNull().default("general"),
  completedDates: jsonb("completed_dates").notNull().$type<string[]>().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("remedy_user_idx").on(table.userId),
]);

export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  orderId: text("order_id").notNull().unique(),
  paymentId: text("payment_id"),
  amountPaise: integer("amount_paise").notNull(),
  currency: text("currency").notNull().default("INR"),
  status: text("status").notNull().default("created"), // created, paid, failed
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  paidAt: timestamp("paid_at", { withTimezone: true }),
}, (table) => [
  index("payment_user_idx").on(table.userId),
  index("payment_order_idx").on(table.orderId),
]);

export const webhookEvents = pgTable("webhook_events", {
  eventId: text("event_id").primaryKey(),
  processedAt: timestamp("processed_at", { withTimezone: true }).notNull().defaultNow(),
});

export const astrologerReviews = pgTable("astrologer_reviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  persona: text("persona").notNull(),
  reviewerName: text("reviewer_name").notNull(),
  stars: integer("stars").notNull().default(5), // 1 से 5 स्टार रेटिंग
  comment: text("comment").notNull(),
  helpfulCount: integer("helpful_count").notNull().default(0),
  isApproved: boolean("is_approved").notNull().default(false), // मार्केटिंग सेफ्टी: डिफ़ॉल्ट रूप से फ़ाल्स (Moderated)
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("persona_idx").on(table.persona),
  index("is_approved_idx").on(table.isApproved),
]);
