const LitElement = customElements.get("hui-masonry-view")
  ? Object.getPrototypeOf(customElements.get("hui-masonry-view"))
  : Object.getPrototypeOf(customElements.get("hui-view"));
const html = LitElement.prototype.html;
const css = LitElement.prototype.css;

const weatherIconsDay = {
  "clear": "day",
  "clear-night": "night",
  "cloudy": "cloudy",
  "fog": "fog",
  "hail": "rainy-7",
  "lightning": "thunder",
  "lightning-rainy": "lightning-rainy",
  "partlycloudy": "cloudy-day-3",
  "pouring": "rainy-6",
  "rainy": "rainy-5",
  "snowy": "snowy-6",
  "snowy-rainy": "snowy-rainy",
  "sunny": "day",
  "windy": "windy",
  "windy-variant": "windy",
  "exceptional": "exceptional",
};

const DefaultSensors = [
  ["detailEntity", "_rain_chance"],
  ["cloudCoverEntity", "_cloud_cover"],
  ["rainChanceEntity", "_rain_chance"],
  ["freezeChanceEntity", "_freeze_chance"],
  ["snowChanceEntity", "_snow_chance"],
  ["uvEntity", "_uv"],
  ["rainForecastEntity", "_next_rain"],
];

const weatherIconsNight = {
  ...weatherIconsDay,
  "clear": "night",
  "sunny": "night",
  "partlycloudy": "cloudy-night-3",
};

const translations = {
  "fr": {
    "conditions": {
      "clear": "Ciel dégagé",
      "clear-night": "Nuit claire",
      "cloudy": "Nuageux",
      "fog": "Brouillard",
      "hail": "Risque de grèle",
      "lightning": "Orages",
      "lightning-rainy": "Pluies orageuses",
      "partlycloudy": "Eclaircies",
      "pouring": "Pluie forte",
      "rainy": "Pluie",
      "snowy": "Neige",
      "snowy-rainy": "Pluie verglaçante",
      "sunny": "Ensoleillé",
      "windy": "Venteux",
      "windy-variant": "Venteux variable",
      "exceptional": "Exceptionnel",
    },
    "conditionsNightOverride": {
      "sunny": "Nuit claire",
    },
    "windDirections": ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSO","SO","OSO","O","ONO","NO","NNO","N"],
    "wind": "Vent",
    "windGust": "Rafales",
    "windGustMax": "Max.",
    "uvIndex": "Indice UV",
    "uvIndexUnit": "indice UV",
    "humidity": "Humidité",
    "pressure": "Pression atmosphérique",
    "sunrise": "Heure de lever",
    "sunset": "Heure de coucher",
    "noRainInHour": "Pas de pluie dans l'heure.",
    "rainNow": " actuellement.",
    "rainIn": " dans ",
    "entityNotAvailable": "Entité non disponible : ",
    "alerts": {
      "Vent violent": "Vent violent",
      "Pluie-inondation": "Pluie-inondation",
      "Orages": "Orages",
      "Inondation": "Inondation",
      "Neige-verglas": "Neige-verglas",
      "Canicule": "Canicule",
      "Grand-froid": "Grand-froid",
      "Avalanches": "Avalanches",
      "Vagues-submersion": "Vagues-submersion",
    },
    "rainIntensity": {
      "Temps sec": "Temps sec",
      "Pluie faible": "Pluie faible",
      "Pluie modérée": "Pluie modérée",
      "Pluie forte": "Pluie forte",
    },
  },
  "en": {
    "conditions": {
      "clear": "Clear sky",
      "clear-night": "Clear night",
      "cloudy": "Cloudy",
      "fog": "Fog",
      "hail": "Hail",
      "lightning": "Thunderstorm",
      "lightning-rainy": "Rainy thunderstorm",
      "partlycloudy": "Partly cloudy",
      "pouring": "Heavy rain",
      "rainy": "Rain",
      "snowy": "Snow",
      "snowy-rainy": "Sleet",
      "sunny": "Sunny",
      "windy": "Windy",
      "windy-variant": "Variable wind",
      "exceptional": "Exceptional",
    },
    "conditionsNightOverride": {
      "sunny": "Clear night",
    },
    "windDirections": ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW","N"],
    "wind": "Wind",
    "windGust": "Gusts",
    "windGustMax": "Max.",
    "uvIndex": "UV index",
    "uvIndexUnit": "UV index",
    "humidity": "Humidity",
    "pressure": "Atmospheric pressure",
    "sunrise": "Sunrise",
    "sunset": "Sunset",
    "noRainInHour": "No rain in the next hour.",
    "rainNow": " now.",
    "rainIn": " in ",
    "entityNotAvailable": "Entity not available: ",
    "alerts": {
      "Vent violent": "High winds",
      "Pluie-inondation": "Rain/flooding",
      "Orages": "Thunderstorms",
      "Inondation": "Flooding",
      "Neige-verglas": "Snow/ice",
      "Canicule": "Heat wave",
      "Grand-froid": "Extreme cold",
      "Avalanches": "Avalanches",
      "Vagues-submersion": "Waves/flooding",
    },
    "rainIntensity": {
      "Temps sec": "Dry",
      "Pluie faible": "Light rain",
      "Pluie modérée": "Moderate rain",
      "Pluie forte": "Heavy rain",
    },
  },
};

