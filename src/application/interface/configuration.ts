export interface ConfigurationParams {
	showEditingIcon?: boolean;
	showEditButton?: boolean;
	showDeleteButton?: boolean;
}
export default interface Configuration {
    lang: 'EN' | 'ES',
    theme: 'vue-expert-datatable',
	params?: ConfigurationParams;
}
