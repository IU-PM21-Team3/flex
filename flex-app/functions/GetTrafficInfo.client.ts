import { httpsCallable } from "firebase/functions";
import { IOdptTrainInformation, /* fromIOdptTrainInformationArrWithString */ } from "../models/GetTrafficInfo.type";
import { MyFirebaseApps } from "../firebase/clientApp";

const functions = MyFirebaseApps.functions;

export async function getTrafficInfo(): Promise<IOdptTrainInformation<Date>[] | null> {
  //const addMessage = httpsCallable<void, IOdptTrainInformation<string>[]>(functions, "GetTrafficInfo");
  const addMessage = httpsCallable(functions, "GetTrafficInfo");
  let returnValue: IOdptTrainInformation<Date>[] = [];

  await addMessage().then(d => {
    //returnValue = fromIOdptTrainInformationArrWithString(d.data);
    console.log(d);
  }).catch(e => {
    console.error(e);
  });

  return returnValue;
}
