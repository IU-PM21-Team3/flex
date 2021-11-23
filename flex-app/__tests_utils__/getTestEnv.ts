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

export function testWithTestEnv(
  testName: string,
  testFunc: (testEnv: RulesTestEnvironment) => void | Promise<unknown>,
  projectId?: string,
  rulesText?: string,
  rulesFilePath?: string,
  encoding?: BufferEncoding
) {
  test(testName, () => {
    let testEnv: RulesTestEnvironment | undefined = undefined;

    return getTestEnv(projectId, rulesText, rulesFilePath, encoding)
      .then((v) => {
        testEnv = v;
        return testFunc(v);
      }).
      finally(() => testEnv?.cleanup());
  });
}
