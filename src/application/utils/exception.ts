export default class Exception extends Error {
    __proto__ = Error
    message: string
    stack?: string
    code: number | undefined

    constructor (message: string | undefined, code: number | undefined = undefined) {
        super(message)
        Object.setPrototypeOf(this, Exception.prototype)
        if (message) {
            this.message = message
        } else {
            this.message = 'Error desconocido'
        }
        this.code = code
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, Exception)
        }
    }
}
