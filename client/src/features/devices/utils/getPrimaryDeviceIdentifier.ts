import {
  Device,
} from "types";

export type DeviceIdentifierType =
  | "imei1"
  | "imei2"
  | "serial";

export interface DeviceIdentifier {
  type: DeviceIdentifierType;
  value: string;
}

export const getPrimaryDeviceIdentifier =
  (
    device: Device
  ): DeviceIdentifier | null => {
    const imei1 =
      device.imei1?.trim();

    if (imei1) {
      return {
        type: "imei1",
        value: imei1,
      };
    }

    const imei2 =
      device.imei2?.trim();

    if (imei2) {
      return {
        type: "imei2",
        value: imei2,
      };
    }

    const serial =
      device.serial?.trim();

    if (serial) {
      return {
        type: "serial",
        value: serial,
      };
    }

    return null;
  };
