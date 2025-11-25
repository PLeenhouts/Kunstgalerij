import { useState } from "react";
import { Routes, Route, Link, useParams } from "react-router-dom";

export default function ArtDetailPage({ artworks, onToggleFavorite, onAddComment }) {
  const { id } = useParams();
  const art = artworks.find((a) => String(a.id) === id);
  const [commentText, setCommentText] = useState("");

  if (!art) {
    return (
      <div>
        <p>Kunstwerk niet gevonden.</p>
        <p><Link to="/">Terug naar startpagina</Link></p>
      </div>
    );
  }

  return (
    <div>
      <h1>Virtuele Kunstgalerij “Paintings Meets Pixels” - Where art meets technology…</h1>
      <p>Een virtueel overzicht van kunstwerken</p>
      <hr/>

      <h2>Links</h2>
      <p>
        <Link to="/">Terug naar startpagina</Link> |{" "}
        <Link to="/favorites">Bekijk favorieten overzicht</Link>
      </p>
      <hr/>

      <h2>Detailoverzicht van Kunstwerk</h2>
      <img src={art.imageUrl} alt={art.title}/>

      <h1 >{art.title}</h1>
      <p>{art.artist} · {art.year}</p>

      {Array.isArray(art.techniques) && art.techniques.length > 0 && (
        <p>Technieken: {art.techniques.join(", ")}</p>
      )}

      <p>Beschrijving: {art.description}</p>

       <button onClick={() => onToggleFavorite(art.id, art.isFavorite)}>
        {art.isFavorite ? "Favoriet" : "Markeer als favoriet"}
      </button>

    <hr />
    <h2>Comments</h2>

    {art.comments && art.comments.length > 0 ? (
      <ul>
        {art.comments.map((c) => (
          <li key={c.id}>
            <div>
              {new Date(c.date).toLocaleString()}
            </div>
            <div>{c.text}</div>
          </li>
        ))}
      </ul>
    ) : (
      <p>Nog geen comments.</p>
    )}

      <div>
        <textarea
         rows={3}
         placeholder="Schrijf een comment met je naam..."
         value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button
         onClick={() => {
          const text = commentText.trim();
          if (!text) return;
          onAddComment(art.id, text);
          setCommentText("");     
          }}
        >
          Plaats comment
        </button>
      </div>
    </div>
  );
}

