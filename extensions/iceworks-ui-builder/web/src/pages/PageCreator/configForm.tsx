import React, { useState } from 'react';
import { SchemaForm, SchemaMarkupField as Field, FormButtonGroup, Submit, Reset } from '@formily/next';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  Input,
  Radio,
  Checkbox,
  Select,
  DatePicker,
  NumberPicker,
  TimePicker,
  Upload,
  Switch,
  Range,
  Transfer,
  Rating,
} from '@formily/next-components'; // 或者@formily/next-components'
import { Button, Notification } from '@alifd/next';
import mockSchema from './schema.json';
import styles from './index.module.scss';

const components = {
  Input,
  Checkbox,
};

export default ({ data, schema, resetData, setCurrentStep, currentStep }) => {
  const intl = useIntl();
  const [isCreating, setIsCreating] = useState(false);

  async function createPage(data, config) {
    setIsCreating(true);

    // TODO: create page
    console.log(data, config);

    setIsCreating(false);
    Notification.success({
      content: intl.formatMessage({ id: 'web.iceworksUIBuilder.pageCreator.createPageSuccess' }),
    });
    resetData();
  }

  return (
    <SchemaForm
      components={components}
      schema={schema || mockSchema}
      onSubmit={(config) => {
        createPage(data, config);
        console.log(config);
      }}
    >
      <div className={styles.opts}>
        <Submit type="primary" loading={isCreating}>
          <FormattedMessage id="web.iceworksUIBuilder.pageCreator.createPage" />
        </Submit>
        <Button
          type="primary"
          loading={isCreating}
          onClick={() => {
            setCurrentStep(currentStep - 1);
          }}
        >
          <FormattedMessage id="web.iceworksUIBuilder.pageCreator.previous" />
        </Button>
      </div>
    </SchemaForm>
  );
};
