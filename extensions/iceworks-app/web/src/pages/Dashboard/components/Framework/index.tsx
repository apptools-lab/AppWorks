import React, { useEffect, useState } from 'react';
import { Grid, Icon } from '@alifd/next';
import callService from '@/callService';
import styles from './index.module.scss';

const { Row, Col } = Grid;

function Item({ name, version, outdated }) {
  function handleUpgrade() {
    callService('common', 'executeCommand', 'iceworksApp.configHelper.start', { command: { arguments: ['', name] } });
  }
  return (
    <li>
      <strong>
        {name}
      </strong>
      :&nbsp;
      <span>
        {version}
      </span>
      { outdated && <Icon type="warning" style={{ color: '#FFA003', marginLeft: '6px' }} onClick={handleUpgrade} />}
    </li>
  );
}

export default () => {
  const [coreDependencies, setCoreDependencies] = useState([]);
  const [componentDependencies, setComponentDependencies] = useState([]);
  const [pluginDependencies, setPluginDependencies] = useState([]);

  useEffect(() => {
    async function getCoreDependencies() {
      try {
        setCoreDependencies(await callService('project', 'getCoreDependencies'));
      } catch (e) { /* ignore */ }
    }
    async function getComponentDependencies() {
      try {
        setComponentDependencies(await callService('project', 'getComponentDependencies'));
      } catch (e) { /* ignore */ }
    }
    async function getPluginDependencies() {
      try {
        setPluginDependencies(await callService('project', 'getPluginDependencies'));
      } catch (e) { /* ignore */ }
    }
    getCoreDependencies();
    getComponentDependencies();
    getPluginDependencies();
  }, []);

  return (
    <div className={styles.container}>
      <h2>
        框架信息
      </h2>
      <div className={styles.main}>
        <Row>
          <Col span="8">
            <div className={styles.title}>
              核心依赖
            </div>
            <ul>
              {coreDependencies.map(Item)}
            </ul>
          </Col>
          <Col span="8">
            <div className={styles.title}>
              组件依赖
            </div>
            <ul>
              {componentDependencies.map(Item)}
            </ul>
          </Col>
          <Col span="8">
            <div className={styles.title}>
              插件依赖
            </div>
            <ul>
              {pluginDependencies.map(Item)}
            </ul>
          </Col>
        </Row>
      </div>
    </div>
  );
};
