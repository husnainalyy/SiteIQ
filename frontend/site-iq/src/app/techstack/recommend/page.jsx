'use client';

import { useState } from 'react';
import RecommendForm from '@/components/ui/RecommendForm';
import RecommendationResult from '@/components/ui/RecommendationResult';

export default function RecommendPage() {
  const [result, setResult] = useState(null);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 text-gray-900">
      <main className="flex-1 p-10 flex justify-center items-start overflow-y-auto">
        <div className="w-full max-w-3xl space-y-8 bg-white/90 rounded-2xl shadow-2xl border border-gray-200 p-10">
          <h1 className="text-4xl font-extrabold text-indigo-800 drop-shadow mb-2">
            Get Your Recommendation
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            Enter your requirements below to receive{' '}
            <span className="font-semibold text-purple-700">AI-powered suggestions</span>.
          </p>

          <div className="bg-indigo-50 rounded-xl border border-indigo-200 p-6 shadow mb-6">
            <RecommendForm setResult={setResult} />
          </div>

          {result && (
            <div className="bg-green-50 rounded-xl border border-green-200 p-6 shadow">
              <RecommendationResult result={result} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
