import { Device } from "types";

export interface DeviceIdentifier {
  label: "IMEI 1" | "IMEI 2" | "Serial number";
  value: string;
}

export const getPrimaryDeviceIdentifier = (
  device: Device
): DeviceIdentifier | null => {
  const imei1 = device.imei1?.trim();

  if (imei1) {
    return {
      label: "IMEI 1",
      value: imei1,
    };
  }

  const imei2 = device.imei2?.trim();

  if (imei2) {
    return {
      label: "IMEI 2",
      value: imei2,
    };
  }

  const serial = device.serial?.trim();

  if (serial) {
    return {
      label: "Serial number",
      value: serial,
    };
  }

  return null;
};