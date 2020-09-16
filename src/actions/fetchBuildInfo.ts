import Axios from "axios";
import { buildFactory, IBuild } from "../items/build";

export async function fetchBuildInfo(url: string): Promise<IBuild> {
  const firstReq = await Axios.get(url);
  const jsLinkRegex = /\/assets\/([a-zA-z0-9]+).js/g;
  const jsLinkRegexResults = firstReq.data.match(jsLinkRegex);
  const jsLink = jsLinkRegexResults
    ? `https://canary.discordapp.com${
    jsLinkRegexResults[jsLinkRegexResults.length - 1]
    }`
    : "";
  const secondReq = await Axios.get(jsLink);
  const buildRegex = /Build Number: [0-9]+, Version Hash: [A-Za-z0-9]+/;
  const buildRegexResults = buildRegex.exec(secondReq.data);
  const buildStrings = buildRegexResults
    ? buildRegexResults[0].replace(" ", "").split(",")
    : [];
  return buildFactory({
    buildHash: buildStrings[1].split(":")[1].replace(" ", ""),
    buildID: firstReq.headers["x-build-id"],
    buildNumber: parseInt(buildStrings[0].split(":")[1].replace(" ", ""), 10)
  });
}
