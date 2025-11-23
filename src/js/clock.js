// @ts-check

/** @import { Task } from './task.js' */

/**
 * @typedef AnimeteSVG
 * @property {String} title
 * @property {Number} duration
 * @property {Number} maxTime
 * @property {Boolean} paused
 * @property {SVGSVGElement} svg
 */

/**
 * @typedef Ids
 * @property {string} main
 * @property {string} background
 * @property {string} circle
 * @property {string} circleFront
 * @property {string} circleBack
 * @property {string} circleFrontAnimate
 * @property {string} title
 * @property {string} timeText
 * @property {string} listBlock
 */

export class Clock {
  /** @type {HTMLElement} */
  html;

  /** @type {HTMLElement} */
  main;

  /** @type {HTMLElement} */
  background;

  /** @type {AnimeteSVG} */
  clock = {
    title: '',
    maxTime: 0,
    duration: 0,
    svg: document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
    paused: true,
  };

  /** @type {Array<AnimeteSVG>} */
  list = [];

  /** @type {Number} */
  currentIndex = 0;

  /** @type {Number} */
  maxTime = 0;

  /** @type {Number} */
  startDate = 0;

  /** @type {null|Number} */
  intervalId = null;

  /** @type {Ids} */
  id = {
    main: 'clock-main',
    background: 'clock-background',
    circle: 'clock-circle',
    circleFront: 'clock-circle-front',
    circleBack: 'clock-circle-back',
    circleFrontAnimate: 'clock-circle-animate',
    title: 'clock-title',
    timeText: 'clock-time',
    listBlock: 'list-block',
  };

  /**
   * @constructor
   */
  constructor() {
    this.html = document.createElement('div');

    // Create background
    this.background = document.createElement('div');
    this.html.insertAdjacentElement('beforeend', this.background);
    this.background.setAttribute('id', this.id.background);
    // this.background.setAttribute('style', 'text-align: center');

    // Create main
    this.main = document.createElement('div');
    this.main.setAttribute('id', this.id.main);
    this.html.insertAdjacentElement('beforeend', this.main);
    // this.main.setAttribute('style', 'text-align: center');

    // Init clock
    let clock = document.createElement('div');
    clock.setAttribute('id', this.id.circle);
    this.buildClockSvg(document);
    clock.insertAdjacentElement('beforeend', this.clock.svg);
    this.main.insertAdjacentElement('beforeend', clock);

    // Init list
    // let self = this;
    // this.buildListSvg([]);
    // this.list.forEach((svg) => {
    //   let list = document.createElement('div');
    //   list.insertAdjacentElement('beforeend', svg.svg)
    //   self.main.insertAdjacentElement('beforeend', list);
    // });

  }

