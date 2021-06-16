export class List {

  // Constructor.
  constructor(element) {
    element.insertAdjacentHTML('beforeend', '<ul id="list"></ul>');
    if(element.childNodes.length != 1) alert('[ERROR] Initialize Error in List class.');
    this.ul = element.childNodes.item('list');
    this.length = 0;
  }

  // Generate "li" content.
  generate(string) {
    return `${string} <button id="remove-list-${this.length - 1}">del</button>`;
  }

  // Add "li" element.
  add(string) {
    let htmlString = `<li>${this.generate(string)}</li>`;
    this.ul.insertAdjacentHTML('beforeend', htmlString);
    this.length = this.ul.childNodes.length;
    this.rehashId();
  }

  // Remove "li" element with index.
  remove(index) {
    let li = this.ul.getElementsByTagName('li');
    if(li.length > index && -1 < index) li[index].remove();
    this.length = this.ul.childNodes.length;
    this.rehashId();
  }

  // Rebase "li" element with index.
  rebase(rebaseString, index) {
    let htmlString = this.generate(rebaseString);
    this.ul.childNodes[index].innerHTML = htmlString;
    this.length = this.ul.childNodes.length;
    this.rehashId();
  }

  addClass(classString, index) {
    this.ul.childNodes[index].classList.add(classString);
  }

  addId(idString, index) {
    this.ul.childNodes[index].setAttribute('id', idString);
  }

  rehashId() {
    let self = this;
    this.ul.childNodes.forEach(function (li, index) {
      li.id = `list${index}`;
      li.childNodes[li.childNodes.length-1].onclick = function () {
        self.remove(index);
      }
    });
    this.length = this.ul.childNodes.length;
  }
}
