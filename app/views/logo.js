import Svg from '@core/base/svg';

export default class extends React.Component {

  render() {
    return (
      <div className={'logo' + (this.props.className ? ' ' + this.props.className : '')}>
        <Svg id="logo" viewBox="0 0 62 58"/>
      </div>
    );
  }
}
