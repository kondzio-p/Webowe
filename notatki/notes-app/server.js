const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const sequelize = require("./backend/database");
const Note = require("./backend/models/note.model");
const User = require("./backend/models/user.model");

const app = express();
const JWT_SECRET = "your-jwt-secret-key"; // In production, use environment variable

// Ensure uploads directory exists
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

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

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Authentication required" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid or expired token" });
    req.user = user;
    next();
  });
};

// User routes
app.post("/api/users/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: "Użytkownik już istnieje" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      username,
      password: hashedPassword,
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Return user data and token
    res.json({
      user: {
        id: user.id,
        username: user.username,
        profileImage: user.profileImage,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/users/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Nieprawidłowa nazwa użytkownika lub hasło" });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res
        .status(400)
        .json({ message: "Nieprawidłowa nazwa użytkownika lub hasło" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Return user data and token
    res.json({
      user: {
        id: user.id,
        username: user.username,
        profileImage: user.profileImage,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post(
  "/api/users/profile-image",
  authenticateToken,
  upload.single("profileImage"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const user = await User.findByPk(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Update profile image
      user.profileImage = req.file.path;
      await user.save();

      res.json({
        id: user.id,
        username: user.username,
        profileImage: user.profileImage,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Note relationship
Note.belongsTo(User);
User.hasMany(Note);

// Order update endpoint
app.put("/api/notes/update-order", authenticateToken, async (req, res) => {
  try {
    const updates = req.body;
    for (const update of updates) {
      await Note.update(
        { order: update.order },
        { where: { id: update.id, UserId: req.user.id } }
      );
    }
    res.json({ message: "Order updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create note
app.post(
  "/api/notes",
  authenticateToken,
  upload.single("image"),
  async (req, res) => {
    try {
      const note = await Note.create({
        title: req.body.title,
        content: req.body.content,
        imagePath: req.file ? req.file.path : null,
        sensitive: req.body.sensitive === "true",
        UserId: req.user.id, // Associate note with user
      });
      res.json(note);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Get all notes for user
app.get("/api/notes", authenticateToken, async (req, res) => {
  try {
    const notes = await Note.findAll({
      where: { UserId: req.user.id },
      order: [["order", "ASC"]],
    });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete note
app.delete("/api/notes/:id", authenticateToken, async (req, res) => {
  try {
    const note = await Note.findOne({
      where: {
        id: req.params.id,
        UserId: req.user.id,
      },
    });

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
app.get("/api/notes/:id", authenticateToken, async (req, res) => {
  try {
    const note = await Note.findOne({
      where: {
        id: req.params.id,
        UserId: req.user.id,
      },
    });

    if (note) {
      res.json(note);
    } else {
      res.status(404).json({ error: "Note not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE note (dokończenie)
app.put(
  "/api/notes/:id",
  authenticateToken,
  upload.single("image"),
  async (req, res) => {
    try {
      const noteData = {
        title: req.body.title,
        content: req.body.content,
        sensitive: req.body.sensitive === "true",
      };

      if (req.file) {
        noteData.imagePath = req.file.path;
      }

      const note = await Note.findOne({
        where: {
          id: req.params.id,
          UserId: req.user.id,
        },
      });

      if (note) {
        await note.update(noteData);
        res.json(note);
      } else {
        res.status(404).json({ error: "Note not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Inicjalizacja serwera
const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
