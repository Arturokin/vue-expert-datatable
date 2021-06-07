import Vue, { PluginFunction, VueConstructor } from 'vue';

declare const VueExpertDatatable: VueConstructor<Vue> & { install: PluginFunction<any>; };
export default VueExpertDatatable;
