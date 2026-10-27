# PRD — Bank Data Intelijen (BDI) Frontend Admin

Status: reverse-engineered from the codebase on 2026-10-26. Evidence and verification labels are in `PROJECT_AUDIT.md`. Items marked **(Implemented)** are backed by code; **(Proposed)** are suggestions, not existing requirements; **(Unconfirmed)** need product-owner input. No backend API contract was available — endpoint details come from the frontend services only.

## 1. Document purpose and scope

Describes what the BDI admin web frontend does today, its constraints, gaps, and open questions. Scope: this Angular SPA only. The backend REST API (separate system) is out of scope except as an integration dependency.

## 2. Product overview

A web admin panel for managing intelligence-unit records of the Kejaksaan (Indonesian Prosecution Service): incoming/outgoing correspondence, intelligence work registers, intelligence products, activities, operations, analyses, archives, public legal programs, and geospatial data. It authenticates against a backend via JWT and performs CRUD on registers over REST. UI language is Indonesian.

## 3. Target users and needs

Users are **inferred** from the product name and features **(Unconfirmed)**: intelligence-unit staff and administrators in the Kejaksaan who must record, search, and review registers by year/month and by *bidang* (directorate field: Ipolhankam, Sosbudmas, Ekokeu, Pamstra, Tiprodin).

Needs evidenced by features: log in securely; create/edit/delete/view register entries; filter and search by period; distinguish ordinary vs. classified ("rahasia") correspondence; see yearly summary counts; plot events on a map.

## 4. Product objectives (inferred from features)

1. Digitize routine intelligence-unit registers in one authenticated application.
2. Provide a yearly overview of key outputs (dashboard).
3. Support location-based intelligence data with a map view and sector symbols.
4. Keep operation simple: single admin UI, no offline or mobile-specific mode.

## 5. Existing features and status

| Feature | Status | Notes |
|---|---|---|
| Login (JWT), auto-login, auto-logout | Implemented | Token in `localStorage` |
| Dashboard yearly counts (Prodin: Lapinhar/Lapinsus/Laphastug/Lapopsin; PPH/PPM; Binmatkum/JMS/Jaksa Menyapa) | Implemented | Year selector (`updateYearSelected`) reloads the counts |
| Surat Masuk, Surat Keluar, Ekspedisi (biasa & rahasia) | Implemented | List, search, create, edit, detail, delete |
| RKI, Prodin, Arsip, Opsin, Lahin, PPH/PPM | Implemented | list/form/detail |
| Kegiatan Intelijen + Pamstra variant | Implemented | Filtered by bidang |
| Penkum & Luhkum | Implemented | |
| Data Peta (CRUD with coordinates, 5W1H fields) | Implemented | No detail route; reverse geocoding via Nominatim |
| Peta & Simbol map view | Implemented | Leaflet + OSM tiles + sector symbols |
| Per-feature help components | Implemented, content not reviewed | |
| 404 page | Implemented | |
| Sidebar items "Berita Keluar", "Ekspedisi Berita", footer info links | Placeholder | Route to `/page-not-found` |
| Role-based access, file upload, audit log, reporting/export | Not present | |

## 6. Page and route inventory

See `PROJECT_AUDIT.md` §4 for the full table. Summary: `/auth`, `/dashboard`, `/surat-masuk|surat-keluar|ekspedisi/{biasa,rahasia}[/form|/:id/form|/:id/detail]`, `/rki|prodin|arsip|opsin|lahin|pphppm/list[...]`, `/kegiatan/list[...]` (+pamstra), `/penkumluhkum/{penkum,luhkum}[...]`, `/data-peta/list[...]`, `/peta-simbol/view`, `/page-not-found`. Root redirects to `/dashboard`; unknown paths redirect to `/page-not-found`.

## 7. User journeys (Implemented)

1. **Login:** open app → unauthenticated user sees login page → submit credentials → token stored → dashboard. Token expiry triggers automatic logout.
2. **Record correspondence:** sidebar → Surat Masuk (biasa/rahasia) → filter by month/year or search → "form" → save → success toast/notification → list.
3. **Edit/delete:** list → edit form (`:id/form`) or detail → delete via confirmation modal.
4. **Map review:** Peta & Simbol → select bidang/sector/year → markers on map. Data Peta form: click map to set lat/long, address looked up automatically.
5. **Dashboard:** view yearly counts per category.

## 8. Functional requirements (all describe current behaviour unless marked Proposed)

