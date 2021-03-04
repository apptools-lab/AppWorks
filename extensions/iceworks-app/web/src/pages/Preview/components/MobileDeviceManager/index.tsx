import { Button, List, Input } from '@alifd/next';
import React, { useState } from 'react';

export default function MobileDeviceManager({ deviceData, setDeviceData, numberOfDefaultDevices }) {
  const [mobileDeviceData, setMobileDeviceData] = useState(deviceData);
  const [valueState] = useState([]);
  function addMobileDevice() {
    setMobileDeviceData([...mobileDeviceData, { label: 'New Device', value: '', customizeDevice: true }]);
  }

  function handleNewDeviceNameChange(value, index) {
    const tempData = [...mobileDeviceData];
    tempData[index].label = value;
    setMobileDeviceData(tempData);
  }

  function handleNewDeviceValueChange(value, index) {
    const tempData = [...mobileDeviceData];
    tempData[index].value = value;
    setMobileDeviceData(tempData);
    if (/d*\*d*/.test(value)) {
      valueState[index] = 'success';
      setDeviceData(tempData.slice(numberOfDefaultDevices));
    } else {
      valueState[index] = 'error';
    }
  }

  function handleDeleteDevice(index) {
    const newMobileData = Array.prototype.concat(mobileDeviceData.slice(0, index), mobileDeviceData.slice(index + 1));
    setMobileDeviceData(newMobileData);
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
        mobileDeviceData.map((item, index) => (
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
              > Delete
              </Button>
            </div>
          </List.Item>))
        }
      </List>
    </div>
  );
}
