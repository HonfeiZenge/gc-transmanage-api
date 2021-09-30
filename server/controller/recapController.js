const Joi = require('@hapi/joi')
Joi.objectId = require('joi-objectid')(Joi)


// get all transactions recap data collection
const transactions = async (req, h) => {
  try {
    const offset = Number(req.query.offset) || 0
    const transactions_recap = req.mongo.db.collection('transactions_recap')
    const recapData = await transactions_recap.find({}).sort({ insertedAt: -1 }).skip(offset).limit(16).toArray()
    
    const response = h.response({
      status: 'success',
      message: 'This is transaction recap data',
      data: recapData,
    })

    response.code(200)
    return response
  } catch (err) {
    const response = h.response({
      status: 'fail',
      message: err.message
    })
    response.code(404)
    return response
  }
}

// add data to trasactions recap collection
const addTransactionsRecap = async (req, h) => {
  try {
    const payload = req.payload
    const insertedAt = new Date()
    const { dataRekap } = payload

    let gain = []
    dataRekap.forEach(data => {
      const gDeposit = data.goldDeposited
      gain.push(gDeposit)
    })
    const totalGold = gain.reduce((a, b) => a+b)

    const data = { ...payload, totalGold, insertedAt }

    const transactions_recap = req.mongo.db.collection('transactions_recap')
    const addRecap = await transactions_recap.insertOne(data)

    if (addRecap) {
      const response = h.response({
        status: 'success',
        message: 'Add new recap data'
      })

      response.code(200)
      return response
    }
  } catch (err) {
    const response = h.response({
      status: 'fail',
      message: err.message
    })
    
    response.code(404)
    return response
  }
}

// get single recap data based on recap_id
const recapDetails = async (req, h) => {
  try {
    const id = req.params.recap_id
    const ObjectID = req.mongo.ObjectID
  
    const transactions_recap = req.mongo.db.collection('transactions_recap')
    const recapData = await transactions_recap.findOne({ _id: new ObjectID(id) })

    const res = h.response({
      status: 'success',
      message: 'Success accessing recap details',
      data: recapData,
    })

    res.code(200)
    return res
  } catch (err) {
    const res = h.response({
      status: 'fail',
      message: err.message
    })

    res.code(404)
    return res
  }
}

// Update transaction in collection based on transaction_id
const updateRecapData = async (req, h) => {
  try {
    const id = req.params.recap_id
    const ObjectID = req.mongo.ObjectID
    const payload = req.payload

    // honored, revered, exalted
    const { accClass, dataRekap } = payload;
    
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

    let gain = []
    dataRekap.forEach(data => {
      const result = data.goldDeposited * data.goldRate
      gain.push(result)
    })
    const result = gain.reduce((a, b) => a + b)
  
    const playerGain = result * depo;
    const companyGain = result * modal;
  
    const data = { ...payload, playerGain: playerGain, companyGain: companyGain};

    const transaction = req.mongo.db.collection('transactions_recap')
    const updateData = await transaction.updateOne({_id: ObjectID(id)}, {$set: data})
  
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

module.exports = {
  transactions,
  addTransactionsRecap,
  recapDetails,
  updateRecapData
}
