module.exports={
    extends:["react-app"], //继承react官方规则
    parserOptions:{
        babelOptions:{
            presets:[
                ["babel-preset-react-app",false],
                "babel-preset-react-app/prod",
            ],
        },
    },
};