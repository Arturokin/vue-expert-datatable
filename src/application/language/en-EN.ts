import Language from "../interface/language";

const language: Language = {
    add_button_text: 'Add {table_name}',
    save_button_text: 'Save {table_name}',
    edit_button_text: 'Edit {table_name}',
    delete_button_text: 'Delete {table_name}',
    input_placeholder: 'Insert {pronoun} {value}',
    rule_required: 'Field {_field_} is required',
    rule_email: 'Invalid e-mail',
    rule_numeric: 'Field {_field_} must be a number',
    rule_integer: 'Field {_field_} must be an integer',
    rule_length: '{_field_} should have {length} characters',
    rule_min: '{_field_} should have at least {length} characters',
    rule_max: '{_field_} should have at max {length} characters',
    rule_url: 'Field {_field_} must be and URL',
	fill_required_fields: 'Fill in the required fields'
}

export default language
