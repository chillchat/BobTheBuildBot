import { IBuild } from "../items/build";

export function getLastestBuild() {
  const builds: IBuild[] = require("../../../builds.json");
  delete require.cache[require.resolve("../../../builds.json")];
  return builds[builds.length - 1];
}
