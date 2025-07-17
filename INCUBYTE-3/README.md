# Sweet Shop Management System

A simple Sweet Shop Management System built with Node.js, Express, and TDD. Features include add, update, delete, search, sort, view, pagination, authentication, and a web front-end.

## Features
- Add, update, delete sweets (with authentication)
- View, search, and sort sweets
- Pagination support
- Data persistence (JSON file)
- Simple web front-end

## Setup
1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Run the server:**
   ```sh
   node index.js
   ```
   The API will be available at [http://localhost:3000](http://localhost:3000)

3. **Run tests:**
   ```sh
   npm test
   ```

## API Endpoints

### Authentication
- For add, update, and delete operations, include the header:
  ```
  Authorization: Bearer secret-token
  ```

### Sweets
- `GET /sweets` — View all sweets (supports `limit` and `offset` query params for pagination)
- `POST /sweets` — Add a sweet (auth required)
- `PUT /sweets/:id` — Update a sweet (auth required)
- `DELETE /sweets/:id` — Delete a sweet (auth required)
- `GET /sweets/search?q=...` — Search sweets by name
- `GET /sweets/sort?field=...` — Sort sweets by a field (e.g., `name`, `price`, `quantity`, `category`)

### Example curl requests
- Add a sweet:
  ```sh
  curl -X POST http://localhost:3000/sweets -H "Authorization: Bearer secret-token" -H "Content-Type: application/json" -d '{"name":"Ladoo","price":10,"quantity":50,"category":"Traditional"}'
  ```
- View all sweets:
  ```sh
  curl http://localhost:3000/sweets
  ```
- Update a sweet:
  ```sh
  curl -X PUT http://localhost:3000/sweets/1 -H "Authorization: Bearer secret-token" -H "Content-Type: application/json" -d '{"name":"Barfi","price":15}'
  ```
- Delete a sweet:
  ```sh
  curl -X DELETE http://localhost:3000/sweets/1 -H "Authorization: Bearer secret-token"
  ```
- Search sweets:
  ```sh
  curl "http://localhost:3000/sweets/search?q=la"
  ```
- Sort sweets:
  ```sh
  curl "http://localhost:3000/sweets/sort?field=price"
  ```

## Front-End
- Open `public/index.html` in your browser (or access [http://localhost:3000](http://localhost:3000) if running locally)
- Use the web interface to manage sweets

## Data Persistence
- Sweets are saved in `sweetshop/sweets.json` automatically.

## License
MIT 