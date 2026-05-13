export default {
  locales: ['en', 'es'], // Define the languages you support
  output: 'src/assets/tranlsations/$LOCALE.json', // Path to your translation files
  sort: true, // Sort keys in the translation files
  verbose: true, // Enable verbose logging
  indentation: 2, // Indentation for JSON files
  keySeparator: '.', // Use dot as a key separator for nested keys
  namespaceSeparator: ':', // Use colon as a namespace separator
  useKeysAsDefaultValue: false, // Do not use keys as default values
  createOldCatalogs: false, // Do not create old catalogs
  flatten: false, // Ensure keys are not flattened
};