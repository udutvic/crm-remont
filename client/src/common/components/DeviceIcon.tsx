import type { FC } from "react";

import BrandIcon from "./BrandIcon";

interface DeviceIconProps {
  brand?: string;
  size?: "small" | "medium" | "large";
  color?: string;
}

const DeviceIcon: FC<DeviceIconProps> = (props) => (
  <BrandIcon {...props} />
);

export default DeviceIcon;