const rainForecastValues = new Map([
  ["Pas de valeur", 0.1],
  ["Temps sec", 0.1],
  ["Pluie faible", 0.4],
  ["Pluie modérée", 0.7],
  ["Pluie forte", 1],
]);

window.customCards = window.customCards || [];
window.customCards.push({
  "type": "meteofrance-weather-card",
  "name": "Carte Météo France par HACF",
  "description": "Carte pour l'intégration Météo France.",
  "preview": true,
  "documentationURL": "https://github.com/hacf-fr/lovelace-meteofrance-weather-card",
});

const fireEvent = (node, type, detail, options) => {
  options = options || {};
  detail = detail === null || detail === undefined ? {} : detail;
  const event = new Event(type, {
    "bubbles": options.bubbles === undefined ? true : options.bubbles,
    "cancelable": Boolean(options.cancelable),
    "composed": options.composed === undefined ? true : options.composed,
  });
  event.detail = detail;
  node.dispatchEvent(event);
  return event;
};

function hasConfigOrEntityChanged(element, changedProps) {
  if (changedProps.has("_config")) {
    return true;
  }

  const oldHass = changedProps.get("hass");
  if (oldHass) {
    if (!element._config || !element._config.entity) {
      return true;
    }
    const entityName = element._config.entity.split(".")[1];
    return (
      oldHass.states[element._config.entity] !==
        element.hass.states[element._config.entity] ||
      oldHass.states["sun.sun"] !== element.hass.states["sun.sun"] ||
      !DefaultSensors.every((sensor) => {
        const sensorName = "sensor." + entityName + sensor[1];
        return oldHass.states[sensorName] === element.hass.states[sensorName];
      })
    );
  }

  return true;
}

class MeteofranceWeatherCard extends LitElement {
  static get properties() {
    return {
      "_config": {},
      "_dailyForecastEvent": {},
      "_hourlyForecastEvent": {},
      "hass": {},
    };
  }

  static async getConfigElement() {
    await import("./meteofrance-weather-card-editor.js");
    return document.createElement("meteofrance-weather-card-editor");
  }

  static getStubConfig(hass, unusedEntities, allEntities) {
    let entity = this.getDefaultWeatherEntity(unusedEntities, allEntities);
    let entities = { entity };

    if (entity) {
      let sensors = this.getWeatherEntitiesFromEntity(
        hass,
        entity.split(".")[1],
        allEntities
      );
      entities = {
        ...entities,
        ...sensors,
      };
    }
    return entities;
  }

  static getDefaultWeatherEntity(unusedEntities, allEntities) {
    let entity = unusedEntities.find((eid) => eid.split(".")[0] === "weather");
    if (!entity) {
      entity = allEntities.find((eid) => eid.split(".")[0] === "weather");
    }
    return entity;
  }

  static getWeatherEntitiesFromEntity(hass, entityName, allEntities) {
    let entities = {};
    DefaultSensors.forEach((sensor) => {
      const sensorName = "sensor." + entityName + sensor[1];
      if (hass.states[sensorName] !== undefined && allEntities.includes(sensorName)) {
        entities = {
          ...entities,
          [sensor[0]]: sensorName,
        };
      }
    });
    return entities;
  }

