'use client';

import { useState } from 'react';
import api from '@/lib/api';
import { Button } from './button';

export default function RecommendForm({ setResult }) {
  const [form, setForm] = useState({
    useCase: '',
    seoFocused: false,
    performanceFocused: false,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/techstack/recommend', form);
      setResult(res.data.recommendation);
    } catch (error) {
      console.error('Error getting recommendation:', error);
      alert('Failed to get recommendation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="bg-white border border-gray-300 rounded-2xl shadow-2xl p-8 space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-900">
            Describe your use case
          </label>
          <textarea
            name="useCase"
            placeholder="Tell us about your project requirements, goals, and constraints..."
            onChange={handleChange}
            value={form.useCase}
            required
            className="w-full h-32 bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="seoFocused"
              name="seoFocused"
              checked={form.seoFocused}
              onChange={handleChange}
              className="w-4 h-4 rounded border-gray-300 bg-white text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="seoFocused" className="text-sm text-gray-900 select-none">
              SEO Focused
            </label>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="performanceFocused"
              name="performanceFocused"
              checked={form.performanceFocused}
              onChange={handleChange}
              className="w-4 h-4 rounded border-gray-300 bg-white text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="performanceFocused" className="text-sm text-gray-900 select-none">
              Performance Focused
            </label>
          </div>
        </div>

        <Button
          type="submit"
          variant="glass"
          className="w-full"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin" />
              <span>Analyzing...</span>
            </div>
          ) : (
            'Get Recommendation'
          )}
        </Button>
      </div>
    </form>
  );
}
