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
  postAjax(url, data, success) {
    const params = typeof data == 'string' ? data : Object.keys(data).map(k => { 
      return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]);
    }).join('&');

    const xhr = new XMLHttpRequest();

    xhr.open('POST', url);

    xhr.onreadystatechange = function() {
      if (xhr.readyState>3 && xhr.status==200) { success(xhr.responseText); }
    };

    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(params);
    return xhr;
  }
};

window.onload = () => {
  // const username = lib.select('#username');
  // const password = lib.select('#password');
  // const logInButton = lib.select('#log-in');

  // const logInButtonHandler = (e) => {
  //   e.preventDefault();

  //   lib.postAjax('/post-log-in', { username: username.value, password: password.value }, () => {
  //   });
  // };

  // lib.addEvent(logInButton, 'click', logInButtonHandler);
};