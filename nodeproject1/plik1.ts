let num : number = 22;

let str : string = "Hello World";

let prawda : boolean = true;

let x : null = null;

let y : undefined = undefined;

let cos : any = 43;
cos = "xxxxxx";

let xxxxx : unknown = 5;

if(typeof xxxxx === "number"){
    let num3 : number = xxxxx;
}

function logowanie(): void{
    console.log(" funkcja logowanie");
}

function log2(mess: string): never{
    console.log(mess);
}

let mojWektor : number[] = [2,3,4,];

let mojaTupla :[string, number] = ["Technikum", 555];

enum Color{ Red, Blue, Green };
let kolor :  Color = Color.Blue;

let Osoba: {imie: string, klasa: number} = {imie:"Anna", klasa:4};

let wartosc : string | number;
wartosc = "Krowa";
wartosc = 333;
wartosc = true; // tu jest blad typu ale skonwertowany do js

interface Osoba {imie: string};
interface Klasa {numer: number};

let szkola : Osoba & Klasa = {imie: "Jan", numer : 4};

let mnozenie: (x: number, y:number) => number;
mnozenie = (x, y) =>  x * y;

let ocena : 1 | 2 | 3 | 4 | 5 | 6;
ocena = 5;
//ocena = 8; błąd wartości

//----------------------------------

//petle

let mojePrzedmioty : string[] = ["Matma, Chemia", "Fizyka"];
console.log(mojePrzedmioty);

for(let i = 0; i<=mojePrzedmioty.length; i++){
    console.log(mojePrzedmioty[i]);
}

for(let przedmiot of mojePrzedmioty) {
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

mojePrzedmioty.splice(1,1,"j. angielski");
mojePrzedmioty.forEach((przedm) => {
    console.log(przedm);
});

let mojePrzedmiotyNowe = mojePrzedmioty.slice(1,2);
mojePrzedmiotyNowe.forEach((przedm) => {
    console.log(przedm);
});