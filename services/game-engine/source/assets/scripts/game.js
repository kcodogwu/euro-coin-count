'use strict';

const lib = {
  select(selector, context) {
    const result = (context || document).querySelectorAll(selector);

    if (result.length > 1)
      return [].slice.call(result, 0)
    ; else
      return result[0]
    ;
  },
  addEvent(el, type, handler) {
    if (el.attachEvent)
      el.attachEvent('on' + type, handler)
    ; else
      el.addEventListener(type, handler)
    ;
  }
};

window.onload = () => {
  const addButton = lib.select('.add');
  const resultDiv = lib.select('#result');
  let html = '';
  let i = 1;

  lib.addEvent(addButton, 'click', (e) => {
    e.preventDefault();
    html = resultDiv.innerHTML;
    ++i;

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
  });
};