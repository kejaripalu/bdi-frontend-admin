import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class MonthConverterService {
    private startDate!: string;
    private endDate!: string;

    getStartDate(month: number, year: string) {
        switch (+month) {
            case 1:
                this.startDate = year + '-01-01';
                break;
            case 2:
                this.startDate = year + '-02-01';
                break;
            case 3:
                this.startDate = year + '-03-01';
                break;
            case 4:
                this.startDate = year + '-04-01';
                break;
            case 5:
                this.startDate = year + '-05-01';
                break;
            case 6:
                this.startDate = year + '-06-01';
                break;
            case 7:
                this.startDate = year + '-07-01';
                break;
            case 8:
                this.startDate = year + '-08-01';
                break;
            case 9:
                this.startDate = year + '-09-01';
                break;
            case 10:
                this.startDate = year + '-10-01';
                break;
            case 11:
                this.startDate = year + '-11-01';
                break;
            case 12:
                this.startDate = year + '-12-01';
                break;
        }
        return this.startDate;
    }

    getEndDate(month: number, year: string) {
        switch (+month) {
            case 1:
                this.endDate = year + '-01-31';
                break;
            case 2:
                // 29 only in leap years; the API rejects non-existent dates (INVALID_DATE_FORMAT)
                this.endDate = year + (this.isLeapYear(+year) ? '-02-29' : '-02-28');
                break;
            case 3:
                this.endDate = year + '-03-31';
                break;
            case 4:
                this.endDate = year + '-04-30';
                break;
            case 5:
                this.endDate = year + '-05-31';
                break;
            case 6:
                this.endDate = year + '-06-30';
                break;
            case 7:
                this.endDate = year + '-07-31';
                break;
            case 8:
                this.endDate = year + '-08-31';
                break;
            case 9:
                this.endDate = year + '-09-30';
                break;
            case 10:
                this.endDate = year + '-10-31';
                break;
            case 11:
                this.endDate = year + '-11-30';
                break;
            case 12:
                this.endDate = year + '-12-31';
                break;
        }
        return this.endDate;
    }

    private isLeapYear(year: number): boolean {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }
}
