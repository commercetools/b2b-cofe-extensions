declare function _exports(api: any): {
    presets: string[][];
    plugins: (string | (string | {
        helpers: boolean;
        regenerator: boolean;
    })[])[];
    env: {
        test: {
            presets: string[];
            plugins: (string | (string | {
                helpers: boolean;
                regenerator: boolean;
            })[])[];
        };
    };
};
export = _exports;
