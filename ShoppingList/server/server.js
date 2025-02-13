const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

let stores = [];

// Pobierz wszystkie sklepy
app.get('/stores', (req, res) => {
  res.json(stores);
});

// Dodaj nowy sklep
app.post('/stores', (req, res) => {
  const newStore = { ...req.body, id: stores.length + 1 }; // Dodaj unikalne ID
  stores.push(newStore);
  res.json(newStore);
});

// Aktualizuj konkretny sklep
app.put('/stores/:id', (req, res) => {
  const storeId = parseInt(req.params.id);
  const updatedStore = req.body;

  const index = stores.findIndex(store => store.id === storeId);
  if (index !== -1) {
    stores[index] = updatedStore;
    res.json(updatedStore);
  } else {
    res.status(404).json({ message: 'Store not found' });
  }
});

// Usuń sklep
app.delete('/stores/:id', (req, res) => {
  const storeId = parseInt(req.params.id);
  stores = stores.filter(store => store.id !== storeId);
  res.json(stores);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});