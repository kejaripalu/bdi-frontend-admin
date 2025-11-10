import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

/**
 * Custom validator untuk rentang Latitude (-90 hingga 90).
 * @returns ValidatorFn
 */
export function latitudeRangeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (value === null || value === '') {
      return null; // biarkan required validator yang menangani jika kosong
    }

    const num = Number(value);

    // Cek apakah nilai adalah angka dan berada dalam rentang -90 sampai 90
    if (isNaN(num) || num < -90 || num > 90) {
      // Jika validasi gagal, kembalikan objek kesalahan
      return { 'invalidLatitude': { value: num } };
    }

    return null; // Jika validasi berhasil, kembalikan null
  };
}

/**
 * Custom validator untuk rentang Longitude (-180 hingga 180).
 * @returns ValidatorFn
 */
export function longitudeRangeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (value === null || value === '') {
      return null; // biarkan required validator yang menangani jika kosong
    }

    const num = Number(value);

    // Cek apakah nilai adalah angka dan berada dalam rentang -180 sampai 180
    if (isNaN(num) || num < -180 || num > 180) {
      // Jika validasi gagal, kembalikan objek kesalahan
      return { 'invalidLongitude': { value: num } };
    }

    return null; // Jika validasi berhasil, kembalikan null
  };
}