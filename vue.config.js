const mode = process.env.NODE_ENV || 'development'

module.exports = {
    configureWebpack: {
        resolve: {
            alias: {
                AutoNumeric: 'node_modules/autonumeric/dist/autoNumeric.min'
            }
        },
    }
}
