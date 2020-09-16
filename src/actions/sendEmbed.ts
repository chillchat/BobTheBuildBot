import { TextChannel } from "discord.js";
import { IBuild } from "../items/build";
import { embedFactory } from "../items/embed";

export function sendEmbed(
  buildInfo: IBuild,
  channel: TextChannel,
  roleID?: string
) {
  if (roleID) {
    return channel.send(`<@&${roleID}>`, embedFactory(buildInfo));
  } else {
    return channel.send(embedFactory(buildInfo));
  }
}
