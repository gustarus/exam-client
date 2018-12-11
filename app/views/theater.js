export default class extends React.Component {

  render() {
    let className = 'theater' + (this.props.animated ? ' theater_animated' : '');
    return <div className={className}>{this.props.children}</div>;
  }
}
