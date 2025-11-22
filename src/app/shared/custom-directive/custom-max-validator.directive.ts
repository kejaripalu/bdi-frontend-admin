import { Directive, Input } from "@angular/core";
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from "@angular/forms";

@Directive({
    selector: '[customMax][formControlName],[customMax][formControl],[customMax][ngModel]',
    providers: [{ provide: NG_VALIDATORS, useExisting: CustomMaxValidatorDirective, multi: true }],
    standalone: false
})
export class CustomMaxValidatorDirective implements Validator {
    @Input()
    customMax!: number;

    validate(control: AbstractControl): ValidationErrors | null {
        let v = control.value;
        return (v > this.customMax) ? { "customMax": true } : null;
    }

}