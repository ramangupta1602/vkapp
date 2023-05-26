module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        [
            'module-resolver',
            {
            root: ['./src'],
            extensions: ['.js', '.jsx', '.json', '.svg', '.png'],
            // Note: you do not need to provide aliases for same-name paths immediately under /src/
            alias: {
                Components: "./src/Components",
                Library: "./src/Library"
                // auth: './src/features/auth',
                // tasks: './src/features/tasks',
            }
            }
        ]
    ],
  env: {
    production: {
      plugins: ['transform-remove-console']
    }
  }
};
