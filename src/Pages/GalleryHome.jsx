import { useState } from "react";
import { Routes, Route, Link, useParams } from "react-router-dom";

export default function GalleryHome({ artworks, onToggleFavorite }) {
  const [searchTerm, setSearchTerm] = useState("");
  const filteredArtworks = artworks.filter((art) => {
  const term = searchTerm.toLowerCase();
    return (
      art.title.toLowerCase().includes(term) ||
      art.artist.toLowerCase().includes(term) 
    );
  });

  return (
    <div>
      <h1>Virtuele Kunstgalerij</h1>
      <p>Een overzicht van kunstwerken</p>
    
      <p>
        <Link to="/favorites">Bekijk favorieten →</Link> |{" "}
        <Link to="/admin">Admin</Link>
      </p>

    <input
        type="text"
        placeholder="Zoek op titel of kunstenaar..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1rem",
          marginTop: "1rem",
        }}
      >
         {filteredArtworks.map((art) => (
          <div key={art.id}>
            <Link to={`/art/${art.id}`}>
              <img src={art.imageUrl}alt={art.title}/>
            </Link>

            <h2>{art.title}</h2>
            <p>{art.artist}</p>
            <p>Jaar: {art.year}</p>
            <button onClick={() => onToggleFavorite(art.id, art.isFavorite)}>
              {art.isFavorite ? "Favoriet" : "Markeer als favoriet"}
            </button>

            <p><Link to={`/art/${art.id}`}>Bekijk details →</Link></p>
          </div>
        ))}
      </div>
    </div>
  );
}