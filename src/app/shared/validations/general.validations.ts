import { AbstractControl } from '@angular/forms';
import * as moment from 'moment';
import { TIPOS_DOCUMENTO } from '../constants/general.constants';

/**
 * Valida los porcentajes
 * @param porcentaje porcentaje Maximo
 */
export function validarPorcentaje(porcentaje) {
    return (control: AbstractControl): { [key: string]: any } => {
        const porcentajeNoValido = control.value > porcentaje;
        return porcentajeNoValido ? { porcentajeInvalido: { value: control.value } } : null;
    };
}

/**
 * Valida los decimales
 */
export function validarDecimales() {
    const objRegExp = /^\s*-?\d+(\.\d{1,2})?\s*$/;
    return (control: AbstractControl): { [key: string]: any } => {
        const decimalesValidos = control.value ? objRegExp.test(control.value) : true;
        return !decimalesValidos ? { decimalesInvalidos: { value: control.value } } : null;
    };
}

/**
 * Valida los campos numericos
 */
export function validarCampoNumerico() {
    const objRegExp = /^\d+$/;
    return (control: AbstractControl): { [key: string]: any } => {
        const numeroDocValido = control.value ? objRegExp.test(control.value) : true;
        return !numeroDocValido ? { campoNumericoInvalido: { value: control.value } } : null;
    };
}

/**
 * Valida los campos numericos
 */
export function validarCampoNumericoMayorCero() {
    const objRegExp = /^[1-9]+[0-9]*$/;
    return (control: AbstractControl): { [key: string]: any } => {
        const numeroDocValido = control.value || ((control.value !== null || control.value !== '') && control.value === 0)
            ? objRegExp.test(control.value)
            : true;
        return !numeroDocValido
            // tslint:disable-next-line:object-literal-key-quotes
            ? { 'campoNumericoMayorCeroInvalido': { value: control.value } }
            : null;
    };
}


/**
 * Valida los correos electronicos
 */
export function validarCorreoElectronico() {
    // tslint:disable-next-line:max-line-length
    const objRegExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return (control: AbstractControl): { [key: string]: any } => {
        const correoValido = control.value ? objRegExp.test(control.value) : true;
        return !correoValido ? { correoInvalido: { value: control.value } } : null;
    };
}

/**
 * Valida tamanio exacto de los caracteres
 * @param numeroCaracteres tamanio exacto
 */
export function validarTamanioExactoCaracteres(numeroCaracteres) {
    return (control: AbstractControl): { [key: string]: any } => {
        const tamanioValido = control.value ? control.value.length !== numeroCaracteres : false;
        return tamanioValido ? { tamanioInvalido: { value: control.value } } : null;
    };
}

/**
 * Valida el maxlength
 * @param numeroCaracteres Maxlength
 */
export function validarTamanioMaximoCaracteres(numeroCaracteres) {
    return (control: AbstractControl): { [key: string]: any } => {
        const tamanioValido = control.value ? control.value.length > numeroCaracteres : false;
        return tamanioValido ? { tamanioInvalido: { value: control.value } } : null;
    };
}

export function validarCampoAlfaNumerico() {
    const objRegExp = /^[A-Za-z0-9]+$/;
    return (control: AbstractControl): { [key: string]: any } => {
        const alfanumericoDocValido = control.value ? objRegExp.test(control.value) : true;
        return !alfanumericoDocValido ? { caracteresInvalidos: { value: control.value } } : null;
    };
}

export function validarCampoTexto() {
    const objRegExp = /^[A-Za-z]+$/;
    return (control: AbstractControl): { [key: string]: any } => {
        const alfaDocValido = control.value ? objRegExp.test(control.value) : true;
        return !alfaDocValido ? { textoInvalidos: { value: control.value } } : null;
    };
}

export function validarMenorQueCero() {
    return (control: AbstractControl): { [key: string]: any } => {
        let valorInvalido: boolean;
        if (control.value) {
            valorInvalido = control.value < 0 ? true : false;
        }
        return valorInvalido ? { noMenorCero: { value: control.value } } : null;
    };
}

