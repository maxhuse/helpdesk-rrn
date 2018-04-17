import React, { PureComponent, ReactElement } from 'react';
import classnames from 'classnames';
import { findDOMNode } from 'react-dom';
import { CSSTransition } from 'react-transition-group';

interface IProps {
  className?: string;
  content: ReactElement<any>;
  children: ReactElement<any>;
}
interface IState {
  isHidden: boolean;
}
export default class Tooltip extends PureComponent<IProps, IState> {
  constructor(props) {
    super(props);

    this.toggleHide = this.toggleHide.bind(this);
    this.handleClick = this.handleClick.bind(this);

    this.state = { isHidden: true };
  }

  componentDidMount() {
    document.addEventListener('click', this.handleClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClick, false);
  }

  private handleClick(event): void {
    const rootEl = document.getElementById('root');
    const modalRootEl = document.getElementById('modal-root');

    if (!rootEl || !modalRootEl) {
      return;
    }

    try {
      // Close the tooltip if there is a click outside the tooltip, but inside root.
      // This will protect you from closing when clicking on the date of the calendar.
      if (!findDOMNode(this).contains(event.target) &&
        (rootEl.contains(event.target) || modalRootEl.contains(event.target))
      ) {
        if (!this.state.isHidden) {
          this.toggleHide();
        }
      }
    } catch (error) {
      // do nothing, ie fix
    }
  }

  private toggleHide(): void {
    this.setState({
      isHidden: !this.state.isHidden,
    });
  }

  render() {
    const { className, children, content } = this.props;

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
          <div className={classnames('tooltip__content', className)}>
            {content}
          </div>
        </CSSTransition>
      </div>
    );
  }
}
