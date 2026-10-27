import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, map, throwError } from "rxjs";
import { MonthConverterService } from "src/app/shared/month-converter.service";
import { environment } from "src/environments/environment";
import { SuratMasuk } from "./surat-masuk.model";
import { Message } from "src/app/shared/message";
import { ApiError } from "src/app/shared/api-error";
import { Page } from "src/app/shared/page";

@Injectable({ providedIn: 'root' })
export class SuratMasukService {
    private endPoint = environment.baseUrl + '/surat-masuk';
    registerSuratMasuk: SuratMasuk[] = [];
    private message: Message = new Message();

    constructor(private httpClient: HttpClient, 
                private monthConverterService: MonthConverterService) { }

    getSuratMasuk(page: number, size: number, jenisSurat: string, bulan: number, tahun: string) {
        const startDate = this.monthConverterService.getStartDate(bulan, tahun);        
        const endDate = this.monthConverterService.getEndDate(bulan, tahun);    
        const getEndPoint = `${this.endPoint}?pages=${page}&sizes=${size}&jenisSurat=${jenisSurat}&` +
            `startDate=${startDate}&endDate=${endDate}`;        
        return this.httpClient.get<Page<SuratMasuk>>(getEndPoint)
            .pipe(
                map(response => {
                    return response;
                })
            );
    }

    getSearchSuratMasuk(value: string, page: number, size: number, jenisSurat: string, tahun: string) {
        const startDate = tahun + '-01-01';        
        const endDate = tahun + '-12-31';    
        const getEndPoint = `${this.endPoint}/search?pages=${page}&sizes=${size}&jenisSurat=${jenisSurat}&` +
            `startDate=${startDate}&endDate=${endDate}&value=${encodeURIComponent(value)}`;  
        return this.httpClient.get<Page<SuratMasuk>>(getEndPoint)
            .pipe(
                map(response => {
                    return response;
                })
            );
    }

    getOneSuratMasuk(ids: string) {
        const getEndPoint = `${this.endPoint}/${ids}/detail`;
        return this.httpClient.get<SuratMasuk>(getEndPoint)
            .pipe(
                map(response => {
                    return response;
                }),
                catchError(errorResponse => {
                    let errorMessage =  this.message.errorGetData;
                const apiMessage = ApiError.messageFor(errorResponse);
                if (apiMessage) {
                    return throwError(() => apiMessage);
                }
                    if (!errorResponse.error) {
                        return throwError(() => errorMessage);
                    }
                    switch (errorResponse.error.message) {
                        case 'ID_NOT_FOUND':
                            errorMessage = this.message.errorDataNotFound;
                            break;
                        default:
                            errorMessage = this.message.errorShowData;
                    }
                    return throwError(() => errorMessage);
                })
            );
    }

    createSuratMasuk(suratMasuk: SuratMasuk) {
        return this.httpClient.post<SuratMasuk>(this.endPoint, suratMasuk)
            .pipe(catchError(errorResponse => {
                let errorMessage = this.message.errorConnection;
                const apiMessage = ApiError.messageFor(errorResponse);
                if (apiMessage) {
                    return throwError(() => apiMessage);
                }
                if (!errorResponse.error) {
                    return throwError(() => errorMessage);
                }
                switch (errorResponse.error.message) {
                    case 'INVALID_DATA_INTEGRITY':
                      errorMessage = this.message.errorDataInvalid;
                      break;
                    default:
                      errorMessage = this.message.errorSaveData;
                  }
                return throwError(() => errorMessage);
            }));
    }

    updateSuratMasuk(suratMasuk: SuratMasuk, ids: string) {
        const putEndPoint = `${this.endPoint}/${ids}`;
        return this.httpClient.put<SuratMasuk>(putEndPoint, suratMasuk)
            .pipe(catchError(errorResponse => {
                let errorMessage = this.message.errorConnection;
                const apiMessage = ApiError.messageFor(errorResponse);
                if (apiMessage) {
                    return throwError(() => apiMessage);
                }
                if (!errorResponse.error) {
                    return throwError(() => errorMessage);
                }
                switch (errorResponse.error.message) {
                    case 'ID_NOT_FOUND':
                        errorMessage = this.message.errorDataNotFound;
                        break;
                    case 'INVALID_DATA_INTEGRITY':
                        errorMessage = this.message.errorDataInvalid;
                        break;
                    default:
                        errorMessage = this.message.errorSaveData;
                }
                return throwError(() => errorMessage);
            }));
    }

    deleteSuratMasuk(ids: string) {
        const deleteEndPoint = `${this.endPoint}/${ids}`;
        return this.httpClient.delete<SuratMasuk>(deleteEndPoint)
            .pipe(catchError(errorResponse => {
                let errorMessage = this.message.errorConnection;;
                const apiMessage = ApiError.messageFor(errorResponse);
                if (apiMessage) {
                    return throwError(() => apiMessage);
                }
                if (!errorResponse.error) {
                    return throwError(() => errorMessage);
                }
                switch (errorResponse.error.message) {
                    case 'ID_NOT_FOUND':
                        errorMessage = this.message.errorDataNotFound;
                        break;
                    default:
                        errorMessage = this.message.errorSaveData;
                }
                return throwError(() => errorMessage);
        }));
    }

}


