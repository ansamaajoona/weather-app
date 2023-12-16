import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';

/* 
    Mock the fetch function
*/
global.fetch = jest.fn();


/* 
    Sample mock data
*/
const mockData = {
    longitude: 24.9354,
    latitude: 60.1695,
    current: {
        time: '2023-12-15T12:00:00Z',
        temperature_2m: 25,
        wind_speed_10m: 10,
        weather_code: 800,
        precipitation: 0,
        apparent_temperature: 25,
    },
    daily: {
        time: ['2023-12-15'],
        weather_code: [800],
        temperature_2m_max: [30],
        temperature_2m_min: [20],
    },
    hourly: {
        time: ['2023-12-15T12:00:00Z'],
        temperature_2m: [25],
    },
};


/* 
    Setup fetch mock
*/
const setupFetchMock = (data = mockData) => {
    (global.fetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue(data),
    });
};

describe('Weather App Tests', () => {
    beforeEach(() => {
        setupFetchMock();
    });

    test('demo', () => {
        expect(true).toBe(true);
    });

    test('renders the app with default data', async () => {
        render(<App />);
        expect(screen.getByText(/Weather App/i)).toBeInTheDocument();
        expect(screen.getByText(/Current weather/i)).toBeInTheDocument();
        expect(screen.getByText(/Weekly highlight/i)).toBeInTheDocument();
        expect(screen.getByText(/Hourly chart/i)).toBeInTheDocument();
    });

    test('changes temperature unit on button click', async () => {
        render(<App />);
        const temperatureButton = screen.getByText(/°C/i);

        fireEvent.click(temperatureButton);

        await waitFor(() => {
            expect(screen.getByText(/°F/i)).toBeInTheDocument();
        });
    });

    test('refreshes data on button click', async () => {
        render(<App />);
        const refreshButton = screen.getByText(/Refresh/i);

        fireEvent.click(refreshButton);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalled();
        });
    });

    test('fetches data and updates state', async () => {
        render(<App />);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                'https://api.open-meteo.com/v1/forecast?latitude=65.01&longitude=25.47&current=temperature_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&hourly=temperature_2m&wind_speed_unit=ms&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&temperature_unit=celsius',
                expect.any(Object)
            );

            expect(screen.getByText(/Current weather/i)).toBeInTheDocument();
            expect(screen.getByText(/Weekly highlight/i)).toBeInTheDocument();
            expect(screen.getByText(/Hourly chart/i)).toBeInTheDocument();

        });
    });
});
