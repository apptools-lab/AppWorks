import React, { useState, useEffect } from 'react';
import { Shell, ConfigProvider } from '@alifd/next';
import PageNav from './components/PageNav';
import Logo from './components/Logo';
import HeaderAvatar from './components/HeaderAvatar';
import Footer from './components/Footer';

(function () {
  const throttle = function (type: string, name: string, obj: Window = window) {
    let running = false;

    const func = () => {
      if (running) {
        return;
      }

      running = true;
      requestAnimationFrame(() => {
        obj.dispatchEvent(new CustomEvent(name));
        running = false;
      });
    };

    obj.addEventListener(type, func);
  };

  if (typeof window !== 'undefined') {
    throttle('resize', 'optimizedResize');
  }
})();

interface IGetDevice {
  (width: number): 'phone' | 'tablet' | 'desktop';
}

const defaultValue: IScaffoldConfig = {
  layout: {
    branding: true,
    fixedHeader: false,
    headerAvatar: true,
    type: 'brand',
    footer: true,
  },
};

interface IScaffoldConfig {
  layout: ILayoutConfig
}

interface ILayoutConfig {
  branding: boolean;
  fixedHeader: boolean;
  headerAvatar: boolean;
  type: 'brand' | 'light' | 'dark';
  footer: boolean;
}

export default function BasicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const getDevice: IGetDevice = width => {
    const isPhone =
      typeof navigator !== 'undefined' &&
      navigator &&
      navigator.userAgent.match(/phone/gi);

    if (width < 680 || isPhone) {
      return 'phone';
    } else if (width < 1280 && width > 680) {
      return 'tablet';
    } else {
      return 'desktop';
    }
  };

  const [value, setValue] = useState<IScaffoldConfig>(defaultValue);
  const [device, setDevice] = useState(getDevice(NaN));

  if (typeof window !== 'undefined') {
    window.addEventListener('optimizedResize', e => {
      const deviceWidth =
        (e && e.target && (e.target as Window).innerWidth) || NaN;
      setDevice(getDevice(deviceWidth));
    });
  }

  function handleMessageReceiver(e) {
    if (typeof e.data === 'string') {
      const data = JSON.parse(e.data);
      setValue(data);
    }
  }

  useEffect(() => {
    window.addEventListener('message', handleMessageReceiver, true);
    return () => {
      window.removeEventListener('message', handleMessageReceiver, true);
    };
  }, []);

  const { layout } = value;
  return (
    <ConfigProvider device={device}>
      <Shell
        style={{
          minHeight: '100vh',
        }}
        type={layout.type}
        fixedHeader={layout.fixedHeader}
      >
        {
          layout.branding && (
            <Shell.Branding>
              <Logo
                image="https://img.alicdn.com/tfs/TB1.ZBecq67gK0jSZFHXXa9jVXa-904-826.png"
                text="Logo"
              />
            </Shell.Branding>
          )
        }
        <Shell.Navigation
          direction="hoz"
          style={{
            marginRight: 10,
          }}
        />
        <Shell.Action />
        <Shell.Navigation>
          <PageNav />
        </Shell.Navigation>
        <Shell.Action>
          {
            layout.headerAvatar && <HeaderAvatar />
          }
        </Shell.Action>
        <Shell.Content>{children}</Shell.Content>
        {
          layout.footer && (
          <Shell.Footer>
            <Footer />
          </Shell.Footer>
          )
        }
      </Shell>
    </ConfigProvider>
  );
}
