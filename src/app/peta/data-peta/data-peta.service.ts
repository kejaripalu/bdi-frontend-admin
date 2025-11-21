import { Injectable } from '@angular/core';
import { DataPeta } from './data-peta.model';
import { HttpClient } from '@angular/common/http';
import { MonthConverterService } from 'src/app/shared/month-converter.service';
import { catchError, map, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataPetaService {
  private endPoint = environment.baseUrl + '/data-peta';
  dataPeta: DataPeta[] = [];

  constructor(
    private http: HttpClient,
    private monthConverterService: MonthConverterService) { }

    getAll(page: number, size: number, bidang: string, tahun: string) {
        const startDate = this.monthConverterService.getStartDate(1, tahun);        
        const endDate = this.monthConverterService.getEndDate(12, tahun);    
        const getEndPoint = `${this.endPoint}?pages=${page}&sizes=${size}&bidangDirektorat=${bidang}&` +
            `startDate=${startDate}&endDate=${endDate}`;        
        
        return this.http.get<Response>(getEndPoint)
          .pipe(
            map(response => {
              return response;
            })
        );
    }

    getOne(ids: string) {
        const getEndPoint = `${this.endPoint}/${ids}`;
        return this.http.get<DataPeta>(getEndPoint)
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

    create(dataPeta: DataPeta) {
        return this.http.post<DataPeta>(this.endPoint, dataPeta)
            .pipe(catchError(errorResponse => {
                let errorMessage = 'Aduh!!!... Gawat nih bro... GAGAL terhubung ke server';
                if (!errorResponse.error) {
                    return throwError(() => errorMessage);
                }
                switch (errorResponse.error.message) {
                    case 'INVALID_DATA_INTEGRITY':
                        errorMessage = 'Bro.. Gagal Simpan Data, Cek lagi data isian!!!, data yang dimasukan sudah ada atau format data yang dimasukan invalid!'
                        break;
                    default:
                        errorMessage = 'GAGAL menyimpan data!!!';
                }
                return throwError(() => errorMessage);
            })
        );
    }

    update(ids: string, dataPeta: DataPeta) {
        const updateEndPoint = `${this.endPoint}/${ids}`;
        return this.http.put<DataPeta>(updateEndPoint, dataPeta)
            .pipe(catchError(errorResponse => {
                let errorMessage = 'Aduh!!!... Gawat nih bro... GAGAL terhubung ke server';
                if (!errorResponse.error) {
                    return throwError(() => errorMessage);
                }
                switch (errorResponse.error.message) {
                    case 'ID_NOT_FOUND':
                        errorMessage = 'Bro.. Gagal Update Data, Data tidak ditemukan di server!!!'
                        break;
                    case 'INVALID_DATA_INTEGRITY':
                        errorMessage = 'Bro.. Gagal Update Data, Cek lagi data isian!!!, data yang dimasukan sudah ada atau format data yang dimasukan invalid!'
                        break;
                    default:
                        errorMessage = 'GAGAL mengupdate data!!!';
                }
                return throwError(() => errorMessage);
            })
        );
    }

    delete(ids: string) {
        const deleteEndPoint = `${this.endPoint}/${ids}`;
        return this.http.delete<DataPeta>(deleteEndPoint)
            .pipe(catchError(errorResponse => {
                let errorMessage = 'Aduh!!!... Gawat nih bro... GAGAL terhubung ke server';
                if (!errorResponse.error) {
                    return throwError(() => errorMessage);
                }
                switch (errorResponse.error.message) {
                    case 'ID_NOT_FOUND':
                        errorMessage = 'Bro.. Gagal Hapus Data, Data tidak ditemukan di server!!!'
                        break;
                    default:
                        errorMessage = 'GAGAL menghapus data!!!';
                }
                return throwError(() => errorMessage);
            })
        );
    }

    getBySearch(keyword: string, page: number, size: number, bidang: string, tahun: string) {
        const startDate = tahun + '-01-01';
        const endDate = tahun + '-12-31';
        const getEndPoint = `${this.endPoint}/search?pages=${page}&sizes=${size}&bidangDirektorat=${bidang}` +
            `&startDate=${startDate}&endDate=${endDate}&value=${keyword}`;        
        
        return this.http.get<Response>(getEndPoint)
          .pipe(
            map(response => {
              return response;
            })
        );
    }

}

interface Response {
    content: DataPeta[],
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
}
