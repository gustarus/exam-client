import FormPage from '@core/views/pages/form';
import Theater from '@core/views/theater';
import Scene from '@core/views/scene';
import Card from '@core/views/card';
import State from './state';
import questions from '@core/views/questions';
import app from '@core/instance';

export default class extends FormPage {

  constructor(options) {
    super(options);
    this.state.index = null;
    this.onQuestionPick = this.onQuestionPick.bind(this);
    this.onAnswerSubmit = this.onAnswerSubmit.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    let isParentChanged = FormPage.prototype.shouldComponentUpdate.apply(this, arguments);
    let isIndexChanged = nextState.index !== this.state.index;
    return isParentChanged || isIndexChanged;
  }

  sync() {
    let parent = FormPage.prototype.sync;
    return parent.apply(this).then(() => {
      if (this.state.index === null) {
        let index = this.getNextQuestionIndex(this.state.quiz, this.state.form);
        this.setState({index});
      }
    });
  }

  renderContent() {
    if (this.state.index === null) {
      return null;
    }

    let question = this.state.quiz.questions[this.state.index];
    let Question = questions[question.type];

    return (
      <Theater>
        <Scene middle={true}>
          <Card>
            <State
              index={this.state.index}
              form={this.state.form}
              quiz={this.state.quiz}
              onPick={this.onQuestionPick}/>

            <Question {...question}
              index={this.state.index}
              onSubmit={this.onAnswerSubmit}/>
          </Card>
        </Scene>
      </Theater>
    );
  }

  onQuestionPick(index) {
    this.setState({index});
  }

  onAnswerSubmit(answer) {
    app.api.put(`form/update/${this.state.form.token}`, {answers: [answer]}).then(form => {
      let index = this.getNextQuestionIndex(this.state.quiz, form);
      if (index !== false) {
        this.setState({form, index});
      } else {
        this.context.router.push(`/classroom/results/${this.state.form.token}`);
      }
    });
  }

  getNextQuestionIndex(quiz, form) {
    let ids = quiz.questions.map(a => a.id);
    let answered = form.answers.map(a => a.question_id);
    return this.getNextQuestionIndexBetween(ids, answered, this.state.index)
      || this.getNextQuestionIndexBetween(ids, answered, 0, this.state.index);
  }

  getNextQuestionIndexBetween(ids, answers, from = undefined, to = undefined) {
    from = from || 0;
    to = to || ids.length;
    for (let i = from; i < to; i++) {
      if (!answers.includes(ids[i])) {
        return parseInt(i);
      }
    }

    return false;
  }
}
