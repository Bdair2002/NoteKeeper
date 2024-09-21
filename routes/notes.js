const express = require("express");
const Note = require("../models/Note");
const router = express.Router();

router.get("/", async (req, res) => {
  const { page = 1, limit = 4 } = req.query;
  try {
    const notes = await Note.find()
      .limit(limit * 1)
      .skip((page - 1) * limit);
    const count = await Note.countDocuments();
    res.json({
      notes,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  const note = new Note({
    title: req.body.title,
    content: req.body.content,
  });
  try {
    const savedNote = await note.save();
    res.status(201).json(savedNote);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedNote = await Note.findByIdAndDelete(req.params.id);
    if (!deletedNote)
      return res.status(404).json({ message: "Note not found" });
    res.json({ message: "Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedNote)
      return res.status(404).json({ message: "Note not found" });
    res.json(updatedNote);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/search", async (req, res) => {
  const { title, content } = req.query;

  try {
    const query = {
      $or: [],
    };
    if (title) {
      query.$or.push({ title: { $regex: title, $options: "i" } });
    }
    if (content) {
      query.$or.push({ content: { $regex: content, $options: "i" } });
    }
    if (query.$or.length === 0) {
      return res
        .status(400)
        .json({ message: "Please provide title or content to search." });
    }
    const notes = await Note.find(query);
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
