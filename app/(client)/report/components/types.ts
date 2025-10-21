export interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  isGenerating?: boolean;
}

export interface SearchResult {
  title: string;
  link: string;
  snippet: string;
}
