'use strict';

const lib = {
  select(selector, context) {
    const result = (context || document).querySelectorAll(selector);

    if (result.length > 1) {
      return [].slice.call(result, 0);
    } else {
      return result[0];
    }
  },
  addEvent(el, type, handler) {
    if (el.attachEvent) {
      el.attachEvent('on' + type, handler);
    } else {
      el.addEventListener(type, handler);
    }
  },
  hasClass(el, className) {
    return el.classList ? el.classList.contains(className) : new RegExp('\\b'+ className+'\\b').test(el.className);
  },
  addClass(el, className) {
    if (el.classList) el.classList.add(className);
    else if (!this.hasClass(el, className)) el.className += ' ' + className;
  },
  removeClass(el, className) {
    if (el.classList) el.classList.remove(className);
    else el.className = el.className.replace(new RegExp('\\b'+ className+'\\b', 'g'), '');
  },
};

window.onload = () => {
  const addButton = lib.select('.add');
  const resultDiv = lib.select('#result');
  let removeButton;
  let html = '';
  let i = 1;

  const removeButtonHandler = (e) => {
    e.preventDefault();

    let parent = e.target.parentNode;
    let p = parent.parentNode;

    p.removeChild(parent);
  };

  lib.addEvent(addButton, 'click', (e) => {
    e.preventDefault();
    const resultChildDiv = document.createElement('div');
    const span = document.createElement('span');
    const countCoinsInput = document.createElement('input');
    const coinLabelSelect = document.createElement('select');
    const e2Option = document.createElement('option');
    const e1Option = document.createElement('option');
    const c50Option = document.createElement('option');
    const c20Option = document.createElement('option');
    const c10Option = document.createElement('option');
    const c5Option = document.createElement('option');
    const c2Option = document.createElement('option');
    const c1Option = document.createElement('option');

    ++i;
    lib.addClass(resultChildDiv, 'result-child');
    countCoinsInput.setAttribute('type', 'number');
    countCoinsInput.setAttribute('name', 'coinCount' + i);
    coinLabelSelect.setAttribute('name', 'coinLabel' + i);
    e2Option.setAttribute('value', '€2');
    //e2Option.innerText = 

    html= resultDiv.innerHTML;

    html += `
      <div class="result-child">
        <span class="">
          <input type="number" class="" name="coinCount${ i }" />
          x
          <select name="coinLabel${ i }">
            <option value="€2">€2</option>
            <option value="€1">€1</option>
            <option value="50c">50c</option>
            <option value="20c">20c</option>
            <option value="10c">10c</option>
            <option value="5c">5c</option>
            <option value="2c">2c</option>
            <option value="1c">1c</option>
          </select>
        </span>
        <button class="remove">-</button>
      </div>
    `;

    resultDiv.innerHTML = html;
    removeButton = document.querySelectorAll('.remove');
    
    [].map.call(removeButton, (el) => {
      lib.addEvent(el, 'click', removeButtonHandler);
    });
  });
};