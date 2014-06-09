'use strict';

var http = require('http');
var https = require('https');
var url = require('url');
var minimist = require('minimist');
var argv;
var port = 3000;
var host = '127.0.0.1';
var slackToken;
var groupRestrict;

function rollDie(max){
  return Math.floor(Math.random() * (max - 1 + 1)) + 1;
}

function startRollServer(port, ip, slackToken, groupRestrict){
  var server = http.createServer(function(req, res){
    var parsed = url.parse(req.url, true);
    
    if(typeof groupRestrict !== 'undefined'  && parsed.query.team_id !== groupRestrict){
      return res.end('');
    }

    if(parsed.pathname === '/roll'){
      var diceData = parsed.query.text.split('d');
      var echoChannel = parsed.query.channel_id;
      var numDice = parseInt(diceData[0] || 1, 10);
      var diceType = parseInt(diceData[1], 10);
      var results = [];
      var roll = 0;

      console.log('request', req.url);

      if(!isNaN(numDice) && !isNaN(diceType)){
        console.log('valid request, rolling dice');
        numDice = numDice > 10 ? 10 : numDice;
        diceType = diceType > 20 ? 20 : diceType;
        for(var i = 0; i < numDice; i++){
          roll = rollDie(diceType);
          results.push(roll);
        }
      }

      var total = results.reduce(function(a,r){ return a += r}, 0);

      var output = JSON.stringify({
        text: diceData.join('d')+': '+total+'; '+results.join(' '),
        username: 'dungeonmaster',
        icon_emoji: ':dm:',
        channel: echoChannel
      });

      console.log('sending to webhook', output);
      
      var post = https.request({
        host: 'scripto.slack.com',
        path: '/services/hooks/incoming-webhook?token='+slackToken,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': output.length
        }
      }, function(res){
        res.setEncoding('utf8');
        res.on('data', function(chunk){
          console.log('response', chunk);
        });
      });

      post.write(output);
      post.end();

      res.end('');

    } else {
      res.end('nope');
    }
  });
  server.listen(port, ip);
  console.log('listening on', ip+':'+port)
}

if(!module.parent){
  argv = minimist(process.argv.slice(2));
  host = argv.host || host;
  port = argv.port || port;
  groupRestrict = argv.group || groupRestrict;
  slackToken = argv.token || slackToken;

  if(typeof slackToken === 'undefined'){
    throw new Error('You must supply a token for Slack');
  }

  startRollServer(port, host, slackToken, groupRestrict);
}
