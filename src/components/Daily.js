function Daily({ day, getWeatherIcon }) {
  return (
    <div>
      <div className="d-flex justify-content-between">
        <div className="fw-bold">{day.convertedTime}</div>
      </div>
      <div className="d-flex justify-content-between">
        <div>
          <div>High</div>
          <div>{day.temp.max}</div>
        </div>
        <div>
          <div>Low:</div>
          <div>{day.temp.min}</div>
        </div>
      </div>
      <div>
        <img src={getWeatherIcon(day.weather[0].id)}></img>
      </div>
      <div>{day.weather[0].description}</div>
      <div>Precipitation: {(day.pop * 100).toFixed(2)}%</div>
    </div>
  );
}

export default Daily;
