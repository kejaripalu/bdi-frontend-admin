# Bank Data Intelijen (BDI) — Frontend Admin

Aplikasi **Bank Data Intelijen (BDI) Frontend Admin** adalah panel admin berbasis web untuk mengelola data intelijen di lingkungan Kejaksaan. Aplikasi ini dibangun menggunakan **Angular 20** dan berfungsi sebagai antarmuka pengguna (frontend) yang berkomunikasi dengan backend REST API.

Fitur utama aplikasi meliputi:

- **Dashboard** — Menampilkan ringkasan statistik data Produk Intelijen, PPH/PPM, dan Program Penkum/Luhkum per tahun.
- **Manajemen Surat Masuk & Surat Keluar** — Mengelola register surat masuk dan keluar (biasa & rahasia).
- **Register Kerja Intelijen (RKI)** — Pencatatan dan pengelolaan data kerja intelijen.
- **Ekspedisi Surat** — Pengelolaan ekspedisi surat (biasa & rahasia).
- **Produk Intelijen (Prodin)** — Pengelolaan produk-produk intelijen.
- **Arsip** — Pengelolaan data arsip.
- **Kegiatan Intelijen** — Pengelolaan kegiatan intelijen termasuk Pengamanan Strategis (Pamstra).
- **Operasi Intelijen (Opsin)** — Pengelolaan data operasi intelijen.
- **Telaahan Intelijen (Lahin)** — Pengelolaan telaahan intelijen.
- **PPH & PPM** — Pengelolaan data PPH (Pemberitahuan Perkembangan Hasil) dan PPM (Pemberitahuan Perkembangan Masalah).
- **Penkum & Luhkum** — Pengelolaan data Penerangan Hukum dan Penyuluhan Hukum.
- **Data Peta** — Pengelolaan data geospasial dengan koordinat (latitude/longitude).
- **Peta & Simbol** — Visualisasi peta interaktif menggunakan Leaflet.js.
- **Autentikasi** — Sistem login dengan JWT (JSON Web Token), auto-login, dan auto-logout.

---

## Teknologi Stack

| Kategori           | Teknologi                       | Versi     |
| :----------------- | :------------------------------ | :-------- |
| Framework          | Angular                         | ^20.3.13  |
| Bahasa             | TypeScript                      | ~5.8.3    |
| Build Tool         | Angular CLI (`@angular/build`)  | ^20.3.11  |
| UI Framework       | Bootstrap                       | ^5.2.0    |
| Ikon               | Bootstrap Icons                 | ^1.9.1    |
| Ikon (CDN)         | Font Awesome                    | 6.1.0     |
| Component Library  | ng-bootstrap                    | ^19.0.0   |
| Peta Interaktif    | Leaflet                         | ^1.9.4    |
| JWT Decode         | jwt-decode                      | ^4.0.0    |
| Format Mata Uang   | ngx-currency                    | ^19.0.0   |
| Reactive Library   | RxJS                            | ~7.5.0    |
| Positioning        | Popper.js (`@popperjs/core`)    | ^2.11.6   |
| Unit Testing       | Jasmine + Karma                 | 4.0 / 6.4 |

---

## Library yang Digunakan

### Dependencies (Production)

| Library                           | Fungsi                                                                 |
| :-------------------------------- | :--------------------------------------------------------------------- |
| `@angular/core`                   | Framework utama Angular                                                |
| `@angular/router`                 | Routing & navigasi antar halaman                                       |
| `@angular/forms`                  | Reactive Forms & Template-driven Forms                                 |
| `@angular/animations`             | Animasi Angular                                                        |
| `@angular/common`                 | Modul umum Angular (pipes, directives)                                 |
| `@angular/localize`               | Internasionalisasi (i18n)                                              |
| `@angular/platform-browser`       | Platform browser Angular                                               |
| `@ng-bootstrap/ng-bootstrap`      | Komponen Bootstrap native untuk Angular (pagination, modal, dll.)      |
| `bootstrap`                       | CSS framework untuk styling dan layout responsif                       |
| `bootstrap-icons`                 | Ikon vektor dari Bootstrap                                             |
| `@popperjs/core`                  | Positioning engine untuk tooltip/dropdown                              |
| `jwt-decode`                      | Decode token JWT untuk mendapatkan payload (username, exp, iat)        |
| `leaflet`                         | Library peta interaktif untuk menampilkan data geospasial              |
| `ngx-currency`                    | Directive untuk format input mata uang                                 |
| `rxjs`                            | Library reactive programming untuk mengelola data stream               |
| `tslib`                           | Runtime helper TypeScript                                              |
| `zone.js`                         | Execution context untuk change detection Angular                       |

