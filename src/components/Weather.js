import { useEffect, useState } from 'react';
import { AiOutlineHome, AiOutlineStar } from 'react-icons/ai';
import { MdAddLocationAlt } from 'react-icons/md';
import { FaSearchLocation, FaTrashAlt } from 'react-icons/fa';
import axios from 'axios';
import _, { set } from 'lodash';

import CitySummary from './CitySummary';

import './Weather.css';
import Hourly from './Hourly';
import Daily from './Daily';

function Weather() {
  const [city, setCity] = useState('');
  const [cityData, setCityData] = useState(null);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [validCity, setValidCity] = useState(false);
  const [savedCities, setSavedCities] = useState([]);
  const [reset, setReset] = useState(0);
  const [home, setHome] = useState('');
  const [homeData, setHomeData] = useState(null);

  const [seeDaily, setSeeDaily] = useState(false);
  const [forecastToggleText, setForecastToggleText] = useState("See Daily Forecast");
  
  const [forecast, setForecast] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState(null);
  const [hourlySet, setHourlySet] = useState(1);
  const [dailyForecast, setDailyForecast] = useState(null);
  const [currentIcon, setCurrentIcon] = useState('/images/01n@2x_clearNight.png');

  const [hourlyButtonDisabled, setHourlyButtonDisabled] = useState(true);
  const [dailyButtonDisabled, setDailyButtonDisabled] = useState(false);

  useEffect(() => {
    console.log('hello');

    if (localStorage) {
      const savedCities = JSON.parse(localStorage.getItem('cities'));
      const savedHome = localStorage.getItem('home');
      console.log(savedCities);
      console.log(savedHome);

      if (reset === 0) {
        if (!savedHome) {
          setHome('');
        } else {
          setHome(savedHome);
          setTitle(savedHome);

          fetchHomeData(savedHome);
        }
      }
      if (!savedCities) {
        setSavedCities([]);
      } else {
        setSavedCities(savedCities);
      }
    }
  }, [reset]);

  function addCity(evt, city) {
    evt.preventDefault();
    const cities = [city, ...savedCities];
    console.log(cities);
    if (localStorage) {
      localStorage.setItem('cities', JSON.stringify(cities));
      setReset(reset + 1);
    }
  }

  function deleteCity(evt, city, index) {
    evt.preventDefault();
    console.log(city);
    console.log(index);
    console.log('delete function');
    if (localStorage) {
      const cities = JSON.parse(localStorage.getItem('cities'));
      cities.splice(index, 1);
      localStorage.setItem('cities', JSON.stringify(cities));
    }
    setReset(reset + 1);
  }

  function saveHome(evt, city) {
    evt.preventDefault();
    console.log(city);
    console.log('set home');
    if (localStorage) {
      localStorage.setItem('home', city.name);
      localStorage.setItem('homeData', JSON.stringify(city));
      setHome(city.name);
      setHomeData(city);
    }
    setReset(reset + 1);
  }

  function onInputChange(evt, setValue) {
    const newValue = evt.currentTarget.value;
    setValue(newValue);
    console.log(newValue);
  }

  function fetchData(evt, cityQuery) {

    if (evt) {
      evt.preventDefault();
    }

    axios(`${process.env.REACT_APP_API_URL}/api/weather`, {
      method: 'get',
      withCredentials: false,
      params: {
        q: cityQuery,
        units: 'imperial',
      },
    })
      .then((res) => {
        setHourlySet(1);
        setCityData(res.data);

        console.log(res.data.weather[0].id);
        const icon = getWeatherIcon(res.data.weather[0].id);
        console.log(icon);
        setCurrentIcon(icon);
        setValidCity(res.data?.cod === '404' ? false : res.data?.cod === '400' ? false : true);
        setTitle(res.data?.cod === '404' ? 'City Not Found!' : res.data.name);
        console.log(res.data);
        console.log(validCity);
        fetchForecast(res.data?.coord?.lat, res.data?.coord?.lon);
      })
      .catch((err) => {
        setValidCity(true);
        const resError = err?.response?.data?.error;
        if (resError) {
          if (typeof resError === 'string') {
            setError(resError);
          } else if (resError.details) {
            setError(_.map(resError.details, (x, index) => <div key={index}>{x.message}</div>));
          } else {
            setError(JSON.stringify(resError));
          }
        } else {
          setError(err.message);
        }
      });
  }

  function fetchHomeData(city) {
    console.log(process.env.REACT_APP_API_URL);
    axios(`${process.env.REACT_APP_API_URL}/api/weather`, {
      method: 'get',
      withCredentials: false,
      params: {
        q: city,
        units: 'imperial',
      },
    })
      .then((res) => {
        setHourlySet(1);
        setCityData(res.data);
        setValidCity(res.data?.cod === '404' ? false : res.data?.cod === '400' ? false : true);
        setTitle(res.data?.cod === '404' ? 'City Not Found!' : res.data.name);
        setHomeData(res.data);
        const icon = getWeatherIcon(res.data.weather[0].id);
        console.log(icon);
        setCurrentIcon(icon);
        console.log(res.data);
        console.log(validCity);
        fetchForecast(res.data?.coord?.lat, res.data?.coord?.lon);

        //fetchForecast();
      })
      .catch((err) => {
        setValidCity(true);
        const resError = err?.response?.data?.error;
        if (resError) {
          if (typeof resError === 'string') {
            setError(resError);
          } else if (resError.details) {
            setError(_.map(resError.details, (x, index) => <div key={index}>{x.message}</div>));
          } else {
            setError(JSON.stringify(resError));
          }
        } else {
          setError(err.message);
        }
      });
  }

  function fetchForecast(latitude, longitude) {
    axios(`${process.env.REACT_APP_API_URL}/api/hourly`, {
      method: 'get',
      withCredentials: false,
      params: {
        lat: latitude,
        lon: longitude,
        units: 'imperial',
      },
    })
      .then((res) => {
        console.log(res.data);
        
        const currentForecast = [...res.data?.hourly];
        
          const hours = currentForecast.splice(0, 6);
          setHourlyForecast(hours);
          setDailyForecast(res.data.daily)
          setForecast(res.data);
          
        //}
        
      })
      .catch((err) => {
        console.log(err.data);
      });
  }

  function getWeatherIcon(code) {
    console.log('in here');

    if (code >= 200 && code <= 232) {
      return '/images/11d@2x_thunderstorm.png';
    }
    if (code >= 300 && code <= 321) {
      return '/images/09d@2x_drizzle.png';
    }
    if (code >= 500 && code <= 504) {
      return '/images/10d@2x_rain.png';
    }
    if (code === 511) {
      return '/images/13d@2x_freezingRain.png';
    }
    if (code >= 520 && code <= 531) {
      return '/images/10d@2x_rain.png';
    }
    if (code >= 701 && code <= 781) {
      return '/images/50d@2x_mist.png';
    }
    if (code === 800) {
      return '/images/01d@2x_clearDay.png';
    }
    if (code === 801) {
      return '/images/03d@2x_scatteredCloudsDay.png';
    }
    if (code >= 802 && code <= 804) {
      return '/images/04d@2x_overcast.png';
    }
  }

  function seeMoreHours() {
    console.log(hourlySet)
    const currentHours = [...forecast.hourly] 
    if(hourlySet === 1) {
      setHourlyForecast(currentHours.splice(6, 6));
    }
    else if (hourlySet === 2) {
      setHourlyForecast(currentHours.splice(12, 6));
    } 
    else if (hourlySet === 3) {
      setHourlyForecast(currentHours.splice(18, 6));
    }
    else if (hourlySet === 4) {
      setHourlyForecast(currentHours.splice(24, 6));
    } 
    else {
      return;
    }

    setHourlySet(hourlySet + 1);
    
  }

  function seeLessHours() {
    console.log(hourlySet)
    const currentHours = [...forecast.hourly];

    if(hourlySet === 1) {
      return;
    } 
      
    if (hourlySet === 2) {
        setHourlyForecast(currentHours.splice(0, 6));
    }

    if(hourlySet === 3) {
      setHourlyForecast(currentHours.splice(6, 6));
    }

    if(hourlySet === 4) {
      setHourlyForecast(currentHours.splice(12, 6));
    }
    if(hourlySet === 5) {
      setHourlyForecast(currentHours.splice(18, 6));
    }
    

    setHourlySet(hourlySet - 1);
   
  }

  function switchForecast() {

    if(!seeDaily) {
      setSeeDaily(true);
      setDailyButtonDisabled(true);
      setHourlyButtonDisabled(false);
    } else {
      setSeeDaily(false);
      setDailyButtonDisabled(false);
      setHourlyButtonDisabled(true);
  }
  }

 

  return (
    <div className="container-fluid mb-3">
      <div className="">
        <form className="">
          <div>
            
            {homeData && (
              <div className="d-flex justify-content-end align-items-center mb-1">
                <div className="me-2">
                  <AiOutlineHome className="fs-5" />
                </div>

                <div>
                  {homeData?.name} {homeData?.main?.temp}&deg;
                </div>
              </div>
            )}
            {!homeData && <div className="spacer"></div>}
          </div>
          <div className="mb-3">
            <label htmlFor="cityInput" className="form-label">
              Enter A City
            </label>
            <input id="cityInput" className="form-control" onChange={(evt) => onInputChange(evt, setCity)}></input>
          </div>
          <div className="mb-3">
            <button className="btn btn-primary me-3" onClick={(evt) => fetchData(evt, city)}>
              Get Weather!
              <span className="ms-2">
                <FaSearchLocation className="fs-2" />
              </span>
            </button>
            <button className="btn btn-info" onClick={(evt) => fetchData(evt, home, true)}>
              <AiOutlineHome className="fs-2" />
            </button>
          </div>
        </form>
        <div className="">
          {!title && <div className="fst-italic mb-5">No city selected!</div>}
          {title === 'City Not Found!' && <div className="fst-italic text-danger mb-5">{title}</div>}
          {title && title !== 'City Not Found!' && (
            <div>
              <div className="p-2 mb-3 main-display">
                <div className=" fs-2">{title}</div>
                <div className=" d-flex justify-content-evenly">
                  <div className="me-3">
                    <div className="fs-3">{cityData?.main?.temp}&deg;</div>
                    <div>
                      <img src={currentIcon} width="50" height="50"></img>
                    </div>
                    {cityData?.weather && <div className="fst-italic">{cityData?.weather[0]?.description}</div>}
                  </div>
                  <div>
                    <div className="mb-2">Feels Like: {cityData?.main?.feels_like}&deg;</div>
                    <div className="mb-2">High of {cityData?.main?.temp_max}&deg;</div>
                    <div className="mb-2">Low of {cityData?.main?.temp_min}&deg;</div>
                  </div>
                </div>
              </div>

              <div className=" d-flex justify-content-between mb-3">
                <div>
                  <button className="btn-primary btn" onClick={(evt) => addCity(evt, title)}>
                    <AiOutlineStar className=" fs-3" />
                  </button>
                </div>
                <div>
                  <button className="btn btn-info" onClick={(evt) => saveHome(evt, cityData)}>
                    Set As Home
                    <AiOutlineHome className="fs-3 ms-2" />
                  </button>
                </div>
              </div>
              <div className="d-flex justify-content-evenly">
              <button className="btn btn-secondary" disabled={hourlyButtonDisabled} onClick={(evt) => switchForecast()}>Hourly Forecast</button>
              <button className="btn btn-secondary" disabled={dailyButtonDisabled} onClick={(evt) => switchForecast()}>Daily Forecast</button>
              </div>
              <div className="p-3">
                {forecast != null && !seeDaily && (
                  <div className="row">
                    {_.map(hourlyForecast, (hour) => (
                      <div className="col-sm-6 col-md-4 p-3">
                        <div className=" p-3 d-flex justify-content-center">
                          <div className="">
                            <Hourly hour={hour} getWeatherIcon={getWeatherIcon} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {forecast != null && seeDaily && (
                  <div className="row">
                     {_.map(dailyForecast, (day) => (
                      <div className="col-sm-6 col-md-4 p-3">
                        <div className=" p-3 d-flex justify-content-center">
                          <div className="">
                             <Daily day={day} getWeatherIcon={getWeatherIcon} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                )}
                
                
              </div>

              <div className="d-flex justify-content-between mb-5">

                <button className="btn btn-secondary" onClick={(evt) => seeMoreHours(evt)}>
                  Next hours
                 </button>

                <button className="btn btn-secondary" onClick={(evt) => seeLessHours(evt)}>
                  Less hours
                </button>

                </div>

              
            </div>
          )}
          <div className="">
            {(!savedCities || savedCities.length === 0) && (
              <div className="fst-italic fs-4">Click favorite button to save cities</div>
            )}
            {savedCities && savedCities.length > 0 && (
              <div className="row">
                <div className="fs-4 p-3 mb-3">
                  <div className="border-bottom border-dark">Your Cities</div>
                </div>
                {_.map(savedCities, (city, index) => (
                  <CitySummary city={city} index={index} key={index} fetchData={fetchData} deleteCity={deleteCity} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Weather;
