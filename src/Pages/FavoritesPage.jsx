import { useState } from "react";
import { Routes, Route, Link, useParams } from "react-router-dom";

export default function FavoritesPage({ artworks, onToggleFavorite }) {
    const favoriteArtworks = artworks.filter((art) => art.isFavorite);

  return (
    <div>
      <h1>Favorieten</h1>
      <p>Overzicht van alle favoriete kunstwerken.</p>

      <p>
        <Link to="/">← Terug naar overzicht</Link>
      </p>

      {favoriteArtworks.length === 0 && (
        <p>Je hebt nog geen favorieten geselecteerd.</p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1rem",
          marginTop: "1rem",
        }}
      >
        {favoriteArtworks.map((art) => (
          <div key={art.id}>
            <Link to={`/art/${art.id}`}>
              <img src={art.imageUrl} alt={art.title} />
            </Link>

            <h2>{art.title}</h2>
            <p>{art.artist}</p>
            <p>Jaar: {art.year}</p>

            <button onClick={() => onToggleFavorite(art.id, art.isFavorite)}>
              {art.isFavorite ? "Favoriet" : "Markeer als favoriet"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}