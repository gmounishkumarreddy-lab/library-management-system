# Library Management System (Full Stack)

A full-stack borrow/return library system built with the same architecture style
as your banking project: Spring Boot REST APIs with a layered design
(Controller → Service → Repository), JPA/Hibernate, and a React.js frontend.

## Tech Stack
- **Backend:** Java 17, Spring Boot 3, Spring Data JPA / Hibernate, Spring Validation, H2 (in-memory, swappable for MySQL/PostgreSQL), Maven
- **Frontend:** React 18, Axios
- **Architecture:** Layered backend (Controller → Service → Repository), DTOs for request payloads, centralized exception handling (`@RestControllerAdvice`)

## Features
- **Books:** add / list / update / delete, with total vs. available copy tracking
- **Members:** add / list / update / delete
- **Loans:** issue (borrow) a book to a member, return a book, view all loans, view loans by member, and view overdue loans
- Business rules enforced server-side: can't issue a book with 0 available copies, can't return an already-returned loan, duplicate ISBN/email rejected
- Due dates default to 14 days from issue (configurable per loan); loans past their due date are automatically flagged OVERDUE
- CORS enabled so the React app (port 3000) can call the Spring Boot API (port 8080)

## Project Structure
```
library-management-system/
├── backend/                     # Spring Boot app
│   ├── pom.xml
│   └── src/main/java/com/libraryapp/
│       ├── entity/               # Book, Member, Loan (+ enums)
│       ├── repository/           # Spring Data JPA repositories
│       ├── service/ + service/impl/   # Business logic layer (borrow/return rules)
│       ├── controller/           # REST controllers
│       ├── dto/                  # Request payloads
│       └── exception/            # Custom exceptions + global handler
├── frontend/                    # React app
│   └── src/
│       ├── components/           # BookList, MemberList, LoanList, Navbar
│       ├── services/api.js       # Axios wrapper around the REST API
│       └── App.js
└── README.md
```

## Running the Backend
```bash
cd backend
mvn spring-boot:run
```
- API base URL: `http://localhost:8080/api`
- H2 console: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:librarydb`, user `sa`, no password)
- Seed data (3 books, 2 members) loads automatically from `data.sql`

### Switching to MySQL / PostgreSQL
`application.properties` has a commented block with the MySQL config. Uncomment the
`mysql-connector-j` dependency in `pom.xml`, swap in the datasource properties, and
point it at a local database.

## Running the Frontend
```bash
cd frontend
npm install
npm start
```
- Opens at `http://localhost:3000`
- `package.json` has `"proxy": "http://localhost:8080"`, so API calls are forwarded
  to the Spring Boot backend automatically in development.

## Key REST Endpoints
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/books` | Add a book |
| GET | `/api/books` | List books |
| PUT | `/api/books/{id}` | Update a book |
| DELETE | `/api/books/{id}` | Delete a book |
| POST | `/api/members` | Add a member |
| GET | `/api/members` | List members |
| POST | `/api/loans/issue` | Issue (borrow) a book — `{ "bookId": 1, "memberId": 1, "loanDays": 14 }` |
| POST | `/api/loans/{id}/return` | Return a book |
| GET | `/api/loans` | List all loans (auto-refreshes overdue status) |
| GET | `/api/loans/member/{memberId}` | List a member's loan history |
| GET | `/api/loans/overdue` | List currently overdue loans |

## Possible Extensions
- Fines/penalties for overdue returns (e.g., a scheduled job + a fine amount on `Loan`)
- Reservations/waitlists when all copies are checked out
- Spring Security + JWT for librarian vs. member roles
- Email/SMS due-date reminders
- Swap H2 for MySQL/PostgreSQL for persistent storage (see above)
