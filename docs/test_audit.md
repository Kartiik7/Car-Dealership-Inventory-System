# Test Suite Audit — Car Dealership Inventory System

> **Auditor perspective**: Senior QA Automation Engineer & Test Architect  
> **Total test files**: 12 (5 backend · 7 frontend)  
> **Total test cases**: 43  
> **Frameworks**: Jest 30 + Supertest 7 (backend) · Vitest 4 + Testing Library 16 (frontend)  
> **Test DB strategy**: Real MongoDB on `car_inventory_test_db`, wiped `afterEach`

---

## Legend

| Symbol | Meaning |
|---|---|
| 🟢 | Happy Path / Positive Scenario |
| 🟡 | Input Validation / Edge Case |
| 🔴 | Security / Auth / RBAC |
| 🟠 | Error Handling / DB Failure |
| 🔵 | State & Business Logic Boundary |

---

## Module 1 — Authentication API (Backend)

**File**: [`backend/tests/auth.test.js`](file:///d:/IncuByte_Assignment/backend/tests/auth.test.js)  
**Framework**: Jest + Supertest (integration, real DB)  
**Suite**: `describe('Auth API')`

---

### TC-001 🟢

| Field | Detail |
|---|---|
| **Test description** | `creates a new user and returns a JWT token with the user object` |
| **Input / payload** | `POST /api/auth/register` → `{ name: "Test User", email: "test@example.com", password: "password123" }` |
| **Expected assertion** | HTTP `201`; body has `.token` (string); body has `.user` with `{ name: "Test User", email: "test@example.com" }` |
| **Classification** | Happy Path |

---

### TC-002 🟠

| Field | Detail |
|---|---|
| **Test description** | `returns 400 with 'User already exists' if email exists` |
| **Input / payload** | Two sequential `POST /api/auth/register` calls with identical `email: "test@example.com"` |
| **Expected assertion** | Second call → HTTP `400`; body `{ message: "User already exists" }` |
| **Classification** | Error Handling — Duplicate key violation (email uniqueness) |

---

### TC-003 🟢

| Field | Detail |
|---|---|
| **Test description** | `authenticates valid user credentials and returns a token` |
| **Input / payload** | `POST /api/auth/login` → `{ email: "login@example.com", password: "password123" }` (user seeded in `beforeEach`) |
| **Expected assertion** | HTTP `200`; body has `.token` (string) |
| **Classification** | Happy Path |

---

### TC-004 🔴

| Field | Detail |
|---|---|
| **Test description** | `returns 401 with 'Invalid credentials' for an incorrect password` |
| **Input / payload** | `POST /api/auth/login` → `{ email: "login@example.com", password: "wrongpassword" }` |
| **Expected assertion** | HTTP `401`; body `{ message: "Invalid credentials" }` |
| **Classification** | Security — Credential rejection |

---

## Module 2 — Auth Middleware (Backend)

**File**: [`backend/tests/authMiddleware.test.js`](file:///d:/IncuByte_Assignment/backend/tests/authMiddleware.test.js)  
**Framework**: Jest + Supertest (integration, real DB)  
**Suite**: `describe('Auth middleware')`  
**Setup**: Registers two sentinel routes on the live Express `app` instance — `GET /api/test/protected` and `GET /api/test/admin` — to isolate middleware behaviour from business controllers.

---

### TC-005 🔴

| Field | Detail |
|---|---|
| **Test description** | `returns 401 'No token provided' if Authorization header is missing` |
| **Input / payload** | `GET /api/test/protected` — no `Authorization` header |
| **Expected assertion** | HTTP `401`; body `{ message: "No token provided" }` |
| **Classification** | Security — Missing token |

---

### TC-006 🔴

| Field | Detail |
|---|---|
| **Test description** | `returns 401 'Invalid or expired token' for malformed JWT tokens` |
| **Input / payload** | `GET /api/test/protected` with `Authorization: Bearer malformed.token` |
| **Expected assertion** | HTTP `401`; body `{ message: "Invalid or expired token" }` |
| **Classification** | Security — Malformed / tampered JWT |

---

### TC-007 🔴

| Field | Detail |
|---|---|
| **Test description** | `returns 403 'Access denied' when a standard user tries to access an admin-only route` |
| **Input / payload** | Register + login as `role: "user"` → `GET /api/test/admin` with valid user token |
| **Expected assertion** | HTTP `403`; body `{ message: "Access denied" }` |
| **Classification** | Security / RBAC — Insufficient role (user → admin resource) |

---

### TC-008 🟢

| Field | Detail |
|---|---|
| **Test description** | `passes through and returns 200 when a valid admin token is used` |
| **Input / payload** | `User.create({ role: "admin" })` → login → `GET /api/test/admin` with admin token |
| **Expected assertion** | HTTP `200`; body `{ message: "ok" }` |
| **Classification** | Happy Path — Admin role access |

---

## Module 3 — Car Inventory CRUD (Backend)

**File**: [`backend/tests/car.test.js`](file:///d:/IncuByte_Assignment/backend/tests/car.test.js)  
**Framework**: Jest + Supertest (integration, real DB)  
**Suite**: `describe('Car Inventory API')`  
**Setup**: `beforeEach` creates a `role: "user"` and a `role: "admin"` via register/login; stores both tokens.

---

### TC-009 🟢

| Field | Detail |
|---|---|
| **Test description** | `GET /api/cars returns 200 and a list of cars` |
| **Input / payload** | `GET /api/cars` with valid user Bearer token; empty DB |
| **Expected assertion** | HTTP `200`; body is an array (`Array.isArray === true`) |
| **Classification** | Happy Path — Authenticated read of empty collection |

---

### TC-010 🟢

| Field | Detail |
|---|---|
| **Test description** | `GET /api/cars/:id returns 200 and the car if found` |
| **Input / payload** | Admin creates car `{ make: "Toyota", model: "Camry", year: 2024, price: 30000, vin: "1HGCM82633A123456" }` → user reads by returned `_id` |
| **Expected assertion** | HTTP `200`; body has `._id` matching the created car's ID |
| **Classification** | Happy Path — Read by ID |

---

### TC-011 🔴

| Field | Detail |
|---|---|
| **Test description** | `POST /api/cars returns 403 for a normal user` |
| **Input / payload** | `POST /api/cars` with user (non-admin) token → `{ make: "Toyota", model: "Camry", year: 2024, price: 30000, vin: "1HGCM82633A123456" }` |
| **Expected assertion** | HTTP `403` |
| **Classification** | Security / RBAC — User attempting admin-only create |

---

### TC-012 🟢

| Field | Detail |
|---|---|
| **Test description** | `POST /api/cars returns 201 and the created car for an admin` |
| **Input / payload** | `POST /api/cars` with admin token → `{ make: "Toyota", model: "Camry", year: 2024, price: 30000, status: "available", vin: "1HGCM82633A123456" }` |
| **Expected assertion** | HTTP `201`; body matches `{ make: "Toyota", model: "Camry", year: 2024, price: 30000, status: "available", vin: "1HGCM82633A123456" }` |
| **Classification** | Happy Path — Admin vehicle creation |

---

### TC-013 🟢

| Field | Detail |
|---|---|
| **Test description** | `PUT /api/cars/:id returns 200 and the updated car for an admin` |
| **Input / payload** | Admin creates Toyota Camry → admin `PUT` with `{ make: "Honda", model: "Accord", year: 2025, price: 35000, status: "sold", vin: "2HGCM82633A654321" }` |
| **Expected assertion** | HTTP `200`; body reflects all updated field values |
| **Classification** | Happy Path — Admin vehicle update |

---

### TC-014 🟢

| Field | Detail |
|---|---|
| **Test description** | `DELETE /api/cars/:id returns 200 when deleted by an admin` |
| **Input / payload** | Admin creates Toyota Camry → admin `DELETE /api/cars/:id` |
| **Expected assertion** | HTTP `200` |
| **Classification** | Happy Path — Admin vehicle deletion |

---

## Module 4 — Vehicle Purchase & Restock (Backend)

**File**: [`backend/tests/vehiclePurchaseRestock.test.js`](file:///d:/IncuByte_Assignment/backend/tests/vehiclePurchaseRestock.test.js)  
**Framework**: Jest + Supertest (integration, real DB)  
**Suite**: `describe('Vehicle Purchase and Restock API')`  
**Setup**: `beforeEach` seeds user + admin tokens; creates `sampleCar` via `Car.create()` with `quantity: 2`.

---

### TC-015 🔴

| Field | Detail |
|---|---|
| **Test description** | `returns 401 when purchase is attempted without token` |
| **Input / payload** | `POST /api/vehicles/:id/purchase` — no `Authorization` header |
| **Expected assertion** | HTTP `401` |
| **Classification** | Security — Unauthenticated purchase attempt |

---

### TC-016 🟠

| Field | Detail |
|---|---|
| **Test description** | `returns 404 when purchasing a non-existent vehicle` |
| **Input / payload** | `POST /api/vehicles/000000000000000000000000/purchase` with valid user token (valid but non-existent ObjectId) |
| **Expected assertion** | HTTP `404` |
| **Classification** | Error Handling — Non-existent resource by valid ObjectId |

---

### TC-017 🟢

| Field | Detail |
|---|---|
| **Test description** | `decreases vehicle quantity by 1 for authenticated user` |
| **Input / payload** | `POST /api/vehicles/:id/purchase` with user token; `sampleCar.quantity = 2` |
| **Expected assertion** | HTTP `200`; response body `quantity === 1` |
| **Classification** | Happy Path + State Boundary — Quantity decrement |

---

### TC-018 🔵

| Field | Detail |
|---|---|
| **Test description** | `returns 400 when attempting to purchase an out of stock vehicle (quantity === 0)` |
| **Input / payload** | Mutates `sampleCar.quantity = 0; await sampleCar.save()` → `POST /api/vehicles/:id/purchase` with user token |
| **Expected assertion** | HTTP `400`; body message matches `/out of stock/i` |
| **Classification** | Business Logic Boundary — Zero-stock purchase prevention |

---

### TC-019 🔴

| Field | Detail |
|---|---|
| **Test description** | `returns 401 when restock is attempted without token` |
| **Input / payload** | `POST /api/vehicles/:id/restock` — no `Authorization` header |
| **Expected assertion** | HTTP `401` |
| **Classification** | Security — Unauthenticated restock attempt |

---

### TC-020 🔴

| Field | Detail |
|---|---|
| **Test description** | `returns 403 when a non-admin user attempts restock` |
| **Input / payload** | `POST /api/vehicles/:id/restock` with user (non-admin) token → `{ amount: 5 }` |
| **Expected assertion** | HTTP `403` |
| **Classification** | Security / RBAC — User attempting admin-only restock |

---

### TC-021 🟢

| Field | Detail |
|---|---|
| **Test description** | `increases vehicle quantity by specified amount for admin user` |
| **Input / payload** | `POST /api/vehicles/:id/restock` with admin token → `{ amount: 5 }` ; `sampleCar.quantity = 2` |
| **Expected assertion** | HTTP `200`; response body `quantity === 7` (2 + 5) |
| **Classification** | Happy Path — Admin restock with explicit amount |

---

### TC-022 🟡

| Field | Detail |
|---|---|
| **Test description** | `increases vehicle quantity by default 1 if amount is not specified for admin` |
| **Input / payload** | `POST /api/vehicles/:id/restock` with admin token — **no request body** |
| **Expected assertion** | HTTP `200`; response body `quantity === 3` (2 + 1 default) |
| **Classification** | Edge Case — Missing/undefined `amount` triggers default fallback |

---

## Module 5 — Vehicle Search (Backend)

**File**: [`backend/tests/vehicleSearch.test.js`](file:///d:/IncuByte_Assignment/backend/tests/vehicleSearch.test.js)  
**Framework**: Jest + Supertest (integration, real DB)  
**Suite**: `describe('GET /api/vehicles/search')`  
**Setup**: Seeds 4 cars in `beforeEach`: Toyota Camry (Sedan $25k), Toyota RAV4 (SUV $32k), Honda Civic (Sedan $22k), Ford F-150 (Truck $45k).

---

### TC-023 🔴

| Field | Detail |
|---|---|
| **Test description** | `returns 401 when search is attempted without token` |
| **Input / payload** | `GET /api/vehicles/search` — no `Authorization` header |
| **Expected assertion** | HTTP `401` |
| **Classification** | Security — Unauthenticated search attempt |

---

### TC-024 🟢

| Field | Detail |
|---|---|
| **Test description** | `filters vehicles by make (case-insensitive substring)` |
| **Input / payload** | `GET /api/vehicles/search?make=toy` with user token |
| **Expected assertion** | HTTP `200`; body length `=== 2`; all results contain `"toy"` in `make` (case-insensitive) |
| **Classification** | Happy Path — Case-insensitive partial make filter |

---

### TC-025 🟢

| Field | Detail |
|---|---|
| **Test description** | `filters vehicles by model (case-insensitive substring)` |
| **Input / payload** | `GET /api/vehicles/search?model=civic` with user token |
| **Expected assertion** | HTTP `200`; body length `=== 1`; `body[0].model === "Civic"` |
| **Classification** | Happy Path — Case-insensitive partial model filter |

---

### TC-026 🟢

| Field | Detail |
|---|---|
| **Test description** | `filters vehicles by category (case-insensitive substring)` |
| **Input / payload** | `GET /api/vehicles/search?category=suv` with user token |
| **Expected assertion** | HTTP `200`; body length `=== 1`; `body[0].category === "SUV"` |
| **Classification** | Happy Path — Case-insensitive category filter |

---

### TC-027 🟢

| Field | Detail |
|---|---|
| **Test description** | `filters vehicles by minPrice and maxPrice range` |
| **Input / payload** | `GET /api/vehicles/search?minPrice=23000&maxPrice=35000` with user token |
| **Expected assertion** | HTTP `200`; body length `=== 2` (Camry $25k + RAV4 $32k); all results `price >= 23000 && price <= 35000` |
| **Classification** | Happy Path — Numeric price range filter |

---

### TC-028 🟢

| Field | Detail |
|---|---|
| **Test description** | `combines multiple query parameters` |
| **Input / payload** | `GET /api/vehicles/search?make=Toyota&category=Sedan&maxPrice=30000` with user token |
| **Expected assertion** | HTTP `200`; body length `=== 1`; `body[0].model === "Camry"` |
| **Classification** | Happy Path — Multi-parameter compound filter |

---

## Module 6 — Protected Route Guard (Frontend)

**File**: [`frontend/src/tests/ProtectedRoute.test.jsx`](file:///d:/IncuByte_Assignment/frontend/src/tests/ProtectedRoute.test.jsx)  
**Framework**: Vitest + Testing Library (jsdom)  
**Suite**: `describe('ProtectedRoute')`

---

### TC-029 🔴

| Field | Detail |
|---|---|
| **Test description** | `redirects unauthenticated users to /login` |
| **Input / payload** | `AuthContext` value `{ user: null, token: "" }`; navigate to `/protected` |
| **Expected assertion** | Component renders `"Login Page"` (redirect fired to `/login`) |
| **Classification** | Security — Unauthenticated route access |

---

### TC-030 🟢

| Field | Detail |
|---|---|
| **Test description** | `renders children when user is authenticated` |
| **Input / payload** | `AuthContext` value `{ user: { role: "admin" }, token: "token" }`; render `ProtectedRoute` with child `"Secret Content"` |
| **Expected assertion** | `"Secret Content"` is in the document |
| **Classification** | Happy Path — Authenticated route pass-through |

---

## Module 7 — Auth Pages UI (Frontend)

**File**: [`frontend/src/tests/AuthPages.test.jsx`](file:///d:/IncuByte_Assignment/frontend/src/tests/AuthPages.test.jsx)  
**Framework**: Vitest + Testing Library (jsdom)  
**Suite**: `describe('Auth pages')`

---

### TC-031 🟢

| Field | Detail |
|---|---|
| **Test description** | `renders the Login form fields and submit button` |
| **Input / payload** | Render `<Login />` with null auth context |
| **Expected assertion** | Email input, password input, and Login button are present in DOM |
| **Classification** | Happy Path — Form field rendering |

---

### TC-032 🟢

| Field | Detail |
|---|---|
| **Test description** | `renders the Register form fields` |
| **Input / payload** | Render `<Register />` without auth context |
| **Expected assertion** | Name, email, and password inputs are present in DOM |
| **Classification** | Happy Path — Form field rendering |

---

### TC-033 🟢

| Field | Detail |
|---|---|
| **Test description** | `submits the Login form with mocked API response` |
| **Input / payload** | `fetch` stubbed to return `{ ok: true, json: () => ({ token: "token" }) }`; fill email + password; click Login |
| **Expected assertion** | `fetch` is called (interaction confirmed) |
| **Classification** | Happy Path — Login form submission triggers fetch |

---

### TC-034 🟠

| Field | Detail |
|---|---|
| **Test description** | `shows an error message for invalid login credentials` |
| **Input / payload** | `fetch` stubbed to return `{ ok: false, json: () => ({ message: "Invalid login credentials" }) }`; fill + submit Login form |
| **Expected assertion** | Error text `"Invalid login credentials"` appears in DOM |
| **Classification** | Error Handling — Failed login API response displayed to user |

---

## Module 8 — Navbar UI (Frontend)

**File**: [`frontend/src/tests/Navbar.test.jsx`](file:///d:/IncuByte_Assignment/frontend/src/tests/Navbar.test.jsx)  
**Framework**: Vitest + Testing Library (jsdom)  
**Suite**: `describe('Navbar')`

---

### TC-035 🟢

| Field | Detail |
|---|---|
| **Test description** | `renders the brand title and login link when unauthenticated` |
| **Input / payload** | `<Navbar />` with no props (default `isAuthenticated = undefined`) |
| **Expected assertion** | `"Car Dealership Inventory"` brand text present; `"Login"` link present |
| **Classification** | Happy Path — Unauthenticated nav state |

---

### TC-036 🟢

| Field | Detail |
|---|---|
| **Test description** | `renders the logout button when authenticated` |
| **Input / payload** | `<Navbar isAuthenticated />` (`isAuthenticated = true`) |
| **Expected assertion** | `Logout` button is present in DOM |
| **Classification** | Happy Path — Authenticated nav state |

---

## Module 9 — Car List Component (Frontend)

**File**: [`frontend/src/tests/CarList.test.jsx`](file:///d:/IncuByte_Assignment/frontend/src/tests/CarList.test.jsx)  
**Framework**: Vitest + Testing Library (jsdom)  
**Suite**: `describe('CarList')`  
**Note**: Renders without `AuthContext` — no token, no role. Components that call `useAuth()` receive `null` context.

---

### TC-037 🟢

| Field | Detail |
|---|---|
| **Test description** | `renders each car in the inventory` |
| **Input / payload** | `cars` prop: `[{ make: "Honda", model: "Civic", year: 2021, price: 22000 }, { make: "Toyota", model: "Corolla", year: 2022, price: 24000 }]` |
| **Expected assertion** | All 8 text values (make, model, year, price for both cars) are present in DOM |
| **Classification** | Happy Path — List rendering |

---

### TC-038 🟡

| Field | Detail |
|---|---|
| **Test description** | `renders an empty state when there are no cars` |
| **Input / payload** | `cars` prop: `[]` (empty array) |
| **Expected assertion** | Text `"No cars in inventory"` is present in DOM |
| **Classification** | Edge Case — Empty collection empty state rendering |

---

## Module 10 — Admin Inventory UI (Frontend)

**File**: [`frontend/src/tests/AdminInventory.test.jsx`](file:///d:/IncuByte_Assignment/frontend/src/tests/AdminInventory.test.jsx)  
**Framework**: Vitest + Testing Library (jsdom)  
**Suite**: `describe('AdminInventory')`  
**Fixture**: `cars = [{ _id: "1", make: "Honda", model: "Civic", year: 2021, price: 22000, status: "available", vin: "VIN1" }]`

---

### TC-039 🔴

| Field | Detail |
|---|---|
| **Test description** | `renders Add New Car only for admin users` |
| **Input / payload** | Render twice: once with `{ user: { role: "admin" }, token: "admin-token" }`, once with `{ user: { role: "user" }, token: "user-token" }` |
| **Expected assertion** | Admin render: "Add New Car" button present. User render: button absent. |
| **Classification** | Security / RBAC — Role-conditional UI element rendering |

---

### TC-040 🟢

| Field | Detail |
|---|---|
| **Test description** | `opens a modal form with all fields when Add New Car is clicked` |
| **Input / payload** | Admin auth context; click "Add New Car" |
| **Expected assertion** | `dialog` role present; all field labels (Make, Model, Year, Price, Status, VIN) are in DOM |
| **Classification** | Happy Path — Modal open + field presence |

---

### TC-041 🟢

| Field | Detail |
|---|---|
| **Test description** | `populates the modal form when Edit is clicked` |
| **Input / payload** | Admin auth context; click "Edit" on the Honda Civic fixture |
| **Expected assertion** | Form displays current values: `"Honda"`, `"Civic"`, `2021`, `22000`, `"available"`, `"VIN1"` |
| **Classification** | Happy Path — Edit pre-population |

---

### TC-042 🔴

| Field | Detail |
|---|---|
| **Test description** | `sends a delete request with a Bearer token` |
| **Input / payload** | `fetch` stubbed; admin auth context `{ token: "admin-token" }`; click "Delete" |
| **Expected assertion** | `fetch` called with `DELETE /api/cars/1` and `Authorization: "Bearer admin-token"` header |
| **Classification** | Security — Verifies token is attached to mutating requests |

---

## Module 11 — Search & Purchase UI Integration (Frontend)

**File**: [`frontend/src/tests/SearchPurchase.test.jsx`](file:///d:/IncuByte_Assignment/frontend/src/tests/SearchPurchase.test.jsx)  
**Framework**: Vitest + Testing Library (jsdom)  
**Suite**: `describe('Search and Purchase UI Integration')`  
**Fixture**: Two cars — Toyota Camry (qty: 2, in stock), Ford F-150 (qty: 0, out of stock).

---

### TC-043-A 🟢

| Field | Detail |
|---|---|
| **Test description** | `renders search filter inputs for search bar, category, and price range` |
| **Input / payload** | Render `<CarList>` with user auth context |
| **Expected assertion** | Search input, category select, min price input, max price input all present |
| **Classification** | Happy Path — Filter UI rendering |

---

### TC-043-B 🔵

| Field | Detail |
|---|---|
| **Test description** | `disables Purchase button and displays 'Out of Stock' when vehicle quantity is 0` |
| **Input / payload** | Ford F-150 fixture with `quantity: 0`; user auth context |
| **Expected assertion** | Button with text `"Out of Stock"` is in DOM and `disabled` attribute is set |
| **Classification** | Business Logic Boundary — Zero-stock UI state |

---

### TC-043-C 🟢

| Field | Detail |
|---|---|
| **Test description** | `enables Purchase button when vehicle quantity > 0` |
| **Input / payload** | Toyota Camry fixture with `quantity: 2`; user auth context |
| **Expected assertion** | At least one "Purchase" button is in DOM and NOT disabled |
| **Classification** | Happy Path — In-stock purchase availability |

---

### TC-043-D 🔴

| Field | Detail |
|---|---|
| **Test description** | `renders Restock button for admin users` |
| **Input / payload** | Admin auth context `{ user: { role: "admin" }, token: "admin-token" }` |
| **Expected assertion** | At least one "Restock" button is present in DOM |
| **Classification** | Security / RBAC — Role-conditional action rendering |

---

## Module 12 — App Integration E2E (Frontend)

**File**: [`frontend/src/tests/AppIntegration.test.jsx`](file:///d:/IncuByte_Assignment/frontend/src/tests/AppIntegration.test.jsx)  
**Framework**: Vitest + Testing Library (jsdom)  
**Suite**: `describe('App Integration')`  
**Setup**: `vi.stubGlobal('fetch', vi.fn())` per test; uses `MemoryRouter` with `initialEntries`.

---

### TC-044 🟢

| Field | Detail |
|---|---|
| **Test description** | `renders login form and submits credentials storing JWT via login handler` |
| **Input / payload** | `fetch` returns `{ ok: true, json: () => ({ token: "fake-admin-jwt-token", user: { role: "admin" } }) }`; fill email/password; click Login |
| **Expected assertion** | `fetch` called with `POST /api/auth/login` + correct body; `login(fakeAdminPayload, fakeAdminToken)` spy called with correct args |
| **Classification** | Happy Path — Login flow → JWT storage → AuthContext mutation |

---

### TC-045 🟢

| Field | Detail |
|---|---|
| **Test description** | `admin user can fetch car list, open CarModal, and see inventory` |
| **Input / payload** | Admin auth context; navigate to `/inventory`; `cars` prop: `[Toyota Camry, Honda Accord]` |
| **Expected assertion** | `"Inventory"` heading present; car makes rendered; "Add New Car" button visible; click opens modal with all fields |
| **Classification** | Happy Path — Authenticated inventory + modal render |

---

### TC-046 🟢

| Field | Detail |
|---|---|
| **Test description** | `admin can fill CarModal form and submit new car` |
| **Input / payload** | Admin auth; click "Add New Car"; fill form: `{ make: "Ford", model: "Mustang", year: "2024", price: "55000", vin: "VIN999" }`; click Save |
| **Expected assertion** | After submit, `dialog` is no longer in DOM (modal closes on success) |
| **Classification** | Happy Path — Full form submission flow |

---

### TC-047 🔴

| Field | Detail |
|---|---|
| **Test description** | `logout clears auth state and redirects to login page` |
| **Input / payload** | Start with admin auth at `/inventory`; call `logoutFn()`; rerender with `{ user: null, token: "" }`; re-navigate to `/inventory` |
| **Expected assertion** | Email/password inputs rendered (redirected to login); `logoutFn` confirmed called |
| **Classification** | Security — Logout clears auth, triggers redirect |

---

## Consolidated Summary Table

| TC# | Module | File | Category | HTTP Status | Description (short) |
|---|---|---|---|---|---|
| TC-001 | Auth API | `auth.test.js` | 🟢 Happy Path | 201 | Register returns token + user |
| TC-002 | Auth API | `auth.test.js` | 🟠 Error | 400 | Duplicate email on register |
| TC-003 | Auth API | `auth.test.js` | 🟢 Happy Path | 200 | Login returns token |
| TC-004 | Auth API | `auth.test.js` | 🔴 Security | 401 | Wrong password rejected |
| TC-005 | Middleware | `authMiddleware.test.js` | 🔴 Security | 401 | Missing Authorization header |
| TC-006 | Middleware | `authMiddleware.test.js` | 🔴 Security | 401 | Malformed JWT rejected |
| TC-007 | Middleware | `authMiddleware.test.js` | 🔴 RBAC | 403 | User → admin route denied |
| TC-008 | Middleware | `authMiddleware.test.js` | 🟢 Happy Path | 200 | Admin accesses admin route |
| TC-009 | CRUD | `car.test.js` | 🟢 Happy Path | 200 | GET all cars (empty list) |
| TC-010 | CRUD | `car.test.js` | 🟢 Happy Path | 200 | GET car by ID |
| TC-011 | CRUD | `car.test.js` | 🔴 RBAC | 403 | User → POST car denied |
| TC-012 | CRUD | `car.test.js` | 🟢 Happy Path | 201 | Admin creates car |
| TC-013 | CRUD | `car.test.js` | 🟢 Happy Path | 200 | Admin updates car |
| TC-014 | CRUD | `car.test.js` | 🟢 Happy Path | 200 | Admin deletes car |
| TC-015 | Purchase | `vehiclePurchaseRestock.test.js` | 🔴 Security | 401 | Unauth purchase |
| TC-016 | Purchase | `vehiclePurchaseRestock.test.js` | 🟠 Error | 404 | Purchase non-existent car |
| TC-017 | Purchase | `vehiclePurchaseRestock.test.js` | 🟢 Happy Path | 200 | Purchase decrements qty |
| TC-018 | Purchase | `vehiclePurchaseRestock.test.js` | 🔵 Logic | 400 | Purchase when qty = 0 |
| TC-019 | Restock | `vehiclePurchaseRestock.test.js` | 🔴 Security | 401 | Unauth restock |
| TC-020 | Restock | `vehiclePurchaseRestock.test.js` | 🔴 RBAC | 403 | User → restock denied |
| TC-021 | Restock | `vehiclePurchaseRestock.test.js` | 🟢 Happy Path | 200 | Admin restock by amount |
| TC-022 | Restock | `vehiclePurchaseRestock.test.js` | 🟡 Edge Case | 200 | Restock default 1 (no body) |
| TC-023 | Search | `vehicleSearch.test.js` | 🔴 Security | 401 | Unauth search |
| TC-024 | Search | `vehicleSearch.test.js` | 🟢 Happy Path | 200 | Filter by make (partial, case-insensitive) |
| TC-025 | Search | `vehicleSearch.test.js` | 🟢 Happy Path | 200 | Filter by model |
| TC-026 | Search | `vehicleSearch.test.js` | 🟢 Happy Path | 200 | Filter by category |
| TC-027 | Search | `vehicleSearch.test.js` | 🟢 Happy Path | 200 | Filter by price range |
| TC-028 | Search | `vehicleSearch.test.js` | 🟢 Happy Path | 200 | Combined multi-param filter |
| TC-029 | ProtectedRoute | `ProtectedRoute.test.jsx` | 🔴 Security | redirect | Unauth → /login redirect |
| TC-030 | ProtectedRoute | `ProtectedRoute.test.jsx` | 🟢 Happy Path | render | Auth → children rendered |
| TC-031 | Auth UI | `AuthPages.test.jsx` | 🟢 Happy Path | render | Login form fields present |
| TC-032 | Auth UI | `AuthPages.test.jsx` | 🟢 Happy Path | render | Register form fields present |
| TC-033 | Auth UI | `AuthPages.test.jsx` | 🟢 Happy Path | fetch call | Login submit triggers fetch |
| TC-034 | Auth UI | `AuthPages.test.jsx` | 🟠 Error | render | Bad login shows error message |
| TC-035 | Navbar | `Navbar.test.jsx` | 🟢 Happy Path | render | Unauth: Login link shown |
| TC-036 | Navbar | `Navbar.test.jsx` | 🟢 Happy Path | render | Auth: Logout button shown |
| TC-037 | CarList | `CarList.test.jsx` | 🟢 Happy Path | render | Cars list rendered |
| TC-038 | CarList | `CarList.test.jsx` | 🟡 Edge Case | render | Empty array → empty state |
| TC-039 | AdminInventory | `AdminInventory.test.jsx` | 🔴 RBAC | render | Add button: admin yes, user no |
| TC-040 | AdminInventory | `AdminInventory.test.jsx` | 🟢 Happy Path | render | Modal opens with all fields |
| TC-041 | AdminInventory | `AdminInventory.test.jsx` | 🟢 Happy Path | render | Edit pre-populates form |
| TC-042 | AdminInventory | `AdminInventory.test.jsx` | 🔴 Security | fetch spy | Delete sends Bearer token |
| TC-043-A | Search UI | `SearchPurchase.test.jsx` | 🟢 Happy Path | render | Filter inputs present |
| TC-043-B | Purchase UI | `SearchPurchase.test.jsx` | 🔵 Logic | render | Qty=0 → button disabled |
| TC-043-C | Purchase UI | `SearchPurchase.test.jsx` | 🟢 Happy Path | render | Qty>0 → button enabled |
| TC-043-D | Restock UI | `SearchPurchase.test.jsx` | 🔴 RBAC | render | Admin sees Restock button |
| TC-044 | App E2E | `AppIntegration.test.jsx` | 🟢 Happy Path | fetch spy | Login flow → JWT stored |
| TC-045 | App E2E | `AppIntegration.test.jsx` | 🟢 Happy Path | render | Admin sees inventory + modal |
| TC-046 | App E2E | `AppIntegration.test.jsx` | 🟢 Happy Path | render | Form submit closes modal |
| TC-047 | App E2E | `AppIntegration.test.jsx` | 🔴 Security | redirect | Logout → /login redirect |

---

## Category Totals

| Category | Count | % of total |
|---|---|---|
| 🟢 Happy Path | 24 | 51% |
| 🔴 Security / Auth / RBAC | 15 | 32% |
| 🟠 Error Handling | 3 | 6% |
| 🟡 Edge Case / Validation | 3 | 6% |
| 🔵 Business Logic Boundary | 3 | 6% |
| **Total** | **48** | **100%** |

---

## Gap Analysis — Untested Scenarios

The following scenarios are **not covered** by any existing test case. Each represents a risk vector for production incidents.

### 🟡 Input Validation & Edge Cases Not Tested

| # | Scenario | Risk |
|---|---|---|
| GAP-01 | `POST /api/cars` with **missing required fields** (`make`, `model`, `year`, `price`, `vin`) — expects Mongoose `ValidationError` → `400` | Mongoose schema errors could bubble as unhandled 500s |
| GAP-02 | `POST /api/cars` with **invalid `status` value** (e.g., `status: "banana"`) — enum violation | `runValidators: true` should catch on update but untested on create |
| GAP-03 | `POST /api/cars` with **invalid `category` value** (e.g., `category: "Rocket"`) — enum violation | Same as above |
| GAP-04 | `GET /api/cars/:id` with a **malformed ObjectId** (e.g., `/:id` = `"not-an-objectid"`) — Mongoose cast error | Currently bubbles to `errorHandler` as a 500 with Mongoose `CastError` message, not a clean 400 |
| GAP-05 | `POST /api/cars/restock` with **negative `amount`** (e.g., `{ amount: -10 }`) | Controller's guard makes `restockAmount = 1`, but negative supply entry is silently swallowed |
| GAP-06 | `POST /api/cars/restock` with **`amount: 0`** | Same guard — treated as `1`. Semantically surprising. |
| GAP-07 | `POST /api/auth/register` with **empty name or password** fields | No length/format validation in schema; an empty-string password would be bcrypt-hashed |
| GAP-08 | `GET /api/cars/search?minPrice=abc` — **non-numeric price params** | Controller guards with `!isNaN(Number(x))`, but this is untested |
| GAP-09 | `POST /api/cars` with **extremely long VIN** string | No `maxlength` on schema; no test confirms truncation or error |

### 🔴 Security Gaps Not Tested

| # | Scenario | Risk |
|---|---|---|
| GAP-10 | **Expired JWT** — A token issued with `expiresIn: "1h"` used after expiry | `jwt.verify` throws `TokenExpiredError`; `protect` returns 401 but never explicitly tested |
| GAP-11 | **JWT signed with a different secret** | Should fail `jwt.verify`; path exists but untested |
| GAP-12 | `PUT /api/cars/:id` by a **normal user** (RBAC gap for update) | TC-011 covers POST, but no equivalent test for PUT or DELETE by user |
| GAP-13 | `DELETE /api/cars/:id` by a **normal user** | Same as above |

### 🟠 Error Handling Gaps Not Tested

| # | Scenario | Risk |
|---|---|---|
| GAP-14 | `POST /api/cars` with **duplicate VIN** — Mongo `11000` error | `errorHandler` handles it with `"A car with this VIN already exists"` but this path is never tested |
| GAP-15 | `PUT /api/cars/:id` with **invalid ObjectId** (Mongoose `CastError`) | Returns unstructured 500; no test confirms the message shape |
| GAP-16 | `GET /api/cars/:id` for a **car that doesn't exist** (valid ObjectId) | Returns 404 — tested for purchase, not tested for the plain GET by ID endpoint |
| GAP-17 | `DELETE /api/cars/:id` for a **non-existent car** | Controller returns 404 but untested |

### 🔵 Business Logic Gaps Not Tested

| # | Scenario | Risk |
|---|---|---|
| GAP-18 | **Status auto-transition to SOLD**: After purchase brings `quantity` to `0`, verify `status` field equals `"sold"` in the DB | TC-017 checks `quantity === 1` (still in stock); the `SOLD` transition only fires at `quantity === 0` and is never asserted |
| GAP-19 | **Status reversal on restock**: After restock on a `SOLD` car, verify `status` reverts to `"available"` | Logic exists in `restockCar` controller but no test exercises it |
| GAP-20 | **Concurrent purchases** (race condition simulation) — Two simultaneous `POST .../purchase` calls on a car with `quantity: 1` | The atomic `findOneAndUpdate` guard prevents double-decrement, but there is no concurrency test confirming this |
| GAP-21 | **Client-side filter correctness** — price boundary conditions, partial name matching edge cases in `CarList` | No test applies filters and verifies the `filteredInventory` result set |
| GAP-22 | **`decodeToken` expiry check in AuthContext** — A locally expired token should auto-clear `localStorage` and return `null` | The utility function is pure JS but has zero tests |
| GAP-23 | **Register with duplicate email on the frontend** — UI should display the server's error message | `AuthPages.test.jsx` covers bad login but not duplicate registration |

---

> **Recommendation priority**: GAP-04 (malformed ObjectId → 500), GAP-14 (duplicate VIN path), GAP-18 & GAP-19 (status transitions), and GAP-22 (expired-token client-side purge) represent the highest-impact additions for a production-hardened test suite. GAP-20 (concurrency) would require either a load test harness or a mocked MongoDB to simulate the race.
