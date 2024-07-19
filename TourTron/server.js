const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const port = process.env.PORT || 3000;
const app = require('./app');

// console.log(process.env);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
