// functions/.eslintrc.js
module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "google", // This preset can be very strict and might have the 10-space indent
  ],
  parserOptions: {
    ecmaVersion: 2018, // Or your chosen ECMAScript version
  },
  rules: {
    "quotes": ["error", "double"],
    // The 'google' preset might set indent to something specific.
    // You can override it here:
    "indent": ["error", 2], // Change to 2 spaces (or 4 if you prefer)
    "object-curly-spacing": ["error", "never"],
    "max-len": ["error", {"code": 100, "ignoreComments": true}], // Increased to 100
    "comma-dangle": ["error", "always-multiline"],
    // Add other rules or overrides here
  },
};
