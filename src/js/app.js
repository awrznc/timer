// @ts-check

import { Task } from './task.js';
import { Clock } from './clock.js';

class TriggerType {
  /** @type {Number} */
  static get CLICK() {
    return 0;
  }

  /** @type {Number} */
  static get ONLOAD() {
    return 1;
  }

  /** @type {Number} */
  value = TriggerType.CLICK;

  /** @param {String} value*/
  constructor(value) {
    switch (value) {
      case 'click': { this.value = TriggerType.CLICK; break; }
      case 'onload': { this.value = TriggerType.ONLOAD; break; }
      default: { break; }
    }
  }
}

class Params {
  /** @type {TriggerType} */
  trigger = new TriggerType('click');

  /** @type {Array<Task>} */
  tasks = [];

  /**
   * @constructor
   * @param {Window} window
   */
  constructor(window) {

    // Parse URL
    let params = new URLSearchParams(window.location.search);
    if (params.size === 0) {
      return;
    }
    let entries = Object.fromEntries(params.entries());

    // trigger
    this.trigger = new TriggerType(entries.trigger);

    // tasks
    this.tasks = entries.tasks.split(',').map((task) => {
      let result = task.split('-');

      // Parse time
      let time = result[0].split(':');
      let hour = parseInt(time[0]);
      let min = parseInt(time[1]);
      let sec = parseInt(time[2]);

      // Parse title
      let title = result[1];

      return new Task(title, hour, min, sec);
    });
  }
}

export class Timer {

  /** @type {HTMLElement} */
  html;

  /** @type {Array<Task>} */
  tasks = new Array;

  /** @type {Clock} */
  clock = new Clock();

  /**
   * @constructor
   * @param {String} id
   * @param {Document} document
   * @param {Window} window
   */
  constructor(id, document, window) {
    // create base
    this.html = this.#createBase(id, document);

    // create clock
    this.html.insertAdjacentElement('beforeend', this.clock.html);

    // Build
    let params = new Params(window);
    let paused = params.trigger.value === TriggerType.CLICK;
    this.clock.init(params.tasks, paused, document);
  }

  /**
   * @param {String} id
   * @param {Document} document
   * @returns {HTMLElement}
   */
  #createBase(id, document) {
    const html = document.getElementById(id);
    if (html === null) {
      throw new Error(`Not found id: ${id}`);
    }
    return html;
  }
}

/** @abstract Entry point */
window.onload = function () {
  new Timer('timer', document, window);
}
