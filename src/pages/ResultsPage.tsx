import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Loader2,
  LogIn,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../Context/AuthContext';
import { searchWithAI, AiSearchResponse } from '../services/openai';
import type { SearchResult } from '../types';
import logo from '../logo.png';

const RESULTS_PER_PAGE = 10;
const MAX_FREE_RESULTS = 3;

export default function ResultsPage() {
  const { user, loadingAuth } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Query iniziale
  const initialQuery = searchParams.get('q') || '';
  // Pagina iniziale
  const initialPage = parseInt(searchParams.get('page') || '1', 10);

  // Stato per l'input di ricerca
  const [localQuery, setLocalQuery] = useState(initialQuery);

  // Introduction e risultati (sempre array)
  const [introduction, setIntroduction] = useState('');
  const [allResults, setAllResults] = useState<SearchResult[]>([]);

  // Loading/error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isRegistered = !!user;

  // Per la transizione "fade-in" dell'introduzione
  const [showIntro, setShowIntro] = useState(false);

  // Gestione del form di ricerca
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localQuery.trim()) {
      navigate(`/results?q=${encodeURIComponent(localQuery)}&page=1`);
    }
  };

  useEffect(() => {
    // Se non c'è una query, resettiamo introduzione e risultati
    if (!initialQuery) {
      setAllResults([]);
      setIntroduction('');
      return;
    }

    if (loadingAuth) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setShowIntro(false); // nascondiamo la intro finché non arriva la nuova

      try {
        const resultsToFetch = isRegistered ? 50 : MAX_FREE_RESULTS;
        const data: AiSearchResponse = await searchWithAI(
          initialQuery,
          resultsToFetch
        );

        // Verifichiamo che data esista e abbia la forma prevista
        if (data) {
          // introduzione
          setIntroduction(data.introduction || '');

          // risultati: se non è un array, fallback a []
          if (Array.isArray(data.results)) {
            setAllResults(data.results);
          } else {
            setAllResults([]);
          }
        } else {
          // In caso di risposta nulla o form errato
          setIntroduction('');
          setAllResults([]);
        }

        // Forziamo il "fade-in" dell'introduzione
        setTimeout(() => setShowIntro(true), 100);
      } catch (err) {
        console.error('Errore fetchData:', err);
        setError('Failed to fetch results. Please try again.');
        setIntroduction('');
        setAllResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [initialQuery, isRegistered, loadingAuth]);

  // Se l'utente non è registrato, mostriamo solo 3 risultati
  const visibleResults = isRegistered
    ? allResults
    : allResults.slice(0, MAX_FREE_RESULTS);

  // Calcolo pagine totali
  const totalPages = Math.ceil(visibleResults.length / RESULTS_PER_PAGE);
  // Pagina corrente non deve superare totalPages
  const currentPage = Math.min(initialPage, totalPages === 0 ? 1 : totalPages);

  // Indici per slicing
  const startIndex = (currentPage - 1) * RESULTS_PER_PAGE;
  const endIndex = startIndex + RESULTS_PER_PAGE;
  // Risultati da mostrare in questa pagina
  const pageResults = visibleResults.slice(startIndex, endIndex);

  // Cambio pagina
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setSearchParams((prev) => {
        prev.set('page', newPage.toString());
        return prev;
      });
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* HEADER */}
      <header className="border-b sticky top-0 bg-white z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="Logo" className="w-16 h-16" />
            </Link>

            {/* Barra di ricerca */}
            <form className="flex-grow max-w-2xl" onSubmit={handleSubmit}>
              <div className="relative">
                <input
                  type="text"
                  value={localQuery}
                  onChange={(e) => setLocalQuery(e.target.value)}
                  className="w-full px-4 py-2 pr-12 rounded-full border border-gray-300 
                             focus:border-blue-500 focus:ring-1 focus:ring-blue-200
                             outline-none text-sm"
                  placeholder="Ask anything..."
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 
                             text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Bottone login/signup se non registrato */}
            {!isRegistered && (
              <button
                onClick={() => navigate('/login')}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium
                           text-white bg-blue-600 rounded-full
                           hover:bg-blue-700 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                Sign up for more results
              </button>
            )}
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Se stiamo caricando auth o i risultati */}
        {loadingAuth || loading ? (
          <div className="flex items-center gap-2 text-gray-600">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Searching...</span>
          </div>
        ) : error ? (
          // Errore generico
          <div className="text-red-600">{error}</div>
        ) : (
          <>
            {/* INTRODUZIONE con transizione "fade-in" */}
            {introduction && (
              <div
                className={`
                  text-gray-800 mb-6 
                  transition-all duration-700 ease-out
                  ${showIntro ? 'opacity-100' : 'opacity-0'}
                `}
              >
                {introduction}
              </div>
            )}

            {/* Se ci sono risultati, messaggio personalizzato */}
            {pageResults.length > 0 ? (
              <div className="mb-4 text-sm text-gray-600">
                About {visibleResults.length} results
              </div>
            ) : (
              // Altrimenti, se non ci sono proprio risultati
              <div className="mb-4 text-sm text-gray-600">
                Nessun risultato trovato per <strong>{initialQuery}</strong>.
              </div>
            )}

            {/* LISTA RISULTATI */}
            <div className="space-y-8">
              {pageResults.map((result, index) => (
                <div
                  key={index}
                  className="max-w-2xl transition-all duration-500 hover:scale-[1.01]"
                >
                  <a
                    href={result.url}
                    className="block group"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="text-sm text-gray-600 mb-1">
                      {result.url}
                    </div>
                    <h2 className="text-xl text-blue-600 group-hover:underline mb-2">
                      {result.title}
                    </h2>
                    <p className="text-sm text-gray-700">{result.snippet}</p>
                  </a>
                </div>
              ))}
            </div>

            {/* Invito a registrarsi se necessario */}
            {!isRegistered && visibleResults.length === MAX_FREE_RESULTS && (
              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-center gap-3 text-blue-800">
                  <LogIn className="w-5 h-5" />
                  <p className="font-medium">
                    Sign up to see more than {MAX_FREE_RESULTS} results!
                  </p>
                </div>
              </div>
            )}

            {/* Paginazione (se > 1 pagina) */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-full hover:bg-gray-100
                             disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(
                      (page) =>
                        page === 1 ||
                        page === totalPages ||
                        Math.abs(page - currentPage) <= 2
                    )
                    .map((page, i, arr) => (
                      <React.Fragment key={page}>
                        {i > 0 && arr[i - 1] !== page - 1 && (
                          <span className="px-2 text-gray-400">...</span>
                        )}
                        <button
                          onClick={() => handlePageChange(page)}
                          className={`w-8 h-8 rounded-full ${
                            currentPage === page
                              ? 'bg-blue-600 text-white'
                              : 'hover:bg-gray-100'
                          }`}
                        >
                          {page}
                        </button>
                      </React.Fragment>
                    ))}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-full hover:bg-gray-100
                             disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
