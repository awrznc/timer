import { List } from './list.js';
import { Button } from './button.js';
import { Timer } from './timer.js';

export class TimerApplication {

  // Constructor.
  constructor( id, document ) {

    let seconds = 3;
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
        return false;
      };
    }
  }
}

// TimerApplication.
let app = new TimerApplication('timer', document);
