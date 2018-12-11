import serialize from 'form-serialize';
import app from '@core/instance';
import style from './style.styl';

class Base extends React.Component {

  constructor(options) {
    super(options);

    // get initial values
    let values;
    if (this.props.isHighlight) {
      values = this.props.answer && this.props.answer.values
        ? this.props.answer.values : null;
    }

    // calculate initial values valid state
    let valid;
    if (this.props.isHighlight) {
      valid = this.props.answer ? this.getInitialIsValid(values) : false;
    }

    this.state = {values, valid};
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  getInitialIsValid(values) {
    throw new Error('You have to override method `getInitialIsValid` if you want to validate answers.');
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.id !== this.props.id || !_.isEqual(nextState.values, this.state.values);
  }

  render() {
    let classNames = [style.container];
    if (this.props.className) {
      classNames.push(this.props.className);
    }

    return (
      <form className={classNames.join(' ')} onSubmit={this.onSubmit} autoComplete="off">
        {this.renderTitle()}
        {this.renderHint()}
        {this.renderContent()}
        {this.renderSubmit()}
      </form>
    );
  }

  renderTitle() {
    return (
      <h3 className={style.header} data-valid={this.state.valid}>
        Вопрос {this.props.index + 1} - {this.props.title}
      </h3>
    );
  }

  renderHint() {
    if (!this.props.isHighlight) {
      return null;
    }

    let score = this.props.answer ? this.props.answer.score : 0;
    let labelCorrect = this.state.valid ? 'правильный' : 'с ошибкой';
    let labelScore = app.translate.pluralize(score, ['балл', 'балла', 'баллов']);
    return (
      <h4 className={style.hint}>
        Ответ {labelCorrect}, <strong>{score} {labelScore}</strong>.
      </h4>
    );
  }

  renderContent() {
    return (
      <div className={style.content}>
        <div className={style.task} dangerouslySetInnerHTML={{__html: this.props.content}}/>
        {this.renderInput()}
      </div>
    );
  }

  renderInput() {
    throw new Error('You have to override `renderInput` method in question view.');
  }

  renderSubmit() {
    if (!this.props.isSubmit) {
      return null;
    }

    return (
      <div className={style.submits}>
        <input type="submit" className={style.submit} value="Сохранить и продолжить"/>
      </div>
    );
  }

  getSerializedData() {
    let el = ReactDOM.findDOMNode(this);
    return serialize(el, {hash: true});
  }

  getFieldsValues() {
    throw new Error('You have to override `getFieldsValues` method in question view. You can use `getSerializedData` to get serialized form data.');
  }

  onChange(e) {
    this.setState({values: this.getFieldsValues()});
  }

  onSubmit(e) {
    e.preventDefault();
    e.stopPropagation();
    let values = this.getFieldsValues();
    if (values && values.length) {
      this.props.onSubmit({question_id: this.props.id, values});
    }
  }
}

Base.defaultProps = {
  isSubmit: true,
  isHighlight: false,
  isDisabled: false,
};

module.exports = Base;
