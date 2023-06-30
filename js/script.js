navigator.serviceWorker.register("service-worker.js");
const defaultPageTitle = "Är det lunch?";
const timeInput = document.getElementById("tid");
const lunchtid = document.getElementById("lunchtid");

timeInput.value = "12:00";

const urlParam = (name) => {
  const queryString = window.location.search;
  return new URLSearchParams(queryString).get(name);
};

if (urlParam("tid") !== null) {
  timeInput.value = urlParam("tid");
}

const getHoursAndMinutesFromString = (lunchTime) => {
  const decodedLunchTime = decodeURIComponent(lunchTime);
  const lunchTimeSplit = decodedLunchTime.split(":");
  const hours = parseInt(lunchTimeSplit[0]);
  const minutes = parseInt(lunchTimeSplit[1]);
  return { hours, minutes };
};

const getLunchTime = () => {
  const lunchTime = timeInput.value;
  const today = new Date();
  document.title = defaultPageTitle + " Lunchtid " + lunchTime;
  const { hours, minutes } = getHoursAndMinutesFromString(lunchTime);
  today.setHours(hours, minutes, 0, 0);
  return today.getTime();
};

const renderTimeLeft = (timeLeft, hours, minutes, seconds) => {
  if (timeLeft > 0) {
    lunchtid.innerHTML = "Om <br/> " + hours + "h " + minutes + "m " + seconds + "s ";
    document.title = defaultPageTitle + " Om " + hours + "h " + minutes + "m " + seconds + "s ";
  }

  if (timeLeft < 0) {
    lunchtid.textContent = "Ja! Det är lunch!";
    document.title = defaultPageTitle + " Ja! Det är lunch!";
  }
};

const getTimeLeft = () => {
  const now = new Date().getTime();
  const lunchTime = getLunchTime();
  const timeLeft = lunchTime - now;
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
  return { timeLeft, hours, minutes, seconds };
};

const userInput = () => {
  const queryString = window.location.search;
  const params = new URLSearchParams(queryString);
  params.set("tid", timeInput.value);
  history.replaceState({ tid: timeInput.value }, "", "?" + decodeURIComponent(params.toString()));
};

const debounce = (func, delay = 1000) => {
  let timerId;
  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

const debouncedUserInput = debounce(userInput);
timeInput.addEventListener("input", debouncedUserInput, false);
setInterval(() => {
  const { timeLeft, hours, minutes, seconds } = getTimeLeft();
  renderTimeLeft(timeLeft, hours, minutes, seconds);
}, 1000);
