import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, map, throwError } from "rxjs";
import { MonthConverterService } from "src/app/shared/month-converter.service";
import { environment } from "src/environments/environment";
import { Ekspedisi } from "./ekspedisi.model";

@Injectable({ providedIn: "root" })
export class EkspedisiService {
    private endPoint = environment.baseUrl + '/ekspedisi';
    ekspedisi: Ekspedisi[] = [];

    constructor(private httpClient: HttpClient, 
                private monthConverterService: MonthConverterService) { }

    getEkspedisi(page: number, size: number, jenisSurat: string, bulan: number, tahun: string) {
        const startDate = this.monthConverterService.getStartDate(bulan, tahun);        
        const endDate = this.monthConverterService.getEndDate(bulan, tahun);    
        const getEndPoint = `${this.endPoint}?pages=${page}&sizes=${size}&jenisSurat=${jenisSurat}&` +
            `startDate=${startDate}&endDate=${endDate}`;        
        return this.httpClient.get<ResponseEkspedisi>(getEndPoint)
            .pipe(
                map(response => {
                    return response;
                })
        );
    }
    
    createEkspedisi(ekspedisi: Ekspedisi) {
        return this.httpClient.post<Ekspedisi>(this.endPoint, ekspedisi)
            .pipe(catchError(errorResponse => {
                let errorMessage = 'Aduh!!!... Gawat nih bro... GAGAL terhubung ke server';
                if (!errorResponse.error) {
                    return throwError(() => errorMessage);
                }
                switch (errorResponse.error.message) {
                    case 'DUPLICATE_DATA_FIELD':
                      errorMessage = 'Bro.. Data ini sudah pernah diinput!!!';
                      break;
                    default:
                      errorMessage = 'GAGAL Simpan data!!!';
                  }
                return throwError(() => errorMessage);
            }));
    }

    getOneEkspedisi(id: string) {
        const getEndPoint = `${this.endPoint}/${id}/detail`;
        return this.httpClient.get<Ekspedisi>(getEndPoint)
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
                            errorMessage = 'GAGAL Menampilkan data!!!';
                    }
                    return throwError(() => errorMessage);
                })
            );
    }

    updateEkspedisi(ekspedisi: Ekspedisi) {
        const putEndPoint = `${this.endPoint}/${ekspedisi.id}`;
        return this.httpClient.put<Ekspedisi>(putEndPoint, ekspedisi)
            .pipe(catchError(errorResponse => {
                let errorMessage = 'Aduh!!!... Gawat nih bro... GAGAL terhubung ke server';
                if (!errorResponse.error) {
                    return throwError(() => errorMessage);
                }
                switch (errorResponse.error.message) {
                    case 'ID_NOT_FOUND':
                        errorMessage = 'Bro... Data tidak ditemukan!!!'
                        break;
                    case 'DUPLICATE_DATA_FIELD':
                        errorMessage = 'Bro.. Data ini sudah pernah diinput!!!';
                        break;
                    default:
                        errorMessage = 'GAGAL Update data!!!';
                }
                return throwError(() => errorMessage);
            }));
    }

}

interface ResponseEkspedisi {
    content: Ekspedisi[],
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
}
