const path = require('path');
const dotenv = require('dotenv');

console.info('DotEnv setup loaded.');
dotenv.config({
  path: path.resolve(process.cwd(), '.test.env'),
});
