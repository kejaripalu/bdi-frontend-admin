import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'shorten',
    pure: false,
    standalone: false
})
export class ShortenPipe implements PipeTransform {
    
    transform(value: any, ...args: any[]) {
        if (value?.length > 255) {
            return value.substr(0, +args[0]) + ' ...';
        }
        return value;
    }

}
