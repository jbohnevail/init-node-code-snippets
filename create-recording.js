require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const freeclimbSDK = require('@freeclimb/sdk')

const app = express()
app.use(bodyParser.json())
// Where your app is hosted ex. www.myapp.com
const host = process.env.HOST
const port = process.env.PORT || 80
// your freeclimb API key (available in the Dashboard) - be sure to set up environment variables to store these values
const accountId = process.env.ACCOUNT_ID
const apiKey = process.env.API_KEY
const freeclimb = freeclimbSDK(accountId, apiKey)
const applicationId = process.env.APPLICATION_ID

// Invoke create method to initiate the asynchronous outdial request
freeclimb.api.calls.create(to, from, applicationId).catch(err => {/* Handle Errors */ })

// Handles incoming calls. Set with 'Call Connect URL' in App Config
app.post('/incomingCall', (req, res) => {
  // Create PerCL say script
  const say = freeclimb.percl.say('Hello. Please leave a message after the beep, then press one or hangup.')
  const options = {
    playBeep: true,
    finishOnKey: '1'
  }
  // Create PerCL record utterance script
  const record = freeclimb.percl.recordUtterance(`${host}/finishedRecording`, options)
  const percl = freeclimb.percl.build(say, record)
  res.status(200).json(percl)
})

app.post('/finishedRecording', (req, res) => {
  const recordingResponse = req.body
  const say = freeclimb.percl.say('This is what you have recorded')
  const play = freeclimb.percl.play(recordingResponse.recordingUrl)
  const goodbye = freeclimb.percl.say('Goodbye')
  const percl = freeclimb.percl.build(say, play)
  res.status(200).json(percl)
})

// Specify this route with 'Status Callback URL' in App Config
app.post('/status', (req, res) => {
  // handle status changes
  res.status(200)
})

app.listen(port, () => {
  console.log(`started the server on port ${port}`)
})
