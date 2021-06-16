import { List } from './list.js';
import { Button } from './button.js';

export class TimerApplication {

  // Constructor.
  constructor( id, document, min, sec ) {

    // Application
    this.app = document.getElementById( id );
    this.app.insertAdjacentHTML('beforeend', `<div id="tt"></div>`);

    // Timer
    this.minutes = min;
    this.seconds = sec;
    let allSec = (min * 60) + sec;
    this.timer = document.getElementById( 'tt' );

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
        let diff = ld.getTime() - nd.getTime();
        let sec = Math.floor( diff / 1000 ) % 60;
        let min = Math.floor( diff / 1000 / 60 ) % 60;

        document.getElementById('min').textContent = String(min).padStart(2, '0');
        document.getElementById('sec').textContent = String(sec).padStart(2, '0');

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

    // Button
    this.app.insertAdjacentHTML('beforeend', `<div id="timer-button"></div>`);
    this.app.insertAdjacentHTML('beforeend', `<p style="font-size: 4em; margin: 0px;">Drawing</p>`);
    let button = new Button(document.getElementById('timer-button'), 'start');

    // List
    this.app.insertAdjacentHTML('beforeend', `<div id="listApp"></div>`);
    let list = new List(document.getElementById('listApp'));
    list.add('Buffer.');
    list.addClass('current-list', 0);

    // Plus button.
    this.app.insertAdjacentHTML('beforeend', `<div id="plus-button">+</div>`);
    document.getElementById('plus-button').onclick = function () {

      let html = `
        <div>
          <form id="form">
            <input id="rebase-title" type="text" placeholder="title" autocomplete="off" autofocus/>
          </form>
        </div>

        <div>
          min :
          <input id="minutes-output-box" type="text" value="0" style="width: 32px; text-align: center;" oninput="document.getElementById('minutes-output-bar').value=this.value"/>
          <input id="minutes-output-bar" type="range" value="0" min="0" max="59" step="1" oninput="document.getElementById('minutes-output-box').value=this.value">
        </div>

        <div>
          sec :
          <input id="seconds-output-box" type="text" value="0" style="width: 32px; text-align: center;" oninput="document.getElementById('seconds-output-bar').value=this.value"/>
          <input id="seconds-output-bar" type="range" value="0" min="0" max="59" step="1" oninput="document.getElementById('seconds-output-box').value=this.value">
        </div>
      `;
      list.add(html);
      list.addClass('future-list', list.length - 1);
      list.addClass('rebase', list.length - 1);

      let form = document.getElementById( "form" );
      form.onsubmit = function () {
        let title = 'rebase-title';
        let min = 'minutes-output-bar';
        let sec = 'seconds-output-bar';
        let inputText = document.getElementById(title).value;
        let inputMinutes = document.getElementById(min).value;
        let inputSeconds = document.getElementById(sec).value;
        let string = `${String(inputMinutes).padStart(2, '0')}:${String(inputSeconds).padStart(2, '0')} ${inputText}`;
        list.rebase(string, list.length - 1);
        // document.getElementsByClassName('rebase')[0].innerHTML = string;
        // document.getElementsByClassName('rebase')[0].classList.remove('rebase');
        return false;
      };
    }
  }
}

// TimerApplication
const seconds = 10;
const minutes = 0;
let app = new TimerApplication('timer', document, minutes, seconds);