  // Mise à jour des champs de configuration si nécessaire
  upgradeConfig(config) {
    let upgradedConfig = { ...config };

    // Conversion des chaînes booléennes ("true"/"false") en vrais booléens
    const boolKeys = [
      "current", "details", "daily_forecast", "hourly_forecast",
      "alert_forecast", "one_hour_forecast", "animated_icons",
      "show_sun", "show_name", "show_temperature", "wind_gust_zero_dash",
      "hourly_wind", "hourly_wind_gust", "hourly_precipitation",
      "hourly_humidity", "hourly_wind_icons",
      "daily_wind", "daily_wind_gust", "daily_precipitation",
      "daily_humidity", "daily_wind_icons",
    ];
    boolKeys.forEach((k) => {
      if (k in upgradedConfig && typeof upgradedConfig[k] === "string") {
        if (upgradedConfig[k].toLowerCase() === "false") upgradedConfig[k] = false;
        else if (upgradedConfig[k].toLowerCase() === "true") upgradedConfig[k] = true;
      }
    });

    // Conversion des chaînes numériques en nombres
    const numKeys = ["number_of_daily_forecasts", "number_of_hourly_forecasts", "number_of_forecasts"];
    numKeys.forEach((k) => {
      if (k in upgradedConfig && typeof upgradedConfig[k] === "string") {
        const n = Number(upgradedConfig[k]);
        if (!Number.isNaN(n)) upgradedConfig[k] = n;
      }
    });

    // Initialisation des sous-options horaires manquantes pour toute config activant les prévisions horaires
    if (upgradedConfig["hourly_forecast"] !== false) {
      if (upgradedConfig["hourly_wind"] === undefined) upgradedConfig["hourly_wind"] = true;
      if (upgradedConfig["hourly_wind_gust"] === undefined) upgradedConfig["hourly_wind_gust"] = true;
      if (upgradedConfig["hourly_precipitation"] === undefined) upgradedConfig["hourly_precipitation"] = true;
      if (upgradedConfig["hourly_humidity"] === undefined) upgradedConfig["hourly_humidity"] = true;
      if (upgradedConfig["hourly_wind_icons"] === undefined) upgradedConfig["hourly_wind_icons"] = true;
    }

    // Initialisation des sous-options journalières manquantes pour toute config activant les prévisions journalières
    if (upgradedConfig["daily_forecast"] !== false) {
      if (upgradedConfig["daily_wind"] === undefined) upgradedConfig["daily_wind"] = true;
      if (upgradedConfig["daily_wind_gust"] === undefined) upgradedConfig["daily_wind_gust"] = true;
      if (upgradedConfig["daily_precipitation"] === undefined) upgradedConfig["daily_precipitation"] = true;
      if (upgradedConfig["daily_humidity"] === undefined) upgradedConfig["daily_humidity"] = true;
      if (upgradedConfig["daily_wind_icons"] === undefined) upgradedConfig["daily_wind_icons"] = true;
    }

    // Migration de la clé "forecast" dépréciée (HA < 2023.1 stockait les prévisions dans les attributs ;
    // depuis 2023.1 les prévisions passent par souscription, donc attributes.forecast est toujours undefined.
    // Par défaut : daily_forecast, le mode le plus courant pour Météo France).
    if (config["forecast"] !== undefined && config["daily_forecast"] === undefined && config["hourly_forecast"] === undefined) {
      upgradedConfig["daily_forecast"] = config["forecast"];
      upgradedConfig["hourly_forecast"] = false;
    }
    if (config["number_of_forecasts"] !== undefined) {
      if (upgradedConfig["daily_forecast"] !== false && config["number_of_daily_forecasts"] === undefined) {
        upgradedConfig["number_of_daily_forecasts"] = config["number_of_forecasts"];
      }
      if (upgradedConfig["hourly_forecast"] !== false && config["number_of_hourly_forecasts"] === undefined) {
        upgradedConfig["number_of_hourly_forecasts"] = config["number_of_forecasts"];
      }
    }
    return upgradedConfig;
  }

  setConfig(config) {
    if (!config.entity) {
      throw new Error("Please define a weather entity");
    }
    this._config = this.upgradeConfig(config);
  }

  shouldUpdate(changedProps) {
    return hasConfigOrEntityChanged(this, changedProps);
  }

  isSelected(option) {
    return option === undefined || option === true;
  }

  getTranslations() {
    const lang = (this.hass.language || "en").split("-")[0];
    return translations[lang] || translations["en"];
  }

  getTimeFormatOptions() {
    const timeFormat = this.hass.locale?.time_format;
    if (timeFormat === "12") return { "hour12": true };
    if (timeFormat === "24") return { "hour12": false };
    return {};
  }

_unsubscribeDailyForecastEvents() {
    if (this._daily_subscribed) {
      this._daily_subscribed.then((unsub) => unsub());
      this._daily_subscribed = undefined;
    }
  }

  _unsubscribeHourlyForecastEvents() {
    if (this._hourly_subscribed) {
      this._hourly_subscribed.then((unsub) => unsub());
      this._hourly_subscribed = undefined;
    }
  }

  async _subscribeDailyForecastEvents() {
    this._unsubscribeDailyForecastEvents();
    if (
      !this.isConnected ||
      !this.hass ||
      !this._config ||
      !this.isSelected(this._config.daily_forecast)
    ) {
      return;
    }

    this._daily_subscribed = this.hass.connection.subscribeMessage(
      (event) => {
        this._dailyForecastEvent = event;
      },
      {
        "type": "weather/subscribe_forecast",
        "forecast_type": "daily",
        "entity_id": this._config.entity,
      }
    );
  }

  async _subscribeHourlyForecastEvents() {
    this._unsubscribeHourlyForecastEvents();
    if (
      !this.isConnected ||
      !this.hass ||
      !this._config ||
      !this.isSelected(this._config.hourly_forecast)
    ) {
      return;
    }

    this._hourly_subscribed = this.hass.connection.subscribeMessage(
      (event) => {
        this._hourlyForecastEvent = event;
      },
      {
        "type": "weather/subscribe_forecast",
        "forecast_type": "hourly",
        "entity_id": this._config.entity,
      }
    );
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.hasUpdated && this._config && this.hass) {
      this._subscribeDailyForecastEvents();
      this._subscribeHourlyForecastEvents();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._unsubscribeDailyForecastEvents();
    this._unsubscribeHourlyForecastEvents();
  }

  updated(changedProps) {
    if (!this.hass || !this._config) {
      return;
    }
    if (changedProps.has("_config") || !this._daily_subscribed) {
      this._subscribeDailyForecastEvents();
    }
    if (changedProps.has("_config") || !this._hourly_subscribed) {
      this._subscribeHourlyForecastEvents();
    }
  }

