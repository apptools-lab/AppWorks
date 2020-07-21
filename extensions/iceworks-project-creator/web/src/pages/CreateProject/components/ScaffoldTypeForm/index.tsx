import React, { useState } from 'react';
import { Notification } from '@alifd/next';
import MenuCard from '@/components/MenuCard';
import { targets, webAppTypes, miniAppBuildTypes } from './config';
import styles from './index.module.scss';

interface IScaffoldTypeForm {
  type: string;
}

const ScaffoldTypeForm: React.FC<IScaffoldTypeForm> = ({ type }) => {
  const [selectedTargets, setSelectedTargets] = useState([targets[0]]);
  const [selectedAppType, setSelectedAppType] = useState(webAppTypes[0]);
  const [selectedBuildType, setSelectedBuildType] = useState(miniAppBuildTypes[0]);

  const onTargetClick = (target) => {
    const targetIndex = selectedTargets.findIndex(item => target.type === item.type);
    if (targetIndex > -1) {
      if (selectedTargets.length === 1) {
        Notification.error({ content: '请至少选择一个 Target' })
        return;
      }
      selectedTargets.splice(targetIndex, 1);
    } else {
      selectedTargets.push(target);
    }
    setSelectedTargets([...selectedTargets]);
  }
  const onAppTypeClick = (appType) => setSelectedAppType(appType);
  const onBuildTypeClick = (buildType) => setSelectedBuildType(buildType);
  return (
    <div className={styles.container}>
      {type === 'rax' && (
        <>
          <div className={styles.title}>Target (至少选择一个)</div>
          <div className={styles.row}>
            {targets.map(item => {
              const selected = selectedTargets.some(selectedTarget => selectedTarget.type === item.type);
              return (
                <MenuCard
                  selected={selected}
                  title={item.title}
                  icon={item.icon}
                  onClick={() => onTargetClick(item)}
                />
              )
            })}
          </div>
        </>
      )}
      {type === 'rax' && selectedTargets.some(item => item.type === 'web') && (
        <>
          <div className={styles.title}>为 Web 应用选择应用类型</div>
          <div className={styles.row}>
            {webAppTypes.map(item => (
              <MenuCard
                style={{ width: 100, height: 36 }}
                selected={selectedAppType.type === item.type}
                title={item.title}
                onClick={() => onAppTypeClick(item)}
              />
            ))}
          </div>
        </>
      )}
      {selectedTargets.some(item => item.type === 'miniapp' || item.type === 'wechat-miniprogram' || item.type === 'kraken') && (
        <>
          <div className={styles.title}>为小程序选择构建类型</div>
          <div className={styles.row}>
            {miniAppBuildTypes.map(item => (
              <MenuCard
                key={item.type}
                style={{ width: 100, height: 36 }}
                selected={selectedBuildType.type === item.type}
                title={item.title}
                onClick={() => onBuildTypeClick(item)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default ScaffoldTypeForm;
