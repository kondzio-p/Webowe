//Po kliknięciu przycisku "Dodaj imię" pojawia się pole input, w któym użytkownik może wpisać swoje imię oraz przycisk "Wyświetl powitanie".
//Gdy użytkownik wpisze swoje imię i kliknie drugi przycisk "Wyświetl powitanie", pojawia się wyskakujące okoenko (alert) z komunikatem "Witaj, imię". Jeśli użytkownik nie wpisze imienia należy wyświetlić odpowiedni komunikat.
//Po kliknięciu przycisku "Wyświetl powitanie pole input zostaje wyczyszczone i ukryte"
$(document).ready(function(){

    $("#showPowitanie").hide();
    $("#inputName").hide();


    //Po kliknięciu przycisku o id "addName" "Dodaj imię" pojawia się pole input, w któym użytkownik może wpisać swoje imię oraz przycisk "Wyświetl powitanie".
    $("#addName").click(function() {
        $("#inputName").show();
        $("#showPowitanie").show();
    });

    //Gdy użytkownik wpisze swoje imię i kliknie drugi przycisk "Wyświetl powitanie", pojawia się wyskakujące okoenko (alert) z komunikatem "Witaj, imię". Jeśli użytkownik nie wpisze imienia należy wyświetlić odpowiedni komunikat.
    $("#showPowitanie").click(function() {
        var name = $("#inputName").val();
        if (name == "") {
            alert("Wpisz swoje imię");
            } 
            else {
                alert("Witaj, " + name);
            }
            });
    
    //Po kliknięciu przycisku "Wyświetl powitanie" pole input zostaje wyczyszczone i ukryte"
    $("#showPowitanie").click(function() {
        $("#inputName").val("");
        $("#inputName").hide();
        $("#showPowitanie").hide();
    });
                
    
    });