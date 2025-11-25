import { useState } from "react";
import { Routes, Route, Link, useParams } from "react-router-dom";

export default function AdminPage({ artworks, onAddArtwork, onUpdateArtwork, onDeleteArtwork }) {
  const [editId, setEditId] = useState(null);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [year, setYear] = useState("");
  const [techniques, setTechniques] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");

  function resetForm() {
    setEditId(null);
    setTitle("");
    setArtist("");
    setYear("");
    setTechniques("");
    setImageUrl("");
    setDescription("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim() || !artist.trim()) {
      alert("Titel en kunstenaar zijn verplicht.");
      return;
    }
  
  let cleanedYear = year.trim();
  let yearNumber = null;

  if (cleanedYear !== "") {
    yearNumber = Number(cleanedYear);
    if (
      Number.isNaN(yearNumber) ||
      yearNumber < 0 ||
      yearNumber > 2025
    ) {
      alert("Voer een geldig jaar in (bijv. 2025).");
      return;
    }
  }

    const data = { title, artist, yearNumber, techniques, imageUrl, description };

    if (editId) {
      onUpdateArtwork(editId, data);
    } else {
      onAddArtwork(data);
    }
    resetForm();
  }

  function handleEdit(art) {
    setEditId(art.id);
    setTitle(art.title);
    setArtist(art.artist);
    setYear(art.year !== null && art.year !== undefined ? String(art.year): "");
    setTechniques(Array.isArray(art.techniques) ? art.techniques.join(", ") : "");
    setImageUrl(art.imageUrl || "");
    setDescription(art.description || "");
  }

  return (
    <div>
      <h1>Virtuele Kunstgalerij “Paintings Meets Pixels” - Where art meets technology…</h1>
      <p>Een virtueel overzicht van kunstwerken</p>
      <hr/>
      <h1>Admin – Kunstwerken beheren</h1>
      <p>
        <Link to="/">Uitloggen als Admin</Link>
      </p>
      <hr/>
     
      <h2>{editId ? "Kunstwerk bewerken" : "Nieuw kunstwerk toevoegen"}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Titel*:
            <input
              type="text"
              value={title}
              placeholder="Bijv. De nachtwacht"
              onChange={(e) => setTitle(e.target.value)}           
            />
          </label>
        </div>

        <div>
          <label>
            Kunstenaar*:
            <input
              type="text"
              value={artist}
              placeholder="Bijv. Rembrandt van Rijn"
              onChange={(e) => setArtist(e.target.value)}          
            />
          </label>
        </div>

        <div>
          <label>
            Jaar:
            <input
              type="text"
              inputMode="numeric"
              value={year}
              placeholder="Bijv. 2025"
              onChange={(e) => setYear(e.target.value)}             
            />
          </label>
        </div>

        <div>
          <label>
            Technieken (kommagescheiden):
            <input
              type="text"
              value={techniques}
              placeholder="Bijv. Olieverf, Barok"
              onChange={(e) => setTechniques(e.target.value)}              
            />
          </label>
        </div>

        <div>
          <label>
            Afbeelding-URL:
            <input
              type="text"
              value={imageUrl}
              placeholder="Bijv. www.test.com/afb.jpg"
              onChange={(e) => setImageUrl(e.target.value)}              
            />
          </label>
        </div>

        <div>
          <label>
            Beschrijving:
            <input             
              type="text"
              value={description}
              placeholder="Bijv. Een prachtig kunstwerk..."
              onChange={(e) => setDescription(e.target.value)}              
            />
          </label>
        </div>
        <div>
          <p>* is een verplicht veld</p>
        </div>
        
        <button type="submit">
          {editId ? "Wijzigingen opslaan" : "Toevoegen"}
        </button>
        {editId && (
          <button type="button" onClick={resetForm}>
            Annuleren
          </button>
        )}
      </form>
      <hr/>
      
      <h2>Overzicht bestaande kunstwerken & Bewerken en verwijderen van bestaande kunstwerken</h2>
      {artworks.length === 0 ? (
        <p>Er zijn nog geen kunstwerken.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Titel</th>
              <th>Kunstenaar</th>
              <th>Jaar</th>
              <th>Afbeelding</th>
              <th>Technieken</th>
              <th>Beschrijving</th>
              <th>Acties</th>
            </tr>
          </thead>
          <tbody>
            {artworks.map((art) => (
              <tr key={art.id}>
                <td>{art.title}</td>
                <td>{art.artist}</td>
                <td>{art.year}</td>
                <td>{art.imageUrl}</td>
                <td>{art.techniques.join(", ")}</td>
                <td>{art.description}</td>
                <td>
                  <button type="button" onClick={() => handleEdit(art)}>
                    Bewerken
                  </button>
                  <button type="button" onClick={() => onDeleteArtwork(art.id)}>
                    Verwijderen
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

