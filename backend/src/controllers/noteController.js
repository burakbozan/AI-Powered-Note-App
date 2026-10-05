const { Note } = require('../models');
const aiService = require('../services/aiService');
const asyncHandler = require('../utils/asyncHandler');

exports.createNote = asyncHandler(async (req, res) => {
  const { title, content = '' } = req.body;
  if (typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ error: 'A note title is required.' });
  }
  if (typeof content !== 'string') {
    return res.status(400).json({ error: 'Note content must be a string.' });
  }

  const note = await Note.create({
    title: title.trim(),
    content,
    userId: req.user.id,
  });
  res.status(201).json({ note });
});

exports.getNotes = asyncHandler(async (req, res) => {
  const notes = await Note.findAll({
    where: { userId: req.user.id },
    order: [['updatedAt', 'DESC']],
  });
  res.json({ notes });
});

exports.updateNote = asyncHandler(async (req, res) => {
  const note = await Note.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!note) return res.status(404).json({ error: 'Note not found.' });

  const { title, content } = req.body;
  if (title !== undefined) {
    if (typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ error: 'Note title must be a non-empty string.' });
    }
    note.title = title.trim();
  }
  if (content !== undefined) {
    if (typeof content !== 'string') {
      return res.status(400).json({ error: 'Note content must be a string.' });
    }
    note.content = content;
  }

  await note.save();
  res.json({ note });
});

exports.deleteNote = asyncHandler(async (req, res) => {
  const deleted = await Note.destroy({ where: { id: req.params.id, userId: req.user.id } });
  if (!deleted) return res.status(404).json({ error: 'Note not found.' });
  res.status(204).end();
});

exports.summarizeNote = asyncHandler(async (req, res) => {
  const note = await Note.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!note) return res.status(404).json({ error: 'Note not found.' });

  const enrichment = await aiService.summarizeAndTag(note);
  note.summary = enrichment.summary;
  note.tags = enrichment.tags;
  await note.save();

  res.json({ note });
});