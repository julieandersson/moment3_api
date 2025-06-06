# Moment 3 - backend - DT210G

## Uppgiftsbeskrivning
Denna uppgift är en del av moment 3 i kursen DT210G, Fördjupad frontend-utveckling och och gick ut på att skapa ett backend-API för ett lagersystem för produkthantering där inloggade användare kan hantera produkter. API:et är byggt med Hapi.js som backendramverk och MongoDB Atlas som databas och hanterar CRUD-operationer för skönhetsprodukter. Systemet stödjer inloggning med autentisering och sessionshantering via JWT, där token lagras som en HTTP-only cookie. 


## Funktionalitet
### Produktrelaterade endpoints:
- Lägga till en ny produkt (POST/products)
- Hämta alla produkter (GET/products)
- Hämta en specifik produkt (GET/products/{id})
- Uppdatera en produkt (PUT/products/{id})
- Radera en produkt (DELETE/products/{id})

Varje produkt innehåller fölhande:
- **name**: produktens namn
- **category**: vilken kategori produkten tillhör (endast tillåtna: ansiktskräm, rengöring och serum)
- **brand**: vilket märke produkten har
- **price**: produktens pris (priset kan inte vara mindre än1)
- **amountInStock**: hur många som finns i lager av varje produkt (antal i lager kan inte vara mindre än 0)

### Användarrelaterade endpoints
- Registrera en ny användare (POST/users)
- Logga in en användare (Skapar JWT-cookie) (POST/users/login)
- Logga ut en användare (raderar cookie) (GET/users/logout)
- Kontrollera om användaren är inloggad (GET/checkUser)
- Hämta alla användare (GET/users)
- Hämta en specifik användare (GET/users/{id})
- Uppdatera användarinfo (ej lösenord) (PUT/users/{id})
- Radera användare (DELETE/users/{id})

För denna applikation kommer endast funktionalitet för att logga in och ut användas i frontend. 

### Autentisering
- JWT används som autentiseringsmetod, där token lagras som en HTTP-only cookie (jwt)
- Endast inloggade användare kan skapa, uppdatera och radera produkter
- Sessionshantering sköts med @hapi/cookie

### Miljövariabler (.env)
Följande nycklar krävs i .env-filen för att projektet ska fungera:
```bash
PORT=5000
DATABASE="mongodb+srv://<username>:<password>@<cluster-url>/<database>?retryWrites=true&w=majority"
JWT_SECRET_KEY="secretkey"
COOKIE_PASSWORD="cookiekey"
```

## Teknologier
API:et använder följande teknologier:
- Hapi.js
- MongoDB Atlas
- Mongoose
- @hapi/jwt
- @hapi/cookie
- dotenv
- nodemon

## Skapad av:
- Julie Andersson
- Webbutvecklingsprogrammet på Mittuniversitetet i Sundsvall
- Moment 3 backend-API - kurs DT210g - Fördjupad frontend-utveckling