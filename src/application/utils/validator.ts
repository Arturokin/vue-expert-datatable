import { extend, configure } from 'vee-validate'
import { required, email, numeric, length, min, max, between, integer } from 'vee-validate/dist/rules'
import Language from '../interface/language'
import enEN from '../language/en-EN'
import esEs from '../language/es-ES'

export default function (lang: 'ES' | 'EN') : void {
    let loadedLang: Language | undefined = undefined
    if (lang === 'EN') {
        loadedLang = enEN
    } else if (lang === 'ES') {
        loadedLang = esEs
    } else {
        loadedLang = enEN
    }
    configure({
        classes: {
            valid: 'expert-column-is-valid',
            invalid: 'expert-column-is-invalid',
            dirty: ['expert-column-is-dirty', 'expert-column-is-dirty'],
        }
    })
    if (loadedLang) {
        extend('email', {
            ...email,
            message: loadedLang.rule_email
        })
        extend('required', {
            ...required,
            message: loadedLang.rule_required
        })
        extend('numeric', {
            ...numeric,
            message: loadedLang.rule_numeric
        })
        extend('integer', {
            ...integer,
            message: loadedLang.rule_integer
        })
        extend('length', {
            ...length,
            message: loadedLang.rule_length
        })
        extend('min', {
            ...min,
            message: loadedLang.rule_min
        })
        extend('max', {
            ...max,
            message: loadedLang.rule_max
        })
        extend('min_value', {
            ...min,
            message: loadedLang.rule_min_value
        })
        extend('max_value', {
            ...max,
            message: loadedLang.rule_max_value
        })
        extend('between', {
            ...between,
            message: loadedLang.rule_between
        })
        extend('url', {
            validate (value) {
                return validate_url(value)
            },
            message: loadedLang.rule_url
        })
    }
    const validate_url = (value: any) => {
        const validate = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value)
        return validate
    }
}
