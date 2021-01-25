# python-websocket-chrome-interactive-app

# Dev Process
Clients:
- Host
- Audience

## Current API

Inspiration: a chat room

Socket Endpoint : /chat

open : join the room

on_close : remove self from room

on_message : every 0.5 - 1 seconds, get all location+message of current members in the room

### Architecture:

Problem: Running on heroku/cloud instance means that multiple instance of the app will be spawned, for load balancing. Hence, 1 instance of the app may not contain all members

Solution: Using a external cache such as redis to maintain the global states of the system (state of all users etc.)

## Future Architecture:

Extend to multiple 'rooms' or sessions

2 different set of APIs

### Host
Socket Endpoint : /host

open : Create room

on_close : remove room

on_message : every 0.5 - 1 seconds, get all location of current audience

### Audience
Socket Endpoint : /join

open : open polling

on_close : remove from waiters

on_message : every 0.5 - 1 seconds, send location to server.