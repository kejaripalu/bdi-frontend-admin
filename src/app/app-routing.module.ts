import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ProdinListComponent } from "./register/prodin/prodin-list/prodin-list.component";
import { ProdinComponent } from "./register/prodin/prodin.component";
import { EkspedisiDetailComponent } from "./register/ekspedisi/ekspedisi-detail/ekspedisi-detail.component";
import { EkspedisiFormComponent } from "./register/ekspedisi/ekspedisi-form/ekspedisi-form.component";
import { EkspedisiListComponent } from "./register/ekspedisi/ekspedisi-list/ekspedisi-list.component";
import { EkspedisiComponent } from "./register/ekspedisi/ekspedisi.component";
import { RkiDetailComponent } from "./register/rki/rki-detail/rki-detail.component";
import { RkiFormComponent } from "./register/rki/rki-form/rki-form.component";
import { RkiListComponent } from "./register/rki/rki-list/rki-list.component";
import { RkiComponent } from "./register/rki/rki.component";
import { SuratKeluarDetailComponent } from "./register/surat-keluar/surat-keluar-detail/surat-keluar-detail.component";
import { SuratKeluarFormComponent } from "./register/surat-keluar/surat-keluar-form/surat-keluar-form.component";
import { SuratKeluarListComponent } from "./register/surat-keluar/surat-keluar-list/surat-keluar-list.component";
import { SuratKeluarComponent } from "./register/surat-keluar/surat-keluar.component";
import { SuratMasukDetailComponent } from "./register/surat-masuk/surat-masuk-detail/surat-masuk-detail.component";
import { SuratMasukFormComponent } from "./register/surat-masuk/surat-masuk-form/surat-masuk-form.component";
import { SuratMasukListComponent } from "./register/surat-masuk/surat-masuk-list/surat-masuk-list.component";
import { SuratMasukComponent } from "./register/surat-masuk/surat-masuk.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ProdinDetailComponent } from "./register/prodin/prodin-detail/prodin-detail.component";
import { ProdinFormComponent } from "./register/prodin/prodin-form/prodin-form.component";
import { ArsipComponent } from "./register/arsip/arsip.component";
import { ArsipListComponent } from "./register/arsip/arsip-list/arsip-list.component";
import { ArsipFormComponent } from "./register/arsip/arsip-form/arsip-form.component";
import { ArsipDetailComponent } from "./register/arsip/arsip-detail/arsip-detail.component";
import { KegiatanComponent } from "./register/kegiatan/kegiatan.component";
import { KegiatanListComponent } from "./register/kegiatan/kegiatan-list/kegiatan-list.component";
import { KegiatanFormComponent } from "./register/kegiatan/kegiatan-form/kegiatan-form.component";
import { KegiatanDetailComponent } from "./register/kegiatan/kegiatan-detail/kegiatan-detail.component";
import { KegiatanPamstraListComponent } from "./register/kegiatan/kegiatan-pamstra-list/kegiatan-pamstra-list.component";
import { KegiatanPamstraDetailComponent } from "./register/kegiatan/kegiatan-pamstra-detail/kegiatan-pamstra-detail.component";
import { KegiatanPamstraFormComponent } from "./register/kegiatan/kegiatan-pamstra-form/kegiatan-pamstra-form.component";
import { OpsinComponent } from "./register/opsin/opsin.component";
import { OpsinListComponent } from "./register/opsin/opsin-list/opsin-list.component";
import { OpsinFormComponent } from "./register/opsin/opsin-form/opsin-form.component";
import { OpsinDetailComponent } from "./register/opsin/opsin-detail/opsin-detail.component";
import { LahinComponent } from "./register/lahin/lahin.component";
import { LahinListComponent } from "./register/lahin/lahin-list/lahin-list.component";
import { LahinFormComponent } from "./register/lahin/lahin-form/lahin-form.component";
import { LahinDetailComponent } from "./register/lahin/lahin-detail/lahin-detail.component";
import { PageNotFoundComponent } from "./pages/page-not-found/page-not-found.component";
import { PphppmComponent } from "./register/pphppm/pphppm.component";
import { PphppmListComponent } from "./register/pphppm/pphppm-list/pphppm-list.component";
import { PphppmFormComponent } from "./register/pphppm/pphppm-form/pphppm-form.component";
import { PphppmDetailComponent } from "./register/pphppm/pphppm-detail/pphppm-detail.component";
import { AuthComponent } from "./auth/auth.component";
import { AuthGuard } from "./auth/auth.guard";
import { AuthAfterLoginGuard } from "./auth/auth-after-login.guard";
import { PenkumluhkumComponent } from "./register/penkumluhkum/penkumluhkum.component";
import { PenkumluhkumListComponent } from "./register/penkumluhkum/penkumluhkum-list/penkumluhkum-list.component";
import { PenkumluhkumFormComponent } from "./register/penkumluhkum/penkumluhkum-form/penkumluhkum-form.component";
import { PenkumluhkumDetailComponent } from "./register/penkumluhkum/penkumluhkum-detail/penkumluhkum-detail.component";
import { DataPetaComponent } from "./peta/data-peta/data-peta.component";
import { DataPetaListComponent } from "./peta/data-peta/data-peta-list/data-peta-list.component";
import { DataPetaFormComponent } from "./peta/data-peta/data-peta-form/data-peta-form.component";
import { PetaSimbolComponent } from "./peta/peta-simbol/peta-simbol.component";
import { PetaSimbolViewComponent } from "./peta/peta-simbol/peta-simbol-view/peta-simbol-view.component";

