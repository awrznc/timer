export class List {

  /**
    * @property {Number} length
    */
  length;

  /**
   * @property {ChildNode}
   */
  ul;

  /**
   * Constructor.
   * @constructor
   * @param {HTMLElement} element
   */
  constructor(element) {
    element.insertAdjacentHTML('beforeend', '<ul id="list"></ul>');
    if(element.childNodes.length != 1) alert('[ERROR] Initialize Error in List class.');
    this.ul = element.childNodes.item('list');
    this.length = 0;
  }

  /**
   * Generate "li" content.
   * @param {String} string
   * @return {String}
   */
  generate(string) {
    return `${string} <button id="remove-list-${this.length - 1}">del</button>`;
  }

  /**
   * Add "li" element string.
   * @param {String} string
   */
  add(string) {
    let htmlString = `<li>${this.generate(string)}</li>`;
    this.ul.insertAdjacentHTML('beforeend', htmlString);
    this.length = this.ul.childNodes.length;
    this.rehashId();
  }

  /**
   * Add element object.
   * @param {HTMLLIElement} elementObject
   */
  addElement(elementObject) {
    elementObject.insertAdjacentHTML('beforeend', this.generate(''));
    this.ul.appendChild(elementObject);
    this.length = this.ul.childNodes.length;
    this.rehashId();
  }

  /**
   * Remove "li" element with index.
   * @param {Number} index
   */
  remove(index) {
    let li = this.ul.getElementsByTagName('li');
    if(li.length > index && -1 < index) li[index].remove();
    this.length = this.ul.childNodes.length;
    this.rehashId();
  }

  /**
   * Rebase "li" element with index.
   * @param {String} rebaseString
   * @param {Number} index
   */
  rebase(rebaseString, index) {
    let htmlString = this.generate(rebaseString);
    this.ul.childNodes[index].innerHTML = htmlString;
    this.length = this.ul.childNodes.length;
    this.rehashId();
  }

  /**
   * Add class name.
   * @param {String} classString
   * @param {Number} index
   */
  addClass(classString, index) {
    this.ul.childNodes[index].classList.add(classString);
  }

  addId(idString, index) {
    this.ul.childNodes[index].setAttribute('id', idString);
  }

  /**
   * Rehash instance list.
   */
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
