navigator.serviceWorker.register("service-worker.js");
const defaultPageTitle = "Är det semester?";
const timeInput = document.getElementById("tid");
const semestertid = document.getElementById("semestertid");

timeInput.value = "12:00";

const urlParam = (name) => {
  const queryString = window.location.search;
  return new URLSearchParams(queryString).get(name);
};

if (urlParam("tid") !== null) {
  timeInput.value = urlParam("tid");
}

const getHoursAndMinutesFromString = (semesterTime) => {
  const decodedSemesterTime = decodeURIComponent(semesterTime);
  const semesterTimeSplit = decodedSemesterTime.split(":");
  const hours = parseInt(semesterTimeSplit[0]);
  const minutes = parseInt(semesterTimeSplit[1]);
  return { hours, minutes };
};

const getSemesterTime = () => {
  const semesterTime = timeInput.value;
  const today = new Date();
  document.title = defaultPageTitle + " Semestertid " + semesterTime;
  const { hours, minutes } = getHoursAndMinutesFromString(semesterTime);
  today.setHours(hours, minutes, 0, 0);
  return today.getTime();
};

const renderTimeLeft = (timeLeft, hours, minutes, seconds) => {
  if (timeLeft > 0) {
    semestertid.innerHTML = "Om <br/> " + hours + "h " + minutes + "m " + seconds + "s ";
    document.title = defaultPageTitle + " Om " + hours + "h " + minutes + "m " + seconds + "s ";
  }

  if (timeLeft < 0) {
    semestertid.textContent = "Ja! Det är semester!";
    document.title = defaultPageTitle + " Ja! Det är semester!";
  }
};

const getTimeLeft = () => {
  const now = new Date().getTime();
  const semesterTime = getSemesterTime();
  const timeLeft = semesterTime - now;
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
