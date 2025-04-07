module.exports = {
  extends: '@loopback/eslint-config',
  overrides: [
    {
      files: ['newrelic.js'],  // Specify the file you want to handle differently
      rules: {
        'no-unused-vars': 'off', // Disable specific rule (e.g., for unused vars)
        'no-console': 'off', // Disable console rule if necessary
        'import/no-extraneous-dependencies': 'off', // Disable the import dependency check if necessary
      },
    },
  ],
};
