import * as _ from 'lodash';
import { App } from './app/app';

function component() {
  const element = document.createElement('div');

  // Lodash, now imported by this script
  element.innerHTML = _.join(['APP-TS', 'CAR'], ' ');

  return element;
}

const APP  = new App();
document.body.appendChild(component());
