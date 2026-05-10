# SIMPRE_CC_Proiect

**Proiect Cloud Computing — Ivan Camelia - 1146**

## 1. Introducere

Proiectul **`SIMPRE_CC_Proiect`** este o aplicație web pentru gestionarea notițelor personale, dezvoltată cu **Next.js**. Aplicația permite utilizatorilor să își creeze un cont, să se autentifice securizat și să administreze notițe personale prin operații de creare, vizualizare, editare și ștergere.

Datele aplicației sunt stocate într-o bază de date **MongoDB**, iar autentificarea este realizată prin **JWT (JSON Web Token)**. Proiectul este gândit pentru rulare în cloud, cu implementare pe **Vercel** și utilizarea serviciului **MongoDB Atlas** pentru persistarea datelor.

Documentația de față prezintă structurat problema abordată, funcționalitățile aplicației, structura API-ului, fluxul de date și serviciile cloud utilizate.

## 2. Descriere problemă

Problema principală abordată de proiect este lipsa unei platforme simple, sigure și accesibile pentru gestionarea notițelor personale online. În mod obișnuit, utilizatorii își salvează ideile, sarcinile sau informațiile importante în fișiere locale, aplicații diferite sau notițe nesincronizate, ceea ce poate duce la:

- pierderea informațiilor importante;
- acces dificil de pe mai multe dispozitive;
- lipsa unei organizări clare;
- absența unui mecanism de autentificare pentru protejarea datelor personale;
- imposibilitatea administrării rapide a conținutului printr-o interfață web simplă.

Aplicația propusă rezolvă aceste probleme printr-un sistem centralizat de notițe, accesibil din browser, unde fiecare utilizator are propriul cont și propriile notițe. Prin autentificare cu token JWT, aplicația se asigură că utilizatorii pot accesa doar datele care le aparțin. Astfel, proiectul oferă o soluție practică pentru organizarea informațiilor personale într-un mod modern, rapid și securizat.

## 3. Descriere API

Aplicația include un API RESTful integrat în Next.js, definit în directorul **`src/pages/api/`**. API-ul gestionează două zone principale: autentificarea utilizatorilor și administrarea notițelor.

### 3.1 Endpoint-uri pentru utilizatori

#### `POST /api/users/register`

Înregistrează un utilizator nou.

- **Date primite:** `username`, `email`, `password`.
- **Validări:** toate câmpurile sunt obligatorii; emailul trebuie să fie unic.
- **Procesare:** parola este criptată folosind `bcryptjs`, apoi utilizatorul este salvat în colecția `users` din MongoDB.
- **Răspuns:** mesaj de confirmare la înregistrare sau mesaj de eroare dacă datele sunt invalide.

#### `POST /api/users/login`

Autentifică un utilizator existent.

- **Date primite:** `email`, `password`.
- **Validări:** verifică existența utilizatorului și compară parola introdusă cu parola criptată din baza de date.
- **Procesare:** dacă autentificarea reușește, se generează un token JWT valabil 24 de ore.
- **Răspuns:** token JWT folosit ulterior pentru accesarea rutelor protejate.

#### `GET /api/users/verify`

Verifică validitatea token-ului JWT.

- **Date primite:** token-ul este trimis în antetul HTTP `Authorization`, în formatul `Bearer <token>`.
- **Procesare:** token-ul este verificat cu cheia secretă `JWT_SECRET`.
- **Răspuns:** `true` dacă token-ul este valid sau `false` dacă token-ul este invalid/expirat.

### 3.2 Endpoint-uri pentru notițe

Endpoint-ul principal pentru notițe este **`/api/noteCtrl`**. Toate operațiile asupra notițelor necesită autentificare prin JWT.

#### `GET /api/noteCtrl`

Returnează toate notițele utilizatorului autentificat.

- **Autentificare:** necesită `Authorization: Bearer <token>`.
- **Procesare:** API-ul extrage `id`-ul utilizatorului din token și caută în colecția `notes` doar notițele asociate acelui utilizator.
- **Răspuns:** listă de notițe.

#### `GET /api/noteCtrl?id=<noteId>`

Returnează o notiță specifică.

- **Parametru:** `id` transmis în query string.
- **Validări:** verifică dacă `id` este un `ObjectId` valid.
- **Securitate:** notița este returnată doar dacă aparține utilizatorului autentificat.
- **Răspuns:** obiectul notiței sau eroare dacă notița nu există ori utilizatorul nu are acces.

#### `POST /api/noteCtrl`

Creează o notiță nouă.

- **Date primite:** `title`, `content`, opțional `date`.
- **Validări:** `title` și `content` sunt obligatorii.
- **Procesare:** notița este salvată cu `user_id`, numele utilizatorului, data creării și data ultimei actualizări.
- **Răspuns:** mesaj de confirmare și informații despre inserarea în baza de date.

#### `PUT /api/noteCtrl?id=<noteId>`

Actualizează o notiță existentă.

