import { BobtheBuildBot } from "./src/bot";
import { TextChannel } from "discord.js";
import { addBuild } from "./src/actions/addBuild";
import config from "./src/private/config";
import { fetchBuildInfo } from "./src/actions/fetchBuildInfo";
import { getChannels } from "./src/actions/getChannels";
import { getLastestBuild } from "./src/actions/getLastestBuild";
import ms from "ms";
import { sendEmbed } from "./src/actions/sendEmbed";

async function __init() {
  const latestBuild = getLastestBuild();
  const buildInfo = await fetchBuildInfo("https://canary.discordapp.com/app");
  if (JSON.stringify(buildInfo) !== JSON.stringify(latestBuild)) {
    addBuild(buildInfo);
    for (const { channelID, roleID } of getChannels()) {
      const channel = BobtheBuildBot.guilds.cache
        .find((g) => g.channels.cache.has(channelID))
        ?.channels.cache.get(channelID);
      if (channel) {
        if (roleID) {
          const role = BobtheBuildBot.guilds.cache
            .find((g) => g.channels.cache.has(channelID))
            ?.roles.cache.get(roleID);
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
  console.log(BobtheBuildBot.user?.username, "is ready!");
  __init().catch((err) => console.error(err));
  setInterval(__init, ms("5m"));
});
