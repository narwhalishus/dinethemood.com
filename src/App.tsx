import { useState } from "react";
import { Header } from "./components/Header";
import { SearchBar } from "./components/SearchBar";
import { diningMoodApi } from "@dinethemoodapp/sdk";
import { client } from "./foundryClient";

interface Restaurant {
  name: string;
  categories: string[];
  vibe: string;
}

export default function App() {
  const [results, setResults] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSearch(query: string) {
    setLoading(true);
    try {
      const resp = await client(diningMoodApi).executeFunction({
        userDescription: query
      });

      setResults(
        Array.isArray(resp)
          ? resp.map((item) => ({
          name: item.name || "Unknown Restaurant",
          categories: item.categories.split(", ") || [],
          vibe: item.vibeLlm || "Unknown Vibe"
        }))
          : []
      );
    } catch (e) {
      console.error("Search error:", e);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Header />
      <SearchBar onSearch={handleSearch} />

      {loading && (
        <p className="results" style={{ textAlign: "center" }}>
          Loading…
        </p>
      )}

      <div className="results">
        {results.map((r) => (
          <div key={r.name} className="card">
            <h2>{r.name}</h2>
            <div className="categories">{r.categories.join(", ")}</div>
            <div className="reason">“{r.vibe}”</div>
          </div>
        ))}
      </div>
    </div>
  );
}