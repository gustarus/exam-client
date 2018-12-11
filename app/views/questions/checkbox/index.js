import Base from './../base';
import style from './style.styl';

export default class extends Base {

  getInitialIsValid(values) {
    return this.props.options.reduce((valid, option) => {
      let checked = _.includes(values, option.id);
      if (option.weight > 0) {
        return checked ? valid : false;
      } else {
        return checked ? false : valid;
      }
    }, true);
  }

  renderInput() {
    let options = this.props.options.map((option, i) => {
      let checked = _.includes(this.state.values, option.id);

      // get option valid state
      // related on checked value
      // false and null are different variants
      let valid;
      if (this.props.isHighlight) {
        valid = option.weight > 0 ? true : (checked ? false : null);
      }

      return (
        <div key={i} className={style.option}>
          <label className={style.label} data-valid={valid}>
            <div className={style.inputContainer}>
              <input name="value[]"
                     type="checkbox"
                     value={option.id}
                     className={style.input}
                     onChange={this.onChange}
                     checked={checked}
                     disabled={this.props.isDisabled}/>
            </div>
            <div className={style.inline} dangerouslySetInnerHTML={{__html: option.content}}/>
          </label>
        </div>
      );
    });

    return <div className={style.options}>{options}</div>;
  }

  getFieldsValues() {
    let data = this.getSerializedData();
    return data.value;
  }
}
