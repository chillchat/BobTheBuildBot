import { Factory } from "../helpers/Factory";
import { IBuild } from "./build";
import { MessageEmbed } from "discord.js";

function embed(buildInfo: IBuild): MessageEmbed {
  return new MessageEmbed({
    title: "Canary Update"
  })
    .addField("Build Number:", buildInfo.buildNumber, true)
    .addField("Build ID:", buildInfo.buildID, true)
    .addField("Build Hash:", buildInfo.buildHash, false);
}

export const embedFactory = Factory<MessageEmbed>(embed);
