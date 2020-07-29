import React, { useState, useEffect } from 'react';
import { Notification, Balloon } from '@alifd/next';
import MenuCard from '@/components/MenuCard';
import { IProjectField } from '@/types';
import { targets, webAppTypes, miniAppTypes } from './config';
import styles from './index.module.scss';

interface IScaffoldTypeForm {
  value: IProjectField;
  onChange: (value: object) => void;
}

const RaxScaffoldTypeForm: React.FC<IScaffoldTypeForm> = ({ value, onChange }) => {
  const [selectedTargets, setSelectedTargets] = useState(() => {
    if (value.ejsOptions && value.ejsOptions.targets && value.ejsOptions.targets instanceof Array) {
      return value.ejsOptions.targets;
    }
    return [targets[0].type];
  });
  const [isMpa, setIsMpa] = useState(() => {
    if (value.ejsOptions && typeof value.ejsOptions.mpa !== 'undefined') {
      return value.ejsOptions.mpa;
    }
    return webAppTypes[0].type === 'mpa';
  });
  const [selectedMiniAppType, setSelectedMiniAppType] = useState(() => {
    if (value.ejsOptions && value.ejsOptions.miniappType) {
      return value.ejsOptions.miniappType;
    }
    return miniAppTypes[0].type;
  });
  /**
   * 选择 Rax 应用的 target
   */
  const onTargetClick = (target) => {
    const ejsOptions: any = { ...value.ejsOptions };

    const targetIndex = selectedTargets.findIndex((item) => target.type === item);
    if (targetIndex > -1) {
      if (selectedTargets.length === 1) {
        Notification.error({ content: '请至少选择一个 Target' });
        return;
      }
      // 删除已有的 target
      selectedTargets.splice(targetIndex, 1);

      if (target.type === 'web') {
        delete ejsOptions.mpa;
      } else if (selectedTargets.length === 1) {
        // 当前 selectedTargets 只剩下 web
        delete ejsOptions.miniappType;
      }
    } else {
      // 新增 target
      if (target.type === 'web') {
        const ismpa = webAppTypes[0].type === 'mpa';
        setIsMpa(ismpa);
        ejsOptions.mpa = ismpa;
      } else if (
        !selectedTargets.some(
          (target) => target === 'miniapp' || target === 'wechat-miniprogram' || target === 'kraken'
        )
      ) {
        setSelectedMiniAppType(miniAppTypes[0].type);
        ejsOptions.miniappType = miniAppTypes[0].type;
      }
      selectedTargets.push(target.type);
    }
    const newSelectedTargets = [...selectedTargets];
    setSelectedTargets(newSelectedTargets);

    onChange({ ejsOptions: { ...ejsOptions, targets: newSelectedTargets } });
  };
  /**
   * 选择 web 应用类型: mpa or spa
   */
  const onWebAppTypeClick = (webAppType) => {
    const ismpa: boolean = webAppType.type === 'mpa';
    setIsMpa(ismpa);
    onChange({ ejsOptions: { ...value.ejsOptions, mpa: webAppType.type === 'mpa' } });
  };
  /**
   * 选择小程序构建类型
   */
  const onMiniAppTypeClick = (miniAppType) => {
    setSelectedMiniAppType(miniAppType.type);
    onChange({ ejsOptions: { ...value.ejsOptions, miniappType: miniAppType.type } });
  };

  useEffect(() => {
    // init value
    onChange({ ejsOptions: { targets: selectedTargets, mpa: isMpa, miniappType: selectedMiniAppType } });
  }, []);
  return (
    <div className={styles.container}>
      <div className={styles.title}>Target (至少选择一个)</div>
      <div className={styles.row}>
        {targets.map((item) => {
          const selected = selectedTargets.some((selectedTarget) => selectedTarget === item.type);
          return (
            <Balloon
              align="t"
              trigger={
                <MenuCard
                  key={item.type}
                  selected={selected}
                  title={item.title}
                  icon={item.icon}
                  onClick={() => onTargetClick(item)}
                />
              }
              closable={false}
              triggerType="hover"
            >
              {item.description}
            </Balloon>
          );
        })}
      </div>
      {selectedTargets.some((item) => item === 'web') && (
        <>
          <div className={styles.title}>为 Web 应用选择应用类型</div>
          <div className={styles.row}>
            {webAppTypes.map((item) => (
              <Balloon
                align="t"
                trigger={
                  <MenuCard
                    key={item.type}
                    style={{ width: 100, height: 36 }}
                    selected={isMpa === (item.type === 'mpa')}
                    title={item.title}
                    onClick={() => onWebAppTypeClick(item)}
                  />
                }
                triggerType="hover"
                closable={false}
              >
                {item.description}
              </Balloon>
            ))}
          </div>
        </>
      )}
      {selectedTargets.some((item) => item === 'miniapp' || item === 'wechat-miniprogram' || item === 'kraken') && (
        <>
          <div className={styles.title}>为小程序选择构建类型</div>
          <div className={styles.row}>
            {miniAppTypes.map((item) => (
              <Balloon
                align="t"
                trigger={
                  <MenuCard
                    key={item.type}
                    style={{ width: 100, height: 36 }}
                    selected={selectedMiniAppType === item.type}
                    title={item.title}
                    onClick={() => onMiniAppTypeClick(item)}
                  />
                }
                triggerType="hover"
                closable={false}
              >
                {item.description}
              </Balloon>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default RaxScaffoldTypeForm;
