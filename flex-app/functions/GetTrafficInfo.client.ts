import { IOdptTrainInformation, /* fromIOdptTrainInformationArrWithString */ } from "./GetTrafficInfo.type";

const API_KEY = "eeb79adabbb87d6aefdd93ebbde513a95cd99e6634405c84fa99fbbb060a671f";
const TRAFFIC_INFO_KEY = "odpt:TrainInformation";
const BASE_URL = "https://api.odpt.org";

export async function getTrafficInfo(): Promise<IOdptTrainInformation<Date>[] | null> {
  return fetch(BASE_URL + "/api/v4/" + TRAFFIC_INFO_KEY + "?acl:consumerKey=" + API_KEY).then((v) => v.json() as unknown as IOdptTrainInformation<Date>[]);
}
