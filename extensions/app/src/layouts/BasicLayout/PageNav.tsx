import React from 'react';
import { Nav } from '@alifd/next';
import { store, Link, useLocation } from 'ice';

const SubNav = Nav.SubNav;
const NavItem = Nav.Item;

interface IMenuItem {
  name: string;
  path?: string;
  icon?: string;
  children?: IMenuItem[];
}

const PageNav = (props) => {
  const location = useLocation();
  const fullpath = `${location.pathname}${location.search}`;

  const [{ collections }] = store.useModel('materials');
  const menuConfig: IMenuItem[] = [
    {
      name: '项目列表',
      path: '/',
      icon: 'chart-pie',
    },
    {
      name: '我的物料源',
      icon: 'set',
      children: collections.map(item => {
        return {
          name: item.title,
          path: `/materialCollection?url=${item.url}`,
        };
      })
    },
    {
      name: '设置',
      path: '/settings',
      icon: 'chart-pie',
    },
  ];

  return (
    <Nav
      className="iceworks-nav"
      type="primary"
      selectedKeys={[fullpath]}
      defaultSelectedKeys={[fullpath]}
      embeddable
      defaultOpenAll
      hasArrow={false}
    >
      {getNavMenuItems(menuConfig)}
    </Nav>
  );
};

export default PageNav;

function getNavMenuItems(menusData: IMenuItem[]) {
  return menusData
    .map((item, index) => {
      return getSubMenuOrItem(item, index);
    });
}

function getSubMenuOrItem(item: IMenuItem, index: number) {
  if (item.children && item.children.some(child => child.name)) {
    const childrenItems = getNavMenuItems(item.children);
    if (childrenItems && childrenItems.length > 0) {
      const subNav = (
        <SubNav
          key={index}
          icon={item.icon}
          label={item.name}
        >
          {childrenItems}
        </SubNav>
      );

      return subNav;
    }
    return null;
  }
  const navItem = (
    <NavItem key={item.path || item.name} icon={item.icon}>
      <Link to={item.path}>
        {item.name}
      </Link>
    </NavItem>
  );

  return navItem;
}
