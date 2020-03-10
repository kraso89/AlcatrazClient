import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Avatar,
  CircularProgress,
  Fade,
  Chip,
} from '@material-ui/core/';
import assets from '../assets';

import moment from 'moment';

export default function WeatherCard(props) {
  const { data, day } = props;
  const mostCommon = arr =>
    arr.sort((a, b) => arr.filter(v => v === a).length - arr.filter(v => v === b).length).pop();

  const icon = mostCommon(data.map(slot => slot.weather[0].icon));
  const mainWeather = mostCommon(data.map(slot => slot.weather[0].main));
  const imageSrc = assets[mainWeather.toLowerCase()];
  const useStyles = makeStyles(theme => ({
    container: {
      display: 'flex',
    },
    root: {
      maxWidth: 345,
      minHeight: 300,
      backgroundImage: `url(${imageSrc})`,
      backgroundSize: 'cover',
      color: 'white',
    },
    content: {
      height: 0,
      paddingTop: '80%',
    },
    media: {
      height: 0,
      paddingTop: '60%',
    },
    subHeader: {
      backgroundColor: 'rgba(255,255,255,.2)',
      color: 'white !important',
    },
    chip: {
      width: '100%',
      backgroundColor: 'rgba(255,255,255,.2)',
      color: 'white',
      fontSize: '.7em',
    },
    icon: {
      marginLeft: '0 !important',
    },
  }));
  const classes = useStyles();
  const loading = !data;
  const cardTitle = () => {
    const compareDate = moment(day);
    const today = moment().endOf('day');
    const tomorrow = moment()
      .add(1, 'day')
      .endOf('day');
    if (compareDate < today) return 'Today';
    if (compareDate < tomorrow) return 'Tomorrow';
    return moment(compareDate).format('dddd');
  };

  return (
    <Fade in={!loading}>
      <Fragment>
        {loading && <CircularProgress />}
        {!loading && (
          <Fragment>
            <Card className={classes.root} onClick={props.setExpanded}>
              <CardHeader
                className={classes.subHeader}
                title={cardTitle()}
                subheader={moment(day).format('ll')}
              />
              <CardContent className={classes.content}>
                <Typography variant="h5">
                  <Chip
                    label={mainWeather}
                    className={classes.chip}
                    avatar={
                      <Avatar
                        className={classes.icon}
                        src={`${process.env.REACT_APP_OPEN_WEATHER_ICON_URL}${icon}@2x.png`}
                      />
                    }
                  />
                </Typography>
              </CardContent>
            </Card>
          </Fragment>
        )}
      </Fragment>
    </Fade>
  );
}
