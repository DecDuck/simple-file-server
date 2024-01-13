import { GetObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { client, getKeyFromHash, hashKey } from "~/server/client";

export default defineEventHandler(async (h3) => {
  const id = h3.context.params?.id;
  if (!id) {
    return createError({ statusCode: 400, statusMessage: "invalid id" });
  }
  if (id.endsWith("==")) {
    const key = atob(id);
    sendRedirect(h3, `/api/v1/${hashKey(key)}/download`, 301);
    return;
  }
  const bucket = process.env.BUCKET;
  if (!bucket) {
    return createError({
      statusCode: 500,
      statusMessage: "BUCKET not set",
    });
  }
  const key = await getKeyFromHash(id, bucket);
  if (!key) {
    return createError({
      statusCode: 404,
      statusMessage: "object with key not found",
    });
  }
  const cmd = new GetObjectCommand({
    Key: key,
    Bucket: bucket,
  });
  let response;
  try {
    response = await client.send(cmd);
  } catch (e) {
    return createError({
      statusCode: 404,
      statusMessage: "object not found",
    });
  }
  appendHeader(h3, "Content-Disposition", `inline; filename="${key}"`);
  appendHeader(h3, "Content-Length", `${response.ContentLength}`);
  appendHeader(h3, "Content-Type", response.ContentType + "");
  return response.Body?.transformToWebStream();
});
