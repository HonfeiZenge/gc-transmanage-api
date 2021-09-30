const Joi = require('@hapi/joi')
const transactionController = require('../../controller/transactionController')
const recapController = require('../../controller/recapController')

const path = '/api/transactions';
const recap_path = '/api/transactions_recap'

const routes = [
  // transactions route
  {
    method: 'GET',
    path: '/',
    handler: (req, h) => {
      return h.response({
        status: 'success',
        message: 'home page',
        data: []
      })
    }
  },
  {
    method: 'GET',
    path: `${path}`,
    handler: transactionController.getAllTransaction,
  },
  {
    method: 'POST',
    path: `${path}`,
    handler: transactionController.addNewTransaction,
  },
  {
    method: 'GET',
    path: `${path}/{transaction_id}`,
    handler: transactionController.getTransactionDetails,
  },
  {
    method: 'PUT',
    path: `${path}/{transaction_id}`,
    options: {
      validate: {
        params: Joi.object({
          transaction_id: Joi.objectId()
        })
      }
    },
    handler: transactionController.updateSingleTransactionData,
  },
  {
    method: 'DELETE',
    path: `${path}/{transaction_id}`,
    handler: transactionController.deleteTransaction,
  },
  {
    method: 'GET',
    path: '/search',
    handler: transactionController.searchTransactionByName,
  },
  // transactions recap route
  {
    method: 'GET',
    path: `${recap_path}`,
    handler: recapController.transactions,
  },
  {
    method: 'POST',
    path: `${recap_path}`,
    handler: recapController.addTransactionsRecap,
  },
  {
    method: 'GET',
    path: `${recap_path}/{recap_id}`,
    handler: recapController.recapDetails,
  },
  {
    method: 'PUT',
    path: `${recap_path}/{recap_id}`,
    options: {
      validate: {
        params: Joi.object({
          recap_id: Joi.objectId()
        })
      }
    },
    handler: recapController.updateRecapData,
  },
  {
    method: '*',
    path: '/{any*}',
    handler: (req, h) => {
      const response = h.response({
        status: 'fail',
        message: 'Page Not Found 404'
      })

      response.code(404);
      return response;
    },
  },
];

module.exports = routes;
