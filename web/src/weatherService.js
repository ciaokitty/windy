import { format } from 'date-fns';

const FORECAST_API = 'https://api.open-meteo.com/v1/forecast';
const ARCHIVE_API = 'https://archive-api.open-meteo.com/v1/archive';

export async function fetchWindData(lat, lng, date) {
    // Determine if we need historical or forecast data
    const today = new Date();
    today.setHours(0, 0, 0, 0); // normalize

    // Simple check: if date is before today, use archive. Else (today or future), use forecast.
    // Note: Archive API usually has a lag of 5-10 days. 
    // For simplicity, let's say anything older than 7 days is archive, else forecast.
    const diffDays = (today - date) / (1000 * 60 * 60 * 24);
    const isArchive = diffDays > 5;

    // Open-Meteo requires YYYY-MM-DD
    const dateStr = format(date, 'yyyy-MM-dd');

    try {
        let url;
        if (isArchive) {
            // ARCHIVE
            // fetching hourly data for that day, we'll try to get the noon value or daily mean
            // For simplicity, let's grab daily max windspeed to be dramatic, or hourly at 12:00
            url = `${ARCHIVE_API}?latitude=${lat}&longitude=${lng}&start_date=${dateStr}&end_date=${dateStr}&hourly=wind_speed_10m,wind_direction_10m`;
        } else {
            // FORECAST
            // If it's today or future
            // Note: Forecast API might not support far future (only 14 days usually). 
            // For >14 days future, we might need a different strategy (historical average?)
            // For MVP, we'll just hit the forecast API and hope for the best or fallback.
            url = `${FORECAST_API}?latitude=${lat}&longitude=${lng}&current=wind_speed_10m,wind_direction_10m&hourly=wind_speed_10m,wind_direction_10m&start_date=${dateStr}&end_date=${dateStr}`;
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error('Weather API error');
        const data = await response.json();

        // Extract relevant data point
        let result = { speed: 0, direction: 0, locationName: '' };

        if (!isArchive && data.current) {
            result.speed = data.current.wind_speed_10m;
            result.direction = data.current.wind_direction_10m;
        } else if (data.hourly) {
            const noonIndex = 12;
            if (data.hourly.wind_speed_10m && data.hourly.wind_speed_10m[noonIndex] !== undefined) {
                result.speed = data.hourly.wind_speed_10m[noonIndex];
                result.direction = data.hourly.wind_direction_10m[noonIndex];
            }
        }

        // Reverse Geocoding to get location name
        // We do this in parallel or after. Check if we can just do one call.
        // Nominatim for reverse geocoding
        try {
            const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            if (geoRes.ok) {
                const geoData = await geoRes.json();
                // address parts: city, town, village, country
                const address = geoData.address || {};
                const city = address.city || address.town || address.village || address.hamlet || address.state_district;
                const country = address.country;
                result.locationName = city ? `${city}, ${country}` : country || "Unknown Location";
            }
        } catch (e) {
            console.warn("Geocoding failed", e);
            result.locationName = "Unknown Location";
        }

        return result;

    } catch (error) {
        console.error("Failed to fetch wind data", error);
        return { speed: 0, direction: 0, error: true, locationName: "Error" };
    }
}
