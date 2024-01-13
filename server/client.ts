import * as AWS from "@aws-sdk/client-s3";
import { Md5 } from "ts-md5";

// @ts-ignore
export const client = new AWS.S3({
  credentials: {
    accessKeyId: process.env.ACCESS_ID,
    secretAccessKey: process.env.ACCESS_KEY,
  },
  endpoint: process.env.ENDPOINT,
  region: "fuck-if-i-care",
});

export const getKeyFromHash = async (hash: string, bucket: string) => {
  const cmd = new AWS.ListObjectsV2Command({ Bucket: bucket });
  const response = await client.send(cmd);
  const objects = response.Contents;
  if (objects == null) {
    return null;
  }
  const objectIndex = objects?.findIndex((o) => {
    if (o.Key == null) {
      return false;
    }
    return hashKey(o.Key) == hash;
  });
  if (objectIndex == -1) {
    return null;
  }
  return objects[objectIndex].Key;
};

export const hashKey = (key: string) => {
  return Md5.hashStr(key);
};
