import { writeFileSync } from "fs";

export function addChannel(channelID: string, roleID: string) {
  const channels: Array<{
    channelID: string;
    roleID: string;
  }> = require("../../../channels.json");
  channels.push({ channelID, roleID });
  delete require.cache[require.resolve("../../../channels.json")];
  writeFileSync("./channels.json", JSON.stringify(channels, null, 2));
}
