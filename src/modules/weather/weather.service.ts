import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class WeatherService {
  private readonly logger = new Logger(WeatherService.name);

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async getCurrentWeather(latitude: number, longitude: number) {
    const cached = await this.prisma.weatherCache.findUnique({
      where: { latitude_longitude: { latitude, longitude } },
    });

    if (cached && cached.expiresAt > new Date()) {
      return JSON.parse(cached.data);
    }

    const apiKey = this.configService.get('weather.apiKey');
    if (!apiKey || apiKey === 'your-weather-api-key') {
      return this.getMockWeather(latitude, longitude);
    }

    try {
      const url = `${this.configService.get('weather.apiUrl')}/current.json?key=${apiKey}&q=${latitude},${longitude}&aqi=no`;
      const response = await fetch(url);
      const data = await response.json();

      await this.prisma.weatherCache.upsert({
        where: { latitude_longitude: { latitude, longitude } },
        update: {
          data: JSON.stringify(data),
          expiresAt: new Date(Date.now() + 30 * 60 * 1000),
        },
        create: {
          location: `${latitude},${longitude}`,
          latitude,
          longitude,
          data: JSON.stringify(data),
          expiresAt: new Date(Date.now() + 30 * 60 * 1000),
        },
      });

      return data;
    } catch (error) {
      this.logger.error('Failed to fetch weather data', error);
      return this.getMockWeather(latitude, longitude);
    }
  }

  async getForecast(latitude: number, longitude: number, days: number = 3) {
    const apiKey = this.configService.get('weather.apiKey');
    if (!apiKey || apiKey === 'your-weather-api-key') {
      return this.getMockForecast(latitude, longitude, days);
    }

    try {
      const url = `${this.configService.get('weather.apiUrl')}/forecast.json?key=${apiKey}&q=${latitude},${longitude}&days=${days}&aqi=no`;
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      this.logger.error('Failed to fetch forecast data', error);
      return this.getMockForecast(latitude, longitude, days);
    }
  }

  async getHistorical(latitude: number, longitude: number, date: string) {
    return this.getMockHistorical(latitude, longitude, date);
  }

  private getMockWeather(latitude: number, longitude: number) {
    return {
      location: { name: 'Mock Location', lat: latitude, lon: longitude },
      current: {
        temp_c: 28,
        humidity: 65,
        condition: { text: 'Partly cloudy', icon: '//cdn.weatherapi.com/weather/64x64/day/116.png' },
        wind_kph: 12,
        precip_mm: 0,
        uv: 6,
      },
    };
  }

  private getMockForecast(latitude: number, longitude: number, days: number) {
    const forecastDays = Array.from({ length: days }, (_, i) => ({
      date: new Date(Date.now() + i * 86400000).toISOString().split('T')[0],
      day: {
        maxtemp_c: 32 + Math.random() * 5,
        mintemp_c: 22 + Math.random() * 3,
        avgtemp_c: 27 + Math.random() * 4,
        daily_chance_of_rain: Math.floor(Math.random() * 80),
        condition: { text: 'Sunny', icon: '//cdn.weatherapi.com/weather/64x64/day/113.png' },
      },
    }));

    return {
      location: { name: 'Mock Location', lat: latitude, lon: longitude },
      forecast: { forecastday: forecastDays },
    };
  }

  private getMockHistorical(latitude: number, longitude: number, date: string) {
    return {
      location: { name: 'Mock Location', lat: latitude, lon: longitude },
      forecast: {
        forecastday: [{
          date,
          day: {
            maxtemp_c: 30,
            mintemp_c: 20,
            avgtemp_c: 25,
            condition: { text: 'Clear', icon: '' },
          },
        }],
      },
    };
  }
}