export function validarIgualACero() {
    return (control: AbstractControl): { [key: string]: any } => {
        let valorInvalido: boolean;

        const valor = parseInt(control.value, 0);
        valorInvalido = 0 >= valor;
        return valorInvalido ? { igualCero: { value: control.value } } : null;
    };
}


export function validarFechaAnteriorOtraIgual(fecha) {
    return (control: AbstractControl): { [key: string]: any } => {

        const fechaPatron = moment(fecha, 'YYYY-MM-DD');
        const fechaEvaluar = control.value != null ? moment(control.value, 'YYYY-MM-DD') : null;

        const fechaNoValido = fechaEvaluar !== null ? fechaEvaluar.isSameOrBefore(fechaPatron) : false;

        return fechaNoValido ? { fechaMenorIgual: { value: control.value } } : null;
    };
}

export function validarFechaAnteriorOtra(fecha) {
    return (control: AbstractControl): { [key: string]: any } => {

        const fechaPatron = moment(fecha, 'YYYY-MM-DD');
        const fechaEvaluar = control.value != null ? moment(control.value, 'YYYY-MM-DD') : null;

        const fechaNoValido = fechaEvaluar !== null ? fechaEvaluar.isSameOrBefore(fechaPatron) : false;

        return fechaNoValido ? { fechaMenor: { value: control.value } } : null;
    };
}

export function validarFechaAnteriorA(fecha) {
    return (control: AbstractControl): { [key: string]: any } => {

        const fechaPatron = moment(fecha, 'YYYY-MM-DD');
        const fechaEvaluar = control.value != null ? moment(control.value, 'YYYY-MM-DD') : null;

        const fechaNoValido = fechaEvaluar !== null ? fechaEvaluar.isBefore(fechaPatron) : false;
        return fechaNoValido ? { fechaMenor: { value: control.value } } : null;
    };
}

export function validarTipoCargoEsPEP() {
    return (control: AbstractControl): { [key: string]: any } => {
        let valorInvalido: boolean;
        if (control.value) {
            valorInvalido = control.value.esPep === 'SI' ? true : false;
        }
        return valorInvalido ? { esPEP: { value: control.value } } : null;
    };
}

export function validarTipoDocumento(tipoDocumento) {
    return (control: AbstractControl): { [key: string]: any } => {
        let valorInvalido: boolean;
        if (tipoDocumento &&
            (tipoDocumento === TIPOS_DOCUMENTO.RC
                || tipoDocumento === TIPOS_DOCUMENTO.TI)) {
            valorInvalido = true;
        }
        return valorInvalido ? { menorEdad: { value: control.value } } : null;
    };
}

/**
 * Valida la razon social o nombre establecimiento comercial
 */
export function validaNombreRazonSocial() {
    const objRegExp = /^[^áÁéÉíÍóÓúÚ]*$/;
    return (control: AbstractControl): { [key: string]: any } => {
        const alfanumericoDocValido = control.value ? objRegExp.test(control.value) : true;
        return !alfanumericoDocValido ? { razonSocialInvalido: { value: control.value } } : null;
    };
}

/**
 * Valida que el texto no tenga doble espacio
 */
export function validaDobleEspacio() {
    return (control: AbstractControl): { [key: string]: any } => {
        const alfanumericoDocValido = control.value ? !control.value.includes('  ') : true;
        return !alfanumericoDocValido ? { dobleEspacio: { value: control.value } } : null;
    };
}

/**
 * Valida el nombre o apellidos de personas naturales
 */
export function validaNombreApellidosNatural() {
    const objRegExp = /^[^áÁéÉíÍóÓúÚ0123456789]*$/;
    return (control: AbstractControl): { [key: string]: any } => {
        const alfanumericoDocValido = control.value ? objRegExp.test(control.value) : true;
        return !alfanumericoDocValido ? { nombreNaturalInvalido: { value: control.value } } : null;
    };
}

export function validarIdentificacion() {
    const objRegExp = /^[A-Za-z0-9.]+$/;
    return (control: AbstractControl): { [key: string]: any } => {
        const alfaDocValido = control.value ? objRegExp.test(control.value) : true;
        if (!alfaDocValido) {
            return { textoInvalidos: { value: control.value } };
        } else if (control.value && control.value.includes('..')) {
            return { textoInvalidos: { value: control.value } };
        } else {
            return null;
        }
    };
}
