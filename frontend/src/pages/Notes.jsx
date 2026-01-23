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

  const fetchNotes = async () => {
    if (!token) return;

    try {
      const res = await api.get("/notes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(res.data);
    } catch (err) {
      console.error("Failed to fetch notes", err);
    }
  };

  useEffect(() => {
    if (token) fetchNotes();
  }, [token]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTitle || !newContent) return alert("Title and content required");

    try {
      const res = await api.post(
        "/notes",
        { title: newTitle, content: newContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNotes([res.data, ...notes]);
      setNewTitle("");
      setNewContent("");
    } catch (err) {
      console.error("Create failed", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(notes.filter((n) => n.id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

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
        { title: editTitle, content: editContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNotes(notes.map((n) => (n.id === id ? res.data : n)));
      handleCancelEdit();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  return (
    <div style={{ maxWidth: "720px", margin: "40px auto", padding: "20px" }}>
      {/* 🔹 TOP BAR */}
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
        <div>
          <span style={{ marginRight: "15px" }}>
            Welcome, <strong>{user?.name}</strong>
          </span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* CREATE */}
      <form
        onSubmit={handleCreate}
        style={{
          background: "#f9f9f9",
          padding: "15px",
          borderRadius: "8px",
          marginBottom: "20px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
        }}
      >
        <input
          placeholder="Title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />
        <textarea
          placeholder="Content"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />
        <button
          style={{
            width: "100%",
            padding: "10px",
            background: "#4f46e5",
            color: "white",
            border: "none",
            borderRadius: "6px",
          }}
        >
          Add Note
        </button>
      </form>

      {/* NOTES */}
      {notes.length === 0 ? (
        <p style={{ textAlign: "center" }}>No notes found</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {notes.map((note) => (
            <li
              key={note.id}
              style={{
                background: "#ffffff",
                padding: "15px",
                borderRadius: "8px",
                marginBottom: "12px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
              }}
            >
              {editingId === note.id ? (
                <>
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    style={{ width: "100%", padding: "8px", marginBottom: "8px" }}
                  />
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    style={{ width: "100%", padding: "8px", marginBottom: "8px" }}
                  />
                  <button onClick={() => handleUpdate(note.id)}>Save</button>
                  <button onClick={handleCancelEdit} style={{ marginLeft: "10px" }}>
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <strong>{note.title}</strong>
                  <p>{note.content}</p>
                  <button onClick={() => handleEditClick(note)}>Edit</button>
                  <button
                    onClick={() => handleDelete(note.id)}
                    style={{
                      marginLeft: "10px",
                      background: "#ef4444",
                      color: "white",
                      border: "none",
                      padding: "6px 10px",
                      borderRadius: "4px",
                    }}
                  >
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
