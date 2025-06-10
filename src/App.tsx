import { useEffect, useState } from "react";
import { Header } from "./components/Header";
import { SearchBar } from "./components/SearchBar";
import { diningMoodApi } from "@dinethemoodapp/sdk";
import { client, handleAuth } from "./foundryClient";

interface Restaurant {
  name: string;
  categories: string[];
  vibe: string;
}

export default function App() {
  const [results, setResults] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hasCode = !!params.get("code");
    const hasToken = !!localStorage.getItem("foundry_token");

    if (!hasToken && !hasCode) {
      handleAuth();
    }
  }, []);

  async function handleSearch(query: string) {
    setLoading(true);
    try {
      const resultSet = await client(diningMoodApi).executeFunction({
        userDescription: query
      });
      const page = await resultSet.fetchPage({ $pageSize: 10 });
      setResults(
        page.data.map(b => ({
          name: b.name ?? "Unknown Restaurant",
          categories:
            typeof b.categories === "string"
              ? b.categories.split(", ")
              : Array.isArray(b.categories)
              ? b.categories
              : [],
          vibe: b.vibeLlm ?? "Unknown Vibe"
        }))
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
        {results.map(r => (
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
