import React, { useEffect } from 'react';
import { Grid, Icon, Loading } from '@alifd/next';
import { FormattedMessage, useIntl } from 'react-intl';
import pageStore from '@/pages/Dashboard/store';
import callService from '@/callService';
import styles from './index.module.scss';

const { Row, Col } = Grid;

function Item({ name, version, outdated }) {
  const intl = useIntl();
  function handleUpgrade() {
    callService('common', 'executeCommand', 'applicationManager.nodeDependencies.upgrade', { command: { arguments: ['', name, outdated] } });
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
      { outdated && <Icon title={intl.formatMessage({ id: 'web.applicationManager.Dashboard.framwork.list.core.upgrade' }, { outdated })} type="warning" style={{ color: '#FFA003', marginLeft: '6px' }} onClick={handleUpgrade} />}
    </li>
  );
}

function List({ title, data, isLoading, error, inited }) {
  const isEmpty = inited && !data.length;
  const content = !isEmpty ?
    (
      <ul>
        {data.map((dep) => <Item key={dep.name} {...dep} />)}
      </ul>
    ) :
    (
      <div className={styles.empty}>
        None
      </div>
    );
  return (
    <Col span="8">
      <h3 className={styles.title}>
        <FormattedMessage id={title} />
      </h3>
      <Loading className={styles.loading} visible={isLoading || !inited}>
        {!error ?
          content :
          <div className={styles.error}>
            Error
          </div>
        }
      </Loading>
    </Col>
  );
}

function ListWitchState({ name }) {
  const moduleName = `${name}Dependencies`;
  const [state, dispatchers] = pageStore.useModel(moduleName);
  const effectsState = pageStore.useModelEffectsState(moduleName);
  useEffect(() => {
    dispatchers.refresh();
  }, []);
  return (<List
    {...state}
    title={`web.applicationManager.Dashboard.framwork.list.${name}.title`}
    isLoading={effectsState.refresh.isLoading}
    error={effectsState.refresh.error}
  />);
}

export default () => {
  const coreDispatcher = pageStore.useModelDispatchers('coreDependencies');
  const componentDispatcher = pageStore.useModelDispatchers('componentDependencies');
  const pluginDispatcher = pageStore.useModelDispatchers('pluginDependencies');

  function refresh() {
    coreDispatcher.refresh();
    componentDispatcher.refresh();
    pluginDispatcher.refresh();
  }

  return (
    <div className={styles.container}>
      <h2>
        <FormattedMessage id="web.applicationManager.Dashboard.framwork.title" />
        <Icon type="refresh" onClick={refresh} className={styles.refresh} size="small" />
      </h2>
      <div className={styles.main}>
        <Row>
          <ListWitchState name="core" />
          <ListWitchState name="component" />
          <ListWitchState name="plugin" />
        </Row>
      </div>
    </div>
  );
};
