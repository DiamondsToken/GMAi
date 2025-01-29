export interface SearchResult {
  title: string;
  snippet: string;
  url: string;
}

export interface User {
  isRegistered: boolean;
}

export interface SearchState {
  results: SearchResult[];
  totalResults: number;
  currentPage: number;
  loading: boolean;
  error: string | null;
}