module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'react-native-reanimated/plugin',
      {
        worklets: false, // Disable worklets if not needed
      },
    ],
    [
      '@babel/plugin-transform-private-methods',
      { loose: true }, // Ensure 'loose' mode is consistent
    ],
    [
      '@babel/plugin-transform-class-properties',
      { loose: true }, // Add this plugin with consistent 'loose' setting
    ],
    [
      '@babel/plugin-transform-private-property-in-object',
      { loose: true }, // Add this plugin with consistent 'loose' setting
    ],
  ],
};
