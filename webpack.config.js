const path = require('path');

module.exports = {
  entry: './index.js',
  output: {
    filename: 'malloci.js',
    path: path.resolve(__dirname, 'dist/js'),
    libraryTarget: "var",
    library: "Utils"
  },
  module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                {loader: 'style-loader', options: { attributes: { id: 'malloci-style' } }},
                'css-loader',
                ],
            },
            {
                test: /\.(svg)$/,
                use: [
                'file-loader?name=../img/[name].[ext]',
                ],
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                'file-loader?name=../textures/[name].[ext]',
                ],
            },
        ],
    },
};