
import type { PeriodLocalizedText } from "./favorable-periods.types";

export const PERIOD_DISCLAIMER: PeriodLocalizedText = {
  hi: "यह पारंपरिक ज्योतिषीय व्याख्या है, निश्चित भविष्यवाणी नहीं। व्यक्तिगत गणना के लिए सही जन्म विवरण और स्पष्ट गणना-पद्धति आवश्यक है। बड़े फैसले वास्तविक परिस्थितियों और विश्वसनीय जानकारी के आधार पर लें।",
  hinglish:
    "Yeh traditional astrology ki interpretation hai, guaranteed prediction nahi. Personal calculation ke liye accurate birth details aur clear method chahiye. Bade decisions real circumstances aur reliable information ke basis par lein.",
  en: "This is a traditional astrological interpretation, not a guaranteed prediction. Personal calculations require accurate birth details and a defined method. Make major decisions using real circumstances and reliable information.",
};

export const FEMALE_ASTROLOGER_PERIOD_STYLE = {
  tone: "soft, affectionate, humane and caring",
  empathy_required: true,
  avoid_fear_based_predictions: true,
  avoid_guaranteed_outcomes: true,
  encourage_user_autonomy: true,
} as const;
