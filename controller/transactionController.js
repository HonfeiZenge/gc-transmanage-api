//const Hapi = require('@hapi/hapi');
const Joi = require('@hapi/joi')
Joi.objectId = require('joi-objectid')(Joi)

// Get all transaction inside collection
const getAllTransaction = async (req, h) => {
  // Declaring db collection
  try {
    const offset = Number(req.query.offset) || 0;
    // const currentDate = new Date();
    const transaction = req.mongo.db.collection('transaction');
    const transactionData = await transaction.find({}).sort({ insertedAt: -1 }).skip(offset).limit(30).toArray();

    // reff sorting by date
    // startTime: {
    //   $gte: currentDate,
    //   $lt:  currentDate
    // }

    const response = h.response({
      status: 'success',
      message: 'This is get all',
      data: transactionData,
    });
    
    response.code(200);
    return response;
  } catch (error) {
    const response = h.response({
      status: 'fail',
      message: error.message
    })
    
    response.code(404)
    return response
  }
  
}

// Add new transaction to collection
const addNewTransaction = async (req, h) => {
  // define value to insert to db
  const payload = req.payload;
  const insertedAt = new Date();
  const updatedAt = new Date(); 
  // honored, revered, exalted
  const { goldDeposited, goldRate, finishGold, accClass } = payload;
  
  let depo = 0;
  let modal = 0;

  if (accClass == 'honored') {
    depo = 0.5;
    modal = 0.5;
  } else if (accClass == 'revered') {
    depo = 0.6;
    modal = 0.4;
  } else {
    depo = 1;
    modal = 0;
  }

  const comModal = (goldDeposited * goldRate) * modal;
  const playerDeposit = (goldDeposited * goldRate) * depo;
  const currentGold = finishGold - goldDeposited;

  const data = { ...payload, currentGold, playerDeposit, comModal, insertedAt, updatedAt };

  // Declaring db collection
  const transaction = req.mongo.db.collection('transaction');
  const addData = await transaction.insertOne(data);

  if (addData) {
    const response = h.response({
      status: 'success',
      message: 'Add new transaction',
    });

    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Failed add new transaction',
  });

  response.code(404);
  return response;
}

// Show 1 selected data to show data details
const getTransactionDetails = async (req, h) => {
  try {
    const id = req.params.transaction_id
    const ObjectID = req.mongo.ObjectID
    const transaction = req.mongo.db.collection('transaction')
    const transactionData = await transaction.findOne({ _id: new ObjectID(id) })

    const response = h.response({
      status: 'success',
      message: 'Success accessing details transaction',
      data: transactionData,
    })

    response.code(200)
    return response
  } catch (error) {
    const response = h.response({
      status: 'fail',
      message: error.message
    })

    response.code(404)
    return response
  }
}

// Update transaction in collection based on transaction_id
const updateSingleTransactionData = async (req, h) => {
  try {
    const id = req.params.transaction_id
    const ObjectID = req.mongo.ObjectID
    const payload = req.payload
    const transaction = req.mongo.db.collection('transaction')

    const updateData = await transaction.updateOne({_id: ObjectID(id)}, {$set: payload})
  
    if (updateData) {
      const response = h.response({
        status: 'success',
        message: 'success updating data',
      })
  
      response.code(200)
      return response
    }
  } catch (error) {
    error.message
  }
}

// Delete transaction from collection
const deleteTransaction = async (req, h) => {
  const id = req.params.transaction_id;
  const ObjectID = req.mongo.ObjectID;

  // Declaring db collection
  const transaction = req.mongo.db.collection('transaction');

  const delData = await transaction.deleteOne({ _id: ObjectID(id) });
  if (delData) {
    const response = h.response({
      status: 'success',
      message: 'Success deleting a transaction',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'success',
    message: 'Fail deleting a transaction',
  });
  response.code(404);
  return response;
}

module.exports = {
  getAllTransaction,
  addNewTransaction,
  getTransactionDetails,
  updateSingleTransactionData,
  deleteTransaction,
}
