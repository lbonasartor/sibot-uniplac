require('dotenv/config')
const { Client, IntentsBitField } = require('discord.js')
const { Configuration, OpenAIApi } = require('openai')

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
})

const openaiConfig = new Configuration({
  apiKey: process.env.API_KEY,
})

const openai = new OpenAIApi(openaiConfig)

client.on('ready', () => {
  console.log('The bot is online and running')
})

client.on('messageCreate', async (message) => {
  if (message.author.bot) {
    return null
  }
  if (!message.mentions.has(client.user.id)) {
    return null
  }

  console.log(`User ${message.author.username} message: ${message.content}`)

  const conversation = [
    {
      role: 'system',
      content: 'You are a friendly chatbot that speaks Brazilian Portuguese.',
    },
  ]

  conversation.push({
    role: 'user',
    content: message.content,
  })

  await message.channel.sendTyping()

  const result = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: conversation,
  })

  const chatGPTResponse = result.data.choices[0].message

  console.log(
    `ChatGPT Response to ${message.author.username}: ${JSON.stringify(
      chatGPTResponse,
      null,
      4
    )}`
  )

  message.reply(chatGPTResponse)
})

client.login(process.env.TOKEN)
