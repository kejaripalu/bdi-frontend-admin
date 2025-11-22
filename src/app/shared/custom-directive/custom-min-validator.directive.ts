import { Directive, Input } from "@angular/core";
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from "@angular/forms";

@Directive({
    selector: '[customMax][formControlName],[customMax][formControl],[customMax][ngModel]',
    providers: [{ provide: NG_VALIDATORS, useExisting: CustomMinValidatorDirective, multi: true }],
    standalone: false
})
export class CustomMinValidatorDirective implements Validator {
    @Input()
    customMin!: number;

    validate(control: AbstractControl): ValidationErrors | null {
        let v = control.value;
        return (v < this.customMin) ? { "customMin": true } : null;
    }

}