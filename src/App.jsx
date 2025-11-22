import { useState } from "react";
import './App.css'
import { initialArtworks } from "./data/artworks.js";

function App() {
  const [artworks, setArtworks] = useState(initialArtworks);
  return (
    <div>
      <h1>Virtuele Kunstgalerij</h1>
      <p>Een overzicht van kunstwerken</p>
      <div className="art-grid">
       {artworks.map((art) => (
          <div className="art-card" key={art.id}>
            <img src={art.imageUrl} alt={art.title}/>
            <h2>{art.title}</h2>
            <p>Artiest: {art.artist}</p>
            <p>Jaar: {art.year}</p>
            <p>Beschrijving: {art.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
  
export default App