### DevDependencies (Development)

| Library                           | Fungsi                                           |
| :-------------------------------- | :----------------------------------------------- |
| `@angular/build`                  | Builder Angular untuk build & serve               |
| `@angular/cli`                    | Command-line interface Angular                    |
| `@angular/compiler-cli`           | Compiler Angular ahead-of-time (AOT)              |
| `@types/jasmine`                  | Type definitions untuk Jasmine                    |
| `@types/leaflet`                  | Type definitions untuk Leaflet                    |
| `@types/node`                     | Type definitions untuk Node.js                    |
| `jasmine-core`                    | Framework unit testing                            |
| `karma`                           | Test runner                                       |
| `karma-chrome-launcher`           | Launcher Chrome untuk Karma                       |
| `karma-coverage`                  | Coverage report                                   |
| `karma-jasmine`                   | Adapter Jasmine untuk Karma                       |
| `karma-jasmine-html-reporter`     | HTML reporter untuk hasil test                    |
| `typescript`                      | Compiler TypeScript                               |

---

## Arsitektur & Struktur Folder

```
bdi-frontend-admin/
├── src/
│   ├── app/
│   │   ├── auth/                          # Modul autentikasi
│   │   │   ├── auth.component.ts          # Komponen halaman login
│   │   │   ├── auth.service.ts            # Service: login, logout, autoLogin, autoLogout
│   │   │   ├── auth.guard.ts              # Guard: proteksi route (harus sudah login)
│   │   │   ├── auth-after-login.guard.ts  # Guard: redirect jika sudah login
│   │   │   ├── auth-interceptors.service.ts # HTTP Interceptor: inject JWT token ke header
│   │   │   └── user.model.ts              # Model data user (token, expiration, username)
│   │   │
│   │   ├── dashboard/                     # Modul dashboard
│   │   │   ├── dashboard.component.ts     # Komponen halaman dashboard
│   │   │   └── dashboard.service.ts       # Service: ambil data count Prodin, PPH/PPM, Penkum
│   │   │
│   │   ├── register/                      # Modul register (data intelijen)
│   │   │   ├── surat-masuk/               # Sub-modul Surat Masuk
│   │   │   │   ├── surat-masuk.component.ts
│   │   │   │   ├── surat-masuk.model.ts
│   │   │   │   ├── surat-masuk.service.ts
│   │   │   │   ├── surat-masuk-list/      # Komponen daftar surat masuk
│   │   │   │   ├── surat-masuk-form/      # Komponen form tambah/edit
│   │   │   │   ├── surat-masuk-detail/    # Komponen detail
│   │   │   │   └── surat-masuk-help/      # Komponen bantuan/info
│   │   │   ├── surat-keluar/              # Sub-modul Surat Keluar (struktur serupa)
│   │   │   ├── rki/                       # Sub-modul Register Kerja Intelijen
│   │   │   ├── ekspedisi/                 # Sub-modul Ekspedisi Surat
│   │   │   ├── prodin/                    # Sub-modul Produk Intelijen
│   │   │   ├── arsip/                     # Sub-modul Arsip
│   │   │   ├── kegiatan/                  # Sub-modul Kegiatan Intelijen + Pamstra
│   │   │   ├── opsin/                     # Sub-modul Operasi Intelijen
│   │   │   ├── lahin/                     # Sub-modul Telaahan Intelijen
│   │   │   ├── pphppm/                    # Sub-modul PPH & PPM
│   │   │   └── penkumluhkum/              # Sub-modul Penkum & Luhkum
│   │   │
│   │   ├── peta/                          # Modul peta
│   │   │   ├── data-peta/                 # Sub-modul data peta (CRUD koordinat)
│   │   │   │   ├── data-peta.component.ts
│   │   │   │   ├── data-peta.model.ts
│   │   │   │   ├── data-peta.service.ts
│   │   │   │   ├── data-peta-list/
│   │   │   │   ├── data-peta-form/
│   │   │   │   └── data-peta-help/
│   │   │   └── peta-simbol/               # Sub-modul visualisasi peta & simbol
│   │   │       ├── peta-simbol.component.ts
│   │   │       ├── peta-simbol-view/
│   │   │       └── peta-simbol-help/
│   │   │
│   │   ├── templates/                     # Layout template umum
│   │   │   ├── navbar/                    # Komponen navigasi atas
│   │   │   └── sidebar/                   # Komponen sidebar navigasi
│   │   │
│   │   ├── shared/                        # Komponen, pipe, service, & directive bersama
│   │   │   ├── loading-spinner/           # Komponen loading spinner
│   │   │   ├── no-data-alert/             # Komponen alert "tidak ada data"
│   │   │   ├── danger-alert/              # Komponen alert error/danger
│   │   │   ├── toast/                     # Komponen notifikasi toast
│   │   │   ├── delete-modal/              # Komponen modal konfirmasi hapus
│   │   │   ├── bidang-direktorat/         # Data & pipe bidang/direktorat/sektor
│   │   │   ├── prodin/                    # Pipe untuk produk intelijen
│   │   │   ├── custom-directive/          # Custom validator directive (min/max)
│   │   │   ├── reverse.pipe.ts            # Pipe: reverse array
│   │   │   ├── shorten.pipe.ts            # Pipe: potong teks panjang
│   │   │   ├── truncate.pipe.ts           # Pipe: truncate teks
│   │   │   ├── message.ts                 # Konstanta pesan (success, error)
│   │   │   ├── month.ts                   # Konstanta bulan
│   │   │   ├── month-converter.service.ts # Service: konversi bulan ke startDate/endDate
│   │   │   ├── curent-date-time.service.ts# Service: tanggal dan waktu saat ini
│   │   │   ├── notification.service.ts    # Service: notifikasi
│   │   │   ├── toast.service.ts           # Service: toast/notifikasi
│   │   │   └── coordinate.validator.ts    # Validator koordinat (latitude/longitude)
│   │   │
│   │   ├── pages/                         # Halaman statis
│   │   │   ├── page-not-found/            # Halaman 404
│   │   │   └── login-page/                # Wrapper halaman login
│   │   │
│   │   ├── app.module.ts                  # Root module (NgModule)
│   │   ├── app-routing.module.ts          # Konfigurasi routing
│   │   ├── app.component.ts               # Root component
│   │   ├── app.component.html             # Template root (layout utama)
│   │   └── app.component.css              # Style root component
│   │
│   ├── assets/                            # Aset statis
│   │   ├── images/                        # Gambar
│   │   └── js/                            # Script tambahan (scripts.js)
│   │
│   ├── environments/                      # Konfigurasi environment
│   │   ├── environment.ts                 # Development (localhost:8888)
│   │   └── environment.prod.ts            # Production (192.168.1.13:8181)
│   │
│   ├── index.html                         # Entry point HTML
│   ├── main.ts                            # Bootstrap Angular
│   ├── polyfills.ts                       # Polyfills
│   ├── styles.css                         # Global styles
│   └── test.ts                            # Setup unit test
│
├── angular.json                           # Konfigurasi Angular CLI
├── tsconfig.json                          # Konfigurasi TypeScript
├── tsconfig.app.json                      # TypeScript config untuk app
├── tsconfig.spec.json                     # TypeScript config untuk test
├── karma.conf.js                          # Konfigurasi Karma test runner
├── package.json                           # Dependencies & scripts
└── package-lock.json                      # Lock file dependencies
```

