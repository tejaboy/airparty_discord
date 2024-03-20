import { discordSdk } from './discordSdk';
import './index.css';
import kaboom from 'kaboom'

// Initialize Kaboom
export const k = kaboom({
	background: "41D9FF"
});

const text = k.add([
  k.text("hello world " + discordSdk.channelId),
  k.pos(k.center()),
  k.anchor("center")
])