import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Brain } from 'lucide-react';
import logo1 from '../logo1.png';
export default function SearchPage() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/results?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-white">
      <div className="flex-grow flex flex-col items-center justify-center w-full max-w-2xl mx-auto px-4">
        <div className="flex items-center gap-2 mb-8">
          <img src={logo1} alt="Logo" className="w-60 h-50" />
        </div>

        <form onSubmit={handleSearch} className="w-full">
          <div className="relative w-full">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-4 py-3 pr-12 rounded-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              placeholder="Ask anything..."
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>

      <footer className="w-full py-4 text-center text-sm text-gray-600">
        Powered by OpenAI - Beta v1.0.1
      </footer>
    </div>
  );
}