### Konvensi Penamaan File

Proyek ini mengikuti konvensi penamaan standar Angular:

| Tipe File     | Pola Penamaan                         | Contoh                            |
| :------------ | :------------------------------------ | :-------------------------------- |
| Component     | `<nama>.component.ts`                 | `dashboard.component.ts`          |
| Service       | `<nama>.service.ts`                   | `auth.service.ts`                 |
| Model         | `<nama>.model.ts`                     | `surat-masuk.model.ts`            |
| Guard         | `<nama>.guard.ts`                     | `auth.guard.ts`                   |
| Interceptor   | `<nama>-interceptors.service.ts`      | `auth-interceptors.service.ts`    |
| Pipe          | `<nama>.pipe.ts`                      | `reverse.pipe.ts`                 |
| Directive     | `<nama>.directive.ts`                 | `custom-max-validator.directive.ts` |
| Template      | `<nama>.component.html`               | `dashboard.component.html`        |
| Style         | `<nama>.component.css`                | `dashboard.component.css`         |
| Spec (Test)   | `<nama>.component.spec.ts`            | `app.component.spec.ts`           |
| Validator     | `<nama>.validator.ts`                 | `coordinate.validator.ts`         |

### Pola Arsitektur per Modul (Feature Module Pattern)

Setiap fitur utama (misal: `surat-masuk`) memiliki struktur konsisten:

