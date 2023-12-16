/* 
  Defaults
*/
import { useState, useEffect } from 'react';


/* 
  Components
*/
import Chart from "./components/Chart";
import WeatherIcons from './components/WeatherIcons';


export default function App() {

  interface IWeatherData {
    longitude: number,
    latitude: number,
    current: {
      time: string,
      temperature_2m: number,
      wind_speed_10m: number,
      weather_code: number,
      precipitation: number,
      apparent_temperature: number,
    },
    daily: {
      time: string[],
      weather_code: number[],
      temperature_2m_max: number[],
      temperature_2m_min: number[],
    }
  }

  const [weatherData, setWeatherData] = useState<IWeatherData | null>(null);
  const [chartOptions, setChartOptions] = useState({});
  const [temperatureUnit, setTemperatureUnit] = useState<'celsius' | 'fahrenheit'>('celsius')

  async function fetchData() {
    try {
      const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=65.01&longitude=25.47&current=temperature_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&hourly=temperature_2m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&temperature_unit=${temperatureUnit}`, {
        method: 'GET',
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        }
      })  
      const data = await response.json();

      setWeatherData({
        longitude: data.longitude,
        latitude: data.latitude,
        current: {
          time: data.current.time,
          temperature_2m: data.current.temperature_2m,
          wind_speed_10m: data.current.wind_speed_10m,
          weather_code: data.current.weather_code,
          precipitation: data.current.precipitation,
          apparent_temperature: data.current.apparent_temperature,
        },
        daily: {
          time: data.daily.time,
          temperature_2m_max: data.daily.temperature_2m_max,
          temperature_2m_min: data.daily.temperature_2m_min,
          weather_code: data.daily.weather_code,
        }
      })

      setChartOptions({
        title: {
          text: '',
        },
        xAxis: {
          /* 
            Convert ISO time to locale string
          */
          categories: data.hourly.time.map((item: string) => new Date(item).toLocaleString('en-GB', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })),
          tickInterval: 21,
          alignTicks: true
        },
        series: [
          {
            type: 'spline',
            data: data.hourly.temperature_2m,
            name: 'Temperature',
            showInLegend: false,
          }
        ]
      })

    } catch(error) {
      return console.error(error)
    }
  }

  /* 
    We want to call this useEffect hook always when temperatureUnit changes.
  */
  useEffect(() => {
    fetchData()
  }, [temperatureUnit])
  


  return (
    <main className="flex flex-col min-h-screen h-full py-2 px-6 md:px-4 lg:px-48 bg-neutral-100">


      {/* Header */}
      <div className="p-2 flex flex-row justify-between">
        
        {/* Left */}
        <div className="flex flex-col">
          <h1 className="font-roboto text-4xl">
            Weather App
          </h1>
          <span className="text-sm font-roboto font-semibold tracking-widest text-gray-700 pl-1">
            {weatherData?.latitude}, {weatherData?.longitude}
          </span>
        </div>

        {/* Right */}
        <div className="">
          <button
            className="box-border bg-white py-2 px-4 mr-2 rounded shadow-md hover:bg-gray-50 hover:cursor-pointer capitalize"
            onClick={() => {
              setTemperatureUnit(temperatureUnit === 'celsius' ? 'fahrenheit' : 'celsius')
            }}
          >
            {temperatureUnit === 'celsius' ? '°C' : '°F'}
          </button>

          <button
            className="box-border bg-white py-2 px-4 rounded shadow-md hover:bg-gray-50 hover:cursor-pointer capitalize"
            onClick={() => fetchData()}
          >
            Refresh
          </button>
        </div>
      </div>


      {/* Content */}
      <div className="flex flex-col md:flex-row lg:flex-row mt-1">

        {/* Left box */}
        <div className="bg-white p-4 md:mr-4 lg:mr-4 shadow-md rounded-md w-full md:w-1/5 lg:w-1/5">

          <h1 className="text-xl font-roboto my-2 px-1 font-bold">Current weather</h1>

          {weatherData && 
            <div className="flex flex-col py-2 px-2">

              <div className="flex justify-center items-center mb-2 ">
                <WeatherIcons weatherCode={weatherData.current.weather_code} size={150}  />
              </div>

              <h2 className="text-5xl font-roboto tracking-wide">
                  {weatherData.current.temperature_2m}{temperatureUnit === 'celsius' ? '°C' : '°F'}
              </h2>

              <span className="mt-6 text-lg font-bold font-roboto">
                {new Date(weatherData.current.time).toLocaleString('en-GB', {
                  dateStyle: 'full', timeStyle: 'short'
                })}
              </span>

              <span className="mt-2 text-lg text-gray-700 font-roboto">
                Feels like: {weatherData.current.apparent_temperature}{temperatureUnit === 'celsius' ? '°C' : '°F'}
              </span>

              <span className="mt-2 text-lg text-gray-700 font-roboto">
                Wind speed: {weatherData.current.wind_speed_10m}
              </span>

              <span className="mt-2 text-lg text-gray-700 font-roboto">
                Precipitation: {weatherData.current.precipitation}%
              </span>
            </div>
          }

        </div>


        {/* Right box */} 
        <div className="flex flex-col mt-4 md:mt-0 lg:mt-0 bg-white p-4 md:ml-4 lg:ml-4 shadow-md rounded-md w-full md:w-4/5 lg:w-4/5">

          {/* Upper */}
          <div className="p-2 mb-6">
            <h1 className="text-xl font-roboto my-2 px-1 font-bold">Weekly highlight</h1>

            <div className="flex flex-row flex-wrap lg:justify-between sm:justify-start md:justify-start">

              {weatherData?.daily.time.map((item: any, index: number) => (
                <div className="py-4 w-full lg:w-36 md:w-48 mx-2 shadow-md rounded-md" key={index}>
                  <h2 className="text-center text-lg tracking-wide font-bold font-roboto">

                    {/* Use 'Today' for today's weather instead of the weekday */}
                    {index == 0 ? 'Today' : 
                      new Date(item).toLocaleString('en-GB', { weekday: 'long' })
                    }
                  </h2>

                  <div className="flex justify-center items-center mb-2">
                    <WeatherIcons weatherCode={weatherData.daily.weather_code[index]} size={100} />
                  </div>

                  <div className="flex flex-row justify-evenly">
                    <span className="font-semibold tracking-wide text-lg">
                      {weatherData?.daily.temperature_2m_min[index]}{temperatureUnit === 'celsius' ? '°C' : '°F'}
                    </span>
                    <span className="font-semibold tracking-wide text-lg">
                      {weatherData?.daily.temperature_2m_max[index]}{temperatureUnit === 'celsius' ? '°C' : '°F'}
                    </span>
                  </div>
                </div>
              ))}

            </div>
          </div>

          {/* Lower */}
          <div className="p-2">
            <h1 className="text-xl font-roboto my-2 px-1 font-bold">Hourly chart</h1>
            <Chart options={chartOptions} />
          </div>

        </div>

      </div>

    </main>

  )
}
