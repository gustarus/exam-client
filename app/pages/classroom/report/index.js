import FormPage from '@core/views/pages/form';
import ProgressBar from 'progressbar.js';
import Theater from '@core/views/theater';
import Scene from '@core/views/scene';
import Card from '@core/views/card';
import questions from '@core/views/questions';
import app from '@core/instance';

import style from './style.styl';

export default class extends FormPage {

  getQuizUrl(session) {
    return `quiz/extended_by_session/${session.token}`;
  }

  componentDidMount() {
    FormPage.prototype.componentDidMount.apply(this);
    this.delegateProgressBar();
  }

  componentWillUpdate() {
    FormPage.prototype.componentWillUpdate.apply(this);
    this.undelegateProgressBar();
  }

  componentDidUpdate() {
    FormPage.prototype.componentDidUpdate.apply(this);
    this.delegateProgressBar();
  }

  componentWillUnmount() {
    FormPage.prototype.componentWillUnmount.apply(this);
    this.undelegateProgressBar();
  }

  renderContent() {
    return (
      <Theater>
        <Scene center={true}>
          <Card className={style.container}>
            <h3 className={style.header}>Результаты вашего теста</h3>
            <h4 className={style.header}>{this.state.form.identity}</h4>
            {this.renderTotal()}
            <h5 className={style.hint}><sup>*</sup> Вы можете нажать cmd + p (ctrl + p) и сохранить отчет как pdf.</h5>
          </Card>

          <Card className={style.container}>
            <h3 className={style.header}>Детально по каждому вопросу</h3>
            {this.renderItems()}
          </Card>
        </Scene>
      </Theater>
    );
  }

  renderTotal() {
    let start = moment(this.state.form.created_at);
    let end = moment(this.state.form.updated_at);
    let diff = end.diff(start, 'seconds', true);
    let duration = moment.duration(diff, 'seconds');
    let hours = duration.hours() || 0;
    let minutes = duration.minutes() || 0;

    return (
      <div className={style.total}>
        <div className={style.total__counter}>
          <div className={style.total__result} id="progress"/>
        </div>

        <div className={style.total__table}>
          <div className={style.total__row}>
            <div className={style.total__th}>Дано ответов на вопросы</div>
            <div className={style.total__td}>{this.state.form.answers.length} из {this.state.quiz.questions.length}</div>
          </div>
          <div className={style.total__row}>
            <div className={style.total__th}>Набрано вами баллов</div>
            <div className={style.total__td}>{this.state.form.score} из {this.state.form.weight}</div>
          </div>
          <div className={style.total__row}>
            <div className={style.total__th}>Потрачено времени на тест</div>
            <div className={style.total__td}>{hours}ч {minutes}м</div>
          </div>
          <div className={style.total__row}>
            <div className={style.total__th}>Принимало участие в тесте</div>
            <div className={style.total__td}>{this.state.session.forms.length} человек</div>
          </div>
        </div>
      </div>
    );
  }

  renderItems() {
    let items = this.state.quiz.questions.map((question, i) => {
      let Question = questions[question.type];

      // find question answer in form
      let answer = this.state.form.answers
        .find(item => item.question_id === question.id);

      return <Question key={i} {...question}
                       index={i}
                       answer={answer}
                       isSubmit={false}
                       isHighlight={true}
                       isDisabled={true}
                       className={style.question}/>;
    });

    return <div className={style.items}>{items}</div>;
  }

  delegateProgressBar() {
    let el = ReactDOM.findDOMNode(this);

    if (el) {
      let weight = this.state.form.weight;
      let k = 100 / this.state.form.weight;

      this.bar = new ProgressBar.Circle(el.querySelector('#progress'), {
        strokeWidth: 4,
        trailWidth: 1,
        easing: 'easeInOut',
        duration: 1800,
        text: {
          autoStyleContainer: false,
          className: style.counter__label
        },
        from: {color: '#aaa', width: 1, hsla: 22},
        to: {color: '#333', width: 4, hsla: 119},
        style: null,

        step(state, circle) {
          circle.path.setAttribute('stroke', `hsl(${state.hsla}, 65%, 61%)`);
          circle.path.setAttribute('stroke-width', state.width);

          let value = Math.round(circle.value() / k * 100);
          circle.setText(`${value} из ${weight}`);
        }
      });

      this.bar.animate(this.state.form.score * k / 100);
    }
  }

  undelegateProgressBar() {
    this.bar && this.bar.destroy();
    delete this.bar;
  }
}
