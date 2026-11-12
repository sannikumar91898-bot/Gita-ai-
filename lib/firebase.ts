// lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  GithubAuthProvider, 
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

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

// 🔥 TypeScript Window Interface (Global Verifier ke liye)
declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier | undefined;
  }
}

export function getFirebaseError(lang: string, code: string): string {
  const dict: Record<string, Record<string, string>> = {
    hi: {
      "auth/popup-closed-by-user": "लॉगिन विंडो बंद हो गई। कृपया पुनः प्रयास करें।",
      "auth/network-request-failed": "इंटरनेट कनेक्शन कमजोर है। कृपया चेक करें।",
      "auth/too-many-requests": "बहुत अधिक प्रयास। कृपया कुछ देर बाद प्रयास करें।",
      "auth/invalid-phone-number": "गलत फोन नंबर। कृपया देश कोड (+91) के साथ डालें।",
      "auth/invalid-verification-code": "गलत OTP। कृपया सही कोड डालें।",
      "auth/invalid-app-credential": "सुरक्षा जाँच (CAPTCHA) विफल रही। कृपया Chrome ब्राउज़र में खोलें या पेज रिफ्रेश करें।",
      "default": "लॉगिन में समस्या आई। कृपया दोबारा प्रयास करें।"
    },
    hinglish: {
      "auth/popup-closed-by-user": "Login window band ho gayi. Kripya phir se try karein.",
      "auth/network-request-failed": "Internet connection kamzor hai. Kripya check karein.",
      "auth/too-many-requests": "Bahut zyada attempts. Kripya thodi der baad try karein.",
      "auth/invalid-phone-number": "Galat phone number. Kripya country code (+91) ke sath daalein.",
      "auth/invalid-verification-code": "Galat OTP. Kripya sahi code daalein.",
      "auth/invalid-app-credential": "Security check (CAPTCHA) fail hua. Kripya Chrome browser me kholein ya page refresh karein.",
      "default": "Login me dikkat aayi. Kripya dobara try karein."
    },
    en: {
      "auth/popup-closed-by-user": "Login window closed. Please try again.",
      "auth/network-request-failed": "Weak internet connection. Please check.",
      "auth/too-many-requests": "Too many attempts. Please try again later.",
      "auth/invalid-phone-number": "Invalid phone number. Please include country code.",
      "auth/invalid-verification-code": "Invalid OTP. Please enter the correct code.",
      "auth/invalid-app-credential": "Security check failed. Please open in Chrome browser or refresh.",
      "default": "Login failed. Please try again."
    },
    te: { "default": "లాగిన్‌లో సమస్య ఉంది. దయచేసి మళ్లీ ప్రయత్నించండి.", "auth/invalid-app-credential": "భద్రతా తనిఖీ విఫలమైంది. Chrome బ్రౌజర్‌లో తెరవండి." },
    ta: { "default": "உள்நுழைவில் சிக்கல். மீண்டும் முயற்சிக்கவும்.", "auth/invalid-app-credential": "பாதுகாப்பு சரிபார்ப்பு தோல்வியடைந்தது. Chrome இல் திறக்கவும்." },
    kn: { "default": "ಲಾಗಿನ್‌ನಲ್ಲಿ ಸಮಸ್ಯೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.", "auth/invalid-app-credential": "ಭದ್ರತಾ ಪರಿಶೀಲನೆ ವಿಫಲವಾಗಿದೆ. Chrome ನಲ್ಲಿ ತೆರೆಯಿರಿ." },
    bn: { "default": "লগইনে সমস্যা হয়েছে। আবার চেষ্টা করুন।", "auth/invalid-app-credential": "নিরাপত্তা যাচাই ব্যর্থ। Chrome এ খুলুন।" },
    mr: { "default": "लॉगिनमध्ये समस्या आली. कृपया पुन्हा प्रयत्न करा.", "auth/invalid-app-credential": "सुरक्षा तपासणी अयशस्वी. Chrome मध्ये उघडा." },
    gu: { "default": "લોગિનમાં સમસ્યા. ફરી પ્રયાસ કરો.", "auth/invalid-app-credential": "સુરક્ષા ચકાસણી નિષ્ફળ. Chrome માં ખોલો." },
    ml: { "default": "ലോഗിൻ ചെയ്യുന്നതിൽ പ്രശ്നമുണ്ട്. വീണ്ടും ശ്രമിക്കുക.", "auth/invalid-app-credential": "സുരക്ഷാ പരിശോധന പരാജയപ്പെട്ടു. Chrome ൽ തുറക്കുക." }
  };
  const userDict = dict[lang || "hi"] || dict["en"];
  return userDict[code] || userDict["default"];
}

export const loginWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const result = await signInWithPopup(auth, provider);
    return { user: result.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.code };
  }
};

export const loginWithGithub = async () => {
  try {
    const provider = new GithubAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return { user: result.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.code };
  }
};

// 🔥 FIX: Proper reCAPTCHA Setup & Cleanup (No innerHTML crash)
export const setupRecaptcha = (containerId: string = "recaptcha-container") => {
  if (typeof window === "undefined") return null;
  
  try {
    // 1. Cleanup old verifier properly
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
      window.recaptchaVerifier = undefined;
    }

    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`reCAPTCHA container (${containerId}) not found.`);
      return null;
    }

    // 2. Create new verifier and attach to window (Survives React re-renders)
    window.recaptchaVerifier = new RecaptchaVerifier(auth, container, {
      size: "invisible",
      callback: () => {
        console.log("reCAPTCHA solved successfully");
      },
      'expired-callback': () => {
        console.warn("reCAPTCHA expired. Cleaning up.");
        if (window.recaptchaVerifier) {
          window.recaptchaVerifier.clear();
          window.recaptchaVerifier = undefined;
        }
      }
    });
    
    return window.recaptchaVerifier;
  } catch (error) {
    console.error("Recaptcha Setup Error:", error);
    return null;
  }
};

export const sendPhoneOTP = async (phoneNumber: string, appVerifier: RecaptchaVerifier): Promise<{ result: ConfirmationResult | null; error: string | null }> => {
  try {
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    return { result: confirmationResult, error: null };
  } catch (error: any) {
    console.error("Phone OTP Error:", error.code);
    return { result: null, error: error.code };
  }
};

export const firebaseLogout = async () => {
  try {
    await firebaseSignOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false };
  }
};

export { auth, app };