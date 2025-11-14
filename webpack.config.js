const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const webpack = require('webpack');
const path = require('path');

// Determine environment
const BUILD_ENV = process.env.BUILD_ENV || 'dev';
const config = require(`./config/${BUILD_ENV}.js`);

console.log(`🚀 Building for ${config.environment.toUpperCase()} environment`);

// Helper to convert CSP object to string
function generateCSPString(csp) {
    return Object.entries(csp)
        .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
        .join('; ');
}

module.exports = {
    entry: './src/index.js',
    mode: config.environment === 'development' ? 'development' : 'production',
    devServer: {
        port: 3000,
        hot: config.features.hotReload,
        historyApiFallback: true,
        headers: {
            'Access-Control-Allow-Origin': config.security.corsOrigins.join(','),
        },
    },
    output: {
        publicPath: config.shellUrl + '/',
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[contenthash].js',
        clean: true,
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-react'],
                    },
                },
            },
        ],
    },
    plugins: [
        new ModuleFederationPlugin({
            name: 'shell',
            remotes: {
                productsMFE: `productsMFE@${config.mfeUrls.products}/remoteEntry.js`,
                cartMFE: `cartMFE@${config.mfeUrls.cart}/remoteEntry.js`,
                userMFE: `userMFE@${config.mfeUrls.user}/remoteEntry.js`,
            },
            shared: {
                react: { singleton: true, eager: true },
                'react-dom': { singleton: true, eager: true },
            },
        }),
        new HtmlWebpackPlugin({
            template: './public/index.html',
            templateParameters: {
                CSP: generateCSPString(config.security.csp),
                ENVIRONMENT: config.environment,
            },
        }),
        new webpack.DefinePlugin({
            'process.env.BUILD_ENV': JSON.stringify(BUILD_ENV),
            'process.env.SHELL_URL': JSON.stringify(config.shellUrl),
            'process.env.MFE_PRODUCTS_URL': JSON.stringify(config.mfeUrls.products),
            'process.env.MFE_CART_URL': JSON.stringify(config.mfeUrls.cart),
            'process.env.MFE_USER_URL': JSON.stringify(config.mfeUrls.user),
            'process.env.GOOGLE_CLIENT_ID': JSON.stringify(config.googleClientId),
            'process.env.DEBUG_MODE': JSON.stringify(config.features.debugMode),
        }),
    ],
};