const appRoutes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'auth', component: AuthComponent, canActivate: [AuthAfterLoginGuard], title: 'Login - Bank Data Intelijen' },
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], title: 'Dashboard Bank Data Intelijen Kejaksaan' },
    { path: 'surat-masuk', component: SuratMasukComponent, title: 'Surat Masuk',
        canActivate: [AuthGuard],
        children: [
        { path: '', redirectTo: '/surat-masuk/biasa', pathMatch: 'full' },
        { path: 'biasa', component: SuratMasukListComponent, title: 'Surat Masuk Biasa' },
        { path: 'biasa/form', component: SuratMasukFormComponent, title: 'Form Surat Masuk Biasa' },
        { path: 'biasa/:id/form', component: SuratMasukFormComponent, title: 'Form Surat Masuk Biasa' },
        { path: 'biasa/:id/detail', component: SuratMasukDetailComponent, title: 'Detail Surat Masuk Biasa' },
        { path: 'rahasia', component: SuratMasukListComponent, title: 'Surat Masuk Rahasia' },
        { path: 'rahasia/form', component: SuratMasukFormComponent, title: 'Form Surat Masuk Rahasia' },
        { path: 'rahasia/:id/form', component: SuratMasukFormComponent, title: 'Form Surat Masuk Rahasia' },
        { path: 'rahasia/:id/detail', component: SuratMasukDetailComponent, title: 'Detail Surat Masuk Rahasia' }
    ]},
    { path: 'surat-keluar', component: SuratKeluarComponent, title: 'Surat Keluar', 
        canActivate: [AuthGuard],
        children: [
        { path: '', redirectTo: '/surat-keluar/biasa', pathMatch: 'full' },
        { path: 'biasa', component: SuratKeluarListComponent, title: 'Surat Keluar Biasa' },
        { path: 'biasa/form', component: SuratKeluarFormComponent, title: 'Form Surat Keluar Biasa' },
        { path: 'biasa/:id/form', component: SuratKeluarFormComponent, title: 'Form Surat Keluar Biasa' },
        { path: 'biasa/:id/detail', component: SuratKeluarDetailComponent, title: 'Detail Surat Keluar Biasa' },
        { path: 'rahasia', component: SuratKeluarListComponent, title: 'Surat Keluar Rahasia' },
        { path: 'rahasia/form', component: SuratKeluarFormComponent, title: 'Form Surat Keluar Rahasia' },
        { path: 'rahasia/:id/form', component: SuratKeluarFormComponent, title: 'Form Surat Keluar Rahasia' },
        { path: 'rahasia/:id/detail', component: SuratKeluarDetailComponent, title: 'Detail Surat Keluar Rahasia'}
    ]},
    { path: 'rki', component: RkiComponent, title: 'Register Kerja Intelijen', 
        canActivate: [AuthGuard],
        children: [
        { path: '', redirectTo: '/rki/list', pathMatch: 'full' },
        { path: 'list', component: RkiListComponent, title: 'Daftar Register Kerja Intelijen' },
        { path: 'list/:id/detail', component: RkiDetailComponent, title: 'Detail Register Kerja Intelijen' },
        { path: 'list/form', component: RkiFormComponent, title: 'Form Register Kerja Intelijen' },
        { path: 'list/:id/form', component: RkiFormComponent, title: 'Form Register Kerja Intelijen'}
    ]},
    { path: 'ekspedisi', component: EkspedisiComponent, title: 'Ekspedisi Surat', 
        canActivate: [AuthGuard],
        children: [
        { path: '', redirectTo: '/ekspedisi/biasa', pathMatch: 'full' },
        { path: 'biasa', component: EkspedisiListComponent, title: 'Ekspedisi Surat Biasa' },
        { path: 'biasa/form', component: EkspedisiFormComponent, title: 'Form Ekspedisi Surat Biasa' },
        { path: 'biasa/:id/form', component: EkspedisiFormComponent, title: 'Form Ekspedisi Surat Biasa' },
        { path: 'biasa/:id/detail', component: EkspedisiDetailComponent, title: 'Detail Ekspedisi Surat Biasa' },
        { path: 'rahasia', component: EkspedisiListComponent, title: 'Ekspedisi Surat Rahasia' },
        { path: 'rahasia/form', component: EkspedisiFormComponent, title: 'Form Ekspedisi Surat Rahasia' },
        { path: 'rahasia/:id/form', component: EkspedisiFormComponent, title: 'Form Ekspedisi Surat Rahasia' },
        { path: 'rahasia/:id/detail', component: EkspedisiDetailComponent, title: 'Detail Ekspedisi Surat Rahasia'}
    ]},
    { path: 'prodin', component: ProdinComponent, title: 'Produk Intelijen',
        canActivate: [AuthGuard],
        children:[
        { path: '', redirectTo: '/prodin/list', pathMatch: 'full' },
        { path: 'list', component: ProdinListComponent, title: 'Daftar Produk Intelijen' },
        { path: 'list/:id/detail', component: ProdinDetailComponent, title: 'Detail Produk Intelijen' },
        { path: 'list/form', component: ProdinFormComponent, title: 'Form Produk Intelijen' },
        { path: 'list/:id/form', component: ProdinFormComponent, title: 'Form Produk Intelijen'}
    ]},
    { path: 'arsip', component: ArsipComponent, title: 'Arsip', 
        canActivate: [AuthGuard],
        children:[
        { path: '', redirectTo: '/arsip/list', pathMatch: 'full' },
        { path: 'list', component: ArsipListComponent, title: 'Daftar Arsip' },
        { path: 'list/form', component: ArsipFormComponent, title: 'Form Arsip' },
        { path: 'list/:id/form', component: ArsipFormComponent, title: 'Form Arsip' },
        { path: 'list/:id/detail', component: ArsipDetailComponent, title: 'Detail Arsip'}
    ]},
    { path: 'kegiatan', component: KegiatanComponent, title: 'Kegiatan Intelijen', 
        canActivate: [AuthGuard],
        children:[
        { path: '', redirectTo: '/kegiatan/list', pathMatch: 'full' },
        { path: 'list', component: KegiatanListComponent, title: 'Daftar Kegiatan Intelijen' },
        { path: 'list/form', component: KegiatanFormComponent, title: 'Form Kegiatan Intelijen' },
        { path: 'list/:id/form', component: KegiatanFormComponent, title: 'Form Kegiatan Intelijen' },
        { path: 'list/:id/detail', component: KegiatanDetailComponent, title: 'Detail Kegiatan Intelijen' },
        { path: 'list/pamstra-list', component: KegiatanPamstraListComponent, title: 'Daftar Kegiatan Intelijen Pengamanan Strategis' },
        { path: 'list/pamstra-list/:id/detail', component: KegiatanPamstraDetailComponent, title: 'Detail Kegiatan Intelijen Pengamanan Strategis' },
        { path: 'list/pamstra-form', component: KegiatanPamstraFormComponent,  title: 'Form Kegiatan Intelijen Pengamanan Strategis' },
        { path: 'list/:id/pamstra-form', component: KegiatanPamstraFormComponent, title: 'Form Kegiatan Intelijen Pengamanan Strategis'}
    ]},
    { path: 'opsin', component: OpsinComponent, title: 'Operasi Intelijen', 
        canActivate: [AuthGuard],
        children:[
        { path: '', redirectTo: '/opsin/list', pathMatch: 'full' },
        { path: 'list', component: OpsinListComponent, title: 'Daftar Operasi Intelijen' },
        { path: 'list/form', component: OpsinFormComponent, title: 'Form Operasi Intelijen' },
        { path: 'list/:id/form', component: OpsinFormComponent, title: 'Form Operasi Intelijen' },
        { path: 'list/:id/detail', component: OpsinDetailComponent, title: 'Detail Operasi Intelijen'}
    ]},
    { path: 'lahin', component: LahinComponent, title: 'Telahaan Intelijen', 
        canActivate: [AuthGuard],
        children:[
        { path: '', redirectTo: '/lahin/list', pathMatch: 'full' },
        { path: 'list', component: LahinListComponent, title: 'Daftar Telahaan Intelijen' },
        { path: 'list/form', component: LahinFormComponent, title: 'Form Telahaan Intelijen' },
        { path: 'list/:id/form', component: LahinFormComponent, title: 'Form Telahaan Intelijen' },
        { path: 'list/:id/detail', component: LahinDetailComponent, title: 'Detail Telahaan Intelijen'}
    ]},
    { path: 'pphppm', component: PphppmComponent, title: 'PPM & PPH',
        canActivate: [AuthGuard],
        children:[
        { path: '', redirectTo: '/pphppm/list', pathMatch: 'full', title: 'PPM & PPH' },
        { path: 'list', component: PphppmListComponent, title: 'Daftar PPM & PPH' },
        { path: 'list/form', component: PphppmFormComponent, title: 'Form PPM & PPH' },
        { path: 'list/:id/form', component: PphppmFormComponent, title: 'Form PPM & PPH' },
        { path: 'list/:id/detail', component: PphppmDetailComponent, title: 'Detail PPM & PPH'}
     ]},
     { path: 'penkumluhkum', component: PenkumluhkumComponent, title: 'Penkum & luhkum',
        canActivate: [AuthGuard],
        children:[
        { path: '', redirectTo: '/penkumluhkum/penkum', pathMatch: 'full' },
        { path: 'penkum', component: PenkumluhkumListComponent, title: 'Daftar Penkum' },
        { path: 'penkum/form', component: PenkumluhkumFormComponent, title: 'Form Penkum' },
        { path: 'penkum/:id/form', component: PenkumluhkumFormComponent, title: 'Form Penkum' },
        { path: 'penkum/:id/detail', component: PenkumluhkumDetailComponent, title: 'Detail Penkum' },
        { path: 'luhkum', component: PenkumluhkumListComponent, title: 'Daftar Luhkum' },
        { path: 'luhkum/form', component: PenkumluhkumFormComponent, title: 'Form Luhkum' },
        { path: 'luhkum/:id/form', component: PenkumluhkumFormComponent, title: 'Form Luhkum' },
        { path: 'luhkum/:id/detail', component: PenkumluhkumDetailComponent, title: 'Detail Luhkum' }
     ]},
     { path: 'data-peta', component: DataPetaComponent, title: 'Data Peta', 
        canActivate: [AuthGuard],
        children:[
        { path: '', redirectTo: '/data-peta/list', pathMatch: 'full' },
        { path: 'list', component: DataPetaListComponent, title: 'Daftar Data Peta' },
        { path: 'list/form', component: DataPetaFormComponent, title: 'Form Data Peta' },
        { path: 'list/:id/form', component: DataPetaFormComponent, title: 'Form Data Peta' },
    ]},
    { path: 'peta-simbol', component: PetaSimbolComponent, title: 'Peta & Simbol', 
        canActivate: [AuthGuard],
        children:[
        { path: '', redirectTo: '/peta-simbol/view', pathMatch: 'full' },
        { path: 'view', component: PetaSimbolViewComponent, title: 'Data Peta & Simbol' },
    ]},
    { path: 'page-not-found', component: PageNotFoundComponent, canActivate: [AuthGuard] },
    { path: '**', redirectTo: 'page-not-found', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes, {
        paramsInheritanceStrategy: 'always',
        canceledNavigationResolution: 'computed',
        urlUpdateStrategy: 'eager',
    })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
