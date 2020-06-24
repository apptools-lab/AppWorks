import React, { useState, useEffect } from 'react';
import { Form, Select, Input, Notification } from '@alifd/next';
import { debounce } from 'throttle-debounce';
import { IMaterialSource } from '@iceworks/material-utils';
import { packageManagers, npmRegistries, AliNpmRegistry, AliPackageManager } from '@/constants';
import callService from '@/callService';
import CustomMaterialSource from './CustomMaterialSource';
import styles from './index.module.scss';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: { span: 14 },
  wrapperCol: { span: 10 }
};
const CUSTOM_NPM_REGISTRY_FORM_ITEM_KEY = 'customNpmRegistry';
const CUSTOM_NPM_REGISTRY_SELECT_KEY = 'npm - 自定义物料源';

const ConfigHelper = () => {
  const [materialSources, setMaterialSources] = useState<IMaterialSource[]>([]);
  const [fields, setFields] = useState<any>({});

  const onMaterialSourceAdd = async (materialSource: IMaterialSource) => {
    try {
      const newMaterialSources = await callService('material', 'addMaterialSource', materialSource);
      setMaterialSources(newMaterialSources);
      Notification.success({ content: '新增物料源成功' });
    } catch (e) {
      Notification.error({ content: e.message });
    }
  }

  const onMaterialSourceEdit = async (materialSource: IMaterialSource, originMaterialSource: IMaterialSource) => {
    try {
      const newMaterialSources = await callService('material', 'updateMaterialSource', materialSource, originMaterialSource);
      setMaterialSources(newMaterialSources);
      Notification.success({ content: '修改物料源成功' });
    } catch (e) {
      Notification.error({ content: e.message });
    }
  }

  const onMaterialSourceDelete = async (materialSource: IMaterialSource) => {
    try {
      const newMaterialSources = await callService('material', 'removeMaterialSource', materialSource.source);
      setMaterialSources(newMaterialSources);
      Notification.success({ content: '删除物料源成功' });
    } catch (e) {
      Notification.error({ content: e.message });
    }
  }
  const onFormChange = debounce(800, async (values, items) => {
    setFields(values);
    try {
      const { name, value } = items;
      if (name === 'npmRegistry' && value === CUSTOM_NPM_REGISTRY_SELECT_KEY) {
        return;
      }
      if (name === CUSTOM_NPM_REGISTRY_FORM_ITEM_KEY &&
        !/^(https?:\/\/(([a-zA-Z0-9]+-?)+[a-zA-Z0-9]+\.)+[a-zA-Z]+)(:\d+)?(\/.*)?(\?.*)?(#.*)?$/.test(value)) {
        return;
      }
      if (name === CUSTOM_NPM_REGISTRY_FORM_ITEM_KEY) {
        await callService('common', 'saveDataToSettingJson', 'npmRegistry', value);
      } else {
        await callService('common', 'saveDataToSettingJson', name, value);
      }
      Notification.success({ content: '设置成功' });
    } catch (e) {
      Notification.error({ content: e.message });
    }
  })

  useEffect(() => {
    async function initFormData() {
      try {
        const curPackageManager = await callService('common', 'getDataFromSettingJson', 'packageManager');
        let curNpmRegistry = await callService('common', 'getDataFromSettingJson', 'npmRegistry');
        const curMaterialSources = await callService('material', 'getUserMaterialSources');
        const isAliInternal = await callService('common', 'checkIsAliInternal') as boolean;
        if (isAliInternal) {
          npmRegistries.push(AliNpmRegistry);
          packageManagers.push(AliPackageManager);
        }
        npmRegistries.push(CUSTOM_NPM_REGISTRY_SELECT_KEY);
        setMaterialSources([...materialSources, ...curMaterialSources]);
        let customNpmRegistry = '';
        if (!npmRegistries.includes(curNpmRegistry)) {
          customNpmRegistry = curNpmRegistry;
          curNpmRegistry = CUSTOM_NPM_REGISTRY_SELECT_KEY;
        }
        setFields({ packageManager: curPackageManager, npmRegistry: curNpmRegistry, customNpmRegistry });
      } catch (e) {
        Notification.error({ content: e.message });
      }
    }

    initFormData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className={styles.container}>
      <CustomMaterialSource
        sources={materialSources}
        onMaterialSourceAdd={onMaterialSourceAdd}
        onMaterialSourceDelete={onMaterialSourceDelete}
        onMaterialSourceEdit={onMaterialSourceEdit}
      />
      <Form value={fields} {...formItemLayout} labelTextAlign="left" size="medium" onChange={onFormChange}>
        <FormItem label="Iceworks npm 包管理工具">
          <Select name="packageManager" placeholder="请选择 npm 包管理工具" style={{ width: '100%' }}>
            {packageManagers.map(item => (
              <Select.Option key={item} value={item}>{item}</Select.Option>
            ))}
          </Select>
        </FormItem>
        <FormItem label="Iceworks npm 镜像源">
          <Select name="npmRegistry" placeholder="请选择 npm 镜像源" style={{ width: '100%' }}>
            {npmRegistries.map(item => (
              <Select.Option key={item} value={item}>{item}</Select.Option>
            ))}
          </Select>
        </FormItem>
        {fields.npmRegistry === CUSTOM_NPM_REGISTRY_SELECT_KEY && (
          <FormItem label=" " format="url" >
            <Input name="customNpmRegistry" placeholder="请输入自定义 npm 镜像源" />
          </FormItem>
        )}
      </Form>
    </div >
  )
}

export default ConfigHelper;
