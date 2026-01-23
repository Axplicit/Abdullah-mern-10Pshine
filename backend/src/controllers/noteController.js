import Note from "../models/Note.js";
import logger from "../utils/logger.js";

// CREATE NOTE
ß
export const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    logger.info(
      { userId: req.user.id, title },
      "Create note request"
    );

    const note = await Note.create({
      title,
      content,
      userId: req.user.id,
    });

    logger.info(
      { noteId: note.id, userId: req.user.id },
      "Note created successfully"
    );

    res.status(201).json(note);
  } catch (error) {
    logger.error(
      { err: error, userId: req.user?.id },
      "Failed to create note"
    );
    res.status(500).json({ message: "Failed to create note" });
  }
};


// GET NOTES

export const getNotes = async (req, res) => {
  try {
    logger.info(
      { userId: req.user.id },
      "Fetch notes request"
    );

    const notes = await Note.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
    });

    logger.info(
      { userId: req.user.id, count: notes.length },
      "Notes fetched successfully"
    );

    res.json(notes);
  } catch (error) {
    logger.error(
      { err: error, userId: req.user?.id },
      "Failed to fetch notes"
    );
    res.status(500).json({ message: "Failed to fetch notes" });
  }
};


// UPDATE NOTE

export const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    logger.info(
      { noteId: id, userId: req.user.id },
      "Update note request"
    );

    const note = await Note.findOne({
      where: { id, userId: req.user.id },
    });

    if (!note) {
      logger.warn(
        { noteId: id, userId: req.user.id },
        "Update failed: note not found"
      );
      return res.status(404).json({ message: "Note not found" });
    }

    note.title = title ?? note.title;
    note.content = content ?? note.content;
    await note.save();

    logger.info(
      { noteId: note.id, userId: req.user.id },
      "Note updated successfully"
    );

    res.json(note);
  } catch (error) {
    logger.error(
      { err: error, noteId: req.params?.id, userId: req.user?.id },
      "Failed to update note"
    );
    res.status(500).json({ message: "Failed to update note" });
  }
};


// DELETE NOTE

export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    logger.info(
      { noteId: id, userId: req.user.id },
      "Delete note request"
    );

    const note = await Note.findOne({
      where: { id, userId: req.user.id },
    });

    if (!note) {
      logger.warn(
        { noteId: id, userId: req.user.id },
        "Delete failed: note not found"
      );
      return res.status(404).json({ message: "Note not found" });
    }

    await note.destroy();

    logger.info(
      { noteId: id, userId: req.user.id },
      "Note deleted successfully"
    );

    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    logger.error(
      { err: error, noteId: req.params?.id, userId: req.user?.id },
      "Failed to delete note"
    );
    res.status(500).json({ message: "Failed to delete note" });
  }
};
