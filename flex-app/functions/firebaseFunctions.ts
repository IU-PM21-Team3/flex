import { region, RuntimeOptions } from "firebase-functions";
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

const runtimeOpts: RuntimeOptions = {
  minInstances: 1,
  memory: "1GB"
};

export const nextjsFunc = region("asia-northeast1").runWith(runtimeOpts).https.onRequest((req, res) => nextjsServer.prepare().then(() => nextjsHandle(req, res)));

export default nextjsFunc;
