import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MonthConverterService } from "src/app/shared/month-converter.service";
import { environment } from "src/environments/environment";
import { RegisterLahin } from "./lahin.model";
import { catchError, map, throwError } from "rxjs";

@Injectable({ providedIn: 'root' })
export class RegisterTelaahanIntelijenService {

    private endPoint = environment.baseUrl + '/lahin';

    constructor(private httpClient: HttpClient,
                private monthConverterService: MonthConverterService) { }

    getAll(page: number, size: number, bulan: number, tahun: string) {
        const startDate = this.monthConverterService.getStartDate(bulan, tahun);        
        const endDate = this.monthConverterService.getEndDate(bulan, tahun);    
        const getEndPoint = `${this.endPoint}?pages=${page}&sizes=${size}&` +
            `startDate=${startDate}&endDate=${endDate}`;        
        return this.httpClient.get<Response>(getEndPoint)
            .pipe(
                map(response => {
                    return response;
                })
        );
    }

    getOne(ids: string) {
        const getEndPoint = `${this.endPoint}/${ids}/detail`;
        return this.httpClient.get<RegisterLahin>(getEndPoint)
            .pipe(
                map(response => {
                    return response;
                }),
                catchError(errorResponse => {
                    let errorMessage =  'Aduh... Parah nih bos.. gagal ambil data dari server!!!';
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

    create(lahin: RegisterLahin) {
        return this.httpClient.post<RegisterLahin>(this.endPoint, lahin)
            .pipe(catchError(errorResponse => {
                let errorMessage = 'Aduh!!!... Gawat nih bro... GAGAL terhubung ke server';
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

    update(lahin: RegisterLahin, ids: string) {
        const putEndPoint = `${this.endPoint}/${ids}`;
        return this.httpClient.put<RegisterLahin>(putEndPoint, lahin)
            .pipe(catchError(errorResponse => {
                let errorMessage = 'Aduh!!!... Gawat nih bro... GAGAL terhubung ke server';
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
        return this.httpClient.delete<RegisterLahin>(deleteEndPoint)
            .pipe(catchError(errorResponse => {
                let errorMessage = 'Aduh!!!... Gawat nih bro... GAGAL terhubung ke server';
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

    getSearch(value: string, page: number, size: number, tahun: string) {
        const startDate = tahun + '-01-01';        
        const endDate = tahun + '-12-31';    
        const getEndPoint = `${this.endPoint}/search?pages=${page}&sizes=${size}&` +
            `startDate=${startDate}&endDate=${endDate}&value=${value}`;  
        return this.httpClient.get<Response>(getEndPoint)
            .pipe(
                map(response => {
                    return response;
                })
            );
    }

}

interface Response {
    content: RegisterLahin[],
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
}
