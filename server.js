import express from "express";
import { AppStrategy, createClient } from "@wix/sdk";
import { appInstances } from "@wix/app-management";
const app = express();

// server.ts
//
// Use this sample code to handle webhook events in your
// expressjs typescript server using the Wix SDK package.
// allowing for type checking and auto-completion.
//
// 1) Paste this code into a new file (server.ts)
//
// 2) Install dependencies
//   npm install @wix/sdk
//   npm install @wix/app-management
//   npm install express
//
// 3) Run the server on http://localhost:3000
//   npx ts-node server.ts

// consider loading your public key from a file or an environment variable
const PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA7cn6ZaGD8fQs3RYvfpb0
5YvPizw9DFfJkKkmHWc5pJFeMOeIP9zfhcEOS0dG23bX21vkfx8SW6WytNVk7kg7
YSoBYIk1rLo8FAV0eS3SQJr6P8H27vjYhGuCqghuHgIoj1rbJGe2CQWFUyV/qnKM
tkRs5j2KnCvcpyE4eE75r+TjRK2e7/mZg/Vz9TDWpLT1Xg4SGu5dpgOBAQ2Ethq5
YDO5F8+jJKZP91INrehS0kWtKlFzwPYh01vLDDvgtbnnTpcmE88z1fs6hErhWv1Z
XGVUDv+8wsjMsfKDlGulkWgKKP1HcHmR7uWL2HHCLXPwr7wpxFHl0R65RWaehM4U
7QIDAQAB
-----END PUBLIC KEY-----`;
const APP_ID = "c9903086-07e9-4af7-96cc-4133e5d1ff57";

const client = createClient({
  auth: AppStrategy({
    appId: APP_ID,
    publicKey: PUBLIC_KEY,
  }),
  modules: { appInstances },
});

client.appInstances.onAppInstanceInstalled((event) => {
  console.log(`onAppInstanceInstalled invoked with data:`, event);
  console.log(`App instance ID:`, event.metadata.instanceId);
  //
  // handle your event here
  //
});

app.post("/webhook", express.text(), async (request, response) => {
  try {
    await client.webhooks.process(request.body);
  } catch (err) {
    console.error(err);
    response
      .status(500)
      .send(`Webhook error: ${err instanceof Error ? err.message : err}`);
    return;
  }

  response.status(200).send();
});

app.listen(3000, () => console.log("Server started on port 3000"))
