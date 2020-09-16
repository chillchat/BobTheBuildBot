import { writeFileSync } from "fs";
import { IBuild } from "../items/build";

export function addBuild(buildInfo: IBuild): void {
  const builds: IBuild[] = require("../../../builds.json");
  delete require.cache[require.resolve("../../../builds.json")];
  builds.push(buildInfo);
  writeFileSync("./builds.json", JSON.stringify(builds, null, 2));
}
