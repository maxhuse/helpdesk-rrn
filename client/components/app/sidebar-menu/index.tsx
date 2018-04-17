import React, { Component, StatelessComponent } from 'react';
import { NavLink } from 'react-router-dom';
import { rights, menu } from 'config';
import i18next from 'i18next';
import { TState as TAuthState } from 'ducks/data/auth';

interface IMenuLinkProps {
  link: string;
}
const SidebarMenuLink: StatelessComponent<IMenuLinkProps> = ({ link }) => {
  const menuItem = menu.get(link);

  return (
    <li>
      <NavLink className="sidebar__menu-item" activeClassName="sidebar__menu-item_active" to={link}>
        <i className="material-icons">{menuItem ? menuItem.get('icon', '') : null}</i>
        <span className="sidebar__menu-text">
          {menuItem ? i18next.t(menuItem.get('text', '')) : null}
        </span>
      </NavLink>
    </li>
  );
};

interface IMenuProps {
  authDataIm: TAuthState;
}
// We need here Component but not PureComponent to use activeClassName in SidebarMenuLink
export default class SidebarMenu extends Component<IMenuProps> {
  // Return only accessed links for current user role
  private getLinks() {
    const role = this.props.authDataIm.getIn(['data', 'role']);
    const accessedPagesUrl = rights[role];

    return accessedPagesUrl.map(link => <SidebarMenuLink key={link} link={link} />);
  }

  render() {
    return (
      <ul className="sidebar__menu">
        {this.getLinks()}
      </ul>
    );
  }
}
