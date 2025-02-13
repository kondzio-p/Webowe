const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json())

const db = new sqlite3.Database('./users.db', (err)=>{
    if (err){
        console.error("Problem połączenia z bazą sqlite", err.message);
    } else {
        console.log("Połączono z bazą sqlite ");
    }
}
);

db.run(`CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
    )`,
    (err) => {
        if (err){
            console.error("Błąd tworzenia tabeli w bazie", err.message);
        } else {
            console.log("Utworzono tabelę users");
        }
    }
);

//rejestracja uzytkownika

app.post('/register', (req, res) =>{
    const {username,password} = req.body;
    if(!username || !password) {
        return res.status(400).json({message: 'Nazwa uzytkownika i haslo sa wyymagane'});
    }
    const query = `INSERT INTO users (username, password) VALUES (?, ?)`;
    db.run(query, [username, password], function(err){
        if (err){
            return res.status(500).json({message: 'Błąd rejestracji', error : err.message});
        }
        res.status(201).json({message: 'Rejestracja poprawna.', userId: this.lastID});
    });
});

app.listen(PORT, ()=>{
    console.log(`Serwer działa na porcie: ${PORT} `)
})


//logowanie uzytkownika

app.post('/login', (req, res) =>{
    const {username,password} = req.body;
    if(!username || !password) {
        return res.status(400).json({message: 'Nazwa uzytkownika i haslo sa wyymagane'});
    }
    const query = `SELECT * FROM users WHERE username = ? AND password = ?`
    db.get(query, [username,password], (err,row)=>{
        if(err){
            return res.status(500).json({message: "Błąd logowania", error: err.message});
        }
        if (!row){
            return res.status(401).json({message: "Błędne dane logowania"});
        }
        return res.status(201).json({message:"Logowanie udane.",user: row.username});
    });
});