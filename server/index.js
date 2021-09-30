'use strict';

const Hapi = require('@hapi/hapi')
const routes = require('./routes/api/transaction')
const dotenv = require('dotenv')

dotenv.config()

const app = async () => {
  // Setting the Hapi server
  const serverPort = process.env.PORT || 5000;
  const server = Hapi.server({
    port: serverPort,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // Connecting Hapi server to MongoDB with register
  await server.register({
    plugin: require('hapi-mongodb'),
    options: {
      url: process.env.MONGO_URL,
      settings: {
        useUnifiedTopology: true,
      },
      decorate: true,
    },
  });

  // Define the routes
  server.route(routes);

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.log(err.message);
  process.exit();
});

app();
