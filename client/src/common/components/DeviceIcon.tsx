import React from "react";
import BrandIcon from "./BrandIcon";
interface DeviceIconProps {
  brand?: string;
  size?: "small" | "medium" | "large";
  color?: string;
}
const DeviceIcon: React.FC<DeviceIconProps> = ({ brand = "", size = "medium", color }) => {
  const normalizedBrand = normalizeBrandName(brand);  
  return <BrandIcon brand={normalizedBrand} size={size} color={color} />;
};
const normalizeBrandName = (brand: string): string => {
  if (!brand) return "";  
  const brandLower = brand.toLowerCase();  
  const knownBrands: Record<string, string> = {
    "apple": "Apple",
    "samsung": "Samsung",
    "xiaomi": "Xiaomi",
    "google": "Google",
    "oneplus": "OnePlus",
    "huawei": "Huawei",
    "sony": "Sony",
    "motorola": "Motorola",
    "lg": "LG",
    "nokia": "Nokia",
    "asus": "Asus",
    "lenovo": "Lenovo",
    "hp": "HP",
    "dell": "Dell",
    "acer": "Acer",
    "microsoft": "Microsoft",
    "nintendo": "Nintendo",
    "playstation": "PlayStation",
    "oppo": "Oppo",
    "vivo": "Vivo",
    "realme": "Realme",
    "blackberry": "BlackBerry",
    "honor": "Honor"
  };  
  return knownBrands[brandLower] || brand;
};
export default DeviceIcon;