```
surat-masuk/
├── surat-masuk.component.ts       # Parent component (container + tab navigation)
├── surat-masuk.model.ts           # Data model / interface
├── surat-masuk.service.ts         # HTTP service (CRUD + search)
├── surat-masuk-list/              # Child: tabel daftar data (pagination, filter, search)
├── surat-masuk-form/              # Child: form tambah & edit data
├── surat-masuk-detail/            # Child: tampilan detail data
└── surat-masuk-help/              # Child: panel bantuan/informasi
```

---

## API Endpoints

Aplikasi ini berkomunikasi dengan backend REST API. Base URL dikonfigurasi melalui file environment:

- **Development**: `http://localhost:8888/api/v1`
- **Production**: `http://192.168.1.13:8181/api/v1`

### Autentikasi

| Method | Endpoint                      | Deskripsi                      |
| :----- | :---------------------------- | :----------------------------- |
| POST   | `/api/v1/login`               | Login (mengembalikan JWT token) |

### Surat Masuk

| Method | Endpoint                                     | Deskripsi              |
| :----- | :------------------------------------------- | :--------------------- |
| GET    | `/api/v1/surat-masuk`                        | Daftar surat masuk (paginated, filter jenisSurat & tanggal) |
| GET    | `/api/v1/surat-masuk/search`                 | Pencarian surat masuk  |
| GET    | `/api/v1/surat-masuk/{id}/detail`            | Detail surat masuk     |
| POST   | `/api/v1/surat-masuk`                        | Tambah surat masuk     |
| PUT    | `/api/v1/surat-masuk/{id}`                   | Update surat masuk     |
| DELETE | `/api/v1/surat-masuk/{id}`                   | Hapus surat masuk      |

### Surat Keluar

| Method | Endpoint                                     | Deskripsi              |
| :----- | :------------------------------------------- | :--------------------- |
| GET    | `/api/v1/surat-keluar`                       | Daftar surat keluar    |
| GET    | `/api/v1/surat-keluar/search`                | Pencarian surat keluar |
| GET    | `/api/v1/surat-keluar/{id}/detail`           | Detail surat keluar    |
| POST   | `/api/v1/surat-keluar`                       | Tambah surat keluar    |
| PUT    | `/api/v1/surat-keluar/{id}`                  | Update surat keluar    |
| DELETE | `/api/v1/surat-keluar/{id}`                  | Hapus surat keluar     |