  render() {
    if (!this._config || !this.hass) {
      return html``;
    }

    this.numberElements = 0;

    const stateObj = this.hass.states[this._config.entity];

    if (!stateObj) {
      const t = this.getTranslations();
      return html`
        <ha-card>
          <div class="not-found" role="alert">
            ${t.entityNotAvailable}${this._config.entity}
          </div>
        </ha-card>
      `;
    }

    const tapAction = this._config.tap_action || { action: "more-info" };
    const hasAction =
      tapAction.action !== "none" ||
      (this._config.hold_action && this._config.hold_action.action !== "none") ||
      (this._config.double_tap_action &&
        this._config.double_tap_action.action !== "none");

    return html`
      <ha-card
        ?interactive=${hasAction}
        tabindex="${hasAction ? "0" : "-1"}"
        @click="${this._handleTap}"
        @keydown="${this._handleKeyDown}"
        @pointerdown="${this._handlePointerDown}"
        @pointerup="${this._cancelHold}"
        @pointercancel="${this._cancelHold}"
      >
        ${this.isSelected(this._config.current)
          ? this.renderCurrent(stateObj)
          : ""}
        ${this.isSelected(this._config.details)
          ? this.renderDetails(stateObj)
          : ""}
        ${this.isSelected(this._config.details) && this.isSelected(this._config.alert_forecast)
          ? this.renderAlertForecast()
          : ""}
        ${this.isSelected(this._config.details) && this.isSelected(this._config.one_hour_forecast)
          ? this.renderOneHourForecast()
          : ""}
        ${this.isSelected(this._config.hourly_forecast)
          ? this.renderForecast(this._hourlyForecastEvent, this._config.number_of_hourly_forecasts)
          : ""}
        ${this.isSelected(this._config.daily_forecast)
          ? this.renderForecast(this._dailyForecastEvent, this._config.number_of_daily_forecasts)
          : ""}
      </ha-card>
    `;
  }

  renderCurrent(stateObj) {
    this.numberElements++;
    return html`
      <ul class="flow-row current">
        <li
          title="${this.getPhenomenaText(stateObj.state, this.isNightTime())}"
          style="background: none, url('${this.getWeatherIcon(
            stateObj.state.toLowerCase(),
            this.isNightTime()
          )}') no-repeat; background-size: contain;"
        ></li>
        <li>
          ${this.getPhenomenaText(stateObj.state, this.isNightTime())}
          ${this.isSelected(this._config.show_name)
            ? html`<div>${this._config.name !== undefined ? this._config.name : ""}</div>`
            : ""}
        </li>
        <li>
          ${this.isSelected(this._config.show_temperature) ? html`
            ${this._config.temperature_entity
              ? this.hass.states[this._config.temperature_entity]?.state
              : (this.getUnit("temperature") == "°F"
                  ? Math.round(stateObj.attributes.temperature)
                  : stateObj.attributes.temperature)}
            <sup>${this.getUnit("temperature")}</sup>
          ` : ""}
          <ul>
            ${this.renderMeteoFranceDetail(
              this.hass.states[this._config.detailEntity]
            )}
          </ul>
        </li>
      </ul>
    `;
  }

  renderDetails(stateObj) {
    const sun = this.hass.states["sun.sun"];
    const lang = this.hass.language;
    const timeZone = this.hass.config.time_zone;
    const t = this.getTranslations();
    let next_rising;
    let next_setting;

    if (sun) {
      next_rising = new Date(sun.attributes.next_rising);
      next_setting = new Date(sun.attributes.next_setting);
    }

    this.numberElements++;

    return html`
      <div class="flow-row details-wrapper${this.numberElements > 1 ? " spacer" : ""}">
        ${this._config.show_details_columns !== false ? html`<ul class="details-col">
          <!-- Nébulosité -->
          ${this.renderMeteoFranceDetail(
            this.hass.states[this._config.cloudCoverEntity]
          )}
          <!-- Pluie -->
          ${this.renderMeteoFranceDetail(
            this.hass.states[this._config.rainChanceEntity]
          )}
          <!-- Gel -->
          ${this.renderMeteoFranceDetail(
            this.hass.states[this._config.freezeChanceEntity]
          )}
          <!-- Neige -->
          ${this.renderMeteoFranceDetail(
            this.hass.states[this._config.snowChanceEntity]
          )}
        </ul>` : ""}
        ${this._config.show_details_columns !== false ? html`<ul class="details-col details-col-right">
          <!-- Vent + Rafales -->
          <li>
            <ha-icon icon="mdi:weather-windy" title="${t.wind}"></ha-icon>
            ${(stateObj.attributes.wind_bearing == null
              ? " "
              : t.windDirections[
                  parseInt((stateObj.attributes.wind_bearing + 11.25) / 22.5)
                ] + " ") + stateObj.attributes.wind_speed} ${this.getUnit("speed")}
            ${stateObj.attributes.wind_gust_speed != null
              ? html`<div style="clear:both"><ha-icon icon="mdi:weather-windy-variant" title="${t.windGust}"></ha-icon>${this._config.wind_gust_zero_dash !== false && stateObj.attributes.wind_gust_speed == 0 ? "-" : `${stateObj.attributes.wind_gust_speed} ${this.getUnit("speed")} ${t.windGustMax}`}</div>`
              : ""}
          </li>
          <!-- Humidité -->
          ${this.renderDetail(
            stateObj.attributes.humidity,
            t.humidity,
            "mdi:water-percent",
            "%"
          )}
          <!-- Pression -->
          ${this.renderDetail(
            stateObj.attributes.pressure,
            t.pressure,
            "mdi:gauge",
            this.getUnit("air_pressure")
          )}
          <!-- UV -->
          ${this.renderMeteoFranceDetail(this.hass.states[this._config.uvEntity], t.uvIndex, t.uvIndexUnit)}
        </ul>` : ""}
      </div>
      <ul class="flow-row details">
        <!-- Lever du soleil -->
        ${this.isSelected(this._config.show_sun) && next_rising
          ? this.renderDetail(
              next_rising.toLocaleTimeString(lang, { "hour": "2-digit", "minute": "2-digit", "timeZone": timeZone, ...this.getTimeFormatOptions() }),
              t.sunrise,
              "mdi:weather-sunset-up"
            )
          : ""}
        <!-- Coucher du soleil -->
        ${this.isSelected(this._config.show_sun) && next_setting
          ? this.renderDetail(
              next_setting.toLocaleTimeString(lang, { "hour": "2-digit", "minute": "2-digit", "timeZone": timeZone, ...this.getTimeFormatOptions() }),
              t.sunset,
              "mdi:weather-sunset-down"
            )
          : ""}
      </ul>
    `;
  }

