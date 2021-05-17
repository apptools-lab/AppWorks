import React, { useState, useEffect } from 'react';
import { Form, Select, Input, Notification, Loading } from '@alifd/next';
import { debounce } from 'throttle-debounce';
import { IMaterialSource } from '@appworks/material-utils';
import { packageManagers, npmRegistries, AliNpmRegistry, AliPackageManager, urlRegExp } from '@/constants';
import callService from '@/callService';
import { useIntl } from 'react-intl';
import { LocaleProvider } from '@/i18n';
import CustomMaterialSource from './components/CustomMaterialSource';
import styles from './index.module.scss';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: { span: 14 },
  wrapperCol: { span: 10 },
};
const CUSTOM_NPM_REGISTRY_FORM_ITEM_KEY = 'customNpmRegistry';
const CUSTOM_NPM_REGISTRY_SELECT_KEY = 'npm - 自定义镜像源';

const ConfigHelper = () => {
  const [materialSources, setMaterialSources] = useState<IMaterialSource[]>([]);
  const [fields, setFields] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const intl = useIntl();

  const onSourceAdd = async (materialSource: IMaterialSource) => {
    const newMaterialSources = await callService('material', 'addSource', materialSource);
    setMaterialSources(newMaterialSources);
    Notification.success({ content: intl.formatMessage({ id: 'web.applicationManager.ConfigHelper.index.addMaterialSuccess' }) });
  };

  const onMaterialSourceEdit = async (materialSource: IMaterialSource, originMaterialSource: IMaterialSource) => {
    const newMaterialSources = await callService('material', 'updateSource', materialSource, originMaterialSource);
    setMaterialSources(newMaterialSources);
    Notification.success({ content: intl.formatMessage({ id: 'web.applicationManager.ConfigHelper.index.editMaterialSuccess' }) });
  };

  const onMaterialSourceDelete = async (materialSource: IMaterialSource) => {
    try {
      const newMaterialSources = await callService('material', 'removeSource', materialSource.source);
      setMaterialSources(newMaterialSources);
      Notification.success({ content: intl.formatMessage({ id: 'web.applicationManager.ConfigHelper.index.deleteMaterialSuccess' }) });
    } catch (e) {
      Notification.error({ content: e.message });
    }
  };
  const onFormChange = debounce(800, async (values, items) => {
    setFields(values);
    try {
      const { name, value } = items;
      if (name === 'npmRegistry' && value === CUSTOM_NPM_REGISTRY_SELECT_KEY) {
        return;
      }
      if (name === CUSTOM_NPM_REGISTRY_FORM_ITEM_KEY && !urlRegExp.test(value)) {
        return;
      }
      if (name === CUSTOM_NPM_REGISTRY_FORM_ITEM_KEY) {
        await callService('common', 'saveDataToSettingJson', 'npmRegistry', value);
      } else {
        await callService('common', 'saveDataToSettingJson', name, value);
      }
      Notification.success({ content: intl.formatMessage({ id: 'web.applicationManager.ConfigHelper.index.editSettingSuccess' }) });
    } catch (e) {
      Notification.error({ content: e.message });
    }
  });

  useEffect(() => {
    async function initFormData() {
      try {
        setLoading(true);
        const curPackageManager = await callService('common', 'getDataFromSettingJson', 'packageManager');
        let curNpmRegistry = await callService('common', 'getDataFromSettingJson', 'npmRegistry');
        const curMaterialSources = await callService('material', 'getUserSources');
        const isAliInternal = (await callService('common', 'checkIsAliInternal')) as boolean;
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
      } finally {
        setLoading(false);
      }
    }

    initFormData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      {loading ? (
        <Loading visible={loading} className={styles.loading} />
      ) : (
        <div className={styles.container}>
          <Form value={fields} {...formItemLayout} labelTextAlign="left" size="medium" onChange={onFormChange}>
            <FormItem label={intl.formatMessage({ id: 'web.applicationManager.ConfigHelper.index.npmPackageManager' })}>
              <Select
                name="packageManager"
                placeholder={intl.formatMessage({ id: 'web.applicationManager.ConfigHelper.index.chooseNpmPackageManager' })}
                style={{ width: '100%' }}
              >
                {packageManagers.map((item) => (
                  <Select.Option key={item} value={item}>
                    {item}
                  </Select.Option>
                ))}
              </Select>
            </FormItem>
            <FormItem label={intl.formatMessage({ id: 'web.applicationManager.ConfigHelper.index.npmRegistry' })}>
              <Select
                name="npmRegistry"
                placeholder={intl.formatMessage({ id: 'web.applicationManager.ConfigHelper.index.chooseNpmRegistry' })}
                style={{ width: '100%' }}
              >
                {npmRegistries.map((item) => (
                  <Select.Option key={item} value={item}>
                    {item}
                  </Select.Option>
                ))}
              </Select>
            </FormItem>
            {fields.npmRegistry === CUSTOM_NPM_REGISTRY_SELECT_KEY && (
            <FormItem
              label=" "
              format="url"
              formatMessage={intl.formatMessage({ id: 'web.applicationManager.ConfigHelper.index.formatUrl' })}
            >
              <Input
                name="customNpmRegistry"
                placeholder={intl.formatMessage({ id: 'web.applicationManager.ConfigHelper.index.customNpmRegistryPlaceHolder' })}
              />
            </FormItem>
            )}
          </Form>
          <CustomMaterialSource
            sources={materialSources}
            onSourceAdd={onSourceAdd}
            onSourceDelete={onMaterialSourceDelete}
            onSourceEdit={onMaterialSourceEdit}
            addMaterialVisible={window.iceworksAutoFocusField === 'appworks.materialSources'}
          />
        </div>
      )}
    </>
  );
};

const IntlConfigHelper = () => {
  return (
    <LocaleProvider>
      <ConfigHelper />
    </LocaleProvider>
  );
};

export default IntlConfigHelper;
