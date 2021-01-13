import React, { useEffect, useState } from 'react';
import { Grid, Icon } from '@alifd/next';
import { FormattedMessage, useIntl } from 'react-intl';
import callService from '@/callService';
import styles from './index.module.scss';

const { Row, Col } = Grid;

function Item({ name, version, outdated }) {
  const intl = useIntl();
  function handleUpgrade() {
    callService('common', 'executeCommand', 'iceworksApp.nodeDependencies.upgrade', { command: { arguments: ['', name] } });
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
      { outdated && <Icon title={intl.formatMessage({ id: 'web.iceworksApp.Dashboard.framwork.list.core.upgrade' }, { outdated })} type="warning" style={{ color: '#FFA003', marginLeft: '6px' }} onClick={handleUpgrade} />}
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
        <FormattedMessage id="web.iceworksApp.Dashboard.framwork.title" />
      </h2>
      <div className={styles.main}>
        <Row>
          <Col span="8">
            <h3 className={styles.title}>
              <FormattedMessage id="web.iceworksApp.Dashboard.framwork.list.core.title" />
            </h3>
            <ul>
              {coreDependencies.map((dep) => <Item key={dep.name} {...dep} />)}
            </ul>
          </Col>
          <Col span="8">
            <h3 className={styles.title}>
              <FormattedMessage id="web.iceworksApp.Dashboard.framwork.list.component.title" />
            </h3>
            <ul>
              {componentDependencies.map((dep) => <Item key={dep.name} {...dep} />)}
            </ul>
          </Col>
          <Col span="8">
            <h3 className={styles.title}>
              <FormattedMessage id="web.iceworksApp.Dashboard.framwork.list.plugin.title" />
            </h3>
            <ul>
              {pluginDependencies.map((dep) => <Item key={dep.name} {...dep} />)}
            </ul>
          </Col>
        </Row>
      </div>
    </div>
  );
};
