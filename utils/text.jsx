export function renderToStringServer(element) {
  const ReactDOMServer = require("react-dom/server");
  const html = ReactDOMServer.renderToString(element);

  return html;
} 

export function humanize(str) {
    if (!str || !(typeof str === 'string')) return str

    str = str.replace(/_sistema_origem_/g, '_')
    str = str.replace(/^sin_/g, '')
    str = str.replace(/^dta_/g, 'data_')

    var i, frags = str.split('_');
    for (i = 0; i < frags.length; i++) {
        frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
    }
    return frags.join(' ');
}

export function removeAccents(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

export const maiusculasEMinusculas = (s) => {
    let sb = "";
    let f = true;
  
    for (let i = 0; i < s.length; i++) {
      const ch = s.substring(i, i + 1);
      if (ch.toUpperCase() !== ch.toLowerCase()) {
        if (f) {
          sb += ch.toUpperCase();
          f = false;
        } else {
          sb += ch.toLowerCase();
        }
      } else {
        sb += ch;
        f = true;
      }
    }
  
    s = sb;
  
    s = s.replace(" E ", " e ");
    s = s.replace(" Da ", " da ");
    s = s.replace(" Das ", " das ");
    s = s.replace(" De ", " de ");
    s = s.replace(" Do ", " do ");
    s = s.replace(" Dos ", " dos ");
  
    return s;
  }

  
