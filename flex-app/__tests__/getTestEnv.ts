import { initializeTestEnvironment, RulesTestEnvironment } from "@firebase/rules-unit-testing";
import fs from "fs";

export function getTestEnv(projectId?: string, rulesText?: string, rulesFilePath?: string, encoding?: BufferEncoding): Promise<RulesTestEnvironment> {
  return initializeTestEnvironment({
    projectId: "demo-" + (
      projectId ?? Math.floor(Math.random() * Math.pow(10, 8)).toString()
    ),
    firestore: {
      host: "localhost",
      port: 8080,
      rules: rulesText ?? fs.readFileSync(
        rulesFilePath ?? "../flex-firestore/firestore.rules",
        encoding ?? "utf-8"
      )
    }
  });
}
