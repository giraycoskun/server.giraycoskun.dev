import express from "express";
import crypto from "crypto";
import { exec } from "child_process";

const app = express();
const SECRET = process.env.WEBHOOK_SECRET!;
const PORT = process.env.PORT || 9000;

if (!SECRET) {
  throw new Error("WEBHOOK_SECRET environment variable is required");
}

app.use(express.json({
  verify: (req: express.Request & { rawBody?: Buffer }, _res: any, buf: Buffer) => {
    req.rawBody = buf;
  }
}));

function verifySignature(req: express.Request & { rawBody?: Buffer }) {
  const signature = req.headers["x-hub-signature-256"] as string | undefined;
  if (!signature) return false;

  const hmac = crypto.createHmac("sha256", SECRET);
  hmac.update(req.rawBody!);
  const digest = "sha256=" + hmac.digest("hex");

  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
}

app.post("/webhook", (req, res) => {
  if (!verifySignature(req)) {
    return res.status(403).send("Invalid signature");
  }

  // Run deploy script
  exec("./deploy.sh", (err, stdout, stderr) => {
    console.log("Deploy script executed.");
    if (err) {
      console.error(`Error executing deploy script: ${err}`);
      return;
    }
    console.log(stdout);
    console.log(stderr);
  });

  res.send("OK");
});

app.get("/webhook/health", (_req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

console.log("Current working directory:", process.cwd());
app.listen(PORT, () => console.log(`Webhook server running on port ${PORT}`));
//export WEBHOOK_SECRET="your-actual-secret"