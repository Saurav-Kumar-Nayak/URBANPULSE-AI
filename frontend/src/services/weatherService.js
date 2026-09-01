import axios from 'axios';
import { api } from './api';

// Helper: Convert degrees to cardinal wind direction
const getCardinalDirection = (deg) => {
  if (deg === undefined || deg === null) return 'N';
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((deg % 360) / 22.5) % 16;
  return directions[index];
};

// Helper: Map WMO Weather Code to Condition & Icon
const mapWmoCode = (code) => {
  switch (code) {
    case 0:
      return { condition: 'Clear Sky', icon: 'sun', riskFactor: 0 };
    case 1:
      return { condition: 'Mainly Clear', icon: 'sun-cloud', riskFactor: 0 };
    case 2:
      return { condition: 'Partly Cloudy', icon: 'sun-cloud', riskFactor: 0 };
    case 3:
      return { condition: 'Overcast', icon: 'cloud', riskFactor: 5 };
    case 45:
    case 48:
      return { condition: 'Fog / Haze', icon: 'cloud-fog', riskFactor: 15 };
    case 51:
    case 53:
    case 55:
      return { condition: 'Light Drizzle', icon: 'rain', riskFactor: 15 };
    case 61:
    case 63:
      return { condition: 'Moderate Rain', icon: 'rain', riskFactor: 25 };
    case 65:
      return { condition: 'Heavy Rain', icon: 'rain', riskFactor: 40 };
    case 66:
    case 67:
      return { condition: 'Freezing Rain', icon: 'rain', riskFactor: 45 };
    case 71:
    case 73:
    case 75:
    case 77:
      return { condition: 'Snowfall', icon: 'snow', riskFactor: 35 };
    case 80:
    case 81:
    case 82:
      return { condition: 'Rain Showers', icon: 'rain', riskFactor: 30 };
    case 95:
      return { condition: 'Thunderstorm', icon: 'thunder', riskFactor: 55 };
    case 96:
    case 99:
      return { condition: 'Severe Thunderstorm', icon: 'thunder', riskFactor: 70 };
    default:
      return { condition: 'Partly Cloudy', icon: 'sun-cloud', riskFactor: 0 };
  }
};

// Helper: AQI Category from US EPA standard
export const getAqiCategory = (aqi) => {
  if (aqi <= 50) return { label: 'Good', color: '#34d399' };
  if (aqi <= 100) return { label: 'Moderate', color: '#f59e0b' };
  if (aqi <= 150) return { label: 'Unhealthy for Sensitive Groups', color: '#f97316' };
  if (aqi <= 200) return { label: 'Unhealthy', color: '#ef4444' };
  if (aqi <= 300) return { label: 'Very Unhealthy', color: '#a855f7' };
  return { label: 'Hazardous', color: '#e11d48' };
};

// Helper: UV Category
export const getUvCategory = (uv) => {
  if (uv <= 2) return { label: 'Low', color: '#34d399' };
  if (uv <= 5) return { label: 'Moderate', color: '#f59e0b' };
  if (uv <= 7) return { label: 'High', color: '#f97316' };
  if (uv <= 10) return { label: 'Very High', color: '#ef4444' };
  return { label: 'Extreme', color: '#a855f7' };
};

// Helper: Calculate deterministic Weather Risk
export const calculateWeatherRisk = (weatherData) => {
  let score = 10;
  const factors = [];

  const temp = weatherData.tempC;
  const wind = weatherData.windKmh;
  const precip = weatherData.precipMm || 0;
  const aqi = weatherData.aqi || 50;
  const wmoRisk = weatherData.wmoRiskFactor || 0;

  score += wmoRisk;

  if (precip > 15) {
    score += 35;
    factors.push('Heavy Torrential Precipitation');
  } else if (precip > 5) {
    score += 20;
    factors.push('Moderate Rainfall Accumulation');
  }

  if (wind > 45) {
    score += 35;
    factors.push('Severe High Wind Gusts (>45 km/h)');
  } else if (wind > 28) {
    score += 15;
    factors.push('Breezy / Strong Wind Conditions');
  }

  if (temp > 40) {
    score += 25;
    factors.push('Extreme Thermal Exposure (Heatwave >40°C)');
  } else if (temp < 2) {
    score += 25;
    factors.push('Near Freezing Sub-Zero Temperatures');
  }

  if (aqi > 150) {
    score += 25;
    factors.push('Unhealthy Atmospheric Air Quality Index');
  }

  const finalScore = Math.min(100, Math.max(5, Math.round(score)));

  let rating = 'LOW';
  let color = '#34d399';
  let desc = 'No Adverse Warnings';

  if (finalScore >= 75) {
    rating = 'CRITICAL';
    color = '#ef4444';
    desc = 'Severe Severe Meteorological Hazard';
  } else if (finalScore >= 50) {
    rating = 'HIGH';
    color = '#f97316';
    desc = 'Adverse Weather Conditions';
  } else if (finalScore >= 30) {
    rating = 'MODERATE';
    color = '#f59e0b';
    desc = 'Elevated Weather Alert';
  }

  return { score: finalScore, rating, color, desc, factors };
};

