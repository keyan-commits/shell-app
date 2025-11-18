const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const webpack = require('webpack');
const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');

// Determine which env file to use (priority: .env > .env.dev)
const envFile = fs.existsSync('./.env') ? './.env' : './.env.dev';

// Load environment variables from the selected file
const envConfig = dotenv.config({ path: envFile }).parsed || {};

// 🐛 DEBUG: Log what's loaded
console.log('📄 Using environment file:', envFile);
console.log('🔑 Google Client ID loaded:', envConfig.GOOGLE_CLIENT_ID ? '✅ Yes' : '❌ No');
console.log('🔑 Facebook App ID loaded:', envConfig.FACEBOOK_APP_ID ? '✅ Yes' : '❌ No');

if (!envConfig.GOOGLE_CLIENT_ID) {
    console.warn('⚠️  WARNING: GOOGLE_CLIENT_ID not found in', envFile);
}

if (!envConfig.FACEBOOK_APP_ID) {
    console.warn('⚠️  WARNING: FACEBOOK_APP_ID not found in', envFile);
}

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
                productsMFE: 'productsMFE@http://localhost:3001/remoteEntry.js',
                cartMFE: 'cartMFE@http://localhost:3002/remoteEntry.js',
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
            'process.env.SHELL_URL': JSON.stringify(envConfig.SHELL_URL || config.shellUrl),
            'process.env.MFE_PRODUCTS_URL': JSON.stringify(envConfig.PRODUCTS_MFE_URL || config.mfeUrls.products),
            'process.env.MFE_CART_URL': JSON.stringify(envConfig.CART_MFE_URL || config.mfeUrls.cart),
            'process.env.MFE_USER_URL': JSON.stringify(envConfig.USER_MFE_URL || config.mfeUrls.user),
            'process.env.GOOGLE_CLIENT_ID': JSON.stringify(envConfig.GOOGLE_CLIENT_ID || ''),
            'process.env.FACEBOOK_APP_ID': JSON.stringify(envConfig.FACEBOOK_APP_ID || ''),
            'process.env.DEBUG_MODE': JSON.stringify(config.features.debugMode),
        }),
    ],
};