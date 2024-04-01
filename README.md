# Air Party - Discord Activity Example

![Screenshot of the react colyseus example running](/preview.gif)

This repo is an example built on top of two javascript frameworks

1. [KaboomJS](https://kaboomjs.com/) - A javascript game engine
2. [Colyseus](https://www.colyseus.io/) - A full-stack state-management library

## Client architecture

The client (aka front-end) is using [ViteJS](https://vitejs.dev/)'s React Typescript starter project. It has been refactored to replace React with Kaboom.

- Fast typescript bundling with hot-module-reloading
- Identical configuration API
- Identical environment variable API

## Server architecture

The server (aka back-end) is using Express with typescript. Any file in the server project can be imported by the client, in case you need to share business logic.

## Colyseus

We're going to manage and synchronize our embedded app's state via [Colyseus](https://www.colyseus.io/). Our server is stateful and will hold the source of truth for our embedded app, and each client will post messages to the server to modify this state. ⚠️ This example is not (yet) architected to scale to production. It is meant for rapid prototyping and to showcase common SDK and API patterns.

## Setting up your Discord Application

Before we write any code, lets follow the instructions [here](https://discord.com/developers/docs/activities/building-an-activity#step-1-creating-a-new-app) to make sure your Discord application is set up correctly.

## Setting up your environment variables

In order to run your app, you will need to create a `.env` file. Rename the file [/example.env](/example.env) to `.env` and fill it in with the appropriate OAuth2 variables. The OAuth2 variables can be found in the OAuth2 tab on the developer portal, as described [here](https://discord.com/developers/docs/activities/building-an-activity#find-your-oauth2-credentials)

```.env
# Example .env file
# Rename this from example.env to .env
VITE_CLIENT_ID=PASTE_OAUTH2_CLIENT_ID_HERE
CLIENT_SECRET=PASTE_OAUTH2_CLIENT_SECRET_HERE
```

## Running your app locally

As described [here](https://discord.com/developers/docs/activities/building-an-activity#step-4-running-your-app-locally-in-discord), we encourage using a tunnel solution such as [cloudflared](https://github.com/cloudflare/cloudflared#installing-cloudflared) for local development.
To run your app locally, run the following from this directory.

```
npm install # only need to run this the first time
npm run dev
cloudflared tunnel --url http://localhost:3000 # from another terminal
```

Be sure to complete all the steps listed [here](https://discord.com/developers/docs/activities/building-an-activity) to ensure your development setup is working as expected.

## Where do you go from here?

This basic project will create a 2D plane-based fighting game. You may look at [/packages/server/src/room/StateHandlerRoom.ts](/packages/server/src/room/StateHandlerRoom.ts) for the back-end code.
This project feature multiple Kaboom scene. It is located at (/packages/clieent/scenes/*). This is how we create new "page" for the game.

For more resources on Kaboom, please go [here](https://kaboomjs.com).

### Adding a new environment variable

In order to add new environment variables, you will need to do the following:

1. Add the environment key and value to `.env`
2. Add the key to [/packages/client/src/vite-env.d.ts](/packages/client/src/vite-env.d.ts)
3. Add the key to [/packages/server/environment.d.ts](/packages/server/environment.d.ts)

This will ensure that you have type safety in your client and server code when consuming environment variables

Per the [ViteJS docs](https://vitejs.dev/guide/env-and-mode.html#env-files)

> To prevent accidentally leaking env variables to the client, only variables prefixed with VITE\_ are exposed to your Vite-processed code.

```env
# Example .env file
VITE_CLIENT_ID=123456789012345678
CLIENT_SECRET=abcdefghijklmnopqrstuvwxyzabcdef
```
