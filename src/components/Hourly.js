function Hourly({ hour, getWeatherIcon }) {
  return (
    <div className="">
      <div className="d-flex justify-content-between">
      <div className="fw-bold">{hour.convertedTime}</div>
      <div className="fw-bold">{hour.temp}&deg;</div>

      </div>
      <div><img src={getWeatherIcon(hour.weather[0].id)}></img></div>
      <div>{hour.weather[0].description}</div>
      <div>Precipitation: {(hour.pop * 100).toFixed(2)}%</div>

    </div>
  );
}

export default Hourly;