  /**
   * @param {Array<Task>} tasks
   * @param {Boolean} paused
   * @param {Document} document
   */
  init(tasks, paused, document) {
    let self = this;
    if (tasks.length === 0) {
      return;
    }

    // Set background
    // FIXME: The layout may be affected by environmental differences.
    const height = 200 + (39.19 * tasks.length) + 24;
    this.background.setAttribute('style', `height: ${height}px`);
    this.main.setAttribute('style', `height: ${height}px`);

    // Set title
    let title = document.getElementById(this.id.title);
    if (title === null) {
      throw new Error(`Not found id: ${this.id.title}`);
    }
    title.textContent = tasks[0].title;

    // Set list text
    document.getElementById(self.id.listBlock)?.remove();
    let listBlock = document.createElement('div');
    listBlock.setAttribute('id', self.id.listBlock);
    this.buildListSvg(tasks);
    this.list.forEach((svg) => {
      let list = document.createElement('div');
      list.insertAdjacentElement('beforeend', svg.svg);
      listBlock.insertAdjacentElement('beforeend', list);
    });
    this.main.insertAdjacentElement('beforeend', listBlock);

    // Set clock text
    const defaultTime = 0;
    this.maxTime = tasks.reduce((result, task) => result + task.duration, defaultTime);
    this.clock.duration = this.maxTime;
    this.#setClockText(document, this.maxTime);

    // Set animate
    const radius = 80;
    const pi = 3.1415;
    const strokeDasharray = 2 * pi * radius;
    this.#setCircleAnimate(document, self.maxTime, strokeDasharray);
    this.#setListAnimate(document, tasks);

    // Click event
    // this.main.removeEventListener('click');
    // this.main.addEventListener('click', () => {});
    this.main.onclick = () => {
      if (self.isFinished()) {
        // reset clock
        self.maxTime = 0;
        self.currentIndex = 0;
        self.startDate = 0;
        self.clock.paused = true;
        self.clock.svg.setCurrentTime(0);
        self.clock.svg.pauseAnimations();
        self.init(tasks, paused, document);
        return;
      }

      if (self.clock.paused) {
        self.startDate = Date.now() - (self.maxTime - self.clock.duration) * 10;
        self.clock.svg.unpauseAnimations();
        self.list[self.currentIndex]?.svg.unpauseAnimations();
      } else {
        self.clock.svg.pauseAnimations();
        self.list[self.currentIndex]?.svg.pauseAnimations();
      }
      self.clock.paused = !self.clock.paused;
    };

    // Set interval event
    const interval = 10;
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
    }
    this.intervalId = window.setInterval(() => {
      if (self.clock.paused || self.isFinished()) {
        return;
      }

      // If a deviation of 100 milliseconds or more occurs, rewrite it to the expected value.
      const elapsedTime = (Date.now() - self.startDate) / 10;
      const limit = 100;
      const diff = (self.maxTime) - self.clock.duration - elapsedTime;
      if (Math.abs(diff) >= limit) {
        // clock
        self.clock.duration = Math.max(self.maxTime - elapsedTime, 0);
        let clockCurrentTime = (self.maxTime - self.clock.duration) / 100;
        self.clock.svg.setCurrentTime(clockCurrentTime);

        // list
        let time = clockCurrentTime * 100;
        for (let i = 0; i < self.currentIndex; i++) time -= self.list[i].maxTime;
        self.list[self.currentIndex]?.svg.setCurrentTime(time / 100);
      }

      // update
      self.clock.duration = Math.max(self.clock.duration - 1, 0);
      self.#setClockText(document, self.clock.duration);
      self.#setListText(document, self.clock.duration);
    }, interval);

