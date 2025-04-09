const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { ShoppingList } = require('./database');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Pobierz wszystkie listy zakupów
app.get('/api/lists', async (req, res) => {
  try {
    const lists = await ShoppingList.find();
    res.json(lists);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Pobierz listę zakupów po ID
app.get('/api/lists/:id', async (req, res) => {
  try {
    const list = await ShoppingList.findById(req.params.id);
    if (!list) return res.status(404).json({ message: 'Lista nie znaleziona' });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Dodaj nową listę zakupów
app.post('/api/lists', async (req, res) => {
  const list = new ShoppingList({
    name: req.body.name,
    store: req.body.store,
    date: req.body.date,
    items: req.body.items || []
  });

  try {
    const newList = await list.save();
    res.status(201).json(newList);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Aktualizuj listę zakupów
app.put('/api/lists/:id', async (req, res) => {
  try {
    const list = await ShoppingList.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!list) return res.status(404).json({ message: 'Lista nie znaleziona' });
    res.json(list);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Usuń listę zakupów
app.delete('/api/lists/:id', async (req, res) => {
  try {
    const list = await ShoppingList.findByIdAndDelete(req.params.id);
    if (!list) return res.status(404).json({ message: 'Lista nie znaleziona' });
    res.json({ message: 'Lista usunięta' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Dodaj produkt do listy
app.post('/api/lists/:id/items', async (req, res) => {
  try {
    const list = await ShoppingList.findById(req.params.id);
    if (!list) return res.status(404).json({ message: 'Lista nie znaleziona' });
    
    list.items.push({
      name: req.body.name,
      purchased: req.body.purchased || false
    });
    
    const updatedList = await list.save();
    res.status(201).json(updatedList);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Oznacz produkt jako kupiony/niekupiony
app.put('/api/lists/:listId/items/:itemId', async (req, res) => {
  try {
    const list = await ShoppingList.findById(req.params.listId);
    if (!list) return res.status(404).json({ message: 'Lista nie znaleziona' });
    
    const item = list.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ message: 'Produkt nie znaleziony' });
    
    item.purchased = req.body.purchased;
    
    const updatedList = await list.save();
    res.json(updatedList);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Usuń produkt z listy
app.delete('/api/lists/:listId/items/:itemId', async (req, res) => {
  try {
    const list = await ShoppingList.findById(req.params.listId);
    if (!list) return res.status(404).json({ message: 'Lista nie znaleziona' });
    
    list.items.pull(req.params.itemId);
    
    const updatedList = await list.save();
    res.json(updatedList);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Serwer uruchomiony na porcie ${PORT}`);
});