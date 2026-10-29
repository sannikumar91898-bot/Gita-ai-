import { NextResponse } from 'next/server';

export async function GET() {
  const astrologersData = [
    {
      astrologerName: "Gita",
      title: "वैदिक एवं आध्यात्मिक मार्गदर्शन",
      rating: 4.99,
      totalOrders: "42,150",
      reviews: [
        { id: "g1", name: "Asha K.", stars: 5, timeAgo: "Just now", comment: "thank you ji..will update you ji..very nice talking to you..he guided me well.. 🙏🙏🙏" },
        { id: "g2", name: "Deepak Rawat", stars: 5, timeAgo: "2 hours ago", comment: "Superb experience and realistic predictions, will connect again once I start seeing the changes as advised, but I am confident I will 😊🙏" },
        { id: "g3", name: "Bhavna_92", stars: 5, timeAgo: "Yesterday", comment: "Very straight forward and clear guidance. accuracy and knows what he says. Definitely recommend and looking forward..." },
        { id: "g4", name: "Rohan Verma", stars: 4, timeAgo: "2 days ago", comment: "gita mam ne jo bataya tha wesa hi hua shadi ki baten bilkul accurate thi par thoda wait krna pda.. remedies bht easy hain unki." },
        { id: "g5", name: "Meera_Bisht", stars: 5, timeAgo: "4 days ago", comment: "Highly accurate readings! Unmatched wisdom on this platform. bht calm tareeqe se samjhati hain chijo ko." },
        { id: "g6", name: "Vikram S.", stars: 5, timeAgo: "1 week ago", comment: "bhai sach me kamaal hai jo pareshani chal rhi thi bina bataye mam ne khud hi bol di.. tnx a lot!" },
        { id: "g7", name: "Priya Neogi", stars: 5, timeAgo: "1 week ago", comment: "Gita ji handles messy situations so well. Meri health issues pe jo bola tha 100% real tha." },
        { id: "g8", name: "Rahul_K", stars: 4, timeAgo: "2 weeks ago", comment: "Acha experience tha. Thoda phone line busy thi pehle par connect hone k baad sab detail me bataya mam ne. Satisfied." },
        { id: "g9", name: "Sapna Rawal", stars: 5, timeAgo: "3 weeks ago", comment: "Gita ji real gems hain is app par! Unki baten sunkar hi adha depression door ho jata h mirror ki trh sach bolti hain." },
        { id: "g10", name: "Alok Dwivedi", stars: 5, timeAgo: "1 month ago", comment: "Very deep spiritual knowledge. Genuinely impressed by her calculations." }
      ]
    },
    {
      astrologerName: "Acharya Kriti",
      title: "केपी एवं आधुनिक ज्योतिष विशेषज्ञ",
      rating: 4.98,
      totalOrders: "31,890",
      reviews: [
        { id: "k1", name: "Ritika Sharma", stars: 5, timeAgo: "15 mins ago", comment: "He is amazing, the way he explains the chart, my goddd!! How wonderful it is, and his predictions are unmatched. Truly a great person inside out." },
        { id: "k2", name: "Latika_Singh", stars: 5, timeAgo: "5 hours ago", comment: "my go to place for any kind of a solution. thank you sir for always being there 🙏😊" },
        { id: "k3", name: "Manish Kumar", stars: 5, timeAgo: "Yesterday", comment: "Very knowledgeable and accurate astrologer. His guidance is clear, precise, and to the point. Truly insightful and highly recommended! 🙏" },
        { id: "k4", name: "Suresh_K", stars: 5, timeAgo: "3 days ago", comment: "आचार्य कृति जी की भविष्यवाणियां शत-प्रतिशत सही साबित हुईं। मेरे व्यापार में जो रुकावट थी वो दूर हो गई।" },
        { id: "k5", name: "Nisha Patel", stars: 4, timeAgo: "5 days ago", comment: "Best astrologer for career guidance. Clean, crisp and honest logic. thoda queue me wait krna pdta h baki query solid solve krte h" },
        { id: "k6", name: "Amit Yadav", stars: 5, timeAgo: "1 week ago", comment: "Bina time waste kiye point to point baat karte hain. Mera promotion kab hoga exect month bataya tha inhone nd wahi hua!!" },
        { id: "k7", name: "divya_sharma", stars: 5, timeAgo: "2 weeks ago", comment: "Kriti sir rocks!! Unka logic bht sahi h blindly trust kr skte ho unki advice pe." },
        { id: "k8", name: "Rakesh Raj", stars: 5, timeAgo: "2 weeks ago", comment: "Govt job preparation k liye bht acha guide kiya. Negative points bhi khul k bataye." },
        { id: "k9", name: "Sonali_77", stars: 4, timeAgo: "3 weeks ago", comment: "Accurate tha chart reading par remedies thodi complicated lagi mujhe karne me par results ache mile bad me." },
        { id: "k10", name: "Jatin Malhotra", stars: 5, timeAgo: "1 month ago", comment: "Super calculations via KP system. Highly recommended for property disputes." }
      ]
    },
    {
      astrologerName: "Dr. Devaki Shastri",
      title: "वरिष्ठ नक्षत्र एवं नाड़ी विशेषज्ञ",
      rating: 4.99,
      totalOrders: "54,200",
      reviews: [
        { id: "d1", name: "Swarna_M", stars: 5, timeAgo: "1 hour ago", comment: "he is exceptional.... i have been in toich with him since last 2 years and he is the best" },
        { id: "d2", name: "Neeru Bala", stars: 5, timeAgo: "Yesterday", comment: "He is very kind and his prediction is accurate.. he always solve my all problems with very easy remedies. His remedies r also eff..." },
        { id: "d3", name: "Aditi Rao", stars: 5, timeAgo: "2 days ago", comment: "Just had 4-5 mins with him but he was very clear in what he says and very straight forward. His guidance really helped me..." },
        { id: "d4", name: "Vikas Hegde", stars: 5, timeAgo: "4 days ago", comment: "डॉ. देवकी जी के पास असीम ज्ञान है। उनके ग्रहों के गोचर का विश्लेषण अद्भुत है। प्रणाम गुरुजी।" },
        { id: "d5", name: "Pooja_99", stars: 5, timeAgo: "1 week ago", comment: "Truly a saviour in desperate times. Job ka bht bada tension solve kr diya inhone.. Thank you doctor saab!" },
        { id: "d6", name: "Anand Chaturvedi", stars: 5, timeAgo: "1 week ago", comment: "Nadi shastra ka aisa gyan maine pehle kahi nahi dekha. Khub khub dhanyawad shastri ji." },
        { id: "d7", name: "Kavita_R", stars: 4, timeAgo: "2 weeks ago", comment: "Prediction bohot powerful thi par call drop ho gyi network issue se. Pr jitni baat hui sir ne dil jeet liya." },
        { id: "d8", name: "Gaurav Joshi", stars: 5, timeAgo: "3 weeks ago", comment: "Kundli ka ek ek dasha bilkul sahi match ho rha tha past life events k sath. Remarkable accuracy." },
        { id: "d9", name: "Megha Singhal", stars: 5, timeAgo: "3 weeks ago", comment: "Unki batayi gemstone remedy se meri health bht jaldi recover hui h. Very compassionate soul." },
        { id: "d10", name: "S. K. Mishra", stars: 5, timeAgo: "1 month ago", comment: "Experience speaks! Doctor saab has immense depth in astrology." }
      ]
    },
    {
      astrologerName: "Gargi Maa",
      title: "टैरो कार्ड एवं ध्यान साधना गुरु",
      rating: 4.97,
      totalOrders: "28,450",
      reviews: [
        { id: "m1", name: "Tejaswini", stars: 5, timeAgo: "45 mins ago", comment: "To me He is the best person available on this platform,completely Reliable,Astonishingly Accurate.." },
        { id: "m2", name: "Swaroop S.", stars: 5, timeAgo: "Yesterday", comment: "my savrook...this one word is enough how knowledgeable he is and how his predictions are precise and true indeed...Sir..." },
        { id: "m3", name: "Anjali Mishra", stars: 5, timeAgo: "3 days ago", comment: "As usual, sir is the best, bang on predictions, very straightforward and exceptional, i have trusted him in the past and whatever he says is true." },
        { id: "m4", name: "Harish_Chandra", stars: 5, timeAgo: "5 days ago", comment: "गार्गी मां का आशीर्वाद मिलते ही मेरे जीवन की सारी बाधाएं समाप्त होने लगीं। मानसिक तनाव एकदम खत्म हो गया।" },
        { id: "m5", name: "Kiran J.", stars: 4, timeAgo: "1 week ago", comment: "Her intuition is top notch. Every word resonates deeply with reality. Remedie thodi lambi h pr asar krti h." },
        { id: "m6", name: "Preeti_Rani", stars: 5, timeAgo: "1 week ago", comment: "Tarot card readings generally general lgti h pr gargi maa ne ekdm clear chije boli relation ko lekar.. eye opening session." },
        { id: "m7", name: "Nitin Saxena", stars: 5, timeAgo: "2 weeks ago", comment: "Maa ka aura hi alag hai unse baat karke hi aadha dukh halka ho jata h. Aura healing techniques are awesome." },
        { id: "m8", name: "sneha_kapoor", stars: 5, timeAgo: "2 weeks ago", comment: "Past aur present k bare me jo bola ek ek baat sach nikli. Future predictions ka wait h but highly positive feel ho rha h." },
        { id: "m9", name: "Rishabh", stars: 4, timeAgo: "3 weeks ago", comment: "Bohot pyari hain maa. Tarot decks k through bohot achi counseling ki life ki confusion hatane me." },
        { id: "m10", name: "Tarun Das", stars: 5, timeAgo: "1 month ago", comment: "Excellent energy scanning. Best for mental peace and clarity." }
      ]
    }
  ];

  return NextResponse.json(astrologersData);
}