    if (!paused) {
      this.main.click();
    }
  }

  /**
    * @return {Boolean}
    */
  isFinished() {
    return this.clock.duration <= 0;
  }

  /**
    * @param {Document} document
    * @param {Number} duration
    */
  #setClockText(document, duration) {
    let clock = document.getElementById(this.id.timeText);
    if (clock === null) {
      throw new Error(`Not found id: ${this.id.timeText}`);
    }
    const update_hours = (Math.trunc(duration / 100 / 60 / 60)).toString().padStart(2, '0');
    const update_mins = (Math.trunc(duration / 100 / 60) % 60).toString().padStart(2, '0');
    const update_secs = (Math.trunc(duration / 100) % 60).toString().padStart(2, '0');
    const update_milisecs = (Math.trunc(duration % 100)).toString().padStart(2, '0');
    clock.textContent = `${update_hours}:${update_mins}:${update_secs}.${update_milisecs}`;

    let title = document.getElementById(this.id.title);
    if (title === null) {
      throw new Error(`Not found id: ${this.id.title}`);
    }
    title.textContent = this.list[this.currentIndex].title;
  }

  /**
    * @param {Document} document
    * @param {Number} duration
    * @param {Number} strokeDasharray
    */
  #setCircleAnimate(document, duration, strokeDasharray) {
    // const baseAngle = -90;
    const len = this.list.length;
    const baseAngle = -90 + ((360 - (len * 10)) / 6);
    let front = document.getElementById(this.id.circleFront);
    front?.setAttribute("transform", `rotate(${baseAngle}, 100, 100)`);
    // front?.setAttribute("stroke-dasharray", `${strokeDasharray}`);
    // MEMO: 範囲や間隔は以下のような形で調整できる
    front?.setAttribute("stroke-dasharray", `${100} ${strokeDasharray * 2}`);
    front?.setAttribute('from', `${strokeDasharray / 40}`);
    front?.setAttribute('stroke-linecap', 'round');

    // document.getElementById(this.id.circleFrontAnimate)?.remove();
    let animate = document.getElementById(this.id.circleFrontAnimate);
    const sectionSize = 0;
    animate?.setAttribute('from', `${sectionSize}`);
    animate?.setAttribute('to', `${strokeDasharray}`);
    animate?.setAttribute('dur', `${duration / 100.0}s`);
  }

  /**
   * @param {Document} document
   */
  buildClockSvg(document) {
    let base = {
      title: '',
      maxTime: 0,
      duration: 0,
      svg: document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
      paused: true,
    };
    const width = 200;
    const height = 200;
    base.svg.pauseAnimations();
    base.svg.setAttribute('width', `${width}px`);
    base.svg.setAttribute('height', `${height}px`);
    base.svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    base.svg.insertAdjacentHTML('beforeend', `
      <circle id="${this.id.circleBack}" class="bar-color-back" r="80" cx="50%" cy="50%" fill="transparent" stroke-width="4%"></circle>
      <circle id="${this.id.circleFront}" class="bar-color-front" r="80" cx="50%" cy="50%" fill="transparent" stroke-width="4%" stroke-dasharray="0">
        <animate id="${this.id.circleFrontAnimate}" attributeName="stroke-dashoffset" from="0" to="0" dur="0s" repeatCount="0" fill="freeze" />
      </circle>
      <text id="${this.id.timeText}" class="text" x="50%" y="40%" font-size="1.2em" dominant-baseline="middle" text-anchor="middle">00:00:00.00</text>
      <rect class="text" rx="2" x="20%" y="50%" width="60%" height="2"></rect>
      <text id="${this.id.title}" class="text" x="50%" y="65%" font-size="1.5em" dominant-baseline="middle" text-anchor="middle"></text>
    `);
    this.clock = base;
  }

  /**
  * @param {Document} document
  * @param {Number} duration
  */
  #setListText(document, duration) {
    const id = `clock-time-${this.currentIndex}`;
    let clock = document.getElementById(id);
    if (clock === null) {
      throw new Error(`Not found id: ${id}`);
    }
    const defaultTime = 0;
    let signedDuration = duration - this.list.slice(this.currentIndex + 1, this.list.length).reduce((result, task) => result + task.maxTime, defaultTime);
    let listDuration = Math.max(signedDuration, 0);
    const update_hours = (Math.trunc(listDuration / 100 / 60 / 60)).toString().padStart(2, '0');
    const update_mins = (Math.trunc(listDuration / 100 / 60) % 60).toString().padStart(2, '0');
    const update_secs = (Math.trunc(listDuration / 100) % 60).toString().padStart(2, '0');
    clock.textContent = `${update_hours}:${update_mins}:${update_secs}`;
    if (listDuration <= 0) {
      this.list[this.currentIndex]?.svg.setCurrentTime(this.list[this.currentIndex]?.maxTime);
      this.currentIndex += 1;
      this.list[this.currentIndex]?.svg.unpauseAnimations();
    }
  }

  /**
  * @param {Document} document
  * @param {Array<Task>} tasks
  */
  #setListAnimate(document, tasks) {
    tasks.forEach((task, i) => {
      let width = 200.0 * 0.8;
      let bar = document.getElementById(`list-${i}`);
      bar?.setAttribute("stroke-dasharray", `${width}`);

      const sectionSize = 0;
      let animate = document.getElementById(`list-animate-${i}`);
      animate?.setAttribute('from', `${sectionSize}`);
      animate?.setAttribute('to', `${-1 * width}`);
      animate?.setAttribute('dur', `${task.duration / 100.0}s`);
    });
  }

  /**
    * @param {Array<Task>} tasks
    */
  buildListSvg(tasks) {
    const width = 200;
    const height = '2.2em'

    this.list = tasks.map((task, i) => {
      let base = {
        title: task.title,
        maxTime: task.duration,
        duration: task.duration,
        paused: true,
        svg: document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
      };
      base.svg.pauseAnimations();
      base.svg.setAttribute('width', `${width}px`);
      base.svg.setAttribute('height', `${height}`);
      base.svg.setAttribute('viewBox', `0 0 ${width} 1`);
      base.svg.insertAdjacentHTML('beforeend', `
        <text id="clock-time-${i}" class="text" x="30%" y="0em" font-size="1em" dominant-baseline="middle" text-anchor="middle">${task.getClockString()}</text>
        <text class="text" x="70%" y="0em" font-size="1em" dominant-baseline="middle" text-anchor="middle">${task.title}</text>
        <line class="bar-back bar-color-back" x1="10%" y1="0.8em" x2="90%" y2="0.8em" />
        <line id="list-${i}" class="bar-front bar-color-front" x1="10%" y1="0.8em" x2="90%" y2="0.8em" stroke-dasharray="0">
          <animate id="list-animate-${i}" begin="0s" attributeName="stroke-dashoffset" from="0" to="0" dur="0s" repeatCount="0" fill="freeze" />
        </line>
      `);

      return base;
    });
  }
}
