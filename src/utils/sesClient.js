const { SESClient } = require("@aws-sdk/client-ses");

// Set the AWS Region.
const REGION = "eu-north-1";
// Create SES service object.
const sesClient = new SESClient({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS,
    secretAccessKey: process.env.AWS_SECRET,
  },
});
module.exports = { sesClient };
