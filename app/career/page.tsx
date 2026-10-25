import React from 'react';

export default function CareerPage() {
  return (
    <div className="min-h-screen bg-[#0f081d] text-white p-6 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-purple-400 mb-4">🔮 करियर मार्गदर्शन (Career Guidance)</h1>
      <p className="text-gray-300 text-center max-w-md">
        आपकी कुंडली के सितारों के अनुसार आपके करियर, नौकरी और व्यवसाय से जुड़ी सटीक भविष्यवाणियां यहाँ दिखाई देंगी।
      </p>
      <div className="mt-8 p-6 bg-purple-900/20 border border-purple-500/30 rounded-xl text-center">
        <p className="text-amber-400 font-semibold">करियर गणना की जा रही है...</p>
      </div>
    </div>
  );
}
