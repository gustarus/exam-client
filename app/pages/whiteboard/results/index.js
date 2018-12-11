import Theater from '@core/views/theater';
import Scene from '@core/views/scene';
import Card from '@core/views/card';
import app from '@core/instance';
import style from '@core/pages/whiteboard/session/style.styl';

class Page extends React.Component {

  constructor(options) {
    super(options);
    this.state = {session: null};
    this.onPauseClick = this.onPauseClick.bind(this);
  }

  componentDidMount() {
    this.sync();
  }

  sync() {
    app.api.get(`session/view/${this.props.params.token}`).then(session => {
      this.setState({session});
    });
  }

  render() {
    if (!this.state.session) {
      return null;
    }

    return (
      <Theater>
        <Scene middle={true}>
          <Card className={style.container}>
            <div className={style.block}>
              <h4 className={style.header}>Результат группы</h4>
              <div className={style.counter}>
                <div className={style.counter__indicator}/>
                <div className={style.counter__label}>{this.state.session.score} из {this.state.session.weight}</div>
              </div>
            </div>
          </Card>
        </Scene>
      </Theater>
    );
  }

  onPauseClick(e) {
    e.preventDefault();
    e.stopPropagation();
    app.api.put(`session/pause/${this.state.session.token}`).then(response => {
      this.context.router.goBack();
    })
  }
}

Page.contextTypes = {
  router: React.PropTypes.object.isRequired
};

export default Page;
