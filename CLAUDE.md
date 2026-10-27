# CLAUDE.md — BDI Frontend Admin

Angular 20 admin SPA (Bank Data Intelijen, Kejaksaan) talking to a separate REST backend. UI text is Indonesian. Product context: `PRD.md`. Audit/risks: `PROJECT_AUDIT.md`. Consult `PRD.md` before changing behaviour; don't invent requirements.

## Stack
Angular ^20.3 (NgModule-based, **not standalone**), TypeScript ~5.8 (strict, strictTemplates), RxJS ~7.5, Bootstrap 5 + bootstrap-icons, ng-bootstrap, Leaflet, jwt-decode, ngx-currency. Karma + Jasmine for tests.

## Commands (from package.json)
- `npm start` — dev server (`ng serve`, development config)
- `npm run build` — production build (`ng build`, default config = production, replaces `environment.ts` with `environment.prod.ts`)
- `npm run watch` — dev build in watch mode
- `npm test` — `ng test` (Karma). **Unverified:** karma.conf references `@angular-devkit/build-angular`, which isn't installed; tests may not run.
- No lint script exists. Don't invent one.

## Layout
- `src/app/auth/` — AuthService (BehaviorSubject user, JWT in localStorage `userData`), AuthGuard, AuthAfterLoginGuard, AuthInterceptorsService
- `src/app/register/<feature>/` — arsip, ekspedisi, kegiatan(+pamstra), lahin, opsin, penkumluhkum, pphppm, prodin, rki, surat-keluar, surat-masuk
- `src/app/peta/` — data-peta (CRUD), peta-simbol (Leaflet view)
- `src/app/shared/` — Message strings, toast/notification/confirm-delete services, pipes, validators, bidang-direktorat/sektor lookups
- `src/app/templates/` — navbar, sidebar; `src/app/pages/` — login-page, 404
- `src/environments/` — `baseUrl` per environment

## Conventions (follow the surrounding code)
- Feature = `<f>.component` (router-outlet shell), `-list`, `-form`, `-detail`, `-help`, `<f>.model.ts`, `<f>.service.ts`, with `.spec.ts` per component. New features should copy `register/surat-masuk/`.
- All components are declared in `app.module.ts` with `standalone: false`; register new ones there and in `app-routing.module.ts` (under the feature's parent route with `canActivate: [AuthGuard]` and a `title`).
- Route shape: `<root>/list` (or `biasa`/`rahasia`, `penkum`/`luhkum`), `.../form`, `.../:id/form`, `.../:id/detail`. Bidang is passed as `?bidang=` query param (kegiatan, opsin, rki, data-peta, peta-simbol).
- Services: `@Injectable({ providedIn: 'root' })`, `endPoint = environment.baseUrl + '/<name>'`, methods `get*`, `getSearch*`, `getOne*`, `create*`, `update*`, `delete*`. Naming varies: older services are entity-suffixed (`getSuratMasuk`), newer ones use `getAll`/`getOne`/`getSearch` — follow the service you extend. Entity id field is `ids`. Paging params are `pages`/`sizes`; dates `startDate`/`endDate` (`YYYY-MM-DD`).
- Error mapping: `catchError` → `throwError(() => string)` using `shared/message.ts` strings; backend codes `ID_NOT_FOUND`, `INVALID_DATA_INTEGRITY`.
- Forms: `UntypedFormGroup` + ng-bootstrap date structs converted via `CurrentDateTimeService`. Feedback via `ToastService`/`NotificationService`; deletes via the shared delete modal.
- Components track `Subscription`s manually and unsubscribe in `ngOnDestroy`; keep that pattern.
- Keep user-facing strings in Indonesian.

## Safe-change rules
- Keep changes minimal and local; don't refactor across features unless asked (code is intentionally duplicated per feature).
- Don't change `package.json`, lockfile, `angular.json`, or tsconfig without being asked. `package-lock.json` may have uncommitted user changes — don't revert.
- Don't commit unless asked. Don't run deploys or destructive commands.
- Before declaring done: `npm run build` must pass (strict TS/templates). Run `npm test` if you touched tested code, and report honestly if tests can't run.

## Testing
Specs are generated "should create" stubs (many lack providers/imports). When adding logic, add a meaningful spec with the needed `HttpClientTestingModule`/Router providers. Don't claim tests pass unless you ran them.

## Security
- Never hard-code or commit credentials, tokens, or real hosts beyond what's already in `src/environments/`. Don't print `localStorage` token contents.
- JWT is attached by `AuthInterceptorsService` to **every** HttpClient request (known issue: also reaches Nominatim). Don't add new third-party HttpClient calls without restricting the interceptor to `environment.baseUrl`.
- Don't use `innerHTML`/`bypassSecurityTrust*` with API data. Treat register data (esp. "rahasia") as sensitive: no logging of record contents.
- Auth is client-side guards only; there are no roles. Don't imply client checks are authorization.

## Known quirks (don't "fix" unprompted)
- Dashboard does a one-time `window.location.reload()` via `localStorage.appData`.
- Some sidebar/footer links intentionally go to `/page-not-found` (placeholders).
