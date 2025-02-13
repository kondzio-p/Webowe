"use strict";
let num = 22;
let str = "Hello World";
let prawda = true;
let x = null;
let y = undefined;
let cos = 43;
cos = "xxxxxx";
let xxxxx = 5;
if (typeof xxxxx === "number") {
    let num3 = xxxxx;
}
function logowanie() {
    console.log(" funkcja logowanie");
}
function log2(mess) {
    console.log(mess);
}
let mojWektor = [2, 3, 4,];
let mojaTupla = ["Technikum", 555];
var Color;
(function (Color) {
    Color[Color["Red"] = 0] = "Red";
    Color[Color["Blue"] = 1] = "Blue";
    Color[Color["Green"] = 2] = "Green";
})(Color || (Color = {}));
;
let kolor = Color.Blue;
let Osoba = { imie: "Anna", klasa: 4 };
let wartosc;
wartosc = "Krowa";
wartosc = 333;
wartosc = true; // tu jest blad typu ale skonwertowany do js
;
;
let szkola = { imie: "Jan", numer: 4 };
let mnozenie;
mnozenie = (x, y) => x * y;
let ocena;
ocena = 5;
//ocena = 8; błąd wartości
//----------------------------------
//petle
let mojePrzedmioty = ["Matma, Chemia", "Fizyka"];
console.log(mojePrzedmioty);
for (let i = 0; i <= mojePrzedmioty.length; i++) {
    console.log(mojePrzedmioty[i]);
}
for (let przedmiot of mojePrzedmioty) {
    console.log(przedmiot);
}
mojePrzedmioty.forEach((przedm) => {
    console.log(przedm);
});
mojePrzedmioty.push("Historia");
mojePrzedmioty.forEach((przedm) => {
    console.log(przedm);
});
mojePrzedmioty.pop();
mojePrzedmioty.forEach((przedm) => {
    console.log(przedm);
});
mojePrzedmioty.splice(1, 1, "j. angielski");
mojePrzedmioty.forEach((przedm) => {
    console.log(przedm);
});
let mojePrzedmiotyNowe = mojePrzedmioty.slice(1, 2);
mojePrzedmiotyNowe.forEach((przedm) => {
    console.log(przedm);
});
