import React, { PureComponent } from 'react';
import { findDOMNode } from 'react-dom';
import { CSSTransition } from 'react-transition-group';

export default class Tooltip extends PureComponent {
  constructor(props) {
    super(props);

    this.toggleHide = this.toggleHide.bind(this);
    this.handleClickBinded = this.handleClick.bind(this);

    this.state = { isHidden: true };
  }

  componentDidMount() {
    document.addEventListener('click', this.handleClickBinded, false);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickBinded, false);
  }

  handleClick(event) {
    try {
      // Close the tooltip if there is a click outside the tooltip, but inside root.
      // This will protect you from closing when clicking on the date of the calendar.
      if (
        !findDOMNode(this).contains(event.target) &&
        (
          document.getElementById('root').contains(event.target) ||
          document.getElementById('modal-root').contains(event.target)
        )
      ) {
        if (!this.state.isHidden) {
          this.toggleHide();
        }
      }
    } catch (error) {
      // do nothing, ie fix
    }
  }

  toggleHide() {
    this.setState({
      isHidden: !this.state.isHidden,
    });
  }

  render() {
    const { className = '', children, content } = this.props;

    return (
      <div className="tooltip">
        <div onClick={this.toggleHide}>
          {children}
        </div>

        <CSSTransition
          in={!this.state.isHidden}
          classNames={{
            enter: 'tooltip__content_enter',
            enterActive: 'tooltip__content_enter_active',
            exit: 'tooltip__content_exit',
            exitActive: 'tooltip__content_exit_active',
            appear: 'tooltip__content_appear',
            appearActive: 'tooltip__content_appear_active',
          }}
          timeout={{ enter: 200, exit: 200 }}
          unmountOnExit
        >
          <div className={`tooltip__content ${className}`}>
            {content}
          </div>
        </CSSTransition>
      </div>
    );
  }
}
