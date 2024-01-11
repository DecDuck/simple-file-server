import { GetObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { client } from "~/server/client";

export default defineEventHandler(async (h3) => {
  const id = h3.context.params?.id;
  if (!id) {
    return createError({ statusCode: 400, statusMessage: "invalid id" });
  }
  const key = atob(id);
  const cmd = new GetObjectCommand({
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
  appendHeader(h3, "Content-Disposition", `inline; filename="${key}"`);
  appendHeader(h3, "Content-Length", `${response.ContentLength}`);
  appendHeader(h3, "Content-Type", response.ContentType + "");
  return response.Body?.transformToWebStream();
});
