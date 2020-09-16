import { TextChannel } from "discord.js";
import ms from "ms";
import { addBuild } from "./src/actions/addBuild";
import { fetchBuildInfo } from "./src/actions/fetchBuildInfo";
import { getChannels } from "./src/actions/getChannels";
import { getLastestBuild } from "./src/actions/getLastestBuild";
import { sendEmbed } from "./src/actions/sendEmbed";
import { BobtheBuildBot } from "./src/bot";
import config from "./src/private/config";

async function __init() {
  const latestBuild = getLastestBuild();
  const buildInfo = await fetchBuildInfo("https://canary.discordapp.com/app");
  if (JSON.stringify(buildInfo) !== JSON.stringify(latestBuild)) {
    addBuild(buildInfo);
    for (const { channelID, roleID } of getChannels()) {
      const channel = BobtheBuildBot.guilds
        .find(g => g.channels.has(channelID))
        .channels.get(channelID);
      if (channel) {
        if (roleID) {
          const role = BobtheBuildBot.guilds
            .find(g => g.channels.has(channelID))
            .roles.get(roleID);
          if (role) {
            role.setMentionable(true);
            sendEmbed(buildInfo, channel as TextChannel, roleID).then(() =>
              role.setMentionable(false)
            );
          }
        } else {
          sendEmbed(buildInfo, channel as TextChannel);
        }
      }
    }
  }
  return;
}

BobtheBuildBot.login(config.token);
BobtheBuildBot.once("ready", () => {
  console.log(BobtheBuildBot.user.username, "is ready!");
  __init().catch(err => console.error(err));
  setInterval(__init, ms("5m"));
});
