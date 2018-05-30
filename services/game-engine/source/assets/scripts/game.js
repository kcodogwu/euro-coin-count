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
  let rb = null;
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
    const timesX = document.createTextNode('\n x \n');
    const removeButton = document.createElement('button');

    i=1;
    
    while (true) {
      if (lib.select('[name = "coinLabel' + i + '"]')) {
        ++i;
      } else {
        break;
      }
    }

    lib.addClass(resultChildDiv, 'result-child');
    countCoinsInput.setAttribute('type', 'number');
    countCoinsInput.setAttribute('name', 'coinCount' + i);
    coinLabelSelect.setAttribute('name', 'coinLabel' + i);
    e2Option.setAttribute('value', '€2');
    e2Option.innerHTML = '€2';
    e1Option.setAttribute('value', '€1');
    e1Option.innerHTML = '€1';
    c50Option.setAttribute('value', '50c');
    c50Option.innerHTML = '50c';
    c20Option.setAttribute('value', '20c');
    c20Option.innerHTML = '20c';
    c10Option.setAttribute('value', '10c');
    c10Option.innerHTML = '10c';
    c5Option.setAttribute('value', '5c');
    c5Option.innerHTML = '5c';
    c2Option.setAttribute('value', '2c');
    c2Option.innerHTML = '2c';
    c1Option.setAttribute('value', '1c');
    c1Option.innerHTML = '1c';
    removeButton.setAttribute('class', 'remove');
    removeButton.innerText = '-';
    coinLabelSelect.appendChild(e2Option);
    coinLabelSelect.appendChild(e1Option);
    coinLabelSelect.appendChild(c50Option);
    coinLabelSelect.appendChild(c20Option);
    coinLabelSelect.appendChild(c10Option);
    coinLabelSelect.appendChild(c5Option);
    coinLabelSelect.appendChild(c2Option);
    coinLabelSelect.appendChild(c1Option);
    span.appendChild(countCoinsInput);
    span.appendChild(timesX);
    span.appendChild(coinLabelSelect);
    resultChildDiv.appendChild(span);
    resultChildDiv.appendChild(removeButton);
    resultDiv.appendChild(resultChildDiv);
    rb = document.querySelectorAll('.remove');
    
    [].map.call(rb, (el) => {
      lib.addEvent(el, 'click', removeButtonHandler);
    });
  });
};