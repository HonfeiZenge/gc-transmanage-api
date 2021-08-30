'use strict';

const Hapi = require('@hapi/hapi');
const routes = require('./routes/api/transaction');

const app = async () => {
  // Setting the Hapi server
  const serverPort = process.env.PORT || 5000;
  const server = Hapi.server({
    port: serverPort,
    host: 'localhost',
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
      url: 'mongodb+srv://hayat:gilgamesh73@cluster0.rrnzn.mongodb.net/transaction-management?retryWrites=true&w=majority',
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
