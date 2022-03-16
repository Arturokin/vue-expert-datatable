import { extend } from 'vee-validate'
import { required, email, numeric, length, min, max, between, integer } from 'vee-validate/dist/rules'
import Language from '../interface/language'
import enEN from '../language/en-EN'
import esEs from '../language/es-ES'

export default function (lang: 'ES' | 'EN') : void {
    let loadedLang: Language | undefined = undefined
    if (loadedLang === 'EN') {
        loadedLang = enEN
    } else if (lang === 'EN') {
        loadedLang = esEs
    } else {
        loadedLang = enEN
    }
    if (loadedLang) {
        extend('email', {
            ...email,
            message: 'Ingrese un e-mail válido'
        })
        extend('required', {
            ...required,
            message: 'El campo {_field_} es requerido'
        })
        extend('numeric', {
            ...numeric,
            message: 'El campo {_field_} debe ser un número'
        })
        extend('integer', {
            ...integer,
            message: 'El campo {_field_} debe ser un número entero'
        })
        extend('length', {
            ...length
        })
        extend('min', {
            ...min,
            message: '{_field_} debe tener mínimo {length} caracteres'
        })
        extend('max', {
            ...max,
            message: '{_field_} debe tener máximo {length} caracteres'
        })
        extend('between', {
            ...between
        })
        extend('url', {
            validate (value) {
                return validarUrl(value)
            },
            message: 'El campo {_field_} es debe ser un URL'
        })
    }
    const validarUrl = (value: any) => {
        const validate = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value)
        return validate
    }
}
