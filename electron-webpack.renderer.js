const path = require( "path" );
const HtmlWebpackPlugin = require( "html-webpack-plugin" );
const { CleanWebpackPlugin } = require( "clean-webpack-plugin" );

const settings = {
    title: "Wacky Electron App",
    mode: ( process.env === 'production' ? 'production' : 'development' ),
    distRender: path.resolve( __dirname, 'dist', 'renderer' ),
    srcRender: path.resolve( __dirname, 'src', 'renderer', 'index.tsx' )
};

const commonConfig = {
    mode: settings.mode,
    node: {
        __dirname: false
    },
    output: {
        path: settings.distRender,
        filename: "[name].js"
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader"
            },
            {
                test: /\.jsx?$/,
                loader: "babel-loader"
            },
            {
                test: /\.scss$/,
                loaders: [ "style-loader", "css-loader", "sass-loader" ]
            }
        ]
    },
    resolve: {
        extensions: [ ".js", ".ts", ".tsx", ".jsx", ".json", ".scss" ]
    }
};

const renderer = {
    target: "electron-renderer",
    entry: { gui: settings.srcRender },
    plugins: [ new HtmlWebpackPlugin( {
        title: settings.title
    } ) ]
};

const hotReload = {
    devtool: 'inline-source-map',
    devServer: {
        contentBase: settings.distRender,
        hot: true,
    },
    plugins: [
        // new CleanWebpackPlugin(['dist/*']) for < v2 versions of CleanWebpackPlugin
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin( {
            title: 'Hot Module Replacement',
        } ),
    ],
};

const config = Object.assign(
    {},
    commonConfig,
    renderer,
    settings.mode !== 'production' ? hotReload : {},
);


module.exports = [
    config
];
