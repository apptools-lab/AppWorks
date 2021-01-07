import React from 'react';
import { Grid, Icon } from '@alifd/next';
import styles from './index.module.scss';

const { Row, Col } = Grid;

const cores = [
  {
    name: 'react',
    currentVersion: '1,5,7',
    nextVersion: '1,5,7',
    needUpgrade: true,
  },
  {
    name: 'icejs',
    currentVersion: '1,5,7',
    nextVersion: '1,5,7',
    needUpgrade: true,
  },
];

function Item({ name, currentVersion, needUpgrade }) {
  return (
    <li>
      <strong>
        {name}
      </strong>
      |
      <span>
        {currentVersion}
      </span>
      { needUpgrade && <Icon type="warning" />}
    </li>
  );
}

export default () => {
  return (
    <div className={styles.container}>
      <h2>
        框架信息
      </h2>
      <div>
        <Row>
          <Col span="8">
            <div>
              核心信息
            </div>
            <ul>
              {cores.map(Item)}
            </ul>
          </Col>
          <Col span="8">
            <div>
              组件信息
            </div>
            <ul>
              {cores.map(Item)}
            </ul>
          </Col>
          <Col span="8">
            <div>
              插件信息
            </div>
            <ul>
              {cores.map(Item)}
            </ul>
          </Col>
        </Row>
      </div>
    </div>
  );
};
