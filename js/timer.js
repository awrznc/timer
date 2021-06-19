export class Timer {
  // Constructor.
  constructor( element, document, min, sec ) {

    // Application.
    this.timer = element;

    // Timer.
    this.minutes = min;
    this.seconds = sec;
    let allSec = (min * 60) + sec;

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
      self.isFirstRun = false;
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
          self.timeout = setTimeout(countdown, 1000, ld);
          console.log(self.timeout);
        }
      }
      countdown(limitDate);
    }

    document.addEventListener('animationend', () => {
      this.isFirstRun = true;
      this.run = false;
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

  update(minutes, seconds) {
    this.minutes = minutes;
    this.seconds = seconds;

  }
}