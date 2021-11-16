import { getTrafficInfo } from "../functions/GetTrafficInfo.client";

test("getTrafficInfo test", async () => expect((await getTrafficInfo())?.length).toBeGreaterThanOrEqual(1));
