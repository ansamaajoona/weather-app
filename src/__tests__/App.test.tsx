import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from "../App"

test('demo', () => {
    expect(true).toBe(true)
})

/* 
    Mock function for fetch
*/
const mockFetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve(mockData),
        headers: { get: () => 'application/json' },
        ok: true,
        redirected: false,
        status: 200,
        statusText: 'OK',
    }) as unknown as Response
);

(global as any).fetch = mockFetch;


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

describe('Weather App Tests', () => {
    beforeEach(() => {
        (global.fetch as jest.Mock).mockClear();
        (global.fetch as jest.Mock) = jest.fn(() =>
        Promise.resolve({
                json: () => Promise.resolve(mockData),
            }) as unknown as Response
        );
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
});
