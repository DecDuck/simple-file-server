import * as AWS from "@aws-sdk/client-s3";

export const client = new AWS.S3({
  credentials: { accessKeyId: process.env.ACCESS_ID, secretAccessKey: process.env.ACCESS_KEY },
  endpoint: process.env.ENDPOINT,
  region: "fuck-if-i-care"
});
