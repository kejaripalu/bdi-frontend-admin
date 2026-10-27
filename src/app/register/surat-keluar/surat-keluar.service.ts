import { HttpClient } from "@angular/common/http";
import { ApiError } from "src/app/shared/api-error";
import { Page } from "src/app/shared/page";
import { Injectable } from "@angular/core";
import { catchError, map, throwError } from "rxjs";
import { MonthConverterService } from "src/app/shared/month-converter.service";
import { environment } from "src/environments/environment";
import { SuratKeluar } from "./surat-keluar.model";

@Injectable({ providedIn: 'root' })
export class SuratKeluarService {
    private endPoint = environment.baseUrl + '/surat-keluar';
    registerSuratKeluar: SuratKeluar[] = [];

    constructor(private httpClient: HttpClient,
                private monthConverterService: MonthConverterService) { }

    getSuratKeluar(page: number, size: number, jenisSurat: string, bulan: number, tahun: string) {
        const startDate = this.monthConverterService.getStartDate(bulan, tahun);        
        const endDate = this.monthConverterService.getEndDate(bulan, tahun);    
        const getEndPoint = `${this.endPoint}?pages=${page}&sizes=${size}&jenisSurat=${jenisSurat}&` +
            `startDate=${startDate}&endDate=${endDate}`;        
        return this.httpClient.get<Page<SuratKeluar>>(getEndPoint)
            .pipe(
                map(response => {
                    return response;
                })
            );
    }

    createSuratKeluar(suratKeluar: SuratKeluar) {
        return this.httpClient.post<SuratKeluar>(this.endPoint, suratKeluar)
            .pipe(catchError(errorResponse => {
                let errorMessage = 'Aduh!!!... Gawat nih bro... GAGAL terhubung ke server';
                const apiMessage = ApiError.messageFor(errorResponse);
                if (apiMessage) {
                    return throwError(() => apiMessage);
                }
                if (!errorResponse.error) {
                    return throwError(() => errorMessage);
                }
                switch (errorResponse.error.message) {
                    case 'INVALID_DATA_INTEGRITY':
                      errorMessage = 'Bro.. Gagal Simpan Data, Cek lagi data isian!!!, data yang dimasukan sudah ada atau format data yang dimasukan invalid!';
                      break;
                  }
                return throwError(() => errorMessage);
            }));
    }

    getOneSuratKeluar(ids: string) {
        const getEndPoint = `${this.endPoint}/${ids}/detail`;
        return this.httpClient.get<SuratKeluar>(getEndPoint)
            .pipe(
                map(response => {
                    return response;
                }),
                catchError(errorResponse => {
                    let errorMessage =  'Aduh... Parah nih bos.. gagal ambil data dari server!!!';
                const apiMessage = ApiError.messageFor(errorResponse);
                if (apiMessage) {
                    return throwError(() => apiMessage);
                }
                    if (!errorResponse.error) {
                        return throwError(() => errorMessage);
                    }
                    switch (errorResponse.error.message) {
                        case 'ID_NOT_FOUND':
                            errorMessage = 'Bro... Data tidak ditemukan!!!'
                            break;
                    }
                    return throwError(() => errorMessage);
                })
            );
    }

    updateSuratKeluar(suratKeluar: SuratKeluar, ids: string) {
        const putEndPoint = `${this.endPoint}/${ids}`;
        return this.httpClient.put<SuratKeluar>(putEndPoint, suratKeluar)
            .pipe(catchError(errorResponse => {
                let errorMessage = 'Aduh!!!... Gawat nih bro... GAGAL terhubung ke server';
                const apiMessage = ApiError.messageFor(errorResponse);
                if (apiMessage) {
                    return throwError(() => apiMessage);
                }
                if (!errorResponse.error) {
                    return throwError(() => errorMessage);
                }
                switch (errorResponse.error.message) {
                    case 'ID_NOT_FOUND':
                        errorMessage = 'Bro... Data tidak ditemukan!!!'
                        break;
                    case 'INVALID_DATA_INTEGRITY':
                        errorMessage = 'Bro.. Gagal Simpan Data, Cek lagi data isian!!!, data yang dimasukan sudah ada atau format data yang dimasukan invalid!';
                        break;
                }
                return throwError(() => errorMessage);
            }));
    }

    deleteSuratKeluar(ids: string) {
        const deleteEndPoint = `${this.endPoint}/${ids}`;
        return this.httpClient.delete<SuratKeluar>(deleteEndPoint)
            .pipe(catchError(errorResponse => {
                let errorMessage = 'Aduh!!!... Gawat nih bro... GAGAL terhubung ke server';
                const apiMessage = ApiError.messageFor(errorResponse);
                if (apiMessage) {
                    return throwError(() => apiMessage);
                }
                if (!errorResponse.error) {
                    return throwError(() => errorMessage);
                }
                switch (errorResponse.error.message) {
                    case 'ID_NOT_FOUND':
                        errorMessage = 'Bro... Data tidak ditemukan!!!'
                        break;
                }
                return throwError(() => errorMessage);
            }));
    }

    getSearchSuratKeluar(value: string, page: number, size: number, jenisSurat: string, tahun: string) {
        const startDate = tahun + '-01-01';        
        const endDate = tahun + '-12-31';    
        const getEndPoint = `${this.endPoint}/search?pages=${page}&sizes=${size}&jenisSurat=${jenisSurat}&` +
            `startDate=${startDate}&endDate=${endDate}&value=${encodeURIComponent(value)}`;  
        return this.httpClient.get<Page<SuratKeluar>>(getEndPoint)
            .pipe(
                map(response => {
                    return response;
                })
            );
    }

}


