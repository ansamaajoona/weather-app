
/* 
    Third party libraries
*/
import {
    WiDaySunny,
    WiCloud,
    WiCloudy,
    WiShowers,
    WiRain,
    WiThunderstorm,
    WiSnow,
    WiFog,
    WiSmoke,
    WiTornado,
    WiHurricane,
    WiNightClear,
    WiNightCloudy,
    WiNightShowers,
    WiNightRain,
    WiNightThunderstorm,
    WiNightSnow,
} from 'react-icons/wi';

interface IWeatherIconsProps {
    weatherCode: number;
    size: number
}
interface IIconMapping {
    [key: number]: JSX.Element;
}


export default function WeatherIcons({ weatherCode, size }: IWeatherIconsProps): JSX.Element {

    const iconMapping: IIconMapping = {
        1: <WiDaySunny size={size} />,              // Clear sky
        2: <WiCloud size={size} />,                 // Partly cloudy
        3: <WiCloudy size={size} />,                // Cloudy
        4: <WiShowers size={size} />,               // Showers
        5: <WiRain size={size} />,                  // Rain
        6: <WiThunderstorm size={size} />,          // Thunderstorm
        7: <WiSnow size={size} />,                  // Snow
        8: <WiFog size={size} />,                   // Fog
        9: <WiSmoke size={size} />,                 // Smoke
        10: <WiTornado size={size} />,              // Tornado
        11: <WiHurricane size={size} />,            // Hurricane
        12: <WiNightClear size={size} />,           // Clear sky (night)
        13: <WiNightCloudy size={size} />,          // Partly cloudy (night)
        14: <WiNightShowers size={size} />,         // Showers (night)
        15: <WiNightRain size={size} />,            // Rain (night)
        16: <WiNightThunderstorm size={size} />,    // Thunderstorm (night)
        17: <WiNightSnow size={size} />,            // Snow (night)
    };

    const defaultIcon = <WiDaySunny size={size} />;

    return iconMapping[weatherCode] || defaultIcon;
}