const express = require('express');
const bot = require('./db.json');
const server = express();

server.all('/', (req, res)=>{
    res.send('Your bot is Online')
})
function keepAlive(){
    server.listen(3000, ()=>{console.log("Server is Ready!")});
}
module.exports = keepAlive;

