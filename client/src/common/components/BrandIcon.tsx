import React from 'react';
import { Box } from '@mui/material';
import { 
  SiApple, 
  SiSamsung, 
  SiXiaomi, 
  SiGoogle, 
  SiOneplus, 
  SiHuawei, 
  SiSony, 
  SiMotorola, 
  SiLg, 
  SiNokia, 
  SiAsus, 
  SiLenovo, 
  SiHp, 
  SiDell, 
  SiAcer,  
  SiNintendo, 
  SiPlaystation,
  SiOppo,
  SiVivo,
  SiRealm,
  SiBlackberry,
  SiHonor
} from 'react-icons/si';
interface BrandIconProps {
  brand?: string;
  size?: 'small' | 'medium' | 'large';
  color?: string;
}
const brandColors: Record<string, string> = {
  'Apple': '#A2AAAD',
  'Samsung': '#1428A0',
  'Xiaomi': '#FF6700',
  'Huawei': '#CF0A2C',
  'Sony': '#000000',
  'Google': '#4285F4',
  'OnePlus': '#EB0028',
  'Motorola': '#5C2D91',
  'LG': '#A50034',
  'Nokia': '#124191',
  'Asus': '#00A2E1',
  'Lenovo': '#E2231A',
  'HP': '#0096D6',
  'Dell': '#007DB8',
  'Acer': '#83B81A',
  'Microsoft': '#737373',
  'Nintendo': '#E60012',
  'Playstation': '#003791'
};
const BrandIcon: React.FC<BrandIconProps> = ({ brand = '', size = 'medium', color }) => {
  const sizeValue = size === 'small' ? '1.2rem' : size === 'large' ? '2rem' : '1.5rem';
  const normalizedBrand = brand.toLowerCase();
  const getFormattedBrand = (brand: string): string => {
    const brandMap: Record<string, string> = {
      'apple': 'Apple',
      'samsung': 'Samsung',
      'xiaomi': 'Xiaomi',
      'google': 'Google',
      'oneplus': 'OnePlus',
      'huawei': 'Huawei',
      'sony': 'Sony',
      'motorola': 'Motorola',
      'lg': 'LG',
      'nokia': 'Nokia',
      'asus': 'Asus',
      'lenovo': 'Lenovo',
      'hp': 'HP',
      'dell': 'Dell',
      'acer': 'Acer',
      'microsoft': 'Microsoft',
      'nintendo': 'Nintendo',
      'playstation': 'PlayStation',
      'oppo': 'Oppo',
      'vivo': 'Vivo',
      'realme': 'Realme',
      'blackberry': 'BlackBerry',
      'honor': 'Honor'
    };
    return brandMap[brand] || brand;
  };
  const formattedBrand = getFormattedBrand(normalizedBrand);
  const iconColor = color || brandColors[formattedBrand] || '#757575';
  const getBrandIcon = () => {
    switch (normalizedBrand) {
      case 'apple':
        return <SiApple />;
      case 'samsung':
        return <SiSamsung />;
      case 'xiaomi':
        return <SiXiaomi />;
      case 'google':
        return <SiGoogle />;
      case 'oneplus':
        return <SiOneplus />;
      case 'huawei':
        return <SiHuawei />;
      case 'sony':
        return <SiSony />;
      case 'motorola':
        return <SiMotorola />;
      case 'lg':
        return <SiLg />;
      case 'nokia':
        return <SiNokia />;
      case 'asus':
        return <SiAsus />;
      case 'lenovo':
        return <SiLenovo />;
      case 'hp':
        return <SiHp />;
      case 'dell':
        return <SiDell />;
      case 'acer':
        return <SiAcer />;      
      case 'nintendo':
        return <SiNintendo />;
      case 'playstation':
        return <SiPlaystation />;
      case 'oppo':
        return <SiOppo />;
      case 'vivo':
        return <SiVivo />;
      case 'realme':
        return <SiRealm />;
      case 'blackberry':
        return <SiBlackberry />;    
      case 'honor':
        return <SiHonor />;
      default:
        return (
          <svg viewBox="0 0 320 512" width="1em" height="1em" fill="currentColor">
            <path d="M272 0H48C21.5 0 0 21.5 0 48v416c0 26.5 21.5 48 48 48h224c26.5 0 48-21.5 48-48V48c0-26.5-21.5-48-48-48zM160 480c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm112-108c0 6.6-5.4 12-12 12H60c-6.6 0-12-5.4-12-12V60c0-6.6 5.4-12 12-12h200c6.6 0 12 5.4 12 12v312z"/>
          </svg>
        );
    }
  };
  return (
    <Box 
      component="span" 
      sx={{ 
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: iconColor,
        fontSize: sizeValue
      }}
    >
      {getBrandIcon()}
    </Box>
  );
};
export default BrandIcon;