import { NativeModules } from "react-native";

interface IBeaconTilt {
  startScanning(
    callback: (data: any) => void,
    error: (data: any) => void,
  ): void;
  stopScanning: () => void;
}

const { IBeaconTilt } = NativeModules;

export default IBeaconTilt as IBeaconTilt;
