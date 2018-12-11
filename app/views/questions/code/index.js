import Base from './../base';
import style from './style.styl';
import javascript from 'codemirror/mode/javascript/javascript';
import CodeMirror from 'codemirror';

export default class extends Base {

  getInitialIsValid(values) {
    return this.props.answer.score === this.props.weight;
  }

  componentDidMount() {
    let el = ReactDOM.findDOMNode(this);
    let textarea = el.querySelector('textarea');
    this.editor = CodeMirror.fromTextArea(textarea, {
      mode: 'javascript',
      readOnly: this.props.isDisabled,
      scrollbarStyle: null,
      showCursorWhenSelecting: true,
      theme: 'blackboard',
      lineNumbers: true
    });

    this.editor.on('change', intsance => {
      textarea.value = intsance.getValue();
    });
  }

  renderInput() {
    let option = this.props.options[0];
    let value = this.props.answer && this.props.answer.values
      ? this.props.answer.values[0] : option.content;

    return (
      <div className={style.answer}>
        <textarea name="value" defaultValue={value} disabled="disabled" disabled={this.props.isDisabled}/>
      </div>
    );
  }

  getFieldsValues() {
    let data = this.getSerializedData();
    return [data.value];
  }
}
