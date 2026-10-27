# PROJECT_AUDIT — BDI Frontend Admin

Audit date: 2026-10-26. Method: read-only static inspection (targeted reads and greps). **No build, test, or lint command was executed**; no packages installed; no source/config/lockfile modified. Pre-existing uncommitted change: `package-lock.json` (left untouched).

Legend: **[V]** verified in code/config · **[R]** stated in README only, not re-verified · **[A]** assumption/inference.

## 1. Repository structure (development-relevant)

```
angular.json, package.json, tsconfig*.json, karma.conf.js, .editorconfig
src/main.ts, polyfills.ts, test.ts, index.html, styles.css
src/environments/environment{,.prod}.ts      # baseUrl + version only
src/assets/images/simbol-sektor/*.png         # 74 sector map symbols
src/assets/js/scripts.js                      # loaded as global script by angular.json
src/app/app.module.ts, app-routing.module.ts  # single NgModule, all components declared here
src/app/auth/        # AuthService, AuthGuard, AuthAfterLoginGuard, AuthInterceptorsService, User
src/app/dashboard/   # DashboardComponent + DashboardService
src/app/register/<feature>/  # arsip, ekspedisi, kegiatan(+pamstra), lahin, opsin, penkumluhkum, pphppm, prodin, rki, surat-keluar, surat-masuk
src/app/peta/        # data-peta (CRUD), peta-simbol (Leaflet view)
src/app/shared/      # Message, toast/notification/confirm-delete services, pipes, validators, bidang-direktorat & sektor lookups
src/app/templates/   # navbar, sidebar
src/app/pages/       # login-page, page-not-found
```

Per-feature layout **[V]**: `<f>.component` (shell with `<router-outlet>`), `<f>-list`, `<f>-form`, `<f>-detail`, `<f>-help`, `<f>.model.ts`, `<f>.service.ts`, one `.spec.ts` per component.

## 2. Key files inspected