  renderMeteoFranceDetail(entity, labelOverride, unitOverride) {
    return entity !== undefined
      ? this.renderDetail(
          entity.state,
          labelOverride || entity.attributes.friendly_name,
          entity.attributes.icon,
          unitOverride !== undefined ? unitOverride : entity.attributes.unit_of_measurement
        )
      : "";
  }

  renderDetail(state, label, icon, unit) {
    return html`
      <li>
        <ha-icon icon="${icon}" title="${label}"></ha-icon>
        ${state} ${unit ? html`${unit}` : ""}
      </li>
    `;
  }

  renderOneHourForecast() {
    const rainForecast = this.hass.states[this._config.rainForecastEntity];

    if (!rainForecast || !rainForecast.attributes || !rainForecast.attributes["1_hour_forecast"]) {
      return html``;
    }

    this.numberElements++;

    let [startTime, endTime] = this.getOneHourForecastTime(rainForecast);

    return html` <ul
        class="flow-row oneHourHeader ${this.numberElements > 1
          ? " spacer"
          : ""}"
      >
        <li>${startTime}</li>
        <li>${this.getOneHourNextRainText(rainForecast)}</li>
        <li>${endTime}</li>
      </ul>
      <ul class="flow-row oneHour">
        ${html`
          ${this.getOneHourForecast(rainForecast).map(
            (forecast) => html` <li
              class="rain-${forecast[0]}min"
              style="opacity: ${forecast[1]}"
              title="${this.getTranslations().rainIntensity[forecast[2]] || forecast[2]}"
            ></li>`
          )}
        `}
      </ul>
      <ul class="flow-row oneHourLabel">
        <li></li>
        <li>10</li>
        <li>20</li>
        <li>30</li>
        <li>40</li>
        <li>50</li>
      </ul>`;
  }

  renderAlertForecast() {
    const alertForecast = this.hass.states[this._config.alertEntity];

    if (!alertForecast) {
      return html``;
    }

    const alerts = this.getAlertForecast(alertForecast);

    if (alerts.length == 0) return html``;

    this.numberElements++;

    return html` <div
      class="flow-row alertForecast ${this.numberElements > 1 ? " spacer" : ""}"
    >
      ${alerts.map(
        (phenomenon) => html` <div class="alertForecast${phenomenon.color}">
          <ha-icon
            icon="${phenomenon.icon}"
            title="${phenomenon.name}"
          ></ha-icon>
        </div>`
      )}
    </div>`;
  }

  renderForecast(forecast, number_of_forecasts) {
    if (!forecast || !forecast.forecast || forecast.forecast.length === 0) {
      return html``;
    }

    const lang = this.hass.language;
    const isDaily = forecast.type === "daily";

    this.numberElements++;
    return html`  <div style="overflow-x:auto;"> <ul
      class="flow-row forecast ${this.numberElements > 1 ? " spacer" : ""}"
    >
      ${forecast.forecast
        .slice(
          0,
          number_of_forecasts
            ? number_of_forecasts
            : 5
        )
        .map((daily) => this.renderDailyForecast(daily, lang, isDaily))}
    </ul></div>`;
  }

