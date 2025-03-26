const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const sequelize = require("./backend/database");
const Note = require("./backend/models/note.model");

const app = express();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

// Order update endpoint
app.put('/api/notes/update-order', async (req, res) => {
  try {
    const updates = req.body;
    for (const update of updates) {
      await Note.update({ order: update.order }, { where: { id: update.id } });
    }
    res.json({ message: 'Order updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CRUD routes here (możemy dodać później)

sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log("Serwer działa na porcie 3000");
  });
});

app.post("/api/notes", upload.single("image"), async (req, res) => {
  try {
    const note = await Note.create({
      title: req.body.title,
      content: req.body.content,
      imagePath: req.file ? req.file.path : null,
    });
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/notes", async (req, res) => {
  try {
    const notes = await Note.findAll();
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/notes/:id", async (req, res) => {
  try {
    const note = await Note.findByPk(req.params.id);
    if (note) {
      await note.destroy();
      res.json({ message: "Notatka została usunięta" });
    } else {
      res.status(404).json({ error: "Nie znaleziono notatki" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single note
app.get('/api/notes/:id', async (req, res) => {
  try {
    const note = await Note.findByPk(req.params.id);
    if (note) {
      res.json(note);
    } else {
      res.status(404).json({ error: 'Note not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE note
app.put('/api/notes/:id', upload.single('image'), async (req, res) => {
  try {
    const noteData = {
      title: req.body.title,
      content: req.body.content,
    };

    if (req.file) {
      noteData.imagePath = req.file.path;
    }

    const note = await Note.findByPk(req.params.id);
    if (note) {
      await note.update(noteData);
      res.json(note);
    } else {
      res.status(404).json({ error: 'Note not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
