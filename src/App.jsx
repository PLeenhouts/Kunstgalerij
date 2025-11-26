import { useState, useEffect } from "react";
import { Routes, Route, Link, useParams } from "react-router-dom";
import './App.css'
import { supabase } from "./supabaseClient.js";

import GalleryHome from "./pages/GalleryHome.jsx";
import ArtDetailPage from "./pages/ArtDetailPage.jsx";
import FavoritesPage from "./pages/FavoritesPage.jsx";
import AdminGate from "./pages/AdminGate.jsx";

function App() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  useEffect(() => {
    async function fetchArtworks() {
      setLoading(true);
      setError("");

      const { data: artworksData, error: artworksError } = await supabase
        .from("artworks")
        .select("*")
        .order("title", { ascending: true });

      if (artworksError) {
        console.error("Fout bij laden artworks:", artworksError);
        setError("Kon kunstwerken niet laden.");
        setLoading(false);
        return;
      }
      
        const { data: commentsData, error: commentsError } = await supabase
        .from("comments")
        .select("*")
        .order("created_at", { ascending: true });

      if (commentsError) {
        console.error("Fout bij laden comments:", commentsError);
      }

    const commentsByArtwork = {};
    if (commentsData) {
      for (const c of commentsData) {
        const artId = c.artwork_id;
        if (!commentsByArtwork[artId]) {
          commentsByArtwork[artId] = [];
        }
        commentsByArtwork[artId].push({
          id: c.id,
          text: c.text,
          author: c.author || "Anoniem",
          date: c.created_at,
        });
      }
    }

    const mapped = artworksData.map((row) => mapRowToArtwork(row, commentsByArtwork));

    setArtworks(mapped);
    setLoading(false);
  }

    fetchArtworks();
  }, []);
      
async function handleToggleFavorite(id, currentIsFavorite) {
   setArtworks((prevArtworks) =>
    prevArtworks.map((art) =>
      art.id === id ? { ...art, isFavorite: !art.isFavorite } 
      : art
    )
  );

  const { error } = await supabase
    .from("artworks")
    .update({ is_favorite: !currentIsFavorite })
    .eq("id", id);

  if (error) {
    console.error("Fout bij updaten favoriet:", error.message);
    }
}

async function handleAddComment(artworkId, text, author) {
   const { data, error } = await supabase
    .from("comments")
    .insert({
      artwork_id: artworkId,
      text,
      author,
    })
    .select()
    .single();

  if (error) {
    console.error("Fout bij opslaan comment:", error);
    alert("Opmerking kon niet opgeslagen worden.");
    return;
  }

  const newComment = {
    id: data.id,
    text: data.text,
    author: data.author || "Anoniem",
    date: data.created_at,
  };

  setArtworks((prevArtworks) =>
    prevArtworks.map((art) =>
      art.id === artworkId
        ? {
            ...art,
            comments: [...(art.comments || []), newComment],
          }
        : art
    )
  );
}

  async function handleAddArtwork(formData) {
    const rowToInsert = {
      title: formData.title.trim(),
      artist: formData.artist.trim(),
      year: formData.year ? Number(formData.year) : null,
      image_url: formData.imageUrl?.trim() || null,
      description: formData.description?.trim() || null,
      techniques: formData.techniques?.trim() || null,
      is_favorite: false,
    };

    const { data, error } = await supabase
      .from("artworks")
      .insert(rowToInsert)
      .select()
      .single(); 

    if (error) {
      console.error("Fout bij toevoegen artwork:", error);
      alert("Toevoegen in Supabase mislukt.");
      return;
    }

   const newArt = mapRowToArtwork(data);

  setArtworks((prev) => [newArt, ...prev]);
}

  async function handleUpdateArtwork(id, formData) {
  const rowToUpdate = {
    title: formData.title.trim(),
    artist: formData.artist.trim(),
    year: formData.year ? Number(formData.year) : null,
    image_url: formData.imageUrl?.trim() || null,
    description: formData.description?.trim() || null,
    techniques: formData.techniques?.trim() || null,
     };

  const { data, error } = await supabase
    .from("artworks")
    .update(rowToUpdate)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Fout bij updaten artwork:", error);
    alert("Bewerken in Supabase mislukt.");
    return;
  }

  const updatedArt = mapRowToArtwork(data);

  setArtworks((prev) =>
    prev.map((art) => (art.id === id ? updatedArt : art))
  );
}

  async function handleDeleteArtwork(id) {
  if (!window.confirm("Weet je zeker dat je dit kunstwerk wilt verwijderen?")) {
    return;
  }

  const { error } = await supabase
    .from("artworks")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Fout bij verwijderen artwork:", error);
    alert("Verwijderen in Supabase mislukt.");
    return;
  }
   setArtworks((prev) => prev.filter((art) => art.id !== id));
}

  if (loading) {
    return <p>Kunstwerken laden…</p>;
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>
        <p>
          <button onClick={() => window.location.reload()}>Opnieuw proberen</button>
        </p>
      </div>
    );
  }  

  return (
    <Routes>
      <Route path="/" element={<GalleryHome artworks={artworks} onToggleFavorite={handleToggleFavorite} />} />
      <Route path="/art/:id" element={<ArtDetailPage artworks={artworks} onToggleFavorite={handleToggleFavorite} onAddComment={handleAddComment} />} />
      <Route path="/favorites" element={<FavoritesPage artworks={artworks} onToggleFavorite={handleToggleFavorite} />} />
      <Route path="/admin" element={<AdminGate artworks={artworks} onAddArtwork={handleAddArtwork} onUpdateArtwork={handleUpdateArtwork} onDeleteArtwork={handleDeleteArtwork} />} />  
    </Routes>
  );
}

export default App;

function mapRowToArtwork(row, commentsByArtwork = {}) {
  return {
    id: row.id,
    title: row.title,
    artist: row.artist,
    year: row.year,
    imageUrl: row.image_url,
    description: row.description,
    techniques: row.techniques
      ? row.techniques.split(",").map((t) => t.trim()).filter(Boolean)
      : [],
    isFavorite: row.is_favorite ?? false,
    comments: commentsByArtwork[row.id] ?? [],
  };
}