  renderDailyForecast(daily, lang, isDaily) {
    const p = isDaily ? "daily_" : "hourly_";
    const cfg = {
      "details":       this.isSelected(this._config[p + "details"]),
      "wind":          this.isSelected(this._config[p + "wind"]),
      "windGust":      this.isSelected(this._config[p + "wind_gust"]),
      "precipitation": this.isSelected(this._config[p + "precipitation"]),
      "humidity":      this.isSelected(this._config[p + "humidity"]),
      "windIcons":     this.isSelected(this._config[p + "wind_icons"]),
    };
    return html` <li>
      <ul class="flow-column day">
        <li>
          ${isDaily
            ? new Date(daily.datetime).toLocaleDateString(lang, {
                weekday: "short",
                day: "numeric",
                timeZone: this.hass.config.time_zone,
              })
            : new Date(daily.datetime).toLocaleTimeString(lang, {
                "hour": "2-digit",
                "minute": "2-digit",
                "timeZone": this.hass.config.time_zone,
                ...this.getTimeFormatOptions(),
              })}
        </li>
        <li
          class="icon"
          title="${this.getPhenomenaText(daily.condition, !isDaily && this.isNightTime(daily.datetime))}"
          style="background: none, url('${this.getWeatherIcon(
            daily.condition.toLowerCase(),
            !isDaily && this.isNightTime(daily.datetime)
          )}') no-repeat; background-size: contain"
        ></li>
        <li class="highTemp">
          ${daily.temperature} ${this.getUnit("temperature")}
        </li>
        ${daily.templow !== undefined
          ? html`
              <li class="lowTemp">
                ${daily.templow} ${this.getUnit("temperature")}
              </li>
            `
          : ""}
        ${cfg.precipitation && cfg.details &&
        daily.precipitation !== undefined && daily.precipitation !== null
          ? html`
              <li class="precipitation">
                ${Math.round(daily.precipitation * 10) / 10}
                ${this.getUnit("precipitation")}
              </li>
            `
          : ""}
        ${cfg.humidity && cfg.details &&
        daily.humidity !== undefined && daily.humidity !== null
          ? html`
              <li class="humidity">
                ${Math.round(daily.humidity)}
                ${this.getUnit("humidity")}
              </li>
            `
          : ""}
        ${cfg.precipitation &&
        daily.precipitation_probability !== undefined && daily.precipitation_probability !== null
          ? html`
              <li class="precipitation_probability">
                ${Math.round(daily.precipitation_probability)}
                ${this.getUnit("precipitation_probability")}
              </li>
            `
          : ""}
        ${cfg.wind && cfg.details &&
        daily.wind_speed !== undefined && daily.wind_speed !== null
          ? html`
              <li class="wind_speed">
                ${Math.round(daily.wind_speed)} ${this.getUnit("speed")}
              </li>
            `
          : ""}
        ${cfg.wind && cfg.windGust && cfg.details && (daily.wind_gust_speed !== undefined && daily.wind_gust_speed !== null)
          ? html`
              <li class="wind_gust_speed" style="${daily.wind_gust_speed != null && Math.round(daily.wind_gust_speed) !== 0 ? "background: red; color: white;" : ""}">
                ${(() => { const v = daily.wind_gust_speed; return (v == null || (this._config.wind_gust_zero_dash !== false && Math.round(v) === 0)) ? "-" : `${Math.round(v)} ${this.getUnit("speed")}`; })()}
              </li>
            `
          : ""}
        ${cfg.windIcons && daily.wind_bearing != null
          ? html`
              <li class="icon"
                style="background: none, url('/local/community/lovelace-meteofrance-weather-card/icons/arrow-north-static.svg'); background-size: contain; transform: rotate(${daily.wind_bearing + 180}deg) scale(0.5)">
              </li>
            `
          : ""}
        ${cfg.windIcons && daily.wind_bearing === null
          ? html`
              <li class="icon"
                style="background: none, url('/local/community/lovelace-meteofrance-weather-card/icons/no-wind-bearing-static.svg'); background-size: contain; transform: scale(0.5)">
              </li>
            `
          : ""}
      </ul>
    </li>`;
  }

  isNightTime(datetimehourly) {
    const sun = this.hass.states["sun.sun"];
    if (!sun) {
      return false;
    }

    let nextrising = new Date(sun.attributes.next_rising);
    let nextsetting = new Date(sun.attributes.next_setting);

    const thistime = datetimehourly ? new Date(datetimehourly) : new Date();

    return (
      (thistime > nextsetting && thistime < nextrising) ||
      (thistime < nextsetting &&
        thistime < nextrising &&
        nextrising < nextsetting)
    );
  }

  getOneHourForecast(rainForecastEntity) {
    let rainForecastList = [];
    const forecastAttr = rainForecastEntity.attributes["1_hour_forecast"];
    if (!forecastAttr) return rainForecastList;
    for (let [time, value] of Object.entries(forecastAttr)) {
      if (time != undefined && time.match(/[0-9]*min/g)) {
        time = time.replace("min", "").trim();
        rainForecastList.push([time, rainForecastValues.get(value), value]);
      }
    }

    return rainForecastList;
  }

  getOneHourForecastTime(rainForecastEntity) {
    const lang = this.hass.language;
    const timeZone = this.hass.config.time_zone;
    const timeRefRaw = rainForecastEntity.attributes["forecast_time_ref"];
    let rainForecastTimeRef = timeRefRaw ? new Date(timeRefRaw) : new Date();
    const timeFormatOptions = this.getTimeFormatOptions();
    let rainForecastStartTime = rainForecastTimeRef.toLocaleTimeString(lang, {
      "hour": "2-digit",
      "minute": "2-digit",
      "timeZone": timeZone,
      ...timeFormatOptions,
    });
    rainForecastTimeRef.setHours(rainForecastTimeRef.getHours() + 1);
    let rainForecastEndTime = rainForecastTimeRef.toLocaleTimeString(lang, {
      "hour": "2-digit",
      "minute": "2-digit",
      "timeZone": timeZone,
      ...timeFormatOptions,
    });

    return [rainForecastStartTime, rainForecastEndTime];
  }

