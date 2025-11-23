// @ts-check

export class Task {
  /**
   * @type {String}
   */
  title = '';

  /**
   * @abstract millisec
   * @type {Number}
   */
  duration = 0;

  /**
   * @constructor
   * @param {String} title
   * @param {Number} hour
   * @param {Number} min
   * @param {Number} sec
   */
  constructor(title, hour, min, sec) {
    this.title = title;
    this.duration = (100 * 60 * 60 * hour) + (100 * 60 * min) + (100 * sec) + 0;
  }

  /** @returns {String} */
  getClockString() {
    const update_hours = (Math.trunc(this.duration / 100 / 60 / 60)).toString().padStart(2, '0');
    const update_mins = (Math.trunc(this.duration / 100 / 60) % 60).toString().padStart(2, '0');
    const update_secs = (Math.trunc(this.duration / 100) % 60).toString().padStart(2, '0');
    return `${update_hours}:${update_mins}:${update_secs}`;
  }
}
