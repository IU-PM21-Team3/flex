import { runWith, RuntimeOptions } from "firebase-functions";
import next from "next";
import nextConfig from "../next.config";

const nextjsServer = next({
  dev: false,
  conf: nextConfig,
});

const nextjsHandle = nextjsServer.getRequestHandler();

const runtimeOpts: RuntimeOptions = {
  minInstances: 0,
};

export const nextjsFunc = runWith(runtimeOpts).https.onRequest((req, res) => nextjsServer.prepare().then(() => nextjsHandle(req, res)));

export default nextjsFunc;
