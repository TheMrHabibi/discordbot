const express = require('express')
const mysql = require('mysql')
const app = express()
const port = process.env.PORT || 5000

const dbconnection = mysql.createConnection({
  host: "remotemysql.com",
  user: "G27w4H43cB",
  password: "9GGAkLG3hi",
  database: "G27w4H43cB"
})

dbconnection.connect(function(error) {
  if (error) { throw error }
  console.log("Connected successfully!")
})

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))

const Discord = require('discord.js')
const client = new Discord.Client()

var timer

client.on('ready', function() {
  console.log(`Logged in as ${client.user.tag}!`)
  var guild = client.guilds.cache.get("768844589145653258")
  var rankingsChannel = guild.channels.cache.get("772458287652012042")

  dbconnection.query(`SELECT user_id, COUNT(*) AS total FROM coffee GROUP BY user_id ORDER BY 1 DESC`, function(error, result) {
    if (error) { throw error }
    console.log(result)
    console.log(result.length)
    console.log(result[0].user_id)
    var resultt = "**BEST OF OUR COFFEE CUSTOMERS:**\n"
    var mdresult = ""
    for (let x = 0; x < result.length; x++) {
      mdresult += `\`#${ x + 1 }\` <@${ result[x].user_id }> : ${ result[x].total } times\n`
    }
    rankingsChannel.messages.fetch("772595202312765442").then(function(message) {
      message.edit(resultt + mdresult)
    })
  })
})

client.on('message', function(message) {
  var guild = client.guilds.cache.get("768844589145653258")
  if (message.channel.id === "772288501735227463") {
    if (message.content === "coffee please") {
      dbconnection.query(`INSERT INTO coffee VALUES ('${ message.author.id }')`, function(error, result) {
        console.log("Served coffee for user " + message.author.id)
      })
      dbconnection.query(`SELECT * FROM coffee`, function(error, result, fields) {
        message.channel.send("Thank you <@" + message.author.id + "> for ordering a **Coffee** from us! Total **Coffee** served in this server is `" + result.length + " times`!")
      })
    } else if (message.content === "update server info") {
      var counterChannel = guild.channels.cache.get("772303572238073856")

      dbconnection.query(`SELECT * FROM coffee`, function(error, result, fields) {
        counterChannel.setName(result.length + "-total-coffee-served")
        message.channel.send("Successfully updated server information variables")
      })
    } else if (message.content === "update rankings") {
      var rankingsChannel = guild.channels.cache.get("772458287652012042")
      console.log(rankingsChannel.messages.cache.get("772459056450502656"))
      dbconnection.query(`SELECT user_id, COUNT(*) AS total FROM coffee GROUP BY user_id ORDER BY 1 DESC`, function(error, result) {
        if (error) { throw error }
        console.log(result)
        console.log(result.length)
        console.log(result[0].user_id)
        var resultt = "**BEST OF OUR COFFEE CUSTOMERS:**\n"
        var mdresult = ""
        for (let x = 0; x < result.length; x++) {
          mdresult += `\`#${ x + 1 }\` <@${ result[x].user_id }> : ${ result[x].total } times\n`
        }
        rankingsChannel.messages.fetch("772595202312765442").then(function(message) {
          message.edit(resultt + mdresult)
        })
      })
    }
  }
})

client.on("guildMemberAdd", function(member) {
  var messageToChannel = member.guild.channel.cache.get("772611450879344650")
  messageToChannel.send(`Newcomers! Welcome, <@${ member.id }>`)
})

client.login(process.env.BOT_TOKEN)
