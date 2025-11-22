import { Pipe, PipeTransform } from "@angular/core";
import { BidangDirektoratSektorService } from "./bidang-direktorat-sektor.service";

@Pipe({
    name: 'sektorPipe',
    pure: false,
    standalone: false
})
export class SektorPipe implements PipeTransform {
    constructor(private bidangDirektoratSektorService: BidangDirektoratSektorService) { }

    transform(value: any, ...args: any[]) {
        const indexSektor = this.bidangDirektoratSektorService.getSektor()
            .findIndex(obj => {
                return obj.namaSektor === value;
        });
        const indexBidang = this.bidangDirektoratSektorService.getBidangDirektori()
                .findIndex(obj => {
                    return obj.namaBidang === this.bidangDirektoratSektorService.getSektor()[indexSektor].bidangDirektorat;
        });   

        let deskripsi = null;
        if (args[0] === 'bidang') {         
            deskripsi = this.bidangDirektoratSektorService.getBidangDirektori()[indexBidang].deskripsiBidang;            
        } else if (args[0] === 'subbid') {
            // Sub Seksi pada Kejari
            const bidang = this.bidangDirektoratSektorService.getBidangDirektori()[indexBidang].namaBidang;
            if (bidang === 'IPOLHANKAM' || bidang === 'SOSBUDMAS' || bidang === 'TIPRODIN') {
                deskripsi = 'Subseksi A';
            } else if (bidang === 'EKOKEU' || bidang === 'PAMSTRA') {
                deskripsi = 'Subseksi B';
            }
        } else  {
            deskripsi = this.bidangDirektoratSektorService.getSektor()[indexSektor].deskripsiSektor;
        }
        return deskripsi;
    }

}
