import { useState } from "react";
import './App.css'
import { initialArtworks } from "./data/artworks.js";

function App() {
  const [artworks, setArtworks] = useState(initialArtworks);
  const [expanded, setExpanded] = useState({});
  return (
    <div>
      <h1>Virtuele Kunstgalerij</h1>
      <p>Een overzicht van kunstwerken</p>
      
      <div className="art-grid">
       {artworks.map((art) => (
          <div className="art-card" key={art.id}>
            <img src={art.imageUrl} alt={art.title}/>
            onClick={() =>
              setExpanded((prev) => ({
              ...prev,
              [art.id]: !prev[art.id],
              }))
            }            
            />            
            <h2>{art.title}</h2>
            <p>Artiest: {art.artist}</p>
            
            {expanded[art.id] && (
              <div className="extra-info">
                <p><strong>Beschrijving:</strong> {art.description}</p>
                <p><strong>Jaar:</strong> {art.year}</p>
                <p><strong>Techniek:</strong>{art.techniques.join(", ")}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
  
export default App
