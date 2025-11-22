import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { AppComponent } from './app.component';
import { NavbarComponent } from './templates/navbar/navbar.component';
import { SidebarComponent } from './templates/sidebar/sidebar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SuratMasukComponent } from './register/surat-masuk/surat-masuk.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { ReversePipe } from './shared/reverse.pipe';
import { SuratMasukFormComponent } from './register/surat-masuk/surat-masuk-form/surat-masuk-form.component';
import { NoDataAlertComponent } from './shared/no-data-alert/no-data-alert.component';
import { SuratMasukDetailComponent } from './register/surat-masuk/surat-masuk-detail/surat-masuk-detail.component';
import { DangerAlertComponent } from './shared/danger-alert/danger-alert.component';
import { SuratMasukListComponent } from './register/surat-masuk/surat-masuk-list/surat-masuk-list.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SuratKeluarComponent } from './register/surat-keluar/surat-keluar.component';
import { SuratMasukHelpComponent } from './register/surat-masuk/surat-masuk-help/surat-masuk-help.component';
import { SuratKeluarListComponent } from './register/surat-keluar/surat-keluar-list/surat-keluar-list.component';
import { SuratKeluarFormComponent } from './register/surat-keluar/surat-keluar-form/surat-keluar-form.component';
import { SuratKeluarDetailComponent } from './register/surat-keluar/surat-keluar-detail/surat-keluar-detail.component';
import { SuratKeluarHelpComponent } from './register/surat-keluar/surat-keluar-help/surat-keluar-help.component';
import { ToastComponent } from './shared/toast/toast.component';
import { RkiComponent } from './register/rki/rki.component';
import { RkiListComponent } from './register/rki/rki-list/rki-list.component';
import { RkiDetailComponent } from './register/rki/rki-detail/rki-detail.component';
import { RkiFormComponent } from './register/rki/rki-form/rki-form.component';
import { RkiHelpComponent } from './register/rki/rki-help/rki-help.component';
import { EkspedisiComponent } from './register/ekspedisi/ekspedisi.component';
import { EkspedisiListComponent } from './register/ekspedisi/ekspedisi-list/ekspedisi-list.component';
import { EkspedisiFormComponent } from './register/ekspedisi/ekspedisi-form/ekspedisi-form.component';
import { EkspedisiDetailComponent } from './register/ekspedisi/ekspedisi-detail/ekspedisi-detail.component';
import { EkspedisiHelpComponent } from './register/ekspedisi/ekspedisi-help/ekspedisi-help.component';
import { ProdinComponent } from './register/prodin/prodin.component';
import { ProdinListComponent } from './register/prodin/prodin-list/prodin-list.component';
import { SektorPipe } from './shared/bidang-direktorat/sektor.pipe';
import { ProdinPipe } from './shared/prodin/prodin.pipe';
import { ProdinDetailComponent } from './register/prodin/prodin-detail/prodin-detail.component';
import { ProdinFormComponent } from './register/prodin/prodin-form/prodin-form.component';
import { ProdinHelpComponent } from './register/prodin/prodin-help/prodin-help.component';
import { ArsipComponent } from './register/arsip/arsip.component';
import { ArsipListComponent } from './register/arsip/arsip-list/arsip-list.component';
import { ArsipFormComponent } from './register/arsip/arsip-form/arsip-form.component';
import { ArsipDetailComponent } from './register/arsip/arsip-detail/arsip-detail.component';
import { ArsipHelpComponent } from './register/arsip/arsip-help/arsip-help.component';
import { ShortenPipe } from './shared/shorten.pipe';
import { KegiatanComponent } from './register/kegiatan/kegiatan.component';
import { KegiatanListComponent } from './register/kegiatan/kegiatan-list/kegiatan-list.component';
import { KegiatanFormComponent } from './register/kegiatan/kegiatan-form/kegiatan-form.component';
import { KegiatanDetailComponent } from './register/kegiatan/kegiatan-detail/kegiatan-detail.component';
import { KegiatanHelpComponent } from './register/kegiatan/kegiatan-help/kegiatan-help.component';
import { KegiatanPamstraListComponent } from './register/kegiatan/kegiatan-pamstra-list/kegiatan-pamstra-list.component';
import { KegiatanPamstraDetailComponent } from './register/kegiatan/kegiatan-pamstra-detail/kegiatan-pamstra-detail.component';
import { KegiatanPamstraFormComponent } from './register/kegiatan/kegiatan-pamstra-form/kegiatan-pamstra-form.component';
import { KegiatanPamstraHelpComponent } from './register/kegiatan/kegiatan-pamstra-help/kegiatan-pamstra-help.component';
import { OpsinComponent } from './register/opsin/opsin.component';
import { OpsinListComponent } from './register/opsin/opsin-list/opsin-list.component';
import { OpsinFormComponent } from './register/opsin/opsin-form/opsin-form.component';
import { OpsinDetailComponent } from './register/opsin/opsin-detail/opsin-detail.component';
import { OpsinHelpComponent } from './register/opsin/opsin-help/opsin-help.component';
import { LahinComponent } from './register/lahin/lahin.component';
import { LahinListComponent } from './register/lahin/lahin-list/lahin-list.component';
import { LahinFormComponent } from './register/lahin/lahin-form/lahin-form.component';
import { LahinDetailComponent } from './register/lahin/lahin-detail/lahin-detail.component';
import { LahinHelpComponent } from './register/lahin/lahin-help/lahin-help.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { PphppmComponent } from './register/pphppm/pphppm.component';
import { PphppmDetailComponent } from './register/pphppm/pphppm-detail/pphppm-detail.component';
import { PphppmFormComponent } from './register/pphppm/pphppm-form/pphppm-form.component';
import { PphppmHelpComponent } from './register/pphppm/pphppm-help/pphppm-help.component';
import { PphppmListComponent } from './register/pphppm/pphppm-list/pphppm-list.component';
import { AuthComponent } from './auth/auth.component';
import { AuthInterceptorsService } from './auth/auth-interceptors.service';
import { TruncatePipe } from './shared/truncate.pipe';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { PenkumluhkumComponent } from './register/penkumluhkum/penkumluhkum.component';
import { PenkumluhkumListComponent } from './register/penkumluhkum/penkumluhkum-list/penkumluhkum-list.component';
import { PenkumluhkumFormComponent } from './register/penkumluhkum/penkumluhkum-form/penkumluhkum-form.component';
import { CustomMaxValidatorDirective } from './shared/custom-directive/custom-max-validator.directive';
import { CustomMinValidatorDirective } from './shared/custom-directive/custom-min-validator.directive';
import { PenkumluhkumDetailComponent } from './register/penkumluhkum/penkumluhkum-detail/penkumluhkum-detail.component';
import { PenkumluhkumHelpComponent } from './register/penkumluhkum/penkumluhkum-help/penkumluhkum-help.component';
import { DeleteModalComponent } from './shared/delete-modal/delete-modal.component';
import { DataPetaComponent } from './peta/data-peta/data-peta.component';
import { DataPetaListComponent } from './peta/data-peta/data-peta-list/data-peta-list.component';
import { DataPetaHelpComponent } from './peta/data-peta/data-peta-help/data-peta-help.component';
import { DataPetaFormComponent } from './peta/data-peta/data-peta-form/data-peta-form.component';
import { NgxCurrencyDirective } from 'ngx-currency';

