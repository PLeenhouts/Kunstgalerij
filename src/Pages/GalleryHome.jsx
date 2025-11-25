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
      <h1>Virtuele Kunstgalerij “Paintings Meets Pixels” - Where art meets technology…</h1>
      <p>Een virtueel overzicht van kunstwerken</p>
      <hr/>
    
      <p>
        <h2>Links</h2>
        <Link to="/favorites">Bekijk overzicht favorieten</Link> |{" "}
        <Link to="/admin">Inloggen als Admin</Link>
      </p>
      <hr/>

    <h2>Zoek in de collectie</h2>
    <p> Begin met typen om kunstwerken te zoeken/filteren. 
        
    <input
        type="text"
        placeholder="Zoek op titel of kunstenaar..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      </p>
    <hr/>
      
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
              {art.isFavorite ? "Ingesteld als favoriet" : "Markeer als favoriet"}
            </button>

            <p><Link to={`/art/${art.id}`}>Bekijk details</Link></p>
          </div>
        ))}
      </div>
    </div>
  );
}

