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

const appRoutes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'auth', component: AuthComponent, canActivate: [AuthAfterLoginGuard] },
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard,] },
    { path: 'surat-masuk', component: SuratMasukComponent,
        canActivate: [AuthGuard],
        children: [
        { path: '', redirectTo: '/surat-masuk/biasa', pathMatch: 'full' },
        { path: 'biasa', component: SuratMasukListComponent },
        { path: 'biasa/form', component: SuratMasukFormComponent },
        { path: 'biasa/:id/form', component: SuratMasukFormComponent },
        { path: 'biasa/:id/detail', component: SuratMasukDetailComponent },
        { path: 'rahasia', component: SuratMasukListComponent },
        { path: 'rahasia/form', component: SuratMasukFormComponent },
        { path: 'rahasia/:id/form', component: SuratMasukFormComponent },
        { path: 'rahasia/:id/detail', component: SuratMasukDetailComponent }
    ]},
    { path: 'surat-keluar', component: SuratKeluarComponent, 
        canActivate: [AuthGuard],
        children: [
        { path: '', redirectTo: '/surat-keluar/biasa', pathMatch: 'full' },
        { path: 'biasa', component: SuratKeluarListComponent },
        { path: 'biasa/form', component: SuratKeluarFormComponent },
        { path: 'biasa/:id/form', component: SuratKeluarFormComponent },
        { path: 'biasa/:id/detail', component: SuratKeluarDetailComponent },
        { path: 'rahasia', component: SuratKeluarListComponent },
        { path: 'rahasia/form', component: SuratKeluarFormComponent },
        { path: 'rahasia/:id/form', component: SuratKeluarFormComponent },
        { path: 'rahasia/:id/detail', component: SuratKeluarDetailComponent }
    ]},
    { path: 'rki', component: RkiComponent, 
        canActivate: [AuthGuard],
        children: [
        { path: '', redirectTo: '/rki/list', pathMatch: 'full' },
        { path: 'list', component: RkiListComponent },
        { path: 'list/:id/detail', component: RkiDetailComponent },
        { path: 'list/form', component: RkiFormComponent },
        { path: 'list/:id/form', component: RkiFormComponent }
    ]},
    { path: 'ekspedisi', component: EkspedisiComponent, 
        canActivate: [AuthGuard],
        children: [
        { path: '', redirectTo: '/ekspedisi/biasa', pathMatch: 'full' },
        { path: 'biasa', component: EkspedisiListComponent },
        { path: 'biasa/form', component: EkspedisiFormComponent },
        { path: 'biasa/:id/form', component: EkspedisiFormComponent },
        { path: 'biasa/:id/detail', component: EkspedisiDetailComponent },
        { path: 'rahasia', component: EkspedisiListComponent },
        { path: 'rahasia/form', component: EkspedisiFormComponent },
        { path: 'rahasia/:id/form', component: EkspedisiFormComponent },
        { path: 'rahasia/:id/detail', component: EkspedisiDetailComponent }
    ]},
    { path: 'prodin', component: ProdinComponent,
        canActivate: [AuthGuard],
        children:[
        { path: '', redirectTo: '/prodin/list', pathMatch: 'full' },
        { path: 'list', component: ProdinListComponent },
        { path: 'list/:id/detail', component: ProdinDetailComponent },
        { path: 'list/form', component: ProdinFormComponent },
        { path: 'list/:id/form', component: ProdinFormComponent }
    ]},
    { path: 'arsip', component: ArsipComponent, 
        canActivate: [AuthGuard],
        children:[
        { path: '', redirectTo: '/arsip/list', pathMatch: 'full' },
        { path: 'list', component: ArsipListComponent },
        { path: 'list/form', component: ArsipFormComponent },
        { path: 'list/:id/form', component: ArsipFormComponent },
        { path: 'list/:id/detail', component: ArsipDetailComponent }
    ]},
    { path: 'kegiatan', component: KegiatanComponent, 
        canActivate: [AuthGuard],
        children:[
        { path: '', redirectTo: '/kegiatan/list', pathMatch: 'full' },
        { path: 'list', component: KegiatanListComponent },
        { path: 'list/form', component: KegiatanFormComponent },
        { path: 'list/:id/form', component: KegiatanFormComponent },
        { path: 'list/:id/detail', component: KegiatanDetailComponent },
        { path: 'list/pamstra-list', component: KegiatanPamstraListComponent },
        { path: 'list/pamstra-list/:id/detail', component: KegiatanPamstraDetailComponent },
        { path: 'list/pamstra-form', component: KegiatanPamstraFormComponent },
        { path: 'list/:id/pamstra-form', component: KegiatanPamstraFormComponent }
    ]},
    { path: 'opsin', component: OpsinComponent, 
        canActivate: [AuthGuard],
        children:[
        { path: '', redirectTo: '/opsin/list', pathMatch: 'full' },
        { path: 'list', component: OpsinListComponent },
        { path: 'list/form', component: OpsinFormComponent },
        { path: 'list/:id/form', component: OpsinFormComponent },
        { path: 'list/:id/detail', component: OpsinDetailComponent }
    ]},
    { path: 'lahin', component: LahinComponent, 
        canActivate: [AuthGuard],
        children:[
        { path: '', redirectTo: '/lahin/list', pathMatch: 'full' },
        { path: 'list', component: LahinListComponent },
        { path: 'list/form', component: LahinFormComponent },
        { path: 'list/:id/form', component: LahinFormComponent },
        { path: 'list/:id/detail', component: LahinDetailComponent }
    ]},
    { path: 'pphppm', component: PphppmComponent,
        canActivate: [AuthGuard],
        children:[
        { path: '', redirectTo: '/pphppm/list', pathMatch: 'full' },
        { path: 'list', component: PphppmListComponent },
        { path: 'list/form', component: PphppmFormComponent },
        { path: 'list/:id/form', component: PphppmFormComponent },
        { path: 'list/:id/detail', component: PphppmDetailComponent}
     ]},
     { path: 'penkumluhkum', component: PenkumluhkumComponent,
        canActivate: [AuthGuard],
        children:[
        { path: '', redirectTo: '/penkumluhkum/penkum', pathMatch: 'full' },
        { path: 'penkum', component: PenkumluhkumListComponent },
        { path: 'penkum/form', component: PenkumluhkumFormComponent },
        { path: 'penkum/:id/form', component: PenkumluhkumFormComponent },
        { path: 'penkum/:id/detail', component: PenkumluhkumDetailComponent },
        { path: 'luhkum', component: PenkumluhkumListComponent },
        { path: 'luhkum/form', component: PenkumluhkumFormComponent },
        { path: 'luhkum/:id/form', component: PenkumluhkumFormComponent },
        { path: 'luhkum/:id/detail', component: PenkumluhkumDetailComponent }
     ]},
     { path: 'data-peta', component: DataPetaComponent, 
        canActivate: [AuthGuard],
        children:[
        { path: '', redirectTo: '/data-peta/list', pathMatch: 'full' },
        { path: 'list', component: DataPetaListComponent },
        { path: 'list/form', component: DataPetaFormComponent },
        // { path: 'list/:id/form', component: DataPetaFormComponent },
        // { path: 'list/:id/detail', component: DataPetaDetailComponent }
    ]},
    { path: 'page-not-found', component: PageNotFoundComponent, canActivate: [AuthGuard] },
    { path: '**', redirectTo: 'page-not-found', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
