export function getChannels() {
  const channels: Array<{
    channelID: string;
    roleID: string;
  }> = require("../../../channels.json");
  delete require.cache[require.resolve("../../../channels.json")];
  return channels;
}
