import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'reverse',
    pure: false,
    standalone: false
})
export class ReversePipe implements PipeTransform {
    transform(value: any, ...args: any[]) {
        return value.slice().reverse();
    }  
}
