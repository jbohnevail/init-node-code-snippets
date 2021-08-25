require('dotenv').config()
const freeclimbSDK = require('@freeclimb/sdk')
// your freeclimb API key (available in the Dashboard) - be sure to set up environment variables to store these values
const accountId = process.env.ACCOUNT_ID
const apiKey = process.env.API_KEY
const freeclimb = freeclimbSDK(accountId, apiKey)

// Invoke dequeue queued call
freeclimb.api.queues.members(queueId).dequeue(callId).then(member => {
  // Use the queue member
}).catch(err => {/** Catch Errors */ })
