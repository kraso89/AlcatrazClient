import React, { Fragment } from 'react';
import CanvasJSReact from './canvasjs.react';
import moment from 'moment';
const { CanvasJSChart } = CanvasJSReact;
export default function Chart({ data, day, city = 'Sofia' }) {
  const dataPoints = data.map(timeSlot => {
    const { main, weather } = timeSlot;
    const { description, icon } = weather[0];

    return {
      label: moment(timeSlot.dt_txt).format('HH:mm'),
      y: main.temp,
      minTemp: main.temp_min,
      maxTemp: main.temp_max,
      feelsLike: main.feels_like,
      pressure: main.pressure,
      main: weather[0].main,
      description,
      icon: `${process.env.REACT_APP_OPEN_WEATHER_ICON_URL}${icon}.png`,
    };
  });
  const toolTipContent = `
  <strong>{main}</strong><br/>
  <i>{description}</i> <img class="icon" src={icon} /><br/>
  Max: {maxTemp} °C<br/>
  Min: {minTemp} °C<br/>
  Feels like: {feelsLike} °C<br/>
  Pressure: {pressure}<br/>
  `;
  const options = {
    theme: 'dark2',
    exportEnabled: false,
    animationEnabled: true,
    title: {
      text: `Temperature for ${day} in ${city}`,
    },
    axisX: {
      valueFormatString: 'HH:mm',
    },
    axisY: {
      title: 'Temperature (°C)',
      suffix: ' °C',
    },
    data: [
      {
        type: 'spline',
        indexLabel: '{y}°',
        toolTipContent,
        dataPoints,
      },
    ],
  };

  return (
    <Fragment>
      <CanvasJSChart options={options} />
    </Fragment>
  );
}