- **Parametru:** `id` transmis în query string.
- **Date primite:** `title`, `content`, `date`.
- **Validări:** verifică dacă `id` este valid.
- **Securitate:** actualizarea se face doar dacă notița aparține utilizatorului autentificat.
- **Răspuns:** mesaj de confirmare sau eroare dacă notița nu a fost găsită.

#### `DELETE /api/noteCtrl?id=<noteId>`

Șterge o notiță existentă.

- **Parametru:** `id` transmis în query string.
- **Validări:** verifică dacă `id` este valid.
- **Securitate:** ștergerea este permisă doar pentru notițele utilizatorului autentificat.
- **Răspuns:** mesaj de confirmare sau eroare dacă notița nu există ori nu aparține utilizatorului.

### 3.3 Metode HTTP utilizate

- **POST** — folosit pentru înregistrare, autentificare și creare de notițe.
- **GET** — folosit pentru verificarea autentificării și citirea notițelor.
- **PUT** — folosit pentru actualizarea notițelor.
- **DELETE** — folosit pentru ștergerea notițelor.

## 4. Flux de date

Aplicația urmează o arhitectură **client-server**, în care interfața web comunică prin cereri HTTP cu API-ul Next.js, iar API-ul interacționează cu baza de date MongoDB.

### 4.1 Pașii fluxului de autentificare

1. Utilizatorul completează formularul de înregistrare sau autentificare din interfața aplicației.
2. Clientul trimite datele către endpoint-ul corespunzător:
   - `POST /api/users/register` pentru creare cont;
   - `POST /api/users/login` pentru autentificare.
3. API-ul validează datele primite.
4. La înregistrare, parola este criptată și utilizatorul este salvat în MongoDB.
5. La autentificare, parola introdusă este comparată cu parola criptată din baza de date.
6. Dacă autentificarea este reușită, serverul generează un token JWT.
7. Token-ul este trimis către client și salvat în `localStorage`.
8. Pentru cererile protejate, clientul trimite token-ul în antetul `Authorization`.

### 4.2 Pașii fluxului pentru gestionarea notițelor

1. Utilizatorul autentificat accesează pagina de notițe.
2. Clientul trimite o cerere `GET /api/noteCtrl` cu token-ul JWT în antet.
3. API-ul verifică token-ul și identifică utilizatorul.
4. Serverul interoghează MongoDB și returnează doar notițele utilizatorului curent.
5. Pentru crearea unei notițe, clientul trimite `POST /api/noteCtrl` cu titlu, conținut și dată.
6. Pentru editarea unei notițe, clientul trimite `PUT /api/noteCtrl?id=<noteId>` cu noile valori.
7. Pentru ștergerea unei notițe, clientul trimite `DELETE /api/noteCtrl?id=<noteId>`.
8. După fiecare operație, interfața este actualizată pentru a reflecta datele curente.

### 4.3 Autentificare și autorizare

Autentificarea și autorizarea se realizează cu **JWT (JSON Web Token)**:

- token-ul este generat la autentificare;
- token-ul conține informații despre utilizator, precum `id`, `email` și `name`;
- token-ul este semnat folosind variabila de mediu `JWT_SECRET`;
- token-ul este inclus în antetul `Authorization` pentru cererile protejate;
- API-ul verifică token-ul înainte de accesarea sau modificarea notițelor;
- fiecare operație asupra notițelor este filtrată după `user_id`, pentru ca utilizatorii să nu poată accesa notițele altor conturi.

## 5. Servicii cloud și tehnologii utilizate

### Tehnologii principale

- **Next.js** — framework React folosit pentru interfața web și API routes.
- **React** — bibliotecă pentru construirea componentelor UI.
- **MongoDB** — bază de date NoSQL pentru utilizatori și notițe.
- **MongoDB Atlas** — serviciu cloud pentru găzduirea bazei de date.
- **Vercel** — platformă cloud pentru deploy-ul aplicației Next.js.
- **JWT** — mecanism de autentificare și autorizare.
- **bcryptjs** — criptarea parolelor înainte de salvarea în baza de date.
- **Tailwind CSS** — stilizare rapidă și responsive pentru interfață.

### Variabile de mediu necesare

Pentru rularea aplicației sunt necesare următoarele variabile de mediu:

```env
NEXT_ATLAS_URI=<conexiunea MongoDB Atlas>
NEXT_ATLAS_DATABASE=<numele bazei de date>
JWT_SECRET=<cheie secreta pentru semnarea token-urilor>
```

## 6. Reprezentare vizuală a aplicației

Interfața aplicației include următoarele pagini principale:

- **Login/Register** — permite autentificarea și crearea unui cont nou.
- **Notes** — afișează lista notițelor utilizatorului autentificat.
- **Create Note** — permite adăugarea unei notițe noi.
- **Edit Note** — permite modificarea titlului, conținutului și datei unei notițe.
- **About** — prezintă informații generale despre aplicație.

Designul este construit pentru a fi responsive și ușor de utilizat, cu accent pe claritatea formularelor, acces rapid la acțiunile principale și separarea vizuală a notițelor personale.