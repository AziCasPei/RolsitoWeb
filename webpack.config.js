import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { glob } from 'glob';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import postcssPresetEnv from 'postcss-preset-env';
import cssnano from 'cssnano';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
    entry: { styles: '/styles.css' },
    output: {
        path: path.resolve(__dirname, 'dist'),
        assetModuleFilename: 'assets/[name].[contenthash][ext][query]',
        clean: true
    },
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.html$/,
                use: ['html-loader']
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.css$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    postcssPresetEnv({
                                        stage: 1,
                                        autoprefixer: { grid: true }
                                    }),
                                    cssnano({
                                        preset: 'default',
                                        discardComments: { removeAll: true }
                                    }),
                                ],
                            }
                        },
                    },
                ],
            },
            {
                test: /\.(webp|png)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'images/[name].[contenthash][ext][query]'
                }
            },
            {
                test: /\.(woff|woff2|ttf)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[name].[contenthash][ext][query]'
                }
            }
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'assets/[name].[contenthash].css', // Genera CSS con el mismo nombre que el original
        }),
        ...glob.sync('./**/*.html').map(file => new HtmlWebpackPlugin({
            template: file,
            filename: path.relative('.', file),
            inject: false
        })),
        {
            apply(compiler) {
                const cssFilesMap = new Map();

                compiler.hooks.compilation.tap('RenameCSSFiles', (compilation) => {
                    compilation.hooks.processAssets.tap(
                        {
                            name: 'RenameCSSFiles',
                            stage: compilation.PROCESS_ASSETS_STAGE_ADDITIONS,
                        },
                        (assets) => {
                            Object.keys(assets).forEach(asset => {
                                const content = assets[asset].source();

                                if (asset.endsWith('.js') && content.includes('// extracted by mini-css-extract-plugin')) {
                                    delete assets[asset];
                                } else if (asset.endsWith('.css')) {
                                    const baseName = asset.split('.').slice(0, 1).join('.');

                                    if (!cssFilesMap[baseName]) {
                                        cssFilesMap[baseName] = {};
                                    }

                                    if (Buffer.isBuffer(content)) {
                                        cssFilesMap[baseName].residual = asset;
                                    } else {
                                        cssFilesMap[baseName].processed = asset;
                                    }

                                    if (cssFilesMap[baseName].residual && cssFilesMap[baseName].processed) {
                                        delete assets[cssFilesMap[baseName].residual];
                                    }
                                }
                            });
                        }
                    );

                    HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync('RenameCSSFiles', (data, callback) => {
                        let htmlContent = data.html;
                        Object.keys(cssFilesMap).forEach(key => {
                            const regex = new RegExp(cssFilesMap[key].residual, 'g');
                            htmlContent = htmlContent.replace(regex, cssFilesMap[key].processed);
                        });

                        data.html = htmlContent;
                        callback(null, data);
                    });
                });
            }
        },
    ],
    optimization: {
        realContentHash: false,
        minimize: true,
        minimizer: [
            new TerserPlugin({
                extractComments: false,
            }),
        ],
        splitChunks: {
            chunks: 'all',
        },
    },
    devServer: {
        static: false,
        compress: true,
        port: 3000,
        open: true,
        historyApiFallback: {
            index: '/index.html'
        }
    }
};