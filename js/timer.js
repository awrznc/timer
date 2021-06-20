export class Timer {
  // Constructor.
  constructor( element, document, min, sec ) {

    // Application.
    this.timer = element;

    // Timer.
    this.resetMinutes = min;
    this.resetSeconds = sec;
    this.minutes = this.resetMinutes;
    this.seconds = this.resetSeconds;
    this.allSec = (this.minutes * 60) + this.seconds;
    let allSec = this.allSec;

    // Color animator.
    this.timer.classList.add('main-frame');
    this.timer.insertAdjacentHTML('beforeend', `<div class="color-animator" style="animation-duration: ${allSec - 1}s;"></div>`);
    let colorAnimator = Array.from( this.timer.getElementsByClassName('color-animator'))[0];
    this.colorAnimator = colorAnimator;

    // Rotate animator.
    colorAnimator.insertAdjacentHTML('beforeend', `<div class="first-rotate-animator" style="animation-duration: ${allSec - 1}s;"></div>`);
    colorAnimator.insertAdjacentHTML('beforeend', `<div class="second-rotate-animator" style="animation-duration: ${allSec - 1}s;"></div>`);
    this.fra = Array.from( this.timer.getElementsByClassName('first-rotate-animator'))[0];
    this.sra = Array.from( this.timer.getElementsByClassName('second-rotate-animator'))[0];

    // Add click event.
    let firstRotateAnimator = Array.from( colorAnimator.getElementsByClassName('first-rotate-animator') );
    let secondRotateAnimator = Array.from( colorAnimator.getElementsByClassName('second-rotate-animator') );
    let timer = colorAnimator;
    this.run = false;
    this.isFirstRun = true;
    let self = this;
    this.timer.onclick = function () {
      if (self.run == true) {
        self.run = false;
        timer.classList.add('stop-animation');
        timer.classList.remove('run-animation');
        firstRotateAnimator.forEach(  function (eventElement) {
          eventElement.classList.add('stop-animation');
          eventElement.classList.remove('run-animation');
        });
        secondRotateAnimator.forEach( function (eventElement) {
          eventElement.classList.add('stop-animation');
          eventElement.classList.remove('run-animation');
        });
        return;
      }
      self.run = true;

      timer.classList.add('timer-color-animation');
      timer.classList.add('run-animation');
      timer.classList.remove('stop-animation');
      firstRotateAnimator.forEach(  function (eventElement) {
        eventElement.classList.add('first-rotate-animation');
        eventElement.classList.add('run-animation');
        eventElement.classList.remove('stop-animation');
      });
      secondRotateAnimator.forEach( function (eventElement) {
        eventElement.classList.add('second-rotate-animation');
        eventElement.classList.add('run-animation');
        eventElement.classList.remove('stop-animation');
      });

      // Timer.
      if(self.isFirstRun == false) {
        return;
      }
      self.reset();
      self.isFirstRun = false;

      //
      self.seconds = self.resetSeconds;
      self.minutes = self.resetMinutes;
      if(self.seconds > 0) {
        self.seconds -= 1;
      }
      self.update();
      self.interval;
      let func = function () {
        if(self.run == false) return;

        if(self.seconds <= 0) {
          if(self.minutes > 0) {
            self.seconds = 59;
            self.minutes -= 1;
          } else {
            self.seconds = self.resetSeconds;
            self.minutes = self.resetMinutes;
            clearInterval(self.interval);
          }
        } else {
          self.seconds -= 1;
        }

        if(self.seconds <= 0 && self.minutes <= 0) {
          self.seconds = self.resetSeconds;
          self.minutes = self.resetMinutes;
          clearInterval(self.interval);
        }
        self.update();
      }
      self.interval = setInterval(func, 1000);
    }

    document.addEventListener('animationend', () => {
      self.isFirstRun = true;
      self.run = false;

      // finish.
      self.minutes = 0;
      self.seconds = 0;
      self.update();
      clearInterval(self.interval);

      // reset.
      self.minutes = self.resetMinutes;
      self.seconds = self.resetSeconds;
      self.update();

      timer.classList.remove('timer-color-animation');
      firstRotateAnimator.forEach( function (eventElement) {
        eventElement.classList.remove('first-rotate-animation');
      });
      secondRotateAnimator.forEach( function (eventElement) {
        eventElement.classList.remove('second-rotate-animation');
      });
    });

    // Counter.
    this.timer.insertAdjacentHTML('beforeend', '<div class="border"></div>');
    colorAnimator.insertAdjacentHTML('beforeend', '<div class="counter"><div class="time"><span id="min">00</span>:<span id="sec">00</span></div></div>');
  }

  reset() {
    this.allSec = (this.minutes * 60) + this.seconds;
  }

  update() {
    document.getElementById('min').textContent = String(this.minutes).padStart(2, '0');
    document.getElementById('sec').textContent = String(this.seconds).padStart(2, '0');
  }
}
