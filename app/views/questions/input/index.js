import Base from './../base';
import style from './style.styl';

export default class extends Base {

  getInitialIsValid(values) {
    return this.props.answer.score === this.props.weight;
  }

  renderInput() {
    let option = this.props.options[0];
    let value = this.props.answer && this.props.answer.values
      ? this.props.answer.values[0] : option.content;

    return (
      <div className={style.answer}>
        <input name="value"
               type="text"
               className={style.input}
               defaultValue={value}
               placeholder="Введите ответ сюда"
               disabled={this.props.isDisabled}/>
      </div>
    );
  }

  getFieldsValues() {
    let data = this.getSerializedData();
    return [data.value];
  }
}
