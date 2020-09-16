import { Factory } from "../helpers/Factory";

export interface IBuild {
  buildHash: string;
  buildID: string;
  buildNumber: number;
}

function build(requestInfo: IBuild): Readonly<IBuild> {
  return Object.freeze({
    buildHash: requestInfo.buildHash,
    buildID: requestInfo.buildID,
    buildNumber: requestInfo.buildNumber
  });
}

export const buildFactory = Factory<IBuild>(build);
