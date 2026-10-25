import React from 'react';

export default function FamilyPage() {
  return (
    <div className="min-h-screen bg-[#0f081d] text-white p-6 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-purple-400 mb-4">🏠 परिवार और घर (Family & Home)</h1>
      <p className="text-gray-300 text-center max-w-md">
        आपके पारिवारिक जीवन, सुख-शांति और घरेलू संबंधों पर ग्रहों की स्थिति का क्या प्रभाव है? जानिए यहाँ।
      </p>
      <div className="mt-8 p-6 bg-purple-900/20 border border-purple-500/30 rounded-xl text-center">
        <p className="text-amber-400 font-semibold">पारिवारिक योग का विश्लेषण हो रहा है...</p>
      </div>
    </div>
  );
}