| ID | Requirement | Status |
|---|---|---|
| FR-AUTH-1 | Users authenticate via `POST /login` with username/password and receive a JWT | Implemented |
| FR-AUTH-2 | All routes except `/auth` require an authenticated user; authenticated users visiting `/auth` go to `/dashboard` | Implemented |
| FR-AUTH-3 | Authenticated API requests carry `Authorization: Bearer <token>` | Implemented |
| FR-AUTH-4 | Session restored from stored token on load; auto-logout at token expiry | Implemented |
| FR-REG-1 | For each register (surat masuk/keluar, ekspedisi, rki, prodin, arsip, kegiatan, kegiatan-pamstra, opsin, lahin, pphppm, penkumluhkum, data-peta): list (paginated), create, update, delete | Implemented (verified in full for surat-masuk; others by route/service presence) |
| FR-REG-2 | Detail view for each register except data-peta | Implemented |
| FR-REG-3 | Text search exists in all 13 list components; month/year period filter verified for surat-masuk only | Implemented / partly Unconfirmed |
| FR-REG-4 | Surat/ekspedisi are separated into biasa and rahasia views | Implemented |
| FR-REG-5 | Deletion requires confirmation (delete modal referenced in all 13 list components) | Implemented |
| FR-REG-6 | Success/failure feedback via toast and error messages | Implemented |
| FR-KEG-1 | Kegiatan, opsin, rki, data-peta and peta-simbol read a `bidang` query parameter to scope their data | Implemented |
| FR-DASH-1 | Dashboard shows counts for the selected year (default current year) from `/prodin/count`, `/pphppm/count`, `/penkumluhkum/count` | Implemented |
| FR-MAP-1 | Data Peta records store location, lat/long, sector, bidang, and 5W1H text; coordinates validated | Implemented |
| FR-MAP-2 | Map view renders markers with sector symbols | Implemented |
| FR-MAP-3 | Form reverse-geocodes picked coordinates | Implemented |
| FR-NEW-1 | Role-based authorization / bidang-level access | Proposed (Unconfirmed) |
| FR-NEW-3 | Export/print of registers | Proposed |

## 9. Non-functional requirements

Only measurable facts are stated; targets are **Unconfirmed**.
- Platform: modern desktop browser; responsive layout via Bootstrap (not verified on mobile).
- Performance: production bundle budget warn 2 MB / error 5 MB initial; no lazy loading today.
- Maintainability: strict TypeScript and strict templates enabled; NgModule architecture.
- Availability of external services (CDN, OSM) affects map/icons.
- Proposed: define target browsers, response-time and accessibility levels.

## 10. API and external integrations

- Backend REST base URL from `environment.baseUrl`: dev `http://localhost:8888/api/v1`, prod `http://192.168.1.13:8181/api/v1`.
- Conventions seen in code: `GET /<resource>?pages&sizes&startDate&endDate[&jenisSurat]`, `GET /<resource>/search?...&value=`, `GET /<resource>/{ids}/detail`, `POST /<resource>`, `PUT /<resource>/{ids}`, `DELETE /<resource>/{ids}`. Paged response shape: `content,size,totalElements,totalPages,number`. Error codes handled: `ID_NOT_FOUND`, `INVALID_DATA_INTEGRITY`.
- Third parties: OpenStreetMap tiles, Nominatim reverse geocoding, unpkg (Leaflet CSS), Font Awesome CDN, Google Fonts.
- A formal API contract was not found in this repo **(Unconfirmed)**.

## 11. UI/UX and accessibility

Bootstrap 5 admin layout (navbar + collapsible sidebar + content), ng-bootstrap datepicker/pagination/modal, toasts, loading spinner, "no data" and danger alerts. Recent commits redesigned login and dashboard. Accessibility has not been audited; no ARIA/keyboard review evidence. UI copy is Indonesian and partly informal. Proposed: accessibility review, consistent tone for messages.

## 12. Security and privacy

Implemented: JWT bearer auth, route guards, token-expiry logout. Concerns (see audit): token in `localStorage`; token is sent to third-party hosts by the global interceptor; plain HTTP production URL; no client-side roles; classified ("rahasia") data handled the same as ordinary data on the client. Data is sensitive intelligence-unit information — handling/retention rules are **Unconfirmed**.

## 13. Constraints and dependencies

Angular 20.3, TypeScript 5.8, Bootstrap 5, ng-bootstrap 19, Leaflet 1.9, rxjs 7.5, jwt-decode 4, ngx-currency 19 (its peer dependencies are Angular ^19, while the app uses Angular 20 — compatibility unverified). Requires a compatible backend. Internet access needed for map tiles/CDN assets unless self-hosted **(Unconfirmed)**.

## 14. Known gaps, risks, technical debt

Summarized from `PROJECT_AUDIT.md` §7: JWT leakage to third parties; no authorization model; likely broken/unverified unit tests and no lint script; heavy code duplication across features; `any`/`null as any` typing; dashboard forced-reload workaround; placeholder menu items; external CDN dependency; outdated dev dependencies.

## 15. Acceptance criteria

Criteria for the existing behaviour (to be confirmed by manual or automated test; none have been executed in this audit):
- AC-1: Unauthenticated access to any route other than `/auth` redirects to `/auth`.
- AC-2: Valid login lands on `/dashboard`; invalid login shows an error and stays on login.
- AC-3: After token expiry the user is returned to login.
- AC-4: For each register, a created record appears in the list after save, can be edited, viewed, and deleted after confirmation.
- AC-5: Rahasia and biasa lists show separate data sets.
- AC-6: Data Peta rejects invalid coordinates and shows saved points on the map view.
- AC-7: Production build (`npm run build`) completes within configured budgets.

## 16. Open questions for the product owner

1. Who are the user roles, and should access differ by role or bidang? Should "rahasia" records have stricter access?
2. Is the deployment intranet-only? Is HTTPS planned for the production API?
3. Is there a backend API specification (OpenAPI) and an owner/repo?
4. What are the intended placeholder modules (Berita Keluar, Ekspedisi Berita, Informasi Publik, About/Docs/Privacy/Terms)?
5. What do the "help" pages contain and who maintains them?
6. Should map tiles/geocoding be self-hosted for secure environments?
7. Are file attachments intended (model has `urlFile` only)?
8. Required browser support, languages, and accessibility standards?
9. Why does the dashboard force a one-time page reload after login?
