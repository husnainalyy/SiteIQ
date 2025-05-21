'use client';

import { useState } from 'react';
import api from '@/lib/api';
import { Button } from './button';

export default function ImproveForm({ onSuccess }) {
  const [form, setForm] = useState({
    websiteUrl: '',
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
      const res = await api.post('/techstack/improve', form);
      onSuccess(res.data);
    } catch (err) {
      alert('Improvement failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="bg-white border border-gray-300 rounded-2xl shadow-2xl p-8 space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Website URL
          </label>
          <input
            type="url"
            name="websiteUrl"
            placeholder="https://example.com"
            value={form.websiteUrl}
            onChange={handleChange}
            required
            className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Use Case
          </label>
          <textarea
            name="useCase"
            placeholder="Describe your current setup and what you'd like to improve..."
            value={form.useCase}
            onChange={handleChange}
            required
            className="w-full h-32 bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all resize-none"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="seoFocused"
              name="seoFocused"
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="seoFocused" className="text-sm text-gray-800">
              SEO Focused
            </label>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="performanceFocused"
              name="performanceFocused"
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="performanceFocused" className="text-sm text-gray-800">
              Performance Focused
            </label>
          </div>
        </div>

        <Button
          type="submit"
          variant="glass"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
              <span>Analyzing...</span>
            </div>
          ) : (
            'Get Recommendations'
          )}
        </Button>
      </div>
    </form>
  );
}
