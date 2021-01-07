import React from 'react';
import { Grid } from '@alifd/next';
import styles from './index.module.scss';

const { Row, Col } = Grid;

export default () => {
  return (
    <div className={styles.container}>
      <h2>
        基础信息
        <a href="">
          研发数据平台
        </a>
      </h2>
      <div>
        <Row>
          <Col span="16">
            <h3>
              Fusion Lite
            </h3>
            <div>
              轻量级模板，使用 TypeScript，仅包含基础的 Layout。
            </div>
            <ul>
              <li>
                <strong>本地路径：</strong>
                <a href="">www.taobao.com</a>
              </li>
              <li>
                <strong>仓库路径：</strong>
                <a href="">www.taobao.com</a>
              </li>
              <li>
                <strong>DEF 地址：</strong>
                <a href="">www.taobao.com</a>
              </li>
            </ul>
          </Col>
          <Col span="8">
            <h3>应用资源</h3>
            <ul>
              <li>
                <strong>日常：</strong>
                <a href="">www.taobao.com</a>
              </li>
              <li>
                <strong>预发：</strong>
                <a href="">www.taobao.com</a>
              </li>
              <li>
                <strong>线上：</strong>
                <a href="">www.taobao.com</a>
              </li>
            </ul>
          </Col>
        </Row>
      </div>
    </div>
  );
};
