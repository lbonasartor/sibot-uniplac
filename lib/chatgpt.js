const { Configuration, OpenAIApi } = require('openai')

const openaiConfig = new Configuration({
  apiKey: process.env.API_KEY,
})

exports.openaiAPI = new OpenAIApi(openaiConfig)
