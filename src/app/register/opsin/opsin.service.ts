import { HttpClient } from "@angular/common/http";
import { ApiError } from "src/app/shared/api-error";
import { Page } from "src/app/shared/page";
import { Injectable } from "@angular/core";
import { catchError, map, throwError } from "rxjs";
import { MonthConverterService } from "src/app/shared/month-converter.service";
import { environment } from "src/environments/environment";
import { RegisterOpsin } from "./opsin.model";

@Injectable({ providedIn: 'root' })
export class RegisterOpsinService {
    private endPoint = environment.baseUrl + '/opsin';

    constructor(private httpClient: HttpClient,
                private monthConverterService: MonthConverterService) { }

    getAll(page: number, size: number, bidang: string, bulan: number, tahun: string) {
        const startDate = this.monthConverterService.getStartDate(bulan, tahun);        
        const endDate = this.monthConverterService.getEndDate(bulan, tahun);    
        const getEndPoint = `${this.endPoint}?pages=${page}&sizes=${size}&bidangDirektorat=${bidang}&` +
            `startDate=${startDate}&endDate=${endDate}`;        
        return this.httpClient.get<Page<RegisterOpsin>>(getEndPoint)
            .pipe(
                map(response => {
                    return response;
                })
        );
    }

    getOne(ids: string) {
        const getEndPoint = `${this.endPoint}/${ids}/detail`;
        return this.httpClient.get<RegisterOpsin>(getEndPoint)
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
                        default:
                            errorMessage = 'GAGAL menampilkan data!!!';
                    }
                    return throwError(() => errorMessage);
                })
        );
    }

    create(opsin: RegisterOpsin) {
        return this.httpClient.post<RegisterOpsin>(this.endPoint, opsin)
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
                      errorMessage = 'Bro.. Gagal Simpan Data, Cek lagi data isian!!!, data yang dimasukan duplikat atau format data yang dimasukan invalid!';
                      break;
                    default:
                      errorMessage = 'GAGAL Simpan data!!!';
                  }
                return throwError(() => errorMessage);
        }));
    }

    update(opsin: RegisterOpsin, ids: string) {
        const putEndPoint = `${this.endPoint}/${ids}`;
        return this.httpClient.put<RegisterOpsin>(putEndPoint, opsin)
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
                        errorMessage = 'Bro.. Gagal Simpan Data, Cek lagi data isian!!!, data yang dimasukan duplikat atau format data yang dimasukan invalid!';
                        break;
                    default:
                        errorMessage = 'GAGAL Update data!!!';
                }
                return throwError(() => errorMessage);
        }));
    }

    delete(ids: string) {
        const deleteEndPoint = `${this.endPoint}/${ids}`;
        return this.httpClient.delete<RegisterOpsin>(deleteEndPoint)
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
                    default:
                        errorMessage = 'GAGAL menghapus data!!!';
                }
                return throwError(() => errorMessage);
        }));
    }

    getSearch(value: string, page: number, size: number, bidang: string, tahun: string) {
        const startDate = tahun + '-01-01';        
        const endDate = tahun + '-12-31';    
        const getEndPoint = `${this.endPoint}/search?pages=${page}&sizes=${size}&bidangDirektorat=${bidang}&` +
            `startDate=${startDate}&endDate=${endDate}&value=${encodeURIComponent(value)}`;  
        return this.httpClient.get<Page<RegisterOpsin>>(getEndPoint)
            .pipe(
                map(response => {
                    return response;
                })
            );
    }

}