### Register Kerja Intelijen (RKI)

| Method | Endpoint                                     | Deskripsi              |
| :----- | :------------------------------------------- | :--------------------- |
| GET    | `/api/v1/rki`                                | Daftar RKI (paginated, filter bidang & tanggal) |
| GET    | `/api/v1/rki/search`                         | Pencarian RKI          |
| GET    | `/api/v1/rki/{id}/detail`                    | Detail RKI             |
| POST   | `/api/v1/rki`                                | Tambah RKI             |
| PUT    | `/api/v1/rki/{id}`                           | Update RKI             |
| DELETE | `/api/v1/rki/{id}`                           | Hapus RKI              |

### Ekspedisi Surat

| Method | Endpoint                                     | Deskripsi              |
| :----- | :------------------------------------------- | :--------------------- |
| GET    | `/api/v1/ekspedisi`                          | Daftar ekspedisi       |
| GET    | `/api/v1/ekspedisi/search`                   | Pencarian ekspedisi    |
| GET    | `/api/v1/ekspedisi/{id}/detail`              | Detail ekspedisi       |
| POST   | `/api/v1/ekspedisi`                          | Tambah ekspedisi       |
| PUT    | `/api/v1/ekspedisi/{id}`                     | Update ekspedisi       |
| DELETE | `/api/v1/ekspedisi/{id}`                     | Hapus ekspedisi        |

### Produk Intelijen (Prodin)

| Method | Endpoint                                     | Deskripsi              |
| :----- | :------------------------------------------- | :--------------------- |
| GET    | `/api/v1/prodin`                             | Daftar prodin          |
| GET    | `/api/v1/prodin/search`                      | Pencarian prodin       |
| GET    | `/api/v1/prodin/count`                       | Statistik count prodin (dashboard) |
| GET    | `/api/v1/prodin/{id}/detail`                 | Detail prodin          |
| POST   | `/api/v1/prodin`                             | Tambah prodin          |
| PUT    | `/api/v1/prodin/{id}`                        | Update prodin          |
| DELETE | `/api/v1/prodin/{id}`                        | Hapus prodin           |

### Arsip

| Method | Endpoint                                     | Deskripsi              |
| :----- | :------------------------------------------- | :--------------------- |
| GET    | `/api/v1/arsip`                              | Daftar arsip           |
| GET    | `/api/v1/arsip/search`                       | Pencarian arsip        |
| GET    | `/api/v1/arsip/{id}/detail`                  | Detail arsip           |
| POST   | `/api/v1/arsip`                              | Tambah arsip           |
| PUT    | `/api/v1/arsip/{id}`                         | Update arsip           |
| DELETE | `/api/v1/arsip/{id}`                         | Hapus arsip            |

### Kegiatan Intelijen

| Method | Endpoint                                     | Deskripsi                    |
| :----- | :------------------------------------------- | :--------------------------- |
| GET    | `/api/v1/kegiatan`                           | Daftar kegiatan              |
| GET    | `/api/v1/kegiatan/search`                    | Pencarian kegiatan           |
| GET    | `/api/v1/kegiatan/{id}/detail`               | Detail kegiatan              |
| POST   | `/api/v1/kegiatan`                           | Tambah kegiatan              |
| PUT    | `/api/v1/kegiatan/{id}`                      | Update kegiatan              |
| DELETE | `/api/v1/kegiatan/{id}`                      | Hapus kegiatan               |
| GET    | `/api/v1/kegiatan-pamstra`                   | Daftar kegiatan Pamstra      |
| GET    | `/api/v1/kegiatan-pamstra/search`            | Pencarian kegiatan Pamstra   |
| GET    | `/api/v1/kegiatan-pamstra/{id}/detail`       | Detail kegiatan Pamstra      |
| POST   | `/api/v1/kegiatan-pamstra`                   | Tambah kegiatan Pamstra      |
| PUT    | `/api/v1/kegiatan-pamstra/{id}`              | Update kegiatan Pamstra      |
| DELETE | `/api/v1/kegiatan-pamstra/{id}`              | Hapus kegiatan Pamstra       |

