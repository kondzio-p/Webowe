$(document).ready(function() {
    $('#addData').click(function() {
        const email = $('#email').val();
        const name = $('#name').val();
        const age = $('#age').val();

        // Dodawanie wiersza do tabeli
        $('#dataTable tbody').append(`
            <tr>
                <td>${email}</td>
                <td>${name}</td>
                <td>${age}</td>
            </tr>
        `);

        // Wypisanie danych w formie słownika w konsoli
        const data = { email: email, imię: name, wiek: age };
        console.log(data);

        // Resetowanie formularza
        $('#myForm')[0].reset();
    });
});