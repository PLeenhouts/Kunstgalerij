import { useState } from "react";
import { Routes, Route, Link, useParams } from "react-router-dom";

import AdminPage from "./AdminPage.jsx";

export default function AdminGate({ artworks, onAddArtwork, onUpdateArtwork, onDeleteArtwork }) {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (password === "test") {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Onjuist wachtwoord.");
    }
  }

    if (isAuthenticated) {
    return <AdminPage artworks={artworks} onAddArtwork={onAddArtwork} onUpdateArtwork={onUpdateArtwork} onDeleteArtwork={onDeleteArtwork} />;
  }

   return (
    <div>
      <h1>Virtuele Kunstgalerij “Paintings Meets Pixels” - Where art meets technology…</h1>
      <p>Een virtueel overzicht van kunstwerken</p>
      <hr/>
      <h1>Admin login</h1>
      <p>Voer het admin-wachtwoord in om verder te gaan.</p>

      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Wachtwoord"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Inloggen</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <p>
        <Link to="/">← Terug naar overzicht</Link>
      </p>
    </div>
  );
}
