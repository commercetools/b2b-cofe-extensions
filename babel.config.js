module.exports = function (api) {
    api.cache(true)

    return {
        presets: [
            ['@babel/preset-env']
        ],
        plugins: [
            '@babel/plugin-proposal-nullish-coalescing-operator',
            '@babel/plugin-proposal-optional-chaining',            
            '@babel/plugin-transform-modules-commonjs',
            ['@babel/transform-runtime', {
                helpers: false,
                regenerator: true
            }]
        ],
        env: {
            test: {
                presets: [
                    // modules:false must be removed for test env when using jest
                    '@babel/preset-env',
                ],
                plugins: [
                    '@babel/plugin-proposal-nullish-coalescing-operator',
                    '@babel/plugin-proposal-optional-chaining',                    
                    '@babel/plugin-transform-modules-commonjs',
                    ['@babel/transform-runtime', {
                        helpers: false,
                        regenerator: true
                    }]
                ]
            }
        }
    }
}
