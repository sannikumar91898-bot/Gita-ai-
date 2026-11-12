// lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  GithubAuthProvider, // 🔥 NAYA: GitHub Auth Provider
  signInWithPopup, 
  RecaptchaVerifier, 
  signInWithPhoneNumber,
  signOut as firebaseSignOut,
  type ConfirmationResult
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth
const auth = getAuth(app);

/* -------------------------------------------------------------------------- */
/*                   🔥 PREMIUM BUSINESS & PSYCHOLOGY HOOKS                   */
/* -------------------------------------------------------------------------- */

/**
 * 10 Language Error Translator
 * Psychology: Jab user ko error dikhta hai, toh woh apni language mein ho toh trust badhta hai.
 */
export function getFirebaseError(lang: string, code: string): string {
  const dict: Record<string, Record<string, string>> = {
    hi: {
      "auth/popup-closed-by-user": "लॉगिन विंडो बंद हो गई। कृपया पुनः प्रयास करें।",
      "auth/network-request-failed": "इंटरनेट कनेक्शन कमजोर है। कृपया चेक करें।",
      "auth/too-many-requests": "बहुत अधिक प्रयास। कृपया कुछ देर बाद प्रयास करें।",
      "auth/invalid-phone-number": "गलत फोन नंबर। कृपया देश कोड (+91) के साथ डालें।",
      "auth/invalid-verification-code": "गलत OTP। कृपया सही कोड डालें।",
      "auth/account-exists-with-different-credential": "यह ईमेल किसी अन्य लॉगिन विधि से जुड़ा है।",
      "default": "लॉगिन में समस्या आई। कृपया दोबारा प्रयास करें।"
    },
    hinglish: {
      "auth/popup-closed-by-user": "Login window band ho gayi. Kripya phir se try karein.",
      "auth/network-request-failed": "Internet connection kamzor hai. Kripya check karein.",
      "auth/too-many-requests": "Bahut zyada attempts. Kripya thodi der baad try karein.",
      "auth/invalid-phone-number": "Galat phone number. Kripya country code (+91) ke sath daalein.",
      "auth/invalid-verification-code": "Galat OTP. Kripya sahi code daalein.",
      "auth/account-exists-with-different-credential": "Yeh email kisi aur login method se juda hai.",
      "default": "Login me dikkat aayi. Kripya dobara try karein."
    },
    en: {
      "auth/popup-closed-by-user": "Login window closed. Please try again.",
      "auth/network-request-failed": "Weak internet connection. Please check.",
      "auth/too-many-requests": "Too many attempts. Please try again later.",
      "auth/invalid-phone-number": "Invalid phone number. Please include country code.",
      "auth/invalid-verification-code": "Invalid OTP. Please enter the correct code.",
      "auth/account-exists-with-different-credential": "This email is linked to another login method.",
      "default": "Login failed. Please try again."
    },
    te: {
      "default": "లాగిన్‌లో సమస్య ఉంది. దయచేసి మళ్లీ ప్రయత్నించండి.",
      "auth/network-request-failed": "ఇంటర్నెట్ కనెక్షన్ బలహీనంగా ఉంది.",
      "auth/too-many-requests": "చాలా ప్రయత్నాలు. కొంత సేపటి తర్వాత ప్రయత్నించండి.",
    },
    ta: {
      "default": "உள்நுழைவில் சிக்கல். மீண்டும் முயற்சிக்கவும்.",
      "auth/network-request-failed": "இணைய இணைப்பு பலவீனமாக உள்ளது.",
      "auth/too-many-requests": "அதிக முயற்சிகள். சிறிது நேரம் கழித்து முயற்சிக்கவும்.",
    },
    kn: {
      "default": "ಲಾಗಿನ್‌ನಲ್ಲಿ ಸಮಸ್ಯೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
      "auth/network-request-failed": "ಇಂಟರ್ನೆಟ್ ಸಂಪರ್ಕ ದುರ್ಬಲವಾಗಿದೆ.",
      "auth/too-many-requests": "ಹೆಚ್ಚು ಪ್ರಯತ್ನಗಳು. ಸ್ವಲ್ಪ ಸಮಯದ ನಂತರ ಪ್ರಯತ್ನಿಸಿ.",
    },
    bn: {
      "default": "লগইনে সমস্যা হয়েছে। আবার চেষ্টা করুন।",
      "auth/network-request-failed": "ইন্টারনেট সংযোগ দুর্বল।",
      "auth/too-many-requests": "অনেক বেশি চেষ্টা। কিছুক্ষণ পর আবার চেষ্টা করুন।",
    },
    mr: {
      "default": "लॉगिनमध्ये समस्या आली. कृपया पुन्हा प्रयत्न करा.",
      "auth/network-request-failed": "इंटरनेट कनेक्शन कमजोर आहे.",
      "auth/too-many-requests": "खूप जास्त प्रयत्न. कृपया थोड्या वेळाने प्रयत्न करा.",
    },
    gu: {
      "default": "લોગિનમાં સમસ્યા. ફરી પ્રયાસ કરો.",
      "auth/network-request-failed": "ઇન્ટરનેટ કનેક્શન નબળું છે.",
      "auth/too-many-requests": "ઘણા બધા પ્રયાસો. થોડા સમય પછી પ્રયાસ કરો.",
    },
    ml: {
      "default": "ലോഗിൻ ചെയ്യുന്നതിൽ പ്രശ്നമുണ്ട്. വീണ്ടും ശ്രമിക്കുക.",
      "auth/network-request-failed": "ഇന്റർനെറ്റ് കണക്ഷൻ ദുർബലമാണ്.",
      "auth/too-many-requests": "കൂടുതൽ ശ്രമങ്ങൾ. കുറച്ച് കഴിഞ്ഞ് വീണ്ടും ശ്രമിക്കുക.",
    }
  };
  
  const userDict = dict[lang || "hi"] || dict["en"];
  return userDict[code] || userDict["default"];
}

