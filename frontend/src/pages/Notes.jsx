import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import RichTextEditor from "../components/RichTextEditor";

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
  // FETCH NOTES
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

    if (!newTitle.trim() || !newContent.trim()) {
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
      {/* ================= TOP BAR ================= */}
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
        <h2>Memora</h2>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <span>
            Welcome, <strong>{user?.name}</strong>
          </span>

          <button onClick={() => navigate("/profile")}>Profile</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* ================= CREATE NOTE ================= */}
      <form onSubmit={handleCreate} style={{ marginBottom: "30px" }}>
        <input
          placeholder="Title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        {/* ✅ editor-content wrapper REQUIRED */}
        <div className="editor-content">
          <RichTextEditor value={newContent} onChange={setNewContent} />
        </div>

        <button type="submit" style={{ marginTop: "10px" }}>
          Add Note
        </button>
      </form>

      {/* ================= NOTES LIST ================= */}
      {notes.length === 0 ? (
        <p style={{ textAlign: "center" }}>No notes found</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {notes.map((note) => (
            <li
              key={note.id}
              style={{
                background: "#fff",
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
                    style={{ width: "100%", marginBottom: "10px" }}
                  />

                  <div className="editor-content">
                    <RichTextEditor
                      value={editContent}
                      onChange={setEditContent}
                    />
                  </div>

                  <button onClick={() => handleUpdate(note.id)}>Save</button>
                  <button onClick={handleCancelEdit} style={{ marginLeft: "10px" }}>
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <strong>{note.title}</strong>

                  {/* ✅ REQUIRED for wrapping + images */}
                  <div
                    className="note-content"
                    dangerouslySetInnerHTML={{ __html: note.content }}
                  />

                  <button onClick={() => handleEditClick(note)}>Edit</button>
                  <button
                    onClick={() => handleDelete(note.id)}
                    style={{ marginLeft: "10px" }}
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
