import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Notes = () => {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);

  // Create
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  // Edit
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // ===============================
  // FETCH NOTES (FIXED)
  // ===============================
  const fetchNotes = async () => {
    if (!token) return;

    try {
      const res = await api.get("/notes", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const notesData = res.data?.data;

      if (Array.isArray(notesData)) {
        setNotes(notesData);
      } else {
        console.error("Unexpected notes response:", res.data);
        setNotes([]);
      }
    } catch (err) {
      console.error("Failed to fetch notes", err);
      setNotes([]);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [token]);

  // ===============================
  // CREATE NOTE
  // ===============================
  const handleCreate = async (e) => {
    e.preventDefault();

    if (!newTitle || !newContent) {
      alert("Title and content required");
      return;
    }

    try {
      await api.post(
        "/notes",
        { title: newTitle, content: newContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNewTitle("");
      setNewContent("");
      fetchNotes();
    } catch (err) {
      console.error("Create failed", err);
    }
  };

  // ===============================
  // DELETE NOTE
  // ===============================
  const handleDelete = async (id) => {
    try {
      await api.delete(`/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchNotes();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  // ===============================
  // EDIT NOTE
  // ===============================
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
      await api.put(
        `/notes/${id}`,
        { title: editTitle, content: editContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      handleCancelEdit();
      fetchNotes();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  return (
    <div style={{ maxWidth: "720px", margin: "40px auto", padding: "20px" }}>
      {/* TOP BAR */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px",
          paddingBottom: "10px",
          borderBottom: "1px solid #ddd",
        }}
      >
        <h2>📝 Notes App</h2>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <span>
            Welcome, <strong>{user?.name}</strong>
          </span>

          <button onClick={() => navigate("/profile")}>Profile</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* CREATE NOTE */}
      <form onSubmit={handleCreate}>
        <input
          placeholder="Title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <textarea
          placeholder="Content"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
        />
        <button type="submit">Add Note</button>
      </form>

      {/* NOTES LIST */}
      {notes.length === 0 ? (
        <p>No notes found</p>
      ) : (
        <ul>
          {notes.map((note) => (
            <li key={note.id}>
              {editingId === note.id ? (
                <>
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                  />
                  <button onClick={() => handleUpdate(note.id)}>Save</button>
                  <button onClick={handleCancelEdit}>Cancel</button>
                </>
              ) : (
                <>
                  <strong>{note.title}</strong>
                  <p>{note.content}</p>
                  <button onClick={() => handleEditClick(note)}>Edit</button>
                  <button onClick={() => handleDelete(note.id)}>Delete</button>
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
