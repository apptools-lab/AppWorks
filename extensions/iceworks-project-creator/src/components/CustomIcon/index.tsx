import React from 'react';
import { Icon } from '@alifd/next';

const Iconfont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1846574_u1f7ttl7ye.js',
});

interface ICustomIcon {
  type: string;
  size?: any;
  onClick?: any;
  style?: any
}

const CustomIcon: React.SFC<ICustomIcon> = ({ size, type, onClick, style }) => (
  <Iconfont type={type} size={size} onClick={onClick} style={style} />
);

CustomIcon.defaultProps = {
  size: 'medium',
};

export default CustomIcon;