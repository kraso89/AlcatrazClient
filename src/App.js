import React, { useState, useEffect } from 'react';
import './App.css';
import moment from 'moment';
import _ from 'lodash';
import WeatherCard from './components/WeatherCard';
import { makeStyles, fade } from '@material-ui/core/styles';
import {
  Paper,
  Container,
  Grid,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@material-ui/core/';
import Chart from './components/Chart';

function App() {
  const [weatherData, setweatherData] = useState({});
  const [expandedIndex, setExpanded] = useState(null);
  const [city, setCity] = useState('Sofia');
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData(city);
  }, [city]);

  const fetchData = async city => {
    const result = await fetch(`/weather?city=${city}`)
      .then(res => res.json())
      .catch(err => setError(err.message));

    if (result) {
      const groupedWeather = _.chain(result.list)
        .groupBy(day => moment(day.dt_txt).format('L'))
        .value();
      setweatherData(groupedWeather);
    }
  };

  const handleCityChange = event => {
    setCity(event.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };
  const useStyles = makeStyles(theme => ({
    chart: {
      padding: '1.5em',
    },
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      marginTop: '1em',
      marginBottom: '1em',
    },
  }));
  const classes = useStyles();
  const selectedIndex = Object.keys(weatherData)[expandedIndex];
  return (
    <Container>
      <Container className={classes.search}>
        <FormControl className={classes.formControl}>
          <InputLabel id="demo-controlled-open-select-label">City</InputLabel>
          <Select
            labelId="demo-controlled-open-select-label"
            id="demo-controlled-open-select"
            open={open}
            onClose={handleClose}
            onOpen={handleOpen}
            value={city}
            onChange={handleCityChange}
          >
            <MenuItem value={'Sofia'}>Sofia</MenuItem>
            <MenuItem value={'Los Angeles'}>Los Angeles</MenuItem>
            <MenuItem value={'London'}>London</MenuItem>
            <MenuItem value={'Tokyo'}>Tokyo</MenuItem>
          </Select>
        </FormControl>
      </Container>
      <Grid container spacing={2}>
        {weatherData &&
          Object.keys(weatherData).map((weatherDay, i) => (
            <Grid item sm={2} key={i}>
              <WeatherCard
                data={weatherData[weatherDay]}
                city={city}
                day={weatherDay}
                expanded={expandedIndex === i}
                setExpanded={() => setExpanded(i)}
              />
            </Grid>
          ))}
      </Grid>
      {expandedIndex != null && (
        <Container className={classes.chart}>
          <Paper elevation={3}>
            <Chart data={weatherData[selectedIndex]} day={selectedIndex} city={city} />
          </Paper>
        </Container>
      )}
      {error && <div>{error}</div>}
    </Container>
  );
}

export default App;
