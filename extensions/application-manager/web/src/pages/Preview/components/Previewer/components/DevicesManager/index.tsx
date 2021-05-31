import React, { useContext, useState } from 'react';
import { Button, List, Input } from '@alifd/next';
import { FormattedMessage } from 'react-intl';
import { Context } from '../../../../context';

export default function DeviceManager() {
  const { deviceData, setDeviceData } = useContext(Context);
  const [valueState] = useState([]);
  function addMobileDevice() {
    setDeviceData([...deviceData, { label: 'New Device', value: '', customizeDevice: true }]);
  }

  function handleNewDeviceNameChange(value, index) {
    const tempData = [...deviceData];
    tempData[index].label = value;
    setDeviceData(tempData);
  }

  function handleNewDeviceValueChange(value, index) {
    const tempData = [...deviceData];
    tempData[index].value = value;
    setDeviceData(tempData);
    if (/^[0-9]{1,5}\*[0-9]{1,5}$/.test(value)) {
      valueState[index] = 'success';
      setDeviceData(tempData);
    } else {
      valueState[index] = 'error';
    }
  }

  function handleDeleteDevice(index) {
    const newMobileData = Array.prototype.concat(deviceData.slice(0, index), deviceData.slice(index + 1));
    setDeviceData(newMobileData);
    setDeviceData(newMobileData);
    valueState[index] = undefined;
  }

  return (
    <div>
      <Button
        onClick={addMobileDevice}
      >
        Add New Mobile Device
      </Button>
      <List size="small">
        {
        deviceData.map((item, index) => (
          <List.Item key={index}>
            <Input
              value={item.label}
              disabled={!item.customizeDevice}
              onChange={value => handleNewDeviceNameChange(value, index)}
            />
            <Input
              value={item.value}
              disabled={!item.customizeDevice}
              state={valueState[index]}
              onChange={value => handleNewDeviceValueChange(value, index)}
            />
            <div>
              <Button
                disabled={!item.customizeDevice}
                onClick={() => handleDeleteDevice(index)}
              >
                <FormattedMessage id="web.applicationManager.Preview.mobileDeviceManager.delete" />
              </Button>
            </div>
          </List.Item>))
        }
      </List>
    </div>
  );
}
