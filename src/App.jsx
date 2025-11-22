import { useState } from "react";
import { Routes, Route, Link, useParams } from "react-router-dom";
import './App.css'
import { initialArtworks } from "./data/artworks.js";

function App() {
  const [artworks, setArtworks] = useState(initialArtworks);
  
  return (
    <Routes>
      <Route path="/" element={<GalleryHome artworks={artworks} />} />
      <Route path="/art/:id" element={<ArtDetailPage artworks={artworks} />} />
    </Routes>
  );
}

export default App  
    
    // Overzichtspagina
function GalleryHome({ artworks }) {
  return (
    <div>
      <h1>Virtuele Kunstgalerij</h1>
      <p>Een overzicht van kunstwerken</p>
    
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1rem",
          marginTop: "1rem",
        }}
      >
         {artworks.map((art) => (
          <div key={art.id}>
            <Link to={`/art/${art.id}`}>
              <img src={art.imageUrl}alt={art.title}/></Link>

            <h2>{art.title}</h2>
            <p>{art.artist}</p>
            <p>Jaar: {art.year}</p>           
            <p><Link to={`/art/${art.id}`}>Bekijk details →</Link></p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Detailpagina
function ArtDetailPage({ artworks }) {
  const { id } = useParams();
  const art = artworks.find((a) => a.id === id);

  if (!art) {
    return (
      <div>
        <p>Kunstwerk niet gevonden.</p>
        <p><Link to="/">← Terug naar overzicht</Link></p>
      </div>
    );
  }

  return (
    <div>
      <p><Link to="/">← Terug naar overzicht</Link></p>
      <img src={art.imageUrl} alt={art.title}/>
      <h1 >{art.title}</h1>
      <p>{art.artist} · {art.year}</p>
      {Array.isArray(art.techniques) && art.techniques.length > 0 && (
        <p>Technieken: {art.techniques.join(", ")}</p>
      )}
      <p>Beschrijving: {art.description}</p>      
    </div>
  );
}
