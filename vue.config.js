const mode = process.env.NODE_ENV || 'development'

module.exports = {
    css: {
        extract: {
            filename: 'vue_expert_datatable.css',
            ignoreOrder: true
        }
    },
    configureWebpack: {
        resolve: {
            alias: {
                AutoNumeric: 'node_modules/autonumeric/dist/autoNumeric.min'
            }
        },
    }
}
