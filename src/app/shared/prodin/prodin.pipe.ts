import { Pipe, PipeTransform } from "@angular/core";
import { ProdinService } from "./prodin.service";

@Pipe({
    name: 'prodinPipe',
    pure: false,
    standalone: false
})
export class ProdinPipe implements PipeTransform {   
    constructor(private prodinService: ProdinService) { }
    
    transform(value: any, ...args: any[]) {
        const index = this.prodinService.getProdin()
            .findIndex(obj => {
                return obj.jenisProdin === value;
        });
        let deskripsi = null;
        if (args[0] === 'deskripsi') {
            deskripsi = this.prodinService.getProdin()[index].deskripsiProdin;
        } else {
            deskripsi = this.prodinService.getProdin()[index].namaProdin;
        }
        return deskripsi;
    }

}