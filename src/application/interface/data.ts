import { AxiosInstance } from "axios";
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
    table_data: [],
    selected_row: any
}