const form = document.querySelector('.event-form'),
  inputGroup = document.querySelectorAll('.input-group'),
  eventDate = document.querySelector('.event-date'),
  startTime = document.querySelector('.start-time'),
  endTime = document.querySelector('.end-time'),
  eLocation = document.querySelector('.location'),
  eName = document.querySelector('.name'),
  stringPattern = /^[a-zA-Z0-9]{3,}\s+$/,
  eventSection = document.querySelector('.events-section'),
  eventItems = document.querySelector('.event-items'),
  eventMessage = document.querySelector('.event-message');

let data;

// function to store data in local storage
const storeData = (eventDate, startTime, endTime, eLocation, eName) => {
  if (!localStorage.getItem('itemName')) {
    localStorage.setItem('itemName',JSON.stringify([]));
  }
  let getData = JSON.parse(localStorage.getItem('itemName'));

  const dataObj = {
    eventDate: eventDate,
    startTime: startTime,
    endTime: endTime,
    eLocation: eLocation,
    eName: eName
  }
  getData.push(dataObj)
  localStorage.setItem('itemName', JSON.stringify(getData));
}

if (form) {
  // input validation
  const validateInput = (input, pattern, err) => {
    if (input.value) {
      input.nextElementSibling.classList.remove("show-error");
      if (pattern.test(input.value)) {
        input.nextElementSibling.classList.remove("show-error");
        return true;
      } else {
        input.nextElementSibling.classList.add("show-error");
        input.nextElementSibling.innerText = err;
        return false;
      }
    } else {
      input.nextElementSibling.classList.add("show-error");
      input.nextElementSibling.innerText = '*Field is required';
      return false;
    }
  }

  // submit function
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (eventDate.value && startTime.value && endTime.value && eLocation.value && eName.value) {
      storeData(eventDate.value, startTime.value, endTime.value, eLocation.value, eName.value);
      location.href = 'events.html';
      form.reset();
    } else {
      validateInput(eventDate);
      validateInput(startTime);
      validateInput(endTime);
      validateInput(eLocation);
      validateInput(eName, stringPattern, '*Please enter minimum three characters');
    }
  });
}

// to check local storage is empty or not
const eventData = () => {
  data = localStorage.getItem('itemName');
  if (data) {    
    eventMessage.classList.add('hide-content');
    sortData(JSON.parse(data));
  } else {
    eventMessage.classList.remove('hide-content');
    localStorage.setItem('itemName', JSON.stringify([]));
  }
}

// sorting data and creating object
const sortData = (data) => {
  let tempArr = [];
  let temp = {
    year: {}
  };
  data.forEach(obj => {
    let showDate = obj.eventDate;
    const yearDate = new Date(showDate).getFullYear();
    if (temp.year[`${yearDate}`] == undefined) {
      temp.year[`${yearDate}`] = [];
      temp.year[`${yearDate}`].push(obj);
      tempArr.push(yearDate);
    } else {
      temp.year[`${yearDate}`].push(obj);
    }
  });
  showData(tempArr, temp);
}

// to show data in UI
const showData = (arr1, data) => {
  arr1.forEach(el => {
    if (data.year[el] != undefined) {
      const ul = document.createElement('ul');
      ul.classList.add('event-data');
      const li = document.createElement('li');
      li.classList.add('event-list');
      data.year[el].map((objList)=>{
        let eMonth = new Date(objList.eventDate).toLocaleString('default', { month: 'long' }),
          eDay = new Date(objList.eventDate).toLocaleString("en", { weekday: "long" }),
          [sH,sM] = objList.startTime.split(':');
          [eH,eM] = objList.endTime.split(':');
        li.innerHTML = `<h3><span class="event-month">${eMonth}</span> <span class="event-year">${new Date(objList.eventDate).getFullYear()}</span></h3>
        `;
    
        ul.innerHTML += `<li class="data-list">
            <div class="date-data">
              <span class="schedule-date">${new Date(objList.eventDate).getDate()}</span>
              <span class="schedule-month">${new Date(objList.eventDate).toDateString().split(' ')[1]}</span>
            </div>
            <div class="event-details">
              <h4><span class="event-day">${eDay}</span> <span class="start-event">${sH >= 12 ? sH-12 : sH}:${sM}${sH >= 12 ? 'PM' : 'AM'}</span>-<span class="end-event">${eH >= 12 ? eH-12 : eH}:${eM}${eH >= 12 ? 'PM' : 'AM'}</span></h4>
              <p class="event-location">${objList.eLocation}</p>
              <h5 class="event-name">${objList.eName}</h5>
            </div>
          </li>
      </li>`
      })

      li.appendChild(ul);
      eventItems.appendChild(li);
    }
  });
}

if (eventSection) {
  document.onload = eventData();
}






















