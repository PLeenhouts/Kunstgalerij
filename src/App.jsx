import { useState } from "react";
import { Routes, Route, Link, useParams } from "react-router-dom";
import './App.css'
import { initialArtworks } from "./data/artworks.js";

function App() {
  const [artworks, setArtworks] = useState(initialArtworks);
  
function handleToggleFavorite(id) {
  setArtworks((prevArtworks) =>
    prevArtworks.map((art) =>
      art.id === id ? { ...art, isFavorite: !art.isFavorite } 
      : art
      )
    );
  }

function handleAddComment(id, text) {
  setArtworks((prevArtworks) =>
    prevArtworks.map((art) =>
      art.id === id ? { ...art, comments: [ ...(art.comments || []), { id: Date.now(), text, date: new Date().toISOString()}]}
      : art
      )
    );
  }

function handleAddArtwork(data) {
    setArtworks((prev) => {      
      const slug =
        data.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "") || `art-${Date.now()}`;

      if (prev.some((a) => a.id === slug)) {
        alert("Er bestaat al een kunstwerk met deze titel. Pas de titel aan.");
        return prev;
      }

      const newArt = {
        id: slug,
        title: data.title.trim(),
        artist: data.artist.trim(),
        year: Number(data.year) || "",
        techniques: data.techniques
          ? data.techniques.split(",").map((t) => t.trim()).filter(Boolean)
          : [],
        imageUrl:
          data.imageUrl.trim() ||
          "https://via.placeholder.com/400x250?text=Nieuw+kunstwerk",
        description: data.description.trim(),
        isFavorite: false,
        comments: [],
      };

      return [newArt, ...prev];
    });
  }

function handleUpdateArtwork(id, data) {
    setArtworks((prev) =>
      prev.map((art) =>
        art.id === id
          ? {
              ...art,
              title: data.title.trim(),
              artist: data.artist.trim(),
              year: Number(data.year) || "",
              techniques: data.techniques
                ? data.techniques
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean)
                : [],
              imageUrl:
                data.imageUrl.trim() ||
                "https://via.placeholder.com/400x250?text=Kunstwerk",
              description: data.description.trim(),
            }
          : art
      )
    );
  }

  function handleDeleteArtwork(id) {
    if (!window.confirm("Weet je zeker dat je dit kunstwerk wilt verwijderen?")) {
      return;
    }
    setArtworks((prev) => prev.filter((art) => art.id !== id));
  }  
  
  return (
    <Routes>
      <Route path="/" element={<GalleryHome artworks={artworks} onToggleFavorite={handleToggleFavorite} />} />
      <Route path="/art/:id" element={<ArtDetailPage artworks={artworks} onToggleFavorite={handleToggleFavorite} onAddComment={handleAddComment} />} />
      <Route path="/favorites" element={<FavoritesPage artworks={artworks} onToggleFavorite={handleToggleFavorite} />} />
      <Route path="/admin" element={<AdminGate artworks={artworks} />} />  
    </Routes>
  );
}

export default App  
    
// Overzichtspagina
function GalleryHome({ artworks, onToggleFavorite }) {
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
        <Link to="/favorites">Bekijk favorieten →</Link>
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

            <button onClick={() => onToggleFavorite(art.id)}>
              {art.isFavorite ? "Favoriet" : "Markeer als favoriet"}
            </button>
            
            <p><Link to={`/art/${art.id}`}>Bekijk details →</Link></p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Detailpagina
function ArtDetailPage({ artworks, onToggleFavorite, onAddComment }) {
  const { id } = useParams();
  const art = artworks.find((a) => a.id === id);
  const [commentText, setCommentText] = useState("");
  
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
      <p>
        <Link to="/">← Terug naar overzicht</Link>
        <Link to="/favorites">Naar favorieten</Link></p>
      
      <img src={art.imageUrl} alt={art.title}/>
      <h1>{art.title}</h1>
      <p>{art.artist} · {art.year}</p>
      {Array.isArray(art.techniques) && art.techniques.length > 0 && (
        <p>Technieken: {art.techniques.join(", ")}</p>
      )}
      
      <p>Beschrijving: {art.description}</p>

        <button onClick={() => onToggleFavorite(art.id)}>
          {art.isFavorite ? "Favoriet" : "Markeer als favoriet"}
        </button>

    <hr/>
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

// Favorietenpagina
function FavoritesPage({ artworks, onToggleFavorite }) {
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

            <button onClick={() => onToggleFavorite(art.id)}>
              {art.isFavorite ? "Favoriet" : "Markeer als favoriet"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Beveiligde login Admin-pagina
function AdminGate({ artworks }) {
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
    return <AdminPage artworks={artworks} />;
  }

   return (
    <div>
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

//admin-pagina
function AdminPage({ artworks, onAddArtwork, onUpdateArtwork, onDeleteArtwork }) {
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

    const data = { title, artist, year, techniques, imageUrl, description };

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
    setYear(art.year ?? "");
    setTechniques(Array.isArray(art.techniques) ? art.techniques.join(", ") : "");
    setImageUrl(art.imageUrl || "");
    setDescription(art.description || "");
  }

  return (
    <div>
      <h1>Admin – Kunstwerken beheren</h1>
      <p>
        <Link to="/">← Terug naar overzicht</Link>
      </p>
     
      <h2>{editId ? "Kunstwerk bewerken" : "Nieuw kunstwerk toevoegen"}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Titel*:
            <input
              type="text"
              value={title}
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
              onChange={(e) => setArtist(e.target.value)}          
            />
          </label>
        </div>

        <div>
          <label>
            Jaar:
            <input
              type="number"
              value={year}
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
              onChange={(e) => setDescription(e.target.value)}              
            />
          </label>
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
  
      <h2>Bestaande kunstwerken</h2>
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
