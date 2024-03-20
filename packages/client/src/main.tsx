import { discordSdk } from './discordSdk';
import './index.css';
import kaboom from 'kaboom'
import { IGuildsMembersRead, TAuthenticateResponse } from './types';
import { Client } from 'colyseus.js';
import { getUserAvatarUrl } from './utils/getUserAvatarUrl';
import { getUserDisplayName } from './utils/getUserDisplayName';
import { State } from '../../server/src/entities/State';
import { GAME_NAME } from '../../server/src/shared/Constants';

// Initialize Kaboom
export const k = kaboom({
	background: "41D9FF"
});

const text = k.add([
  k.text("Connecting ..."),
  k.pos(k.center()),
  k.anchor("center")
]);

// Discord SDK Set-up
const setUpDiscordSdk = async () => {
  await discordSdk.ready();

  // Authorize with Discord Client
  const {code} = await discordSdk.commands.authorize({
    client_id: import.meta.env.VITE_CLIENT_ID,
    response_type: 'code',
    state: '',
    prompt: 'none',
    // More info on scopes here: https://discord.com/developers/docs/topics/oauth2#shared-resources-oauth2-scopes
    scope: [
      // "applications.builds.upload",
      // "applications.builds.read",
      // "applications.store.update",
      // "applications.entitlements",
      // "bot",
      'identify',
      // "connections",
      // "email",
      // "gdm.join",
      'guilds',
      // "guilds.join",
      'guilds.members.read',
      // "messages.read",
      // "relationships.read",
      // 'rpc.activities.write',
      // "rpc.notifications.read",
      // "rpc.voice.write",
      'rpc.voice.read',
      // "webhook.incoming",
    ],
  });

  // Retrieve an access_token from your embedded app's server
  const response = await fetch('/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      code,
    }),
  });
  const {access_token} = await response.json();

  // Authenticate with Discord client (using the access_token)
  const newAuth: TAuthenticateResponse = await discordSdk.commands.authenticate({
    access_token,
  });

  // Get guild specific nickname and avatar, and fallback to user name and avatar
  const guildMember: IGuildsMembersRead | null = await fetch(
    `/discord/api/users/@me/guilds/${discordSdk.guildId}/member`,
    {
      method: 'get',
      headers: {Authorization: `Bearer ${access_token}`},
    }
  )
    .then((j) => j.json())
    .catch(() => {
      return null;
    });

  // Done with discord-specific setup

  // Now we create a colyseus client
  const wsUrl = `wss://${location.host}/api/colyseus`;
  const client = new Client(wsUrl);

  let roomName = 'Channel';

  // Requesting the channel in GDMs (when the guild ID is null) requires
  // the dm_channels.read scope which requires Discord approval.
  if (discordSdk.channelId != null && discordSdk.guildId != null) {
    // Over RPC collect info about the channel
    const channel = await discordSdk.commands.getChannel({channel_id: discordSdk.channelId});
    if (channel.name != null) {
      roomName = channel.name;
    }
  }

  // Get the user's guild-specific avatar uri
  // If none, fall back to the user profile avatar
  // If no main avatar, use a default avatar
  const avatarUri = getUserAvatarUrl({
    guildMember,
    user: newAuth.user,
  });

  // Get the user's guild nickname. If none set, fall back to global_name, or username
  // Note - this name is note guaranteed to be unique
  const name = getUserDisplayName({
    guildMember,
    user: newAuth.user,
  });

  // The second argument has to include for the room as well as the current player
  const newRoom = await client.joinOrCreate<State>(GAME_NAME, {
    channelId: discordSdk.channelId,
    roomName,
    userId: newAuth.user.id,
    name,
    avatarUri,
  });

  console.log(avatarUri);
  console.log(client);
  console.log(newRoom);

  // Finally, we construct our authenticatedContext object to be consumed throughout the app
  return { avatarUri, name, client, room: newRoom };
};

setUpDiscordSdk().then(({avatarUri, name, client, room}) => {
  text.text = "Set-up succes. Welcome, " + name + "!";
});