  getOneHourNextRainText(rainForecastEntity) {
    const t = this.getTranslations();
    for (let [time, value] of Object.entries(
      rainForecastEntity.attributes["1_hour_forecast"]
    )) {
      if (time != undefined && rainForecastValues.get(value) > 0.1) {
        let timeStr = time.replace(/([345])5/g, "$10");
        const label = t.rainIntensity[value] || value;
        return label + (time == "0 min" ? t.rainNow : t.rainIn + timeStr + ".");
      }
    }

    return t.noRainInHour;
  }

  getAlertForecast(alertEntity) {
    if (alertEntity == undefined) {
      return [];
    }

    const t = this.getTranslations();
    const alertDefs = [
      { key: "Vent violent",      hide: "hide_alertVentViolent",      icon: "mdi:weather-windy" },
      { key: "Pluie-inondation",  hide: "hide_alertPluieInondation",  icon: "mdi:weather-pouring" },
      { key: "Orages",            hide: "hide_alertOrages",           icon: "mdi:weather-lightning" },
      { key: "Inondation",        hide: "hide_alertInondation",       icon: "mdi:home-flood" },
      { key: "Neige-verglas",     hide: "hide_alertNeigeVerglas",     icon: "mdi:weather-snowy-heavy" },
      { key: "Canicule",          hide: "hide_alertCanicule",         icon: "mdi:weather-sunny-alert" },
      { key: "Grand-froid",       hide: "hide_alertGrandFroid",       icon: "mdi:snowflake" },
      { key: "Avalanches",        hide: "hide_alertAvalanches",       icon: "mdi:image-filter-hdr" },
      { key: "Vagues-submersion", hide: "hide_alertVaguesSubmersion", icon: "mdi:waves" },
    ];

    return alertDefs
      .filter((a) => !this._config[a.hide] && alertEntity.attributes[a.key])
      .map((a) => ({
        "name": t.alerts[a.key] || a.key,
        "icon": a.icon,
        "color": alertEntity.attributes[a.key],
      }));
  }

  getWeatherIcon(condition, isNight) {
    return `${
      this._config.icons
        ? this._config.icons
        : "/local/community/lovelace-meteofrance-weather-card/icons/"
    }${isNight ? weatherIconsNight[condition] : weatherIconsDay[condition]}${
      this.isSelected(this._config.animated_icons) ? "" : "-static"
    }.svg`;
  }

  getPhenomenaText(phenomena, isNight) {
    const t = this.getTranslations();
    const text = isNight
      ? (t.conditionsNightOverride[phenomena] || t.conditions[phenomena])
      : t.conditions[phenomena];
    return text || phenomena;
  }

  getUnit(measure) {
    const lengthUnit = this.hass.config.unit_system.length;
    switch (measure) {
      case "air_pressure":
        return lengthUnit === "km" ? "hPa" : "inHg";
      case "length":
        return lengthUnit;
      case "precipitation":
        return lengthUnit === "km" ? "mm" : "in";
      case "precipitation_probability":
        return "%";
      case "humidity":
        return "%";
      case "speed":
        return lengthUnit === "km" ? "km/h" : "mph";
      default:
        return this.hass.config.unit_system[measure] || "";
    }
  }

  _executeAction(action) {
    if (!action || action.action === "none") return;
    switch (action.action) {
      
      case "more-info":
        fireEvent(this, "hass-more-info", { 
          entityId: action.entity || action.entity_id || this._config.entity 
        });
        break;

      case "navigate":
        if (action.navigation_path) {
          window.history.pushState(null, "", action.navigation_path);
          fireEvent(window, "location-changed");
        }
        break;

      case "url":
        if (action.url_path) {
          window.open(action.url_path, "_blank");
        }
        break;

      case "perform-action":
      case "call-service": {
        const serviceStr = action.action_name || action.service || action.perform_action || "";
        const [domain, service] = serviceStr.split(".");
        if (domain && service) {
          this.hass.callService(
            domain, 
            service, 
            action.action_data || action.service_data || action.data || {}, 
            action.target
          );
        }
        break;
      }

      case "fire-dom-event":
        fireEvent(this, "ll-custom", action);
        break;
    }
  }

  _handleTap() {
    if (this._longPress) {
      this._longPress = false;
      return;
    }
    const tapAction = this._config.tap_action || { action: "more-info" };
    const doubleTapAction = this._config.double_tap_action;

    if (doubleTapAction && doubleTapAction.action !== "none") {
      if (this._tapTimeout) {
        clearTimeout(this._tapTimeout);
        this._tapTimeout = undefined;
        this._executeAction(doubleTapAction);
      } else {
        this._tapTimeout = setTimeout(() => {
          this._tapTimeout = undefined;
          this._executeAction(tapAction);
        }, 400);
      }
    } else {
      this._executeAction(tapAction);
    }
  }

