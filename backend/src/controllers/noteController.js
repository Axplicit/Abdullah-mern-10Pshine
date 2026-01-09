import Note from "../models/Note.js";

// CREATE note
export const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    const note = await Note.create({
      title,
      content,
      userId: req.user.id,
    });

    res.status(201).json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create note" });
  }
};

// GET all notes of user
export const getNotes = async (req, res) => {
  try {
    const notes = await Note.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
    });

    res.json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch notes" });
  }
};

// UPDATE note
export const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const note = await Note.findOne({
      where: { id, userId: req.user.id },
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    note.title = title ?? note.title;
    note.content = content ?? note.content;

    await note.save();

    res.json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update note" });
  }
};

// DELETE note
export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    const note = await Note.findOne({
      where: { id, userId: req.user.id },
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    await note.destroy();

    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete note" });
  }
};
