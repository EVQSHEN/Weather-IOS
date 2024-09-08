export function getHumidityDescription(humidity: number) {
  if (humidity < 40) {
    return 'Low humidity. It might feel dry.';
  } else if (humidity < 70) {
    return 'Moderate humidity. Comfortable conditions.';
  } else {
    return 'High humidity. It might feel humid and uncomfortable.';
  }
}

export function getVisibilityDescription(visibility: number) {
  if (visibility >= 10) {
    return "It's perfectly clear right now.";
  } else if (visibility >= 5) {
    return 'Good visibility.';
  } else {
    return 'Poor visibility. Exercise caution while driving or moving around.';
  }
}

export function getPrecipitationDescription(precipitation: number) {
  if (precipitation !== undefined) {
    if (precipitation <= 0.2) {
      return 'Light rain or drizzle. An umbrella may come in handy.';
    } else if (precipitation <= 2.5) {
      return 'Moderate rain.';
    } else {
      return 'Heavy rain.';
    }
  } else {
    return 'Conditions are dry.';
  }
}

export function getPressureDescription(pressure: number) {
  if (pressure < 1000) {
    return 'Low pressure. Expect changes in the weather.';
  } else if (pressure >= 1000 && pressure <= 1010) {
    return 'Normal pressure. Typical weather conditions.';
  } else {
    return 'High pressure. Expect stable and clear weather.';
  }
}

export function getFeelsLikeDescription(feelsLike: number, temp: number) {
  if (feelsLike < temp) {
    return 'Feels colder than the actual temperature.';
  } else if (feelsLike > temp) {
    return 'Feels warmer than the actual temperature.';
  } else {
    return 'Feels like the actual temperature.';
  }
}

export function getUVLevelDescription(uvIndex: number) {
  if (Math.round(uvIndex) <= 2) {
    return 'Low';
  } else if (Math.round(uvIndex) <= 5) {
    return 'Moderate';
  } else if (Math.round(uvIndex) <= 7) {
    return 'High';
  } else {
    return 'Very High';
  }
}

export function getUVDescription(uvIndex: number) {
  if (Math.round(uvIndex) <= 2) {
    return 'No protection needed.';
  } else if (Math.round(uvIndex) <= 5) {
    return 'Wear sunscreen.';
  } else {
    return 'Take precautions.';
  }
}
