import { useEffect, useState } from 'react';
import { AiOutlineHome, AiOutlineStar } from 'react-icons/ai';
import { MdAddLocationAlt } from 'react-icons/md';
import { FaSearchLocation, FaTrashAlt } from 'react-icons/fa';
import axios from 'axios';
import _, { set } from 'lodash';

import CitySummary from './CitySummary';

import './Weather.css';

function Weather() {
  const [city, setCity] = useState('');
  const [cityData, setCityData] = useState(null);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [rerenderCount, setRerenderCount] = useState(0);
  const [loaded, setLoaded] = useState('');
  const [validCity, setValidCity] = useState(false);
  const [savedCities, setSavedCities] = useState([]);
  const [savedCitiesData, setSavedCitiesData] = useState([]);
  const [copy, setCopy] = useState([]);
  const [reset, setReset] = useState(0);
  const [home, setHome] = useState('');
  const [homeData, setHomeData] = useState(null);
  const [homeChange, setHomeChange] = useState(0);

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

  // useEffect(() => {
  //   const axiosRequests = [];

  //   for (const savedCity of savedCities) {
  //     axiosRequests.push(
  //       axios(`http://localhost:5000/api`, {
  //         method: 'get',
  //         params: {
  //           q: savedCity,
  //           units: 'imperial',
  //         },
  //       })
  //     );
  //   }

  //   if (axiosRequests.length > 0) {
  //     console.log(axiosRequests);

  //     axios
  //       .all(axiosRequests)
  //       .then(
  //         axios.spread((...responses) => {
  //           const responseArray = [];
  //           for(let i = 0; i < axiosRequests.length; i++ ) {
  //             responseArray.push(responses[i].data);
  //           }
  //           // const responseOne = responses[0];
  //           // const responseTwo = responses[1];
  //           // const responseThree = responses[2];

  //           // console.log(responseOne);
  //           // console.log(responseTwo);
  //           // console.log(responseThree);
  //           setSavedCitiesData(responseArray);
  //           // use/access the results
  //         })
  //       )
  //       .catch((errors) => {
  //         // react on errors.
  //       });
  //   }
  // }, [savedCities]);

  function loadCity(evt, city) {
    evt.preventDefault();
    axios(`http://localhost:5000/api`, {
      method: 'get',
      withCredentials: false,
      params: {
        q: city,
        units: 'imperial',
      },
    })
      .then((res) => {
        console.log(res.data);
        copy.push(res.data);
        setSavedCitiesData([...copy]);
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

  function onInputChange(evt, setValue) {
    const newValue = evt.currentTarget.value;
    setValue(newValue);
    console.log(newValue);
  }

  function fetchData(evt, cityQuery) {
    if (evt) {
      evt.preventDefault();
    }

    axios(`http://localhost:5000/api`, {
      method: 'get',
      withCredentials: false,
      params: {
        q: cityQuery,
        units: 'imperial',
      },
    })
      .then((res) => {
        setCityData(res.data);
        setValidCity(res.data?.cod === '404' ? false : res.data?.cod === '400' ? false : true);
        setTitle(res.data?.cod === '404' ? 'City Not Found!' : res.data.name);
        console.log(res.data);
        console.log(validCity);
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
    axios(`http://localhost:5000/api`, {
      method: 'get',
      withCredentials: false,
      params: {
        q: city,
        units: 'imperial',
      },
    })
      .then((res) => {
        setCityData(res.data);
        setValidCity(res.data?.cod === '404' ? false : res.data?.cod === '400' ? false : true);
        setTitle(res.data?.cod === '404' ? 'City Not Found!' : res.data.name);
        setHomeData(res.data);
        console.log(res.data);
        console.log(validCity);
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

  return (
    <div className="">
      <form className="">
        <div>
          <h1>Weather App</h1>
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
          <button className="btn btn-info" onClick={(evt) => fetchData(evt, home)}>
            <AiOutlineHome className="fs-2" />
          </button>
        </div>
      </form>
      <div>
        {!title && <div className="fst-italic mb-5">No city selected!</div>} 
        {title === 'City Not Found!' && <div className="fst-italic text-danger mb-5">{title}</div>}
        {title && title !== 'City Not Found!' && (
          <div>
            <div className="card border border-dark border bg-light p-2 mb-3">
              <div className="card-headers fs-2">{title}</div>
              <div className="card-body d-flex justify-content-evenly">
                <div className="me-3">
                  <div className="fs-3">{cityData?.main?.temp}&deg;</div>
                  {cityData?.weather && <div className="fst-italic">{cityData?.weather[0]?.description}</div>}
                </div>
                <div>
                  <div className="mb-2">Feels Like: {cityData?.main?.feels_like}&deg;</div>
                  <div className="mb-2">High of {cityData?.main?.temp_max}&deg;</div>
                  <div className="mb-2">Low of {cityData?.main?.temp_min}&deg;</div>
                </div>
              </div>
              <div className="card-footer d-flex justify-content-between">
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
            </div>
          </div>
        )}
        <div className="">
          {(!savedCities || savedCities.length === 0) && (
            <div className="fst-italic fs-4">Click favorite button to save cities</div>
          )}
          {savedCities && savedCities.length > 0 && (
            <div className=" row">
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
  );
}

export default Weather;
