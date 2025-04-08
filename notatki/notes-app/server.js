const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer"); // Do obsługi przesyłania plików
const path = require("path");
const bcrypt = require("bcrypt"); // Do haszowania haseł
const jwt = require("jsonwebtoken");
const fs = require("fs");

const sequelize = require("./backend/database");
const Note = require("./backend/models/note.model");
const User = require("./backend/models/user.model");

const app = express();
const JWT_SECRET = "your-jwt-secret-key"; // BEZPIECZEŃSTWO: W produkcji użyj zmiennej środowiskowej

// Upewnij się, że katalog uploads istnieje
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// Konfiguracja multer do przechowywania przesyłanych plików
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Generuj unikalne nazwy plików
  },
});
const upload = multer({ storage: storage });

// Konfiguracja middleware
app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads")); // Udostępniaj przesłane pliki statycznie

// Middleware autentykacji - weryfikuje token JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token)
    return res.status(401).json({ error: "Wymagane uwierzytelnienie" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err)
      return res
        .status(403)
        .json({ error: "Nieprawidłowy lub przedawniony token" });
    req.user = user; // Dołącz dane użytkownika do żądania
    next();
  });
};

// Endpoint rejestracji użytkownika
app.post("/api/users/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Sprawdź czy użytkownik już istnieje
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: "Użytkownik już istnieje" });
    }

    // Zahaszuj hasło przed zapisem
    const hashedPassword = await bcrypt.hash(password, 10);

    // Utwórz użytkownika w bazie danych
    const user = await User.create({
      username,
      password: hashedPassword,
    });

    // Wygeneruj token JWT do automatycznego logowania
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Zwróć dane użytkownika i token
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

// Endpoint logowania użytkownika
app.post("/api/users/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Znajdź użytkownika po nazwie
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Nieprawidłowa nazwa użytkownika lub hasło" });
    }

    // Zweryfikuj hasło
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res
        .status(400)
        .json({ message: "Nieprawidłowa nazwa użytkownika lub hasło" });
    }

    // Wygeneruj token JWT
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Zwróć dane użytkownika i token
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

// Endpoint aktualizacji zdjęcia profilowego
app.post(
  "/api/users/profile-image",
  authenticateToken, // Wymagaj autentykacji
  upload.single("profileImage"), // Obsłuż przesłanie pojedynczego pliku
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Nie przesłano pliku" });
      }

      const user = await User.findByPk(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "Nie znaleziono użytkownika" });
      }

      // Zaktualizuj ścieżkę zdjęcia profilowego w bazie danych
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

// Zdefiniuj relacje bazodanowe
Note.belongsTo(User);
User.hasMany(Note);

// Endpoint aktualizacji kolejności notatek
app.put("/api/notes/update-order", authenticateToken, async (req, res) => {
  try {
    const updates = req.body;
    // Przetwórz każdą aktualizację notatki
    for (const update of updates) {
      await Note.update(
        { order: update.order },
        { where: { id: update.id, UserId: req.user.id } } // Upewnij się, że notatka należy do użytkownika
      );
    }
    res.json({ message: "Kolejność zaktualizowana pomyślnie" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint tworzenia notatki
app.post(
  "/api/notes",
  authenticateToken,
  upload.single("image"), // Obsłuż opcjonalne przesłanie obrazka
  async (req, res) => {
    try {
      const note = await Note.create({
        title: req.body.title,
        content: req.body.content,
        imagePath: req.file ? req.file.path : null,
        sensitive: req.body.sensitive === "true",
        UserId: req.user.id, // Powiąż notatkę z bieżącym użytkownikiem
      });
      res.json(note);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Pobierz wszystkie notatki bieżącego użytkownika
app.get("/api/notes", authenticateToken, async (req, res) => {
  try {
    const notes = await Note.findAll({
      where: { UserId: req.user.id },
      order: [["order", "ASC"]], // Sortuj według kolejności zdefiniowanej przez użytkownika
    });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint usuwania notatki
app.delete("/api/notes/:id", authenticateToken, async (req, res) => {
  try {
    // Znajdź notatkę upewniając się, że należy do bieżącego użytkownika
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

// Endpoint pobierania pojedynczej notatki
app.get("/api/notes/:id", authenticateToken, async (req, res) => {
  try {
    // Znajdź notatkę upewniając się, że należy do bieżącego użytkownika
    const note = await Note.findOne({
      where: {
        id: req.params.id,
        UserId: req.user.id,
      },
    });

    if (note) {
      res.json(note);
    } else {
      res.status(404).json({ error: "Nie znaleziono notatki" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint aktualizacji notatki
app.put(
  "/api/notes/:id",
  authenticateToken,
  upload.single("image"), // Obsłuż opcjonalną aktualizację obrazka
  async (req, res) => {
    try {
      const noteData = {
        title: req.body.title,
        content: req.body.content,
        sensitive: req.body.sensitive === "true",
      };

      // Dodaj ścieżkę obrazka jeśli przesłano nowy obraz
      if (req.file) {
        noteData.imagePath = req.file.path;
      }

      // Znajdź notatkę upewniając się, że należy do bieżącego użytkownika
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
        res.status(404).json({ error: "Nie znaleziono notatki" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Inicjalizacja serwera
const PORT = process.env.PORT || 3000;

// Synchronizuj modele bazy danych z bazą danych przed uruchomieniem serwera
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Serwer działa na porcie ${PORT}`);
  });
});
