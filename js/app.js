import { List } from './list.js';
import { Button } from './button.js';
import { Timer } from './timer.js';

export class TimerApplication {

  // Constructor.
  constructor( id, document ) {

    let self = this;

    let seconds = 0;
    let minutes = 0;

    // Application.
    this.app = document.getElementById( id );

    // Timer.
    this.app.insertAdjacentHTML('beforeend', `<div id="circle"></div>`);
    let timer = new Timer(document.getElementById( 'circle' ), document, minutes, seconds);
    timer.update(minutes, seconds);

    // Button.
    this.app.insertAdjacentHTML('beforeend', `<div id="timer-button"></div>`);
    this.app.insertAdjacentHTML('beforeend', `<p style="font-size: 4em; margin: 0px;">Drawing</p>`);
    let button = new Button(document.getElementById('timer-button'), 'start');

    // List.
    this.app.insertAdjacentHTML('beforeend', `<div id="listApp"></div>`);
    let list = new List(document.getElementById('listApp'));
    list.add('Buffer.');
    list.addClass('current-list', 0);

    // Plus button.
    this.app.insertAdjacentHTML('beforeend', `<div id="plus-button">+</div>`);
    document.getElementById('plus-button').onclick = function () {

      // Input li.
      let li = document.createElement('li');

      // Input minutes box.
      let minutesDiv = document.createElement('div');

      let minutesTitle = document.createElement('span');
      minutesTitle.appendChild(document.createTextNode('min : '));
      minutesDiv.appendChild(minutesTitle);

      let minutesInputBox = document.createElement('input');
      minutesInputBox.setAttribute('id', 'minutes-output-box');
      minutesInputBox.setAttribute('type', 'text');
      minutesInputBox.setAttribute('value', '0');
      minutesInputBox.setAttribute('style', 'width: 32px; text-align: center;');
      minutesDiv.appendChild(minutesInputBox);

      let minutesInputBar = document.createElement('input');
      minutesInputBar.setAttribute('id', 'minutes-output-bar');
      minutesInputBar.setAttribute('type', 'range');
      minutesInputBar.setAttribute('value', '0');
      minutesInputBar.setAttribute('min', '0');
      minutesInputBar.setAttribute('max', '59');
      minutesInputBar.setAttribute('step', '1');
      function handleInput(e) {
        let inputMinutesValue = e.target.value;
        timer.minutes = inputMinutesValue;
        timer.resetMinutes = inputMinutesValue;
        timer.allSec = (timer.minutes * 60) + Number(timer.seconds);

        document.getElementById('minutes-output-box').value = inputMinutesValue;
        document.getElementById('min').textContent = inputMinutesValue;
        document.getElementsByClassName('first-rotate-animator')[0].setAttribute('style', `animation-duration: ${timer.allSec - 1}s;`);
        document.getElementsByClassName('second-rotate-animator')[0].setAttribute('style', `animation-duration: ${timer.allSec - 1}s;`);
        document.getElementsByClassName('color-animator')[0].setAttribute('style', `animation-duration: ${timer.allSec - 1}s;`);
      };
      minutesInputBar.oninput = handleInput;
      minutesDiv.appendChild(minutesInputBar);
      li.appendChild(minutesDiv);

      // Input second box.
      let secondsDiv = document.createElement('div');

      let secondsTitle = document.createElement('span');
      secondsTitle.appendChild(document.createTextNode('sec : '));
      secondsDiv.appendChild(secondsTitle);

      let secondsInputBox = document.createElement('input');
      secondsInputBox.setAttribute('id', 'seconds-output-box');
      secondsInputBox.setAttribute('type', 'text');
      secondsInputBox.setAttribute('value', '0');
      secondsInputBox.setAttribute('style', 'width: 32px; text-align: center;');
      secondsDiv.appendChild(secondsInputBox);

      let secondsInputBar = document.createElement('input');
      secondsInputBar.setAttribute('id', 'seconds-output-bar');
      secondsInputBar.setAttribute('type', 'range');
      secondsInputBar.setAttribute('value', '0');
      secondsInputBar.setAttribute('sec', '0');
      secondsInputBar.setAttribute('max', '59');
      secondsInputBar.setAttribute('step', '1');
      function handleSecondsInput(e) {
        let inputSecoundsValue = e.target.value;
        timer.seconds = inputSecoundsValue;
        timer.resetSeconds = inputSecoundsValue;
        timer.allSec = (timer.minutes * 60) + Number(timer.seconds);

        document.getElementById('seconds-output-box').value = inputSecoundsValue;
        document.getElementById('sec').textContent = inputSecoundsValue;
        document.getElementsByClassName('first-rotate-animator')[0].setAttribute('style', `animation-duration: ${timer.allSec - 1}s;`);
        document.getElementsByClassName('second-rotate-animator')[0].setAttribute('style', `animation-duration: ${timer.allSec - 1}s;`);
        document.getElementsByClassName('color-animator')[0].setAttribute('style', `animation-duration: ${timer.allSec - 1}s;`);
      };
      secondsInputBar.oninput = handleSecondsInput;

      secondsDiv.appendChild(secondsInputBar);
      li.appendChild(secondsDiv);

      // form
      let formInput = document.createElement('input');
      formInput.setAttribute('id', 'rebase-title');
      formInput.setAttribute('type', 'text');
      formInput.setAttribute('placeholder', 'title');
      formInput.setAttribute('autocomplete', 'off');
      formInput.setAttribute('autofocus', '');
      let form = document.createElement('form');
      form.setAttribute('id', 'form');
      form.onsubmit = function () {
        let title = 'rebase-title';
        let min = 'minutes-output-bar';
        let sec = 'seconds-output-bar';
        let inputText = document.getElementById(title).value;
        let inputMinutes = document.getElementById(min).value;
        let inputSeconds = document.getElementById(sec).value;
        let string = `${String(inputMinutes).padStart(2, '0')}:${String(inputSeconds).padStart(2, '0')} ${inputText}`;
        list.rebase(string, list.length - 1);
        return false;
      };
      form.appendChild(formInput);

      li.appendChild(form);

      list.addElement(li);
      list.addClass('future-list', list.length - 1);
      list.addClass('rebase', list.length - 1);
    }
  }
}

// TimerApplication.
let app = new TimerApplication('timer', document);
