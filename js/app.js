class List {

  // Constructor.
  constructor(element) {
    element.insertAdjacentHTML('beforeend', '<ul></ul>');
    if(element.childNodes.length != 1) alert('[ERROR] Constructor in List class.');
    this.ul = element.childNodes[0];
  }

  // Generate "li" element.
  generate(string) {
    return `<li>${string}</li>`;
  }

  // Add "li" element.
  add(string) {
    let html_string = this.generate(string);
    this.ul.insertAdjacentHTML('beforeend', html_string);
  }

  // Remove "li" element with index.
  remove(index) {
    let li = this.ul.getElementsByTagName('li');
    if(li.length > index && -1 < index) li[index].remove();
  }

  addClass(classString, index) {
    this.ul.childNodes[index].classList.add(classString);
  }
}


class TimerApplication {

  // Constructor.
  constructor( id, min, sec ) {
    this.minutes = min;
    this.seconds = sec;
    let allSec = (min * 60) + sec;

    this.timer = document.getElementById( id );

    // Color animator.
    this.timer.classList.add('main-frame');
    this.timer.insertAdjacentHTML('beforeend', `<div class="color-animator" style="animation-duration: ${allSec - 1}s;"></div>`);
    let colorAnimator = Array.from( this.timer.getElementsByClassName('color-animator'))[0];

    // Rotate animator.
    colorAnimator.insertAdjacentHTML('beforeend', `<div class="first-rotate-animator" style="animation-duration: ${allSec - 1}s;"></div>`);
    colorAnimator.insertAdjacentHTML('beforeend', `<div class="second-rotate-animator" style="animation-duration: ${allSec - 1}s;"></div>`);

    // Add click event.
    let firstRotateAnimator = Array.from( colorAnimator.getElementsByClassName('first-rotate-animator') );
    let secondRotateAnimator = Array.from( colorAnimator.getElementsByClassName('second-rotate-animator') );
    let timer = colorAnimator;

    // Click event.
    this.timer.onclick = function () {
      console.log(sec);
      timer.classList.add('timer-color-animation');
      firstRotateAnimator.forEach(  function (eventElement) {
        eventElement.classList.add('first-rotate-animation');
      });
      secondRotateAnimator.forEach( function (eventElement) {
        eventElement.classList.add('second-rotate-animation');
      });
      let nowDate = new Date();
      let limitDate = new Date(
        nowDate.getFullYear(),
        nowDate.getMonth(),
        nowDate.getDate(),
        nowDate.getHours(),
        nowDate.getMinutes() + min,
        nowDate.getSeconds() + sec
      );

      let countdown = function (ld) {
        let nd = new Date();
        let diff   = ld . getTime() - nd.getTime();
        let sec = Math.floor( diff / 1000 ) % 60;
        let min = Math.floor( diff / 1000 / 60 ) % 60;

        document.getElementById("min").textContent = String(min).padStart(2,"0");
        document.getElementById("sec").textContent = String(sec).padStart(2,"0");
        console.log(String(sec).padStart(2,"0"));

        if(sec == 0 && min == 0) {
          return 0;
        } else {
          setTimeout(countdown, 1000, ld);
        }
      }
      countdown(limitDate);
    }

    document.addEventListener('animationend', () => {
      timer.classList.remove('timer-color-animation');
      firstRotateAnimator.forEach( function (eventElement) {
        eventElement.classList.remove('first-rotate-animation');
      });
      secondRotateAnimator.forEach( function (eventElement) {
        eventElement.classList.remove('second-rotate-animation');
      });
    });

    // Counter
    this.timer.insertAdjacentHTML('beforeend', '<div class="border"></div>');
    colorAnimator.insertAdjacentHTML('beforeend', '<div class="counter"><div class="time"><span id="min">00</span>:<span id="sec">00</span></div></div>');
  }
}

// TimerApplication
const seconds = 10;
const minutes = 0;
let app = new TimerApplication('timer', minutes, seconds);

// List
let list = new List(document.getElementById('list'));
list.add('Buffer.');
list.addClass('past-list', 0);

list.add('Rough sketching.');
list.addClass('past-list', 1);

list.add('Rough painting.');
list.addClass('past-list', 2);

list.add('Line drawing.');
list.addClass('current-list', 3);

list.add('Painting.');
list.addClass('future-list', 4);

list.add('Processing.');
list.addClass('future-list', 5);

// list.remove(0);
