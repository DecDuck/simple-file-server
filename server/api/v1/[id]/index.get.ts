import { GetObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { client } from "~/server/client";

export default defineEventHandler(async (h3) => {
  const id = h3.context.params?.id;
  if (!id) {
    return createError({ statusCode: 400, statusMessage: "invalid id" });
  }
  const key = atob(id);
  const cmd = new HeadObjectCommand({
    Key: key,
    Bucket: process.env.BUCKET,
  });
  let response;
  try {
    response = await client.send(cmd);
  } catch (e) {
    return createError({
      statusCode: 404,
      statusMessage: "object not found"
    })
  }
  return {
    uploadDate: response.LastModified,
    size: response.ContentLength,
    type: response.ContentType,
    name: key,
  };
});
