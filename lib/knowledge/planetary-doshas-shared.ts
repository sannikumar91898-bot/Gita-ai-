
import type {
  DoshaLocalizedText,
} from "./planetary-doshas.types";

export const DOSHA_DISCLAIMER: DoshaLocalizedText = {
  hi: "यह पारंपरिक ज्योतिषीय जानकारी है, निश्चित वैज्ञानिक भविष्यवाणी नहीं। किसी दोष के आधार पर अपने जीवन, विवाह, स्वास्थ्य या करियर को लेकर डरें नहीं। कोई महँगा उपाय करना अनिवार्य नहीं है।",
  hinglish:
    "Yeh traditional astrology ki information hai, guaranteed scientific prediction nahi. Kisi dosh ke basis par apni life, marriage, health ya career ko lekar darein nahi. Koi expensive remedy karna compulsory nahi hai.",
  en: "This is traditional astrological information, not a scientifically established prediction. Do not fear for your life, marriage, health or career because of a dosha. No expensive remedy is compulsory.",
};

export const DOSHA_STYLE = {
  voice: "warm_female" as const,
  tone: "gentle" as const,
  empathy_required: true,
  avoid_judgment: true,
  avoid_fear_based_predictions: true,
  encourage_user_autonomy: true,
};
