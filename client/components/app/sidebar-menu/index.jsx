import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { rights, menu } from 'config';
import i18next from 'i18next';

const SidebarMenuLink = ({ link }) => (
  <li>
    <NavLink className="sidebar__menu-item" activeClassName="sidebar__menu-item_active" to={link}>
      <i className="material-icons">{menu.get(link).get('icon')}</i>
      <span className="sidebar__menu-text">{i18next.t(menu.get(link).get('text'))}</span>
    </NavLink>
  </li>
);

// We need here Component but not PureComponent to use activeClassName in SidebarMenuLink
export default class SidebarMenu extends Component {
  // Return only accessed links for current user role
  getLinks() {
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
