import React, { useEffect, useState } from "react";
import {
  PermissionsAndroid,
  NativeModules,
  NativeEventEmitter,
  Platform,
} from "react-native";
import IBeaconTilt from "./IBeaconTilt";

interface Tilt {
  startScan(): void;
  temperature?: number | null;
  gravity?: number | null;
  device?: string | null;
  scanning?: boolean | null;
}

export function useTilt(): Tilt {
  const [temperature, setTemperature] = useState<number | null>(null);
  const [gravity, setGravity] = useState<number | null>(null);
  const [device, setDevice] = useState<string | null>(null);
  const [scanning, setScanning] = useState<boolean | null>(false);

  const startScan = async () => {
    const allowed = await requestPermissions();

    if (allowed) {
      console.log("Scanning...");
      setScanning(true);

      IBeaconTilt.startScanning(
        data => {},
        error => {
          setScanning(false);
          console.error("Scan error:", error);
        },
      );
    }
  };

  useEffect(() => {
    const eventEmitter = new NativeEventEmitter(NativeModules.IBeacon);
    let eventListener = eventEmitter.addListener("onScanResults", event => {
      if (event.device) {
        console.log(`iBeacon data:`, event);
        setDevice(event.device);
        setTemperature(event.temperature);
        setGravity(event.gravity);
      }
    });

    return () => {
      IBeaconTilt.stopScanning();
      eventListener.remove();
    };
  }, []);

  const requestAndroidPermissions = async () => {
    const bluetoothScanPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      {
        title: "Scan Permission",
        message: "Bluetooth Low Energy requires Scan",
        buttonPositive: "OK",
      },
    );
    const bluetoothConnectPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      {
        title: "Connect Permission",
        message: "Bluetooth Low Energy requires Connect",
        buttonPositive: "OK",
      },
    );
    const fineLocationPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      },
    );

    const coarseLocationPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Coarse Location",
        buttonPositive: "OK",
      },
    );

    return (
      bluetoothScanPermission === "granted" &&
      bluetoothConnectPermission === "granted" &&
      fineLocationPermission === "granted" &&
      coarseLocationPermission === "granted"
    );
  };

  const requestPermissions = async (): Promise<boolean> => {
    return new Promise(async function (resolve, reject) {
      if (Platform.OS === "android") {
        const allowed = await requestAndroidPermissions();

        resolve(allowed);
      }
    });
  };

  return { startScan, scanning, temperature, gravity, device };
}
