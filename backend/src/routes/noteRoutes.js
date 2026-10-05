const express = require('express');
const noteController = require('../controllers/noteController');

const router = express.Router();

router.post('/', noteController.createNote);
router.get('/', noteController.getNotes);
router.put('/:id', noteController.updateNote);
router.delete('/:id', noteController.deleteNote);
router.post('/:id/summarize', noteController.summarizeNote);

module.exports = router;