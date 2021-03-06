import { Client, Message, MessageEmbed, TextChannel } from "discord.js";

import { addChannel } from "./actions/addChannel";
import config from "./private/config";
import { getChannels } from "./actions/getChannels";
import { getLastestBuild } from "./actions/getLastestBuild";
import { sendEmbed } from "./actions/sendEmbed";

interface ICommands {
  [s: string]: (bot: Client, msg: Message, args: string[]) => void;
}

const commands: ICommands = {
  announce: (bot, msg, args) => {
    if (config.approvedAnnouncers.includes(msg.author.id)) {
      for (const { channelID, roleID } of getChannels()) {
        const channel = bot.guilds.cache
          .find((g) => g.channels.cache.has(channelID))
          ?.channels.cache.get(channelID);
        if (channel) {
          if (roleID) {
            const role = bot.guilds.cache
              .find((g) => g.channels.cache.has(channelID))
              ?.roles.cache.get(roleID);
            if (role) {
              role.setMentionable(true);
              (channel as TextChannel)
                .send(
                  `<@&${roleID}>`,
                  new MessageEmbed({ description: args.join(" ") })
                    .setTimestamp()
                    .setAuthor(
                      msg.author.username,
                      msg.author.avatarURL() ?? ""
                    )
                )
                .then(() => {
                  setTimeout(() => {
                    role.setMentionable(false);
                  }, 500);
                });
            }
          } else {
            (channel as TextChannel).send(
              new MessageEmbed({ description: args.join(" ") })
                .setTimestamp()
                .setAuthor(msg.author.username, msg.author.avatarURL() ?? "")
            );
          }
        }
      }
    }
    return;
  },
  latest: (bot, msg, args) => {
    const lastestBuild = getLastestBuild();
    sendEmbed(lastestBuild, msg.channel as TextChannel);
  },
  setup: (bot, msg, args) => {
    addChannel(args[0], args[1]);
    msg.channel.send(
      new MessageEmbed({
        description: "Thanks for setting up Bob the Build Bot!",
        title: "Setup",
      }).setTimestamp()
    );
    const lastestBuild = getLastestBuild();
    if (args[1]) {
      const role = msg.guild?.roles.cache.get(args[1]);
      if (role) {
        role.setMentionable(true);
        sendEmbed(lastestBuild, msg.channel as TextChannel, args[1]).then(
          () => {
            role.setMentionable(false);
          }
        );
      }
    } else {
      sendEmbed(lastestBuild, msg.channel as TextChannel);
    }
  },
};

export const BobtheBuildBot = new Client({
  disableMentions: "everyone",
  ws: {
    intents: ["GUILDS", "GUILD_MESSAGES"],
  },
});

BobtheBuildBot.on("message", (msg) => {
  if (msg.content.startsWith(config.prefix)) {
    const parts = msg.content.split(" ");
    const cmdName = parts[0].slice(config.prefix.length);
    parts.shift();
    const args = parts;
    if (commands[cmdName]) {
      commands[cmdName](BobtheBuildBot, msg, args);
    }
  }
});
