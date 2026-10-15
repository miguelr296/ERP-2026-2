import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function peruvianDniValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => /^\d{8}$/.test(String(control.value ?? '')) ? null : { dni: true };
}

export function peruvianRucValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = String(control.value ?? '');
    if (!/^\d{11}$/.test(value) || !['10', '15', '17', '20'].includes(value.slice(0, 2))) return { ruc: true };
    const weights = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
    const sum = value.slice(0, 10).split('').reduce((total, digit, index) => total + Number(digit) * weights[index], 0);
    const remainder = 11 - (sum % 11);
    const checkDigit = remainder === 10 ? 0 : remainder === 11 ? 1 : remainder;
    return checkDigit === Number(value[10]) ? null : { ruc: true };
  };
}
