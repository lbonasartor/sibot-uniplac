const { openaiAPI } = require('./chatgpt')

exports.getReply = async (messages) => {
  const conversation = [
    {
      role: 'system',
      content: 'You are a friendly chatbot that speaks Brazilian Portuguese.',
    },
  ]

  messages.forEach((message) => {
    conversation.push({
      role: 'user',
      content: message,
    })
  })

  const result = await openaiAPI.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: conversation,
  })

  const chatGPTResponse = result.data.choices[0].message

  return chatGPTResponse
}
