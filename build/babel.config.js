"use strict";
module.exports = function (api) {
    api.cache(true);
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
    };
};
//# sourceMappingURL=babel.config.js.map