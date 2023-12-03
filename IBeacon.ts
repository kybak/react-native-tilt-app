import {NativeModules} from 'react-native';

interface IBeacon {
  startScanning(
    callback: (data: any) => void,
    error: (data: any) => void,
  ): void;
  stopScanning: () => void;
  triggerEvent: () => void;
}

const {IBeacon} = NativeModules;

export default IBeacon as IBeacon;