package.json, angular.json, tsconfig.json, karma.conf.js, .gitignore, README.md (headings + API/auth/env sections), src/index.html, environments/*, app.module.ts, app-routing.module.ts, app.component.{ts,html}, all `auth/*.ts`, dashboard.component.ts, dashboard.service.ts, surat-masuk service/model/form, shared/message.ts, shared/bidang-direktorat/bidang-direktorat.ts, sidebar.component.html, peta-simbol-view.component.ts, data-peta.model.ts, data-peta-form (geocoding section), auth.component.spec.ts. Other features were only checked via greps (endpoints, localStorage, console.log, urlFile) and are **assumed** to follow the surat-masuk pattern **[A]**.

## 3. Verified architecture

- Angular **20.3.x**, TypeScript ~5.8.3, builder `@angular/build:application`, **NgModule-based** (all components `standalone: false`), `provideHttpClient(withInterceptorsFromDi())` **[V]**.
- Strict TS + `strictTemplates` **[V]**; but heavy use of `null as any` and `!` definite assignment, `any` appears in ~62 non-spec files **[V]**.
- Reactive state: `BehaviorSubject<User>` in `AuthService`; no NgRx/signals store **[V]** (grep of `package.json`).
- Forms: `UntypedFormGroup`/`UntypedFormControl`, ng-bootstrap datepicker (`NgbDateStruct`) **[V]**.
- UI: Bootstrap 5, bootstrap-icons, ng-bootstrap, Font Awesome via CDN script, Google Font Inter, Leaflet CSS via unpkg (with SRI), `ngx-currency` **[V]**.
- Templates use new control flow (`@if`) **[V]** in app.component.html.
- Services: `providedIn: 'root'`, endpoint `environment.baseUrl + '/<name>'`, CRUD + `/search` + `/{ids}/detail` (method names are inconsistent: older services use entity-suffixed names like `getSuratMasuk`/`getOneSuratMasuk`, newer ones use `getAll`/`getOne`/`getSearch`), per-service `catchError` mapping `error.message` codes (`ID_NOT_FOUND`, `INVALID_DATA_INTEGRITY`) to Indonesian strings from `shared/message.ts` **[V]** (surat-masuk). Entity id field is `ids` **[V]**.
- Paging query params are `pages` / `sizes` (plural), date range `startDate`/`endDate`, `jenisSurat` **[V]**.

## 4. Feature inventory (routes in `app-routing.module.ts`) **[V]**

| Area | Route root | Children |
|---|---|---|
| Auth | `/auth` | login (guard: AuthAfterLoginGuard) |
| Dashboard | `/dashboard` | counts for prodin, PPH/PPM, penkum/luhkum; year selector (default current year) |
| Surat Masuk / Keluar / Ekspedisi | `/surat-masuk`, `/surat-keluar`, `/ekspedisi` | `biasa`, `rahasia` × list/form/`:id/form`/`:id/detail` |
| RKI, Prodin, Arsip, Opsin, Lahin, PPH/PPM | `/rki`, `/prodin`, `/arsip`, `/opsin`, `/lahin`, `/pphppm` | `list`, `list/form`, `list/:id/form`, `list/:id/detail` |
| Kegiatan | `/kegiatan` | as above plus `list/pamstra-list`, `pamstra-list/:id/detail`, `pamstra-form`, `:id/pamstra-form` |
| Penkum/Luhkum | `/penkumluhkum` | `penkum`, `luhkum` × list/form/:id/form/:id/detail |
| Data Peta | `/data-peta` | list, form, :id/form (no detail route) |
| Peta & Simbol | `/peta-simbol/view` | Leaflet map view |
| Fallback | `/page-not-found`, `**` | |

All except `/auth` have `AuthGuard` **[V]**. No lazy loading **[V]**. Endpoints in use: login, surat-masuk, surat-keluar, rki, ekspedisi, prodin, arsip, kegiatan, kegiatan-pamstra, opsin, lahin, pphppm, penkumluhkum, data-peta, and `/count` on prodin/pphppm/penkumluhkum **[V]**. Delete uses a shared `DeleteModalComponent` **[V]**.

Bidang direktorat enum: IPOLHANKAM, SOSBUDMAS, EKOKEU, PAMSTRA, TIPRODIN **[V]**; used as `?bidang=` query param by kegiatan, opsin, rki, data-peta and peta-simbol components **[V]**.

## 5. Existing vs. inferred

- **Existing [V]:** everything in §3–4.
- **Inferred [A]:** that every feature's list/form/detail matches surat-masuk's behaviour (search, pagination, month/year filter, toast on success via `?message=SimpanSukses`); exact field validations per entity; the purpose of the "help" components (appear to be per-feature help modals/pages — content not read).
- **Not present [V by absence]:** role-based authorization, refresh tokens, file upload (only a `urlFile` text/link field), i18n usage (only `@angular/localize` dependency), state library, e2e tests, lint config, CI config.
- **Placeholders:** sidebar contains links to `/page-not-found` (e.g. "Berita Keluar", "Ekspedisi Berita", "Informasi Publik" commented out) and footer links "Tentang/Dokumentasi/Privacy/Terms" all go to `/page-not-found` **[V]**.

## 6. Build / test verification

| Check | Result |
|---|---|
| `npm run build`, `npm start`, `npm test`, lint | **Not executed** (documentation-only task) |
| Scripts listed in package.json | `ng`, `start`, `build`, `watch`, `test` only; **no lint script** **[V]** |
| Spec inventory | 78 spec files, 80 `it()` blocks; sampled spec (`auth.component.spec.ts`) is the generated "should create" with `declarations` only and no providers/imports → likely fails without `HttpClient`/Router providers **[A]** |

## 7. Risks, gaps, unresolved issues

1. **Token in `localStorage`** (`userData`) — XSS-exposable **[V]**. Bearer token is attached to *every* request including third-party (`data-peta-form` calls Nominatim via injected `HttpClient`, and the interceptor has no URL filter, so the JWT is sent to `nominatim.openstreetmap.org`) **[V]** — token leak to a third-party host; high priority.
2. **Hard-coded environment URLs**: prod `http://192.168.1.13:8181/api/v1` is plain HTTP on a private IP **[V]**.
3. **No role/permission model** on the client; all authenticated users see all registers including "rahasia" **[V by absence]**. Whether the backend enforces it is unknown.
4. **No 401/expired-token handling in the interceptor.** `User.getToken()` returns `null` once expired, and the interceptor calls `user.getToken().toString()` → would throw a TypeError for an expired token **[V code path, A runtime]**. The auto-logout `setTimeout` mitigates this but can drift (e.g. after device sleep).
5. **Dashboard forced reload hack**: `checkLogedReloadPage()` calls `window.location.reload()` once using `localStorage.appData` **[V]** — unexplained workaround.
6. **Test config likely broken**: `karma.conf.js` lists framework `@angular-devkit/build-angular`, but `node_modules/@angular-devkit` contains only architect/core/schematics, while the builder is `@angular/build:karma` with legacy `main`/`karmaConfig` options **[V config, A outcome]**. Specs unverified.
7. **Duplicated code**: per-feature services/forms are near-copies (error mapping repeated in each method) **[V]**; large components (~200+ lines).
8. **Subscription handling** is manual (`Subscription` fields + `unsubscribe`), inconsistent `Subscription = null as any` **[V]**.
9. **Sidebar naming mismatches**: "Register Tamu" → `/pphppm`; several Opsin/Peta menu items share the same route differing only by query param **[V]**.
10. **External CDN dependencies** at runtime (Font Awesome script, Google Fonts, unpkg Leaflet CSS, OSM tiles, Nominatim) — fails in air-gapped intranet deployments; Font Awesome script has no SRI **[V]**.
11. Mixed-language UI/error strings with informal tone ("Aduh!!!", "Bro..") in user-facing messages **[V]**.
12. `rxjs ~7.5.0` is old relative to Angular 20 (Angular 20 requires rxjs ^6.5 || ^7.4 — acceptable but dated) **[V]**; `@types/node ^12`, `jasmine ~4.0` dated **[V]**.
13. `ngx-currency@19` declares peer deps `@angular/* ^19`, but the app is on Angular 20.3.x **[V]**; runtime compatibility not tested. README endpoint tables were not compared with services.

### Open questions
- Backend repo/API contract (OpenAPI?) location and role model.
- Intended deployment (intranet only?) and HTTPS plan.
- Meaning/definition of "help" components and the `appData` reload workaround.
- Is `ng test` used at all today?

## 8. Evidence paths

- Routing: `src/app/app-routing.module.ts`; module: `src/app/app.module.ts`
- Auth: `src/app/auth/*.ts`
- Service pattern: `src/app/register/surat-masuk/surat-masuk.service.ts`
- Messages: `src/app/shared/message.ts`
- Third-party call with JWT interceptor: `src/app/peta/data-peta/data-peta-form/data-peta-form.component.ts` (`getAddress`), `src/app/auth/auth-interceptors.service.ts`
- Dashboard reload hack: `src/app/dashboard/dashboard.component.ts` (`checkLogedReloadPage`)
- Test config: `karma.conf.js`, `angular.json` (`test` target)
- Env: `src/environments/`
