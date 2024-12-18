import { LoadingSpinner } from "@/components/ui/loading-spinner";
import * as WeatherIcons from "@/components/weathericons";

export const getWeatherIcon = (precipitation: number, temperature: number, cloudcover: number) => {
    // Define conditions and corresponding icons
    const conditions = [
        // Dry Conditions
        { condition: precipitation === 0 && cloudcover < 10, icon: <WeatherIcons.DrySunnyIcon /> },
        { condition: precipitation === 0 && cloudcover >= 10 && cloudcover < 25, icon: <WeatherIcons.DryMostlySunnyIcon /> },
        { condition: precipitation === 0 && cloudcover >= 25 && cloudcover < 50, icon: <WeatherIcons.DryPartlySunnyIcon /> },
        { condition: precipitation === 0 && cloudcover >= 50 && cloudcover < 75, icon: <WeatherIcons.DryMostlyCloudyIcon /> },
        { condition: precipitation === 0 && cloudcover >= 75, icon: <WeatherIcons.DryCloudyIcon /> },

        // Light Rain, Warm
        { condition: precipitation > 0 && precipitation < 2 && temperature > 2 && cloudcover < 50, icon: <WeatherIcons.RainLightPartlySunnyIcon /> },
        { condition: precipitation > 0 && precipitation < 2 && temperature > 2 && cloudcover >= 50 && cloudcover < 75, icon: <WeatherIcons.RainLightMostlyCloudyIcon /> },
        { condition: precipitation > 0 && precipitation < 2 && temperature > 2 && cloudcover >= 75, icon: <WeatherIcons.RainLightCloudyIcon /> },

        // Average Rain, Warm
        { condition: precipitation >= 2 && precipitation < 4 && temperature > 2 && cloudcover < 50, icon: <WeatherIcons.RainAveragePartlySunny /> },
        { condition: precipitation >= 2 && precipitation < 4 && temperature > 2 && cloudcover >= 50 && cloudcover < 75, icon: <WeatherIcons.RainAverageMostlyCloudyIcon /> },
        { condition: precipitation >= 2 && precipitation < 4 && temperature > 2 && cloudcover >= 75, icon: <WeatherIcons.RainAverageCloudyIcon /> },

        // Heavy Rain, Warm
        { condition: precipitation >= 4 && temperature > 2 && cloudcover < 50, icon: <WeatherIcons.RainHeavyPartlySunnyIcon /> },
        { condition: precipitation >= 4 && temperature > 2 && cloudcover >= 50 && cloudcover < 75, icon: <WeatherIcons.RainHeavyMostlyCloudyIcon /> },
        { condition: precipitation >= 4 && temperature > 2 && cloudcover >= 75, icon: <WeatherIcons.RainHeavyCloudyIcon /> },

        // Sleet
        { condition: precipitation > 0 && precipitation < 2 && temperature >= -1 && temperature <= 2 && cloudcover < 75, icon: <WeatherIcons.SleetLightPartlySunnyIcon /> },
        { condition: precipitation > 0 && precipitation < 2 && temperature >= -1 && temperature <= 2 && cloudcover >= 75, icon: <WeatherIcons.SleetLightCloudyIcon /> },
        { condition: precipitation >= 2 && precipitation < 4 && temperature >= -1 && temperature <= 2 && cloudcover < 75, icon: <WeatherIcons.SleetAveragePartlySunny /> },
        { condition: precipitation >= 2 && precipitation < 4 && temperature >= -1 && temperature <= 2 && cloudcover >= 75, icon: <WeatherIcons.SleetAverageCloudyIcon /> },
        { condition: precipitation >= 4 && temperature >= -1 && temperature <= 2 && cloudcover < 75, icon: <WeatherIcons.SleetHeavyPartlySunnyIcon /> },
        { condition: precipitation >= 4 && temperature >= -1 && temperature <= 2 && cloudcover >= 75, icon: <WeatherIcons.SleetHeavyCloudyIcon /> },

        // Snow
        { condition: precipitation > 0 && precipitation < 2 && temperature < -1 && cloudcover < 50, icon: <WeatherIcons.SnowLightPartlySunnyIcon /> },
        { condition: precipitation > 0 && precipitation < 2 && temperature < -1 && cloudcover >= 50 && cloudcover < 75, icon: <WeatherIcons.SnowLightMostlyCloudyIcon /> },
        { condition: precipitation > 0 && precipitation < 2 && temperature < -1 && cloudcover >= 75, icon: <WeatherIcons.SnowLightCloudyIcon /> },
        { condition: precipitation >= 2 && precipitation < 4 && temperature < -1 && cloudcover < 50, icon: <WeatherIcons.SnowAveragePartlySunny /> },
        { condition: precipitation >= 2 && precipitation < 4 && temperature < -1 && cloudcover >= 50 && cloudcover < 75, icon: <WeatherIcons.SnowAverageMostlyCloudyIcon /> },
        { condition: precipitation >= 2 && precipitation < 4 && temperature < -1 && cloudcover >= 75, icon: <WeatherIcons.SnowAverageCloudyIcon /> },
        { condition: precipitation >= 4 && temperature < -1 && cloudcover < 50, icon: <WeatherIcons.SnowHeavyPartlySunnyIcon /> },
        { condition: precipitation >= 4 && temperature < -1 && cloudcover >= 50 && cloudcover < 75, icon: <WeatherIcons.SnowHeavyMostlyCloudyIcon /> },
        { condition: precipitation >= 4 && temperature < -1 && cloudcover >= 75, icon: <WeatherIcons.SnowHeavyCloudyIcon /> },
    ];


    // Find the first matching condition
    const matchedCondition = conditions.find((condition) => condition.condition);

    // Return the corresponding icon or a loading spinner if no match is found
    return matchedCondition ? matchedCondition.icon : <LoadingSpinner />;
};