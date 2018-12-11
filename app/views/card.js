export default class extends React.Component {

  render() {
    return <div className={'card' + (this.props.className ? ' ' + this.props.className : '')}>{this.props.children}</div>;
  }
}
