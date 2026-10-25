import React from 'react';

export default function RemediesPage() {
  return (
    <div className="min-h-screen bg-[#0f081d] text-white p-6 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-purple-400 mb-4">✨ वैदिक उपाय (Astrological Remedies)</h1>
      <p className="text-gray-300 text-center max-w-md">
        ग्रह दोषों को शांत करने, बाधाओं को दूर करने के लिए विशेष मंत्र, दान और सरल दैनिक ज्योतिषीय उपाय।
      </p>
      <div className="mt-8 p-6 bg-purple-900/20 border border-purple-500/30 rounded-xl text-center">
        <p className="text-amber-400 font-semibold">उपायों की सूची तैयार की जा रही है...</p>
      </div>
    </div>
  );
}
