function requiresBirthDetails(message: string): boolean {
  return /कुंडली|जन्मपत्री|राशिफल|मेरी राशि|मेरी शादी|शादी कब|विवाह कब|मेरा भविष्य|मेरे भविष्य|मेरी किस्मत|मेरी लव लाइफ|मेरा करियर|भविष्यवाणी|kundli|janam kundli|horoscope|my future|my marriage|when will i marry|my love life|my career|personal prediction|birth chart|meri shadi|mera bhavishya|meri kismat/i.test(
    message
  );
}