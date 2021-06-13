export class Button {

  // Constructor.
  constructor(element, document, type) {
    if(!(type == 'start' || type == 'stop' || type == 'reset' || type == 'settings')) alert('[ERROR] Initialize Error in Button class.');
    let buttonString = '<div></div>';
    element.insertAdjacentHTML('beforeend', buttonString);
    element.insertAdjacentHTML('beforeend', buttonString);
    element.insertAdjacentHTML('beforeend', buttonString);
    element.childNodes.forEach(function (classElement) {
      classElement.classList.add('button');
    });
  }
}
