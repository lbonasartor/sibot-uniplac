require('dotenv/config')
const { Client, IntentsBitField, ChannelType } = require('discord.js')
const { getReply } = require('./lib/chatgptapi')

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
})

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

  await message.channel.sendTyping()
  const chatGPTResponse = await getReply([message.content])

  message.reply(chatGPTResponse)
})

client.on('threadCreate', async (thread) => {
  if (!thread.parent.type === ChannelType.GuildForum) {
    return null
  }
  if (thread.parent.parentId === process.env.IGNORE_ID) {
    return null
  }
  const threadFirstMessage = await thread.fetchStarterMessage()

  await thread.sendTyping()
  const chatGPTResponse = await getReply([
    thread.name,
    threadFirstMessage.content,
  ])
  thread.send(chatGPTResponse)
  thread.send(
    'Sou uma IA então minha resposta pode conter erros, mas caso tenha sido util por favor reaja para que outros possam ver ela mais facilmente. Caso precise de mais ajuda basta me marcar em uma nova mensagem'
  )
  thread.send(`<@&1115007002364612649> podem dar uma olhadinha aqui?`)
})

client.login(process.env.TOKEN)
