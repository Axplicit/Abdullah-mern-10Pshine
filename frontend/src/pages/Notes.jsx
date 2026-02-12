import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import RichTextEditor from "../components/RichTextEditor";
import DarkModeToggle from "../components/DarkModeToggle";

const Notes = () => {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const fetchNotes = async () => {
    if (!token) return;
    try {
      const res = await api.get("/notes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(res.data?.data || []);
    } catch {
      setNotes([]);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [token]);

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

  const handleUpdate = async (id) => {
    await api.put(
      `/notes/${id}`,
      { title: editTitle, content: editContent },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setEditingId(null);
    fetchNotes();
  };

  const handleDelete = async (id) => {
    await api.delete(`/notes/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchNotes();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#0f172a] dark:to-[#020617] transition-colors duration-300">

      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-20 backdrop-blur-md bg-white/70 dark:bg-[#0f172a]/70 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            Memora
          </h1>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Hi, <strong>{user?.name}</strong>
            </span>

            <DarkModeToggle />

            <button
              onClick={() => navigate("/profile")}
              className="text-sm px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              Profile
            </button>

            <button
              onClick={logout}
              className="text-sm px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* ================= MAIN ================= */}
      <main className="max-w-6xl mx-auto px-6 py-10">

        {/* ================= CREATE NOTE CARD ================= */}
        <div className="backdrop-blur-xl bg-white/70 dark:bg-white/5 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl p-8 mb-12 transition">

          <form onSubmit={handleCreate} className="space-y-6">

            {/* Floating Title */}
            <div className="relative">
              <input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder=" "
                className="peer w-full bg-transparent border-b-2 border-gray-300 dark:border-gray-700 focus:border-indigo-500 outline-none text-2xl font-semibold text-gray-900 dark:text-white py-2 transition"
              />
              <label className="absolute left-0 top-2 text-gray-500 dark:text-gray-400 text-sm transition-all 
                peer-placeholder-shown:top-2 peer-placeholder-shown:text-base
                peer-placeholder-shown:text-gray-400
                peer-focus:-top-4 peer-focus:text-sm peer-focus:text-indigo-500">
              </label>
            </div>

            <RichTextEditor
              value={newContent}
              onChange={setNewContent}
            />

            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition shadow-md hover:shadow-lg"
            >
              Save Note
            </button>
          </form>
        </div>

        {/* ================= NOTES GRID ================= */}
        {notes.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No notes yet
          </p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {notes.map((note) => (
              <div
                key={note.id}
                className="group backdrop-blur-xl bg-white/70 dark:bg-white/5 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-lg p-6 transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                {editingId === note.id ? (
                  <>
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 text-lg font-semibold text-gray-900 dark:text-white outline-none mb-4"
                    />

                    <RichTextEditor
                      value={editContent}
                      onChange={setEditContent}
                    />

                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => handleUpdate(note.id)}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="border border-gray-300 dark:border-gray-700 px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {note.title}
                    </h3>

                    <div
                      className="prose dark:prose-invert max-w-none mt-3 text-gray-700 dark:text-gray-300"
                      dangerouslySetInnerHTML={{ __html: note.content }}
                    />

                    <div className="flex gap-4 mt-6 opacity-0 group-hover:opacity-100 transition">
                      <button
                        onClick={() => {
                          setEditingId(note.id);
                          setEditTitle(note.title);
                          setEditContent(note.content);
                        }}
                        className="text-indigo-600 dark:text-indigo-400 text-sm hover:underline"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(note.id)}
                        className="text-red-500 text-sm hover:underline"
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
