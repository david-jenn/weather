import  moment  from 'moment';
import { useEffect, useState } from 'react';

function Hourly({ hour, getWeatherIcon }) {

  const [convertedTime, setConvertedTime] = useState('');


  function convertTime(unixTime) {
     const hour = new Date(unixTime * 1000);
     return moment(hour).format('LT');
     
  }

  return (
    <div className="">
      <div className="d-flex justify-content-between">
      <div className="fw-bold">{convertTime(hour.dt)}</div>
      <div className="fw-bold">{hour.temp}&deg;</div>

      </div>
      <div><img src={getWeatherIcon(hour.weather[0].id)}></img></div>
      <div>{hour.weather[0].description}</div>
      <div>Precipitation: {(hour.pop * 100).toFixed(2)}%</div>

    </div>
  );
}

export default Hourly;
