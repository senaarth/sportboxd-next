import { S3 } from "@aws-sdk/client-s3";

const s3 = new S3({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
  region: "us-east-1",
});

async function uploadToS3(stream: Buffer, key: string) {
  s3.putObject(
    {
      Bucket: "yeon",
      Key: key,
      Body: stream,
    },
    (err: unknown) => {
      console.log(err);
    }
  );
}

async function alreadyCreatedPreview(key: string) {
  try {
    const obj = await s3.getObject({
      Bucket: "yeon",
      Key: "teste1.png",
    });

    // @ts-ignore
    return obj.Body.statusMessage === "OK";
  } catch {
    return false;
  }
}

export { uploadToS3, alreadyCreatedPreview };