  _handlePointerDown(ev) {
    if (ev.button !== 0) return;
    this._longPress = false;
    this._holdTimeout = setTimeout(() => {
      this._longPress = true;
      this._executeAction(this._config.hold_action);
    }, 500);
  }

  _cancelHold() {
    if (this._holdTimeout) {
      clearTimeout(this._holdTimeout);
      this._holdTimeout = undefined;
    }
  }

    _handleKeyDown(ev) {
      if (ev.key === "Enter" || ev.key === " ") {
        ev.preventDefault();
        this._handleTap();
      }
    }

  getCardSize() {
    return 3;
  }

  static get styles() {
    return css`
      ha-card {
        margin: auto;
        overflow: hidden;
        padding: 0.5em 1em;
        position: relative;
      }

      ha-card[interactive] {
        cursor: pointer;
      }

      .not-found {
        flex: 1;
        background-color: var(--warning-color, #f9ca24);
        color: var(--primary-text-color);
        padding: 8px;
        border-radius: 4px;
      }

      ha-card ul {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      .spacer {
        padding-top: 1em;
      }

      .clear {
        clear: both;
      }

      .flow-row {
        display: flex;
        flex-flow: row wrap;
      }

      .flow-column {
        display: flex;
        flex-flow: column wrap;
      }

      .ha-icon {
        height: 0.8em;
        margin-right: 5px;
        color: var(--state-icon-color);
      }

      /* Météo actuelle */
      .current {
        flex-wrap: nowrap;
      }

      .current > *:first-child {
        min-width: 100px;
        height: 100px;
        margin-right: 10px;
      }

      .current > *:last-child {
        margin-left: auto;
        min-width: max-content;
        text-align: right;
      }

      .current > *:last-child sup {
        font-size: initial;
      }

      .current > li {
        font-size: 2em;
        line-height: 1.2;
        align-self: center;
      }

      .current > li > *:last-child {
        line-height: 1;
        font-size: 0.6em;
        color: var(--secondary-text-color);
      }

      /* Détails */
      .details {
        justify-content: space-between;
        font-weight: 300;
      }

      .details > li {
        flex-basis: auto;
        width: 50%;
      }

      .details > li:nth-child(2n) {
        text-align: right;
      }

      .details > li:nth-child(2n) ha-icon {
        margin-right: 0;
        margin-left: 8px;
        float: right;
      }

      .details-wrapper {
        display: flex;
        justify-content: space-between;
        font-weight: 300;
      }

      .details-col {
        width: 50%;
        padding: 0;
        margin: 0;
        list-style: none;
      }

      .details-col ha-icon {
        height: 22px;
        margin-right: 5px;
        color: var(--state-icon-color);
      }

      .details-col-right {
        text-align: right;
      }

      .details-col-right li {
        overflow: hidden;
      }

      .details-col-right ha-icon {
        margin-right: 0;
        margin-left: 8px;
        float: right;
      }

      /* Prévisions dans l'heure */
      .oneHour {
        height: 1em;
      }

      .oneHour > li {
        background-color: var(--state-icon-color);
        border-right: 1px solid
          var(--lovelace-background, var(--primary-background-color));
      }

      .oneHour > li:first-child {
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
      }

      .oneHour > li:last-child {
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
        border: 0;
      }

      /* Étiquettes de l'heure */
      .rain-0min,
      .rain-5min,
      .rain-10min,
      .rain-15min,
      .rain-20min,
      .rain-25min {
        flex: 1 1 0;
      }

      .rain-35min,
      .rain-45min,
      .rain-55min {
        flex: 2 1 0;
      }

      .oneHourLabel > li {
        flex: 1 1 0;
      }

      /* En-tête de l'heure */
      .oneHourHeader {
        justify-content: space-between;
      }

      .oneHourHeader li:last-child {
        text-align: right;
      }

      /* Alerte */
      .alertForecast {
        text-align: center;
        flex-wrap: nowrap;
      }

      .alertForecast > div {
        flex: 1;
        border: 0;
        border-radius: 5px;
        margin-left: 1px;
        margin-right: 1px;
      }

      .alertForecastVert {
        border: 2px solid var(--success-color, #4CAF50);
        color: var(--success-color, #4CAF50);
      }

      .alertForecastJaune {
        background-color: #f9ca24;
        color: #333;
      }

      .alertForecastOrange {
        background-color: #f0932b;
        color: #fff;
      }

      .alertForecastRouge {
        background-color: #eb4d4b;
        color: #fff;
      }

      /* Prévisions */
      .forecast {
        justify-content: space-between;
        flex-wrap: nowrap;
      }

      .forecast > li {
        flex: 1;
        border-right: 0.1em solid var(--divider-color, #d9d9d9);
      }

      .forecast > *:last-child {
        border-right: 0;
      }

      .forecast ul.day {
        align-items: center;
        width: auto;
      }

      .forecast ul.day > *:first-child {
        text-transform: uppercase;
      }

      .forecast ul.day .highTemp {
        font-weight: bold;
      }

      .forecast ul.day .lowTemp {
        color: var(--secondary-text-color);
      }

      .forecast ul.day .icon {
        width: 50px;
        height: 50px;
      }
    `;
  }
}
customElements.define("meteofrance-weather-card", MeteofranceWeatherCard);
