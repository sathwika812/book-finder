import React, { useState } from "react";

function BookCard({ book }) {
  return (
    <div className="bg-white shadow-md p-4 rounded-xl w-64 transition hover:scale-105 hover:shadow-lg">
      {book.cover_i ? (
        <img
          src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
          alt={book.title}
          className="h-48 w-full object-cover rounded-md"
        />
      ) : (
        <div className="h-48 w-full bg-gray-200 flex items-center justify-center text-gray-500 rounded-md">
          No Image
        </div>
      )}
      <h3 className="font-semibold mt-3 text-gray-800">{book.title}</h3>
      <p className="text-sm text-gray-600 mt-1">
        {book.author_name ? book.author_name.join(", ") : "Unknown Author"}
      </p>
      <p className="text-xs text-gray-400 mt-1">
        {book.first_publish_year || ""}
      </p>
    </div>
  );
}

export default function App() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchBooks = async () => {
    const title = query.trim();
    if (!title) {
      setError("Please enter a book title.");
      return;
    }
    setError("");
    setBooks([]);
    setLoading(true);

    try {
      const res = await fetch(
        `https://openlibrary.org/search.json?title=${encodeURIComponent(title)}`
      );
      if (!res.ok) throw new Error("Network error");
      const data = await res.json();

      if (!data.docs || data.docs.length === 0) {
        setError("No books found!");
      } else {
        setBooks(data.docs.slice(0, 12)); // top 12 results
      }
    } catch (err) {
      setError("Error fetching books. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") fetchBooks();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold mb-6 text-blue-700">📚 Book Finder</h1>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Search for a book (e.g., Harry Potter)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          className="border p-2 rounded-lg w-64 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={fetchBooks}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Search
        </button>
      </div>

      {loading && <p className="text-gray-600 mb-4">Loading...</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {books.map((b, i) => (
          <BookCard key={i} book={b} />
        ))}
      </div>
    </div>
  );
}
