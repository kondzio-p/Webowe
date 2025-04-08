# Schemat Relacji i Technologii w Aplikacji Notatki

## Architektura ogólna
- **Frontend**: Angular 16+
- **Backend**: Node.js z Express
- **Baza danych**: SQLite zarządzana przez Sequelize ORM
- **Uwierzytelnianie**: JSON Web Tokens (JWT)

## Modele danych
- **User**: Przechowuje dane użytkowników
- **Note**: Przechowuje notatki z powiązaniem do użytkownika

## Relacje między komponentami

### Backend (Express)
1. **Server.js** - główny plik serwera
   - Konfiguracja Express
   - Definiowanie endpointów API
   - Middlewares (CORS, body-parser, JWT)
   - Obsługa przesyłania plików (multer)

2. **Modele**
   - **User**: powiązanie one-to-many z Note (jeden użytkownik ma wiele notatek)
   - **Note**: powiązanie many-to-one z User (wiele notatek należy do jednego użytkownika)

3. **API Endpoints**:
   - Uwierzytelnianie: `/api/users/register`, `/api/users/login`
   - Profil: `/api/users/profile-image`
   - Notatki: `/api/notes` (CRUD), `/api/notes/update-order`

### Frontend (Angular)
1. **Komponenty**:
   - **AuthComponent**: Logowanie i rejestracja
   - **HeaderComponent**: Nagłówek z profilem użytkownika
   - **NotesComponent**: Kontener dla listy notatek i formularza
   - **NoteFormComponent**: Tworzenie i edycja notatek
   - **NoteListComponent**: Wyświetlanie listy notatek

2. **Serwisy**:
   - **UserService**: Obsługa uwierzytelniania i zarządzanie sesją użytkownika
   - **NoteService**: Interakcja z API notatek
   - **AuthGuard**: Ochrona ścieżek wymagających uwierzytelnienia
   - **AuthInterceptor**: Dodawanie tokena JWT do zapytań HTTP

3. **Przepływ danych**:
   - Dane notatek są pobierane przez NoteService
   - Komunikacja komponentów odbywa się przez serwisy (wzorzec Observable)
   - Zarządzanie stanem odbywa się częściowo przez BehaviorSubject w serwisach

4. **Funkcje specjalne**:
   - Drag & drop dla sortowania notatek
   - Filtrowanie notatek po dacie
   - Zdjęcia profilowe i załączniki do notatek
   - Zaciemnianie wrażliwych notatek

## Technologie wspomagające
- **Bootstrap**: Stylizacja UI
- **Angular CDK**: Drag & Drop
- **RxJS**: Obsługa operacji asynchronicznych
- **bcrypt**: Hashowanie haseł
- **multer**: Obsługa przesyłania plików
