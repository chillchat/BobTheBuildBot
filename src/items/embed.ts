import { RichEmbed } from "discord.js";
import { Factory } from "../helpers/Factory";
import { IBuild } from "./build";

function embed(buildInfo: IBuild): RichEmbed {
  return new RichEmbed({
    title: "Canary Update"
  })
    .addField("Build Number:", buildInfo.buildNumber, true)
    .addField("Build ID:", buildInfo.buildID, true)
    .addField("Build Hash:", buildInfo.buildHash, false);
}

export const embedFactory = Factory<RichEmbed>(embed);
