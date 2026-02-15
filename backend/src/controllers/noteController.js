import Note from "../models/Note.js";
import logger from "../utils/logger.js";
import ApiError from "../utils/ApiError.js";

// CREATE NOTE
export const createNote = async (req, res, next) => {
  try {
    const { title, content } = req.body;

    logger.info({ userId: req.user.id, title }, "Create note request");

    if (!title || !content) {
      throw new ApiError(400, "Title and content are required");
    }

    const note = await Note.create({
      title,
      content,
      userId: req.user.id,
    });

    logger.info(
      { noteId: note.id, userId: req.user.id },
      "Note created successfully"
    );

    res.status(201).json({
      status: "success",
      data: note,
    });
  } catch (error) {
    logger.error({ err: error, userId: req.user?.id }, "Create note failed");
    next(error);
  }
};

// GET NOTES
export const getNotes = async (req, res, next) => {
  try {
    logger.info({ userId: req.user.id }, "Fetch notes request");

    const notes = await Note.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
    });

    logger.info(
      { userId: req.user.id, count: notes.length },
      "Notes fetched successfully"
    );

    res.json({
      status: "success",
      data: notes,
    });
  } catch (error) {
    logger.error({ err: error, userId: req.user?.id }, "Fetch notes failed");
    next(error);
  }
};

// UPDATE NOTE
export const updateNote = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    logger.info({ noteId: id, userId: req.user.id }, "Update note request");

    const note = await Note.findOne({
      where: { id, userId: req.user.id },
    });

    if (!note) {
      logger.warn({ noteId: id, userId: req.user.id }, "Note not found");
      throw new ApiError(404, "Note not found");
    }

    note.title = title ?? note.title;
    note.content = content ?? note.content;
    await note.save();

    logger.info(
      { noteId: note.id, userId: req.user.id },
      "Note updated successfully"
    );

    res.json({
      status: "success",
      data: note,
    });
  } catch (error) {
    logger.error(
      { err: error, noteId: req.params?.id, userId: req.user?.id },
      "Update note failed"
    );
    next(error);
  }
};

// DELETE NOTE
export const deleteNote = async (req, res, next) => {
  try {
    const { id } = req.params;

    logger.info({ noteId: id, userId: req.user.id }, "Delete note request");

    const note = await Note.findOne({
      where: { id, userId: req.user.id },
    });

    if (!note) {
      logger.warn({ noteId: id, userId: req.user.id }, "Note not found");
      throw new ApiError(404, "Note not found");
    }

    await note.destroy();

    logger.info(
      { noteId: id, userId: req.user.id },
      "Note deleted successfully"
    );

    res.json({
      status: "success",
      message: "Note deleted successfully",
    });
  } catch (error) {
    logger.error(
      { err: error, noteId: req.params?.id, userId: req.user?.id },
      "Delete note failed"
    );
    next(error);
  }
};