### Operasi Intelijen (Opsin)

| Method | Endpoint                                     | Deskripsi              |
| :----- | :------------------------------------------- | :--------------------- |
| GET    | `/api/v1/opsin`                              | Daftar opsin           |
| GET    | `/api/v1/opsin/search`                       | Pencarian opsin        |
| GET    | `/api/v1/opsin/{id}/detail`                  | Detail opsin           |
| POST   | `/api/v1/opsin`                              | Tambah opsin           |
| PUT    | `/api/v1/opsin/{id}`                         | Update opsin           |
| DELETE | `/api/v1/opsin/{id}`                         | Hapus opsin            |

### Telaahan Intelijen (Lahin)

| Method | Endpoint                                     | Deskripsi              |
| :----- | :------------------------------------------- | :--------------------- |
| GET    | `/api/v1/lahin`                              | Daftar lahin           |
| GET    | `/api/v1/lahin/search`                       | Pencarian lahin        |
| GET    | `/api/v1/lahin/{id}/detail`                  | Detail lahin           |
| POST   | `/api/v1/lahin`                              | Tambah lahin           |
| PUT    | `/api/v1/lahin/{id}`                         | Update lahin           |
| DELETE | `/api/v1/lahin/{id}`                         | Hapus lahin            |

### PPH & PPM

| Method | Endpoint                                     | Deskripsi              |
| :----- | :------------------------------------------- | :--------------------- |
| GET    | `/api/v1/pphppm`                             | Daftar PPH/PPM         |
| GET    | `/api/v1/pphppm/search`                      | Pencarian PPH/PPM      |
| GET    | `/api/v1/pphppm/count`                       | Statistik count PPH/PPM (dashboard) |
| GET    | `/api/v1/pphppm/{id}/detail`                 | Detail PPH/PPM         |
| POST   | `/api/v1/pphppm`                             | Tambah PPH/PPM         |
| PUT    | `/api/v1/pphppm/{id}`                        | Update PPH/PPM         |
| DELETE | `/api/v1/pphppm/{id}`                        | Hapus PPH/PPM          |

### Penkum & Luhkum

| Method | Endpoint                                     | Deskripsi              |
| :----- | :------------------------------------------- | :--------------------- |
| GET    | `/api/v1/penkumluhkum`                       | Daftar Penkum/Luhkum   |
| GET    | `/api/v1/penkumluhkum/search`                | Pencarian Penkum/Luhkum|
| GET    | `/api/v1/penkumluhkum/count`                 | Statistik count Penkum/Luhkum (dashboard) |
| GET    | `/api/v1/penkumluhkum/{id}/detail`           | Detail Penkum/Luhkum   |
| POST   | `/api/v1/penkumluhkum`                       | Tambah Penkum/Luhkum   |
| PUT    | `/api/v1/penkumluhkum/{id}`                  | Update Penkum/Luhkum   |
| DELETE | `/api/v1/penkumluhkum/{id}`                  | Hapus Penkum/Luhkum    |

### Data Peta

| Method | Endpoint                                     | Deskripsi              |
| :----- | :------------------------------------------- | :--------------------- |
| GET    | `/api/v1/data-peta`                          | Daftar data peta (paginated) |
| GET    | `/api/v1/data-peta/search`                   | Pencarian data peta    |
| GET    | `/api/v1/data-peta/peta-simbol`              | Data peta untuk visualisasi simbol |
| GET    | `/api/v1/data-peta/{id}`                     | Detail data peta       |
| POST   | `/api/v1/data-peta`                          | Tambah data peta       |
| PUT    | `/api/v1/data-peta/{id}`                     | Update data peta       |
| DELETE | `/api/v1/data-peta/{id}`                     | Hapus data peta        |

### Query Parameters Umum

Sebagian besar endpoint `GET` untuk list mendukung query parameters:

