require('dotenv').config();

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET must be set before starting the API.');
}

const app = require('./app');
const { sequelize } = require('./models');

const port = Number(process.env.PORT) || 4000;

async function start() {
  await sequelize.authenticate();
  await sequelize.sync();
  app.listen(port, () => console.log(`API listening on port ${port}`));
}

start().catch((error) => {
  console.error('Unable to start API:', error);
  process.exit(1);
});