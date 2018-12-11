import style from './style.styl';

export default class extends React.Component {

  render() {
    return (
      <div className={style.container}>
        <div className={style.indicator}/>
      </div>
    );
  }
}
