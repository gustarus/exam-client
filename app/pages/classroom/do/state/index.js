import app from '@core/instance';
import style from './style.styl';

export default class extends React.Component {

  constructor(options) {
    super(options);
    this.onPick = this.onPick.bind(this);
  }

  render() {
    let answered = this.props.form.answers.map(a => a.question_id);
    let items = this.props.quiz.questions.map((question, i) => {
      let isCurrent = this.props.index === i;
      let isLocked = answered.includes(question.id);
      let className = style.item + (isLocked ? ' ' + style.item_disabled : '') + (isCurrent ? ' ' + style.item_current : '');
      let callback = !isCurrent && !isLocked ? this.onPick : null;
      return <a key={question.id} href="#" data-index={i} className={className} onClick={callback}/>
    });

    return (
      <div className={style.container}>{items}</div>
    );
  }

  onPick(e) {
    e.preventDefault();
    e.stopPropagation();
    this.props.onPick(parseInt(e.target.dataset.index));
  }
}
