import { https } from "firebase-functions";
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

export default nextjsFunc;
