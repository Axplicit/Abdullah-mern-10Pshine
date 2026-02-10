import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import RichTextEditor from "../components/RichTextEditor";

const Notes = () => {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);

  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  // ===============================
  // FETCH NOTES
  // ===============================
  const fetchNotes = async () => {
    if (!token) return;
    try {
      const res = await api.get("/notes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(res.data?.data || []);
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
    if (!newTitle.trim() || !newContent.trim()) return;

    await api.post(
      "/notes",
      { title: newTitle, content: newContent },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setNewTitle("");
    setNewContent("");
    fetchNotes();
  };

  // ===============================
  // DELETE NOTE
  // ===============================
  const handleDelete = async (id) => {
    await api.delete(`/notes/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchNotes();
  };

  // ===============================
  // UPDATE NOTE
  // ===============================
  const handleUpdate = async (id) => {
    await api.put(
      `/notes/${id}`,
      { title: editTitle, content: editContent },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setEditingId(null);
    fetchNotes();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ===== HEADER ===== */}
      <header className="bg-white shadow">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">Memora</h1>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Hi, <strong>{user?.name}</strong>
            </span>

            <button
              onClick={() => navigate("/profile")}
              className="px-3 py-1 border rounded text-sm hover:bg-gray-100"
            >
              Profile
            </button>

            <button
              onClick={logout}
              className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* ===== MAIN ===== */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* CREATE NOTE */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-lg font-semibold mb-4">Create Note</h2>

          <form onSubmit={handleCreate} className="space-y-4">
            <input
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Note title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />

            <RichTextEditor value={newContent} onChange={setNewContent} />

            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Add Note
            </button>
          </form>
        </div>

        {/* NOTES LIST */}
        {notes.length === 0 ? (
          <p className="text-center text-gray-500">No notes yet</p>
        ) : (
          <div className="grid gap-6">
            {notes.map((note) => (
              <div key={note.id} className="bg-white p-6 rounded-lg shadow">
                {editingId === note.id ? (
                  <>
                    <input
                      className="w-full border rounded px-3 py-2 mb-3"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                    />

                    <RichTextEditor
                      value={editContent}
                      onChange={setEditContent}
                    />

                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => handleUpdate(note.id)}
                        className="bg-green-600 text-white px-4 py-2 rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="border px-4 py-2 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold">{note.title}</h3>

                    <div
                      className="prose max-w-none mt-3"
                      dangerouslySetInnerHTML={{ __html: note.content }}
                    />

                    <div className="mt-4 flex gap-3">
                      <button
                        onClick={() => {
                          setEditingId(note.id);
                          setEditTitle(note.title);
                          setEditContent(note.content);
                        }}
                        className="text-indigo-600 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(note.id)}
                        className="text-red-500 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Notes;
