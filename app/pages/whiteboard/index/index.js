import Theater from '@core/views/theater';
import Scene from '@core/views/scene';
import Card from '@core/views/card';
import Logo from '@core/views/logo';
import app from '@core/instance';
import style from './style.styl';

class Page extends React.Component {

  constructor(options) {
    super(options);
    this.state = {items: []};
    this.onPickClick = this.onPickClick.bind(this);
    app.api.get('quiz/list').then(items => {
      this.setState({items});
    });
  }

  render() {
    if (!this.state.items.length) {
      return null;
    }

    let items = this.state.items.map((item, i) => {
      return (
        <div key={i} className={style.item}>
          <div className={style.item__title}>{item.title}</div>
          <a href="#" className={style.item__button} data-index={i} onClick={this.onPickClick}>Начать</a>
        </div>
      );
    });

    return (
      <Theater animated={true}>
        <Scene middle={true}>
          <Card className={style.container}>
            <h4 className={style.header}>Для начала выберите тест из списка</h4>
            <div className={style.items}>{items}</div>
          </Card>
        </Scene>
      </Theater>
    );
  }

  onPickClick(e) {
    e.preventDefault();
    e.stopPropagation();
    let index = e.target.dataset.index;
    let item = this.state.items[index];
    app.api.post('session/create', {quiz_token: item.token}).then(session => {
      this.context.router.push(`/whiteboard/session/${session.token}`);
    });
  }
}

Page.contextTypes = {
  router: React.PropTypes.object.isRequired
};

export default Page;
