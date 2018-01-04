/* global document */

import React, { PureComponent } from 'react';
import { findDOMNode } from 'react-dom';
import { CSSTransitionGroup } from 'react-transition-group';

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
      // Закрываем тултип если произошел клик за пределами тултипа, но внутри root.
      // (Это защитит от закрытия при клике по дате календаря)
      if (
        !findDOMNode(this).contains(event.target) &&
        document.getElementById('root').contains(event.target)
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

        <CSSTransitionGroup
          component="div"
          transitionName={{
            enter: 'tooltip__content_enter',
            enterActive: 'tooltip__content_enter_active',
            leave: 'tooltip__content_leave',
            leaveActive: 'tooltip__content_leave_active',
            appear: 'tooltip__content_appear',
            appearActive: 'tooltip__content_appear_active',
          }}
          transitionEnterTimeout={200}
          transitionLeaveTimeout={200}
        >
          {this.state.isHidden ?
            null :
            <div className={`tooltip__content ${className}`}>
              {content}
            </div>
          }
        </CSSTransitionGroup>
      </div>
    );
  }
}
