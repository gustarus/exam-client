import Component from '@core/base/component';

export default class Translate extends Component {

  pluralize(integer, labels) {
    let number = Math.abs(integer);
    if (number === 1) {
      return labels[0];
    } else if (number >= 2 && number <= 4) {
      return labels[1];
    } else {
      return labels[2];
    }
  }
}