| Parameter           | Tipe   | Deskripsi                                 |
| :------------------ | :----- | :---------------------------------------- |
| `pages`             | number | Halaman (0-indexed)                       |
| `sizes`             | number | Jumlah data per halaman                   |
| `startDate`         | string | Tanggal awal filter (format: `YYYY-MM-DD`)|
| `endDate`           | string | Tanggal akhir filter (format: `YYYY-MM-DD`)|
| `jenisSurat`        | string | Filter jenis surat (biasa/rahasia)        |
| `bidangDirektorat`  | string | Filter bidang direktorat                  |
| `value`             | string | Kata kunci pencarian                      |

### Response Format (Paginated)

```json
{
  "content": [],
  "size": 10,
  "totalElements": 100,
  "totalPages": 10,
  "number": 0
}
```

---

## Cara Setup Project

### Prasyarat

Pastikan sudah terinstall:

- **Node.js** (versi LTS terbaru, disarankan >= 18.x)
- **npm** (biasanya sudah termasuk dalam Node.js)
- **Angular CLI** (opsional, bisa menggunakan `npx`)

### Langkah-langkah

1. **Clone repository**

   ```bash
   git clone <repository-url>
   cd bdi-frontend-admin
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Konfigurasi environment**

   Sesuaikan base URL backend API di file environment:

   - **Development**: `src/environments/environment.ts`

     ```typescript
     export const environment = {
       production: false,
       baseUrl: 'http://localhost:8888/api/v1',
       version: 'v1.0.0-SNAPSHOT'
     };
     ```

   - **Production**: `src/environments/environment.prod.ts`

     ```typescript
     export const environment = {
       production: true,
       baseUrl: 'http://<PRODUCTION_HOST>:<PORT>/api/v1',
       version: 'v1.0.0-SNAPSHOT'
     };
     ```

4. **Pastikan backend API sudah berjalan**

   Aplikasi ini membutuhkan backend REST API yang berjalan pada URL yang dikonfigurasi di environment. Pastikan server backend sudah aktif sebelum menjalankan frontend.

---

## Cara Menjalankan Aplikasi

### Development Server

```bash
npm start
```

atau

```bash
ng serve
```

Aplikasi akan berjalan di `http://localhost:4200/`. Aplikasi akan otomatis reload saat ada perubahan file.

### Build untuk Production

```bash
npm run build
```

atau

```bash
ng build
```

Hasil build akan tersimpan di folder `dist/bdi-frontend-admin/`.

### Watch Mode (Development Build)

```bash
npm run watch
```

Build secara otomatis setiap ada perubahan file (menggunakan konfigurasi development).

### Menjalankan Unit Test

```bash
npm test
```

atau

```bash
ng test
```

Menjalankan unit test menggunakan Karma + Jasmine di browser Chrome.

---

## Fitur Keamanan

- **JWT Authentication** — Semua request API terproteksi oleh JWT token yang dikirimkan melalui header `Authorization: Bearer <token>`.
- **HTTP Interceptor** — Token otomatis di-inject ke setiap HTTP request melalui `AuthInterceptorsService`.
- **Route Guard** — Semua halaman selain `/auth` dilindungi oleh `AuthGuard` (redirect ke login jika belum autentikasi).
- **Auto Login** — Mengecek token yang tersimpan di `localStorage` saat aplikasi dimuat.
- **Auto Logout** — Otomatis logout saat token JWT kedaluwarsa berdasarkan waktu expiration token.
- **Post-Login Guard** — `AuthAfterLoginGuard` mencegah user yang sudah login mengakses halaman login lagi.

---

## Environment

| Environment  | Base URL API                         | File Konfigurasi                          |
| :----------- | :----------------------------------- | :---------------------------------------- |
| Development  | `http://localhost:8888/api/v1`       | `src/environments/environment.ts`         |
| Production   | `http://192.168.1.13:8181/api/v1`    | `src/environments/environment.prod.ts`    |

---

## Author

**Ucup TopekoX** 🐒