@NgModule({ declarations: [
        AppComponent,
        NavbarComponent,
        SidebarComponent,
        DashboardComponent,
        SuratMasukComponent,
        SuratMasukListComponent,
        LoadingSpinnerComponent,
        SuratMasukFormComponent,
        ReversePipe,
        NoDataAlertComponent,
        SuratMasukDetailComponent,
        DangerAlertComponent,
        SuratKeluarComponent,
        SuratMasukHelpComponent,
        SuratKeluarListComponent,
        SuratKeluarFormComponent,
        SuratKeluarDetailComponent,
        SuratKeluarHelpComponent,
        ToastComponent,
        RkiComponent,
        RkiListComponent,
        RkiDetailComponent,
        RkiFormComponent,
        RkiHelpComponent,
        EkspedisiComponent,
        EkspedisiListComponent,
        EkspedisiFormComponent,
        EkspedisiDetailComponent,
        EkspedisiHelpComponent,
        ProdinComponent,
        ProdinListComponent,
        SektorPipe,
        ProdinPipe,
        ProdinDetailComponent,
        ProdinFormComponent,
        ProdinHelpComponent,
        ArsipComponent,
        ArsipListComponent,
        ArsipFormComponent,
        ArsipDetailComponent,
        ArsipHelpComponent,
        ShortenPipe,
        KegiatanComponent,
        KegiatanListComponent,
        KegiatanFormComponent,
        KegiatanDetailComponent,
        KegiatanHelpComponent,
        KegiatanPamstraListComponent,
        KegiatanPamstraDetailComponent,
        KegiatanPamstraFormComponent,
        KegiatanPamstraHelpComponent,
        OpsinComponent,
        OpsinListComponent,
        OpsinFormComponent,
        OpsinDetailComponent,
        OpsinHelpComponent,
        LahinComponent,
        LahinListComponent,
        LahinFormComponent,
        LahinDetailComponent,
        LahinHelpComponent,
        PageNotFoundComponent,
        PphppmComponent,
        PphppmDetailComponent,
        PphppmFormComponent,
        PphppmHelpComponent,
        PphppmListComponent,
        AuthComponent,
        TruncatePipe,
        LoginPageComponent,
        PenkumluhkumComponent,
        PenkumluhkumListComponent,
        PenkumluhkumFormComponent,
        CustomMaxValidatorDirective,
        CustomMinValidatorDirective,
        PenkumluhkumDetailComponent,
        PenkumluhkumHelpComponent,
        DeleteModalComponent,
        DataPetaComponent,
        DataPetaListComponent,
        DataPetaHelpComponent,
        DataPetaFormComponent
    ],
    exports: [
        NgxCurrencyDirective
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        AppRoutingModule,
        NgbModule,
        NgxCurrencyDirective], providers: [{
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptorsService,
            multi: true
        }, provideHttpClient(withInterceptorsFromDi())] })
export class AppModule { }
