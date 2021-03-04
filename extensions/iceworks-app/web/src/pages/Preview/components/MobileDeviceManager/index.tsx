import { Button, List, Input } from '@alifd/next';
import React, { useState, useRef } from 'react';


export default function MobileDeviceManager({ deviceData, setDeviceData }) {
  const [mobileDeviceData, setMobileDeviceData] = useState(deviceData);
  const valueState = useRef([]);
  function addMobileDevice() {
    setMobileDeviceData([...mobileDeviceData, { label: 'New Device', value: '', customizeDevice: true }]);
  }

  function handleNewDeviceNameChange(value, index) {
    mobileDeviceData[index].label = value;
  }

  function handleNewDeviceValueChange(value, index) {
    mobileDeviceData[index].value = value;
    if (!/d*\*d*/.test(value)) {
      valueState.current[index] = 'error';
    } else {
      valueState.current[index] = 'success';
    }
    setDeviceData(mobileDeviceData);
  }

  function handleDeleteDevice(index) {
    const newMobileData = Array.prototype.concat(mobileDeviceData.slice(0, index), mobileDeviceData.slice(index + 1));
    setMobileDeviceData(newMobileData);
    setDeviceData(newMobileData);
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
            <Button
              disabled={!item.customizeDevice}
              onClick={() => handleDeleteDevice(index)}
            > Delete
            </Button>
          </List.Item>))
                }
      </List>
    </div>
  );
}
