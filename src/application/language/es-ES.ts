import Language from "../interface/language";

const language: Language = {
    add_button_text: 'Agregar {table_name}',
    save_button_text: 'Guardar {table_name}',
    edit_button_text: 'Editar {table_name}',
    delete_button_text: 'Eliminar {table_name}',
    input_placeholder: 'Ingrese {pronoun} {value}',
    rule_required: 'El campo {_field_} es requerido',
    rule_email: 'Ingrese un e-mail válido',
    rule_numeric: 'El campo {_field_} debe ser un número',
    rule_integer: 'El campo {_field_} debe ser un número entero',
    rule_length: '{_field_} debe tener {length} caracteres',
    rule_min: '{_field_} debe tener mínimo {length} caracteres',
    rule_max: '{_field_} debe tener máximo {length} caracteres',
    rule_url: 'El campo {_field_} es debe ser un URL'
}

export default language
