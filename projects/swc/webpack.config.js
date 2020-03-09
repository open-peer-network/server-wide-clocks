module.exports = {
    module: {
        entry: './quick-test.js',
        output: {
            filename: 'quick-test.js',
            path: path.resolve(__dirname, 'dist'),
        },
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'babel-loader',
            },
        ],
    },
};