/* -------------------------------------------------------------------------- */
/*                              AUTH FUNCTIONS                                */
/* -------------------------------------------------------------------------- */

/**
 * Google Login
 */
export const loginWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const result = await signInWithPopup(auth, provider);
    return { user: result.user, error: null };
  } catch (error: any) {
    console.error("Google Login Error:", error.code);
    return { user: null, error: error.code };
  }
};

/**
 * 🔥 NAYA: GitHub Login
 * Business: Tech-savvy users ke liye premium one-click option.
 */
export const loginWithGithub = async () => {
  try {
    const provider = new GithubAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return { user: result.user, error: null };
  } catch (error: any) {
    console.error("GitHub Login Error:", error.code);
    return { user: null, error: error.code };
  }
};

/**
 * 🔥 FIXED: Setup Invisible reCAPTCHA for Phone OTP
 * Error was happening because we were passing the button ID instead of the container.
 */
export const setupRecaptcha = (containerId: string = "recaptcha-container") => {
  if (typeof window === "undefined") return null;
  
  try {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`reCAPTCHA container (${containerId}) not found in DOM.`);
      return null;
    }

    // Clear container if it already has a child to prevent "already rendered" error
    container.innerHTML = "";

    const verifier = new RecaptchaVerifier(auth, container, {
      size: "invisible",
      callback: () => {
        // reCAPTCHA solved
      },
      'expired-callback': () => {
        // Response expired
      }
    });
    return verifier;
  } catch (error) {
    console.error("Recaptcha Setup Error:", error);
    return null;
  }
};

/**
 * Send Phone OTP
 */
export const sendPhoneOTP = async (phoneNumber: string, appVerifier: RecaptchaVerifier): Promise<{ result: ConfirmationResult | null; error: string | null }> => {
  try {
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    return { result: confirmationResult, error: null };
  } catch (error: any) {
    console.error("Phone OTP Error:", error.code);
    return { result: null, error: error.code };
  }
};

/**
 * Firebase Logout
 */
export const firebaseLogout = async () => {
  try {
    await firebaseSignOut(auth);
    return { success: true };
  } catch (error) {
    console.error("Firebase Logout Error:", error);
    return { success: false };
  }
};

export { auth, app };