// Main Weather Service Object
export const weatherService = {
  // 1. Fetch Real Weather & Air Quality Telemetry from Open-Meteo
  fetchWeatherData: async (lat, lng, locationName = 'Selected City') => {
    try {
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,weather_code,surface_pressure,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&timezone=auto`;
      
      const airQualityUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lng}&current=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,uv_index,european_aqi,us_aqi&hourly=pm10,pm2_5,uv_index,us_aqi,temperature_2m&timezone=auto`;

      const [weatherRes, aqRes] = await Promise.all([
        axios.get(weatherUrl, { timeout: 8000 }),
        axios.get(airQualityUrl, { timeout: 8000 }).catch(() => null) // Fallback if AQ fails
      ]);

      const wData = weatherRes.data;
      const cur = wData.current || {};
      const hourly = wData.hourly || {};
      const daily = wData.daily || {};

      const aqCur = aqRes?.data?.current || {};
      const aqHourly = aqRes?.data?.hourly || {};

      const wmoInfo = mapWmoCode(cur.weather_code || 0);

      // Current Weather Metrics
      const tempC = Math.round((cur.temperature_2m ?? 23.4) * 10) / 10;
      const feelsC = Math.round((cur.apparent_temperature ?? tempC) * 10) / 10;
      const humidity = Math.round(cur.relative_humidity_2m ?? 58);
      const windKmh = Math.round(cur.wind_speed_10m ?? 14);
      const windDir = getCardinalDirection(cur.wind_direction_10m ?? 220);
      const windGust = Math.round(cur.wind_gusts_10m ?? (windKmh * 1.4));
      const pressure = Math.round(cur.pressure_msl ?? cur.surface_pressure ?? 1012);
      const precipMm = Math.round((cur.precipitation ?? 0) * 10) / 10;
      
      // Visibility estimation (km)
      const cloudCover = cur.cloud_cover ?? 30;
      let visibility = 10.0;
      if (cur.weather_code === 45 || cur.weather_code === 48) visibility = 1.5;
      else if (precipMm > 10) visibility = 4.0;
      else if (humidity > 85) visibility = 7.5;

      // Air Quality & UV
      const rawAqi = aqCur.us_aqi ?? Math.round((aqCur.pm2_5 || 18) * 2.2);
      const aqi = Math.max(15, Math.min(500, Math.round(rawAqi || 58)));
      const pm25 = Math.round((aqCur.pm2_5 ?? 18.4) * 10) / 10;
      const pm10 = Math.round((aqCur.pm10 ?? 42.1) * 10) / 10;
      const uvIndex = Math.max(0, Math.min(15, Math.round(aqCur.uv_index ?? (cur.is_day ? 4 : 0))));

      // Hourly Forecast (Next 12 hours)
      const hourlyList = [];
      if (hourly.time && hourly.time.length > 0) {
        const nowIndex = 0;
        for (let i = nowIndex; i < Math.min(nowIndex + 11, hourly.time.length); i++) {
          const rawTime = hourly.time[i];
          const dt = new Date(rawTime);
          const timeStr = i === nowIndex ? 'Now' : dt.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
          const hWmo = mapWmoCode(hourly.weather_code ? hourly.weather_code[i] : 0);
          hourlyList.push({
            time: timeStr,
            temp: Math.round(hourly.temperature_2m ? hourly.temperature_2m[i] : tempC),
            icon: hWmo.icon,
            pop: Math.round(hourly.precipitation_probability ? hourly.precipitation_probability[i] : 10),
            condition: hWmo.condition
          });
        }
      }

      // 7-Day Daily Forecast
      const sevenDayList = [];
      if (daily.time && daily.time.length > 0) {
        for (let i = 0; i < Math.min(7, daily.time.length); i++) {
          const dt = new Date(daily.time[i]);
          const dayName = dt.toLocaleDateString('en-US', { weekday: 'short', day: '2-digit' });
          const dWmo = mapWmoCode(daily.weather_code ? daily.weather_code[i] : 0);
          sevenDayList.push({
            day: dayName,
            high: Math.round(daily.temperature_2m_max ? daily.temperature_2m_max[i] : tempC + 4),
            low: Math.round(daily.temperature_2m_min ? daily.temperature_2m_min[i] : tempC - 4),
            pop: Math.round(daily.precipitation_probability_max ? daily.precipitation_probability_max[i] : 20),
            condition: dWmo.icon,
            conditionText: dWmo.condition
          });
        }
      }

      // 24H AQI / Weather Correlation Chart Data
      const correlationList = [];
      if (aqHourly.time && aqHourly.time.length >= 24) {
        for (let i = 0; i < 24; i += 3) {
          const dt = new Date(aqHourly.time[i]);
          const timeStr = dt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
          correlationList.push({
            time: timeStr,
            aqi: Math.round(aqHourly.us_aqi ? aqHourly.us_aqi[i] : aqi),
            pm25: Math.round(aqHourly.pm2_5 ? aqHourly.pm2_5[i] : pm25),
            temp: Math.round(aqHourly.temperature_2m ? aqHourly.temperature_2m[i] : tempC)
          });
        }
      } else {
        // Generate correlation points around real current values
        const hours = ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'];
        hours.forEach((t, idx) => {
          const factor = Math.sin(idx) * 0.2;
          correlationList.push({
            time: t,
            aqi: Math.round(aqi * (1 + factor)),
            pm25: Math.round(pm25 * (1 + factor)),
            temp: Math.round(tempC + (idx > 3 && idx < 6 ? 4 : -2))
          });
        });
      }

      const riskObj = calculateWeatherRisk({
        tempC,
        windKmh,
        precipMm,
        aqi,
        wmoRiskFactor: wmoInfo.riskFactor
      });

      // Build Advisories dynamically from metrics
      const advisories = [];
      const nowTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      
      if (cur.weather_code === 95 || cur.weather_code === 96 || cur.weather_code === 99) {
        advisories.push({
          title: 'Thunderstorm Advisory',
          msg: 'Active convective thunderstorms in sector. Take precautions for lightning and gusty winds.',
          severity: 'High',
          color: '#ef4444',
          time: nowTime
        });
      }
      if (precipMm > 5 || (daily.precipitation_probability_max && daily.precipitation_probability_max[0] > 60)) {
        advisories.push({
          title: 'Precipitation Alert',
          msg: `Rainfall expected (${precipMm}mm active). Urban drainage monitoring advised.`,
          severity: 'Moderate',
          color: '#f59e0b',
          time: nowTime
        });
      }
      if (tempC > 35) {
        advisories.push({
          title: 'Extreme Heat Index Advisory',
          msg: `Ambient temperature reached ${tempC}°C. High hydration and cooling recommendations active.`,
          severity: 'Moderate',
          color: '#f59e0b',
          time: nowTime
        });
      }
      if (aqi > 100) {
        advisories.push({
          title: 'Air Quality Warning',
          msg: `AQI index elevated (${aqi} - ${getAqiCategory(aqi).label}). Sensitive groups should limit exposure.`,
          severity: aqi > 150 ? 'High' : 'Moderate',
          color: aqi > 150 ? '#ef4444' : '#f59e0b',
          time: nowTime
        });
      }
      if (windKmh > 30) {
        advisories.push({
          title: 'High Wind Velocity Alert',
          msg: `Wind speeds averaging ${windKmh} km/h with gusts to ${windGust} km/h. Secure loose outdoor objects.`,
          severity: 'Moderate',
          color: '#38bdf8',
          time: nowTime
        });
      }
      if (advisories.length === 0) {
        advisories.push({
          title: 'Optimal Meteorological Status',
          msg: 'Atmospheric conditions are stable with zero severe weather advisories in effect.',
          severity: 'Low',
          color: '#34d399',
          time: nowTime
        });
      }

      return {
        success: true,
        source: 'LIVE (Open-Meteo)',
        isLive: true,
        lastUpdated: new Date().toLocaleTimeString('en-US'),
        location: {
          name: locationName,
          lat,
          lng
        },
        current: {
          tempC,
          feelsC,
          humidity,
          windKmh,
          windDir,
          windGust,
          pressure,
          visibility,
          precipMm,
          condition: wmoInfo.condition,
          icon: wmoInfo.icon,
          cloudCover
        },
        aqi: {
          value: aqi,
          pm25,
          pm10,
          category: getAqiCategory(aqi)
        },
        uv: {
          value: uvIndex,
          category: getUvCategory(uvIndex)
        },
        risk: riskObj,
        hourly: hourlyList,
        sevenDay: sevenDayList,
        correlation: correlationList,
        advisories
      };
    } catch (err) {
      console.warn('[WeatherService] Live fetch failed, trying local DB fallback:', err.message);
      return await weatherService.getFallbackData(lat, lng, locationName);
    }
  },

  // 2. Search Locations Worldwide using Open-Meteo Geocoding
  searchLocations: async (query) => {
    if (!query || query.trim().length < 2) return [];
    try {
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=8&language=en&format=json`;
      const res = await axios.get(url, { timeout: 5000 });
      if (res.data && res.data.results) {
        return res.data.results.map(r => ({
          city: r.name,
          region: r.admin1 || r.country || '',
          country: r.country || '',
          lat: r.latitude,
          lng: r.longitude,
          tempC: null,
          condition: 'Search Result'
        }));
      }
      return [];
    } catch (err) {
      console.error('[WeatherService] Search failed:', err);
      return [];
    }
  },

  // 3. Fallback Database Data Pipeline
  getFallbackData: async (lat, lng, locationName) => {
    try {
      const dbLocations = await api.getLocations().catch(() => []);
      const matched = dbLocations.find(l => l.location_name.toLowerCase().includes(locationName.toLowerCase())) || dbLocations[0];

      const tempC = 24.5;
      const humidity = 62;
      const windKmh = 14;
      const aqi = matched ? matched.aqi : 65;
      const pm25 = matched ? matched.pm25 : 22.5;

      const riskObj = calculateWeatherRisk({
        tempC,
        windKmh,
        precipMm: 0,
        aqi,
        wmoRiskFactor: 0
      });

      return {
        success: true,
        source: 'SIMULATED (Database Telemetry)',
        isLive: false,
        lastUpdated: new Date().toLocaleTimeString('en-US'),
        location: {
          name: locationName,
          lat,
          lng
        },
        current: {
          tempC,
          feelsC: 25.2,
          humidity,
          windKmh,
          windDir: 'SW',
          windGust: 20,
          pressure: 1012,
          visibility: 10.0,
          precipMm: 0,
          condition: 'Partly Cloudy',
          icon: 'sun-cloud',
          cloudCover: 40
        },
        aqi: {
          value: aqi,
          pm25,
          pm10: pm25 * 2,
          category: getAqiCategory(aqi)
        },
        uv: {
          value: 3,
          category: getUvCategory(3)
        },
        risk: riskObj,
        hourly: [
          { time: 'Now', temp: 24, icon: 'sun-cloud', pop: 10 },
          { time: '12 PM', temp: 26, icon: 'sun', pop: 10 },
          { time: '3 PM', temp: 27, icon: 'sun', pop: 20 },
          { time: '6 PM', temp: 25, icon: 'sun-cloud', pop: 10 },
          { time: '9 PM', temp: 23, icon: 'cloud', pop: 10 }
        ],
        sevenDay: [
          { day: 'Today', high: 27, low: 21, pop: 10, condition: 'sun-cloud' },
          { day: 'Tomorrow', high: 28, low: 22, pop: 20, condition: 'sun' },
          { day: 'Day 3', high: 26, low: 20, pop: 40, condition: 'rain' }
        ],
        correlation: [
          { time: '00:00', aqi: 50, pm25: 20, temp: 22 },
          { time: '06:00', aqi: 70, pm25: 30, temp: 20 },
          { time: '12:00', aqi: 60, pm25: 25, temp: 27 },
          { time: '18:00', aqi: 55, pm25: 22, temp: 24 }
        ],
        advisories: [
          {
            title: 'Telemetry Operating Normally',
            msg: 'System data served from local municipal database telemetry.',
            severity: 'Low',
            color: '#34d399',
            time: new Date().toLocaleTimeString('en-US')
          }
        ]
      };
    } catch {
      return {
        success: false,
        source: 'UNAVAILABLE',
        isLive: false,
        error: 'Data temporarily unavailable'
      };
    }
  },

  // 4. Fetch Dynamic RainViewer Radar Metadata & Timestamps
  fetchRadarMetadata: async () => {
    try {
      const res = await axios.get('https://api.rainviewer.com/public/weather-maps.json', { timeout: 6000 });
      if (res.data && res.data.host && res.data.radar && res.data.radar.past && res.data.radar.past.length > 0) {
        const host = res.data.host;
        const pastList = res.data.radar.past;
        const latestFrame = pastList[pastList.length - 1];
        const timeAgoMins = Math.max(0, Math.round((Date.now() / 1000 - latestFrame.time) / 60));
        
        return {
          success: true,
          host,
          path: latestFrame.path,
          timestamp: latestFrame.time,
          tileUrlTemplate: `${host}${latestFrame.path}/256/{z}/{x}/{y}/2/1_1.png`,
          timeAgoMinutes: timeAgoMins
        };
      }
      return { success: false, error: 'Radar data missing in API response' };
    } catch (err) {
      console.warn('[WeatherService] RainViewer API fetch failed:', err.message);
      return { success: false, error: 'Radar temporarily unavailable' };
    }
  }
};

export default weatherService;
