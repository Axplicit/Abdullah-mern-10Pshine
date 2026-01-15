import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Notes = () => {
  const [notes, setNotes] = useState([]);

  // Create states
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  // Edit states
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const { token } = useAuth();

  // Fetch notes
  const fetchNotes = async () => {
    if (!token) return;

    try {
      const res = await api.get("/notes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotes(res.data);
    } catch (err) {
      console.error("🔥 Failed to fetch notes:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    if (token) {
      fetchNotes();
    }
  }, [token]);

  // Create note
  const handleCreate = async (e) => {
    e.preventDefault();

    if (!newTitle || !newContent) {
      alert("Title and content are required");
      return;
    }

    try {
      const res = await api.post(
        "/notes",
        {
          title: newTitle,
          content: newContent,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotes([res.data, ...notes]); // add new note at top
      setNewTitle("");
      setNewContent("");
    } catch (err) {
      console.error("Failed to create note", err);
    }
  };

  // Delete note
  const handleDelete = async (id) => {
    try {
      await api.delete(`/notes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNotes(notes.filter((note) => note.id !== id));
    } catch (err) {
      console.error("Failed to delete note", err);
    }
  };

  // Edit handlers
  const handleEditClick = (note) => {
    setEditingId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditContent("");
  };

  const handleUpdate = async (id) => {
    try {
      const res = await api.put(
        `/notes/${id}`,
        {
          title: editTitle,
          content: editContent,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotes(notes.map((note) => (note.id === id ? res.data : note)));
      handleCancelEdit();
    } catch (err) {
      console.error("Failed to update note", err);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h2>Your Notes</h2>

      {/* CREATE FORM */}
      <form onSubmit={handleCreate} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          style={{ width: "100%", marginBottom: "5px" }}
        />
        <textarea
          placeholder="Content"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          style={{ width: "100%", marginBottom: "5px" }}
        />
        <button type="submit">Add Note</button>
      </form>

      {/* NOTES LIST */}
      {notes.length === 0 ? (
        <p>No notes found</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {notes.map((note) => (
            <li key={note.id} style={{ marginBottom: "15px", borderBottom: "1px solid #ddd", paddingBottom: "10px" }}>
              {editingId === note.id ? (
                <>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Title"
                    style={{ width: "100%", marginBottom: "5px" }}
                  />
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    placeholder="Content"
                    style={{ width: "100%", marginBottom: "5px" }}
                  />
                  <button onClick={() => handleUpdate(note.id)}>Save</button>
                  <button onClick={handleCancelEdit} style={{ marginLeft: "5px" }}>
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <strong>{note.title}</strong>
                  <p>{note.content}</p>
                  <button onClick={() => handleEditClick(note)}>Edit</button>
                  <button onClick={() => handleDelete(note.id)} style={{ marginLeft: "5px" }}>
                    Delete
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notes;
