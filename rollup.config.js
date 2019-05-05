import babel from 'rollup-plugin-babel'
import { uglify } from 'rollup-plugin-uglify'


const setConfig = function (opts) {
    return {
        input: `src/${opts.filename}`,
        output: {
            file: `dist/${opts.filename}`,
            format: 'umd',
            name: opts.name
        },
        plugins: [
            babel({
                exclude: 'node_modules/**' 
            }),
            // uglify()
        ]
    }
}

export default [{
    filename: 'client.js',
    name: 'Client'
}, {
    filename: 'hub.js',
    name: 'Hub'
}].map(setConfig)