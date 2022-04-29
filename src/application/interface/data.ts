import { AxiosInstance } from "axios";
import Field from "./field";
import Language from "./language";
import Method from "./method";


export default interface Data {
    base_url_testing: string;
    add_method?: Method;
    update_method?: Method;
    get_method?: Method;
    delete_method?: Method;
    http_client: AxiosInstance | undefined
    current_item: any,
    drawer: boolean,
    modal_delete: boolean,
    loading_data: boolean,
    loading_add_update: boolean,
    loading_delete: boolean,
    table_data: any[],
    selected_row: any,
    selected_row_before: any,
    selected_index?: number,
    selected_field?: Field,
    item_record: any,
    item_record_before: any,
    item_record_default: any,
    current_language: Language | undefined,
	is_canceling: boolean,
	show_editing_icon: boolean,
	initialized: boolean
}
