const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/listaZakupow', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Połączono z bazą danych MongoDB');
}).catch(err => {
  console.error('Błąd połączenia z bazą danych:', err);
});

const ShoppingListSchema = new mongoose.Schema({
  name: { type: String, required: true },
  store: { type: String, required: true },
  date: { type: Date, default: Date.now },
  items: [{
    name: { type: String, required: true },
    purchased: { type: Boolean, default: false }
  }]
});

const ShoppingList = mongoose.model('ShoppingList', ShoppingListSchema);

module.exports = { ShoppingList };