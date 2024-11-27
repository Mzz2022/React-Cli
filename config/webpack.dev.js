
const path=require("path")
const EslintWebpackPlugin=require("eslint-webpack-plugin");
const HtmlWebpackPlugin=require("html-webpack-plugin");

// 返回处理样式loader
const getStyleLoaders=(pre)=>{
    return [
        "style-loader",
        "css-loader",
        {
            //处理css兼容性问题
            //配合package.json中browserslist来指定兼容性
            loader: 'postcss-loader',
            options:{
                postcssOptions:{
                    plugins:["postcss-preset-env"],
                }
            },
        },
        pre
    ].filter(Boolean)
}

module.exports={
    entry:'./src/main.js',
    output:{
        path: undefined,
        filename:"static/js/[name].js",
        chunkFilename:'static/js/[name].chunk.js',
        assetModuleFilename:'static/media/[hash:10][ext][query]', //ext 自动补充扩展名 
    },
    module:{
        rules:[
            //处理css
            {
                test: /\.css$/,
                use: getStyleLoaders(),
            },
            {
                test: /\.less$/,
                use: getStyleLoaders("less-loader"),
            },
            {
                test: /\.s[ac]ss$/,
                use: getStyleLoaders("s[ac]ss-loader"),
            },
            {
                test: /\.styl$/,
                use: getStyleLoaders("stylus-loader"),
            },
            //处理图片
            {
                test: /\.(jpe?g|png|gif|webp|svg)$/,
                type: "asset",
                parser:{
                    dataUrlCondition:{
                        maxSize: 10*1024,
                    },
                },
            },
            //处理其他资源
            {
                test: /\.(woff2?|ttf)$/,
                type:"asset/resource",
            },
            //处理js
            {
                test: /\.jsx?$/,
                include: path.resolve(__dirname,"../src"),
                loader:"babel-loader",
                options:{
                    cacheDirectory:true,
                    cacheCompression:false,// 缓存内容不做压缩,提高打包速度
                }
            }
        ],
    },
    //处理html
    plugins:[
        new EslintWebpackPlugin({
            context: path.resolve(__dirname,'../src'),
            excludes: "node_modules",//排除文件,提高检测性能
            cache:true,//设置可缓存
            cacheLocation: path.resolve(__dirname, '../node_modules/.cache/.eslintcache'),
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "../public/index.html")
        })
    ],
    mode:"development",
    devtool:'cheap-module-source-map',
    optimization:{
        splitChunks:{
            chunks:'all',
        },
        runtimeChunk:{
            name:(entrypoint)=> `runtime~${entrypoint.name}.js`
        }
    },
    devServer:{
        host:"localhost",
        port:3000,
        open:true,
        hot:true,
    }
}