# Simple File Server
Connects to S3 storage and acts as a simple proxy/viewer.

## Connecting
Create an .env file with:
```
ACCESS_ID=
ACCESS_KEY=
ENDPOINT=
BUCKET=
```

## Using
Any file that's uploaded to the bucket can be downloaded. Simple encode the filename with Base64 and use the url:
`[your instance url]/[base64]/`