// const { https } = require("firebase-functions");
import { https } from "firebase-functions";
// const next = require("next");
import next from "next";
import nextConfig from "../next.config";

const nextjsDistDir = nextConfig.distDir;

const nextjsServer = next({
  dev: false,
  conf: {
    distDir: nextjsDistDir,
  },
});

const nextjsHandle = nextjsServer.getRequestHandler();

export const nextjsFunc = https.onRequest((req, res) => nextjsServer.prepare().then(() => nextjsHandle(req, res)));

// module.exports = nextjsFunc;
export default nextjsFunc;
