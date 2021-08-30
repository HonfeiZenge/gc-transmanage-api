const Joi = require('@hapi/joi')
const transactionController = require('../../../controller/transactionController');

const path = '/api/transaction';
const routes = [
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
