# Slack D&D

A collection of endpoints to help you play D&D in your slack chat room.  

## Requirements

1. A publically accessible server running node (or abilty to reverse proxy back to your node server);
1. node.js

## Installation

```
npm i -g slack-dnd
slack-dnd --host [hostname || 127.0.0.1] --port [port || 3000] --token [Your Slack integration token] --group [Group ID to restrict usage to]
```

## Slack set up

### Dice
1. Add a [new slash command](https://slack.com/services/new/slash-commands) with the following settings:
  * **Command**: `/roll`
  * **URL**: `http://yourhost.com/roll`
  * **Method**: `get`
  * **Label**: `roll dice!`
1. Set up a new [incoming webhook](https://slack.com/services/new/incoming-webhook)
  * Choose a `channel` to integrate with (this doesn't matter -- it'll always respond to the channel you called it from)
  * Get your `token` from this page (this is what you'll use when you launch the server)

Or if you like pictures: 
![slash command](/assets/slack-integration.png)

![webhook](/assets/slack-webhook.png)  

