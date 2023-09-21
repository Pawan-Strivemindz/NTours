const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const DB = process.env.DB_URL.replace('<PASSWORD>', process.env.DB_PASS);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((con) => {
    // console.log(con.connections);
    console.log('DB Connected!!');
  });
const app = require('./app');
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`listening to the port ${port}..`);
});
