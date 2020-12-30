/**
 * Release to marketplace
 */
import * as urllib from 'urllib';
import { EXTENSION_ZIP_FILE_PATH } from './constant';

const PRIVATE_TOKEN = process.argv[2];
const EXTENSION_NAME = 'icework-kit';
const PUBLISHER = 'O2';

async function uploadExtesion() {
  const response = await urllib.request(
    `https://marketplace.antfin-inc.com/openapi/extension/upload?publisher=${PUBLISHER}`,
    {
      method: 'POST',
      dataType: 'json',
      headers: {
        'x-private-token': PRIVATE_TOKEN,
      },
      files: EXTENSION_ZIP_FILE_PATH,
      data: {
        name: EXTENSION_NAME,
      },
      timeout: 20000,
    },
  );
  const { status, data } = response;
  if (status === 200) {
    return data;
  } else {
    const { code, message } = data;
    throw new Error(`Error: Code: ${code}, Message: ${message}`);
  }
}

async function updateExtensionStatus(extensionStatus: string, extensionReleaseId: string) {
  const response = await urllib.request(
    'https://marketplace.antfin-inc.com/openapi/extension/status',
    {
      method: 'PUT',
      dataType: 'json',
      headers: {
        'x-private-token': PRIVATE_TOKEN,
      },
      data: {
        status: extensionStatus,
        extensionReleaseId,
      },
    },
  );

  const { status, data } = response;
  if (status === 200) {
    return data;
  } else {
    const { code, message } = data;
    throw new Error(`Error: Code: ${code}, Message: ${message}`);
  }
}

(async function () {
  if (!PRIVATE_TOKEN) {
    console.log('Please pass your o2 x-private-token. For example: `npm run o2:release YOUR_TOKEN`.');
    return;
  }

  try {
    // upload extension to marketplace
    const { extensionReleaseId } = await uploadExtesion();

    const intervalId = setInterval(async () => {
      try {
        // pass review extension
        await updateExtensionStatus('PASSED_REVIEW', extensionReleaseId);
        clearInterval(intervalId);
        // publish extension
        await updateExtensionStatus('PUBLISHED', extensionReleaseId);
      } catch (error) {
        console.log(error);
      }
    }, 10000);
  } catch (error) {
    console.log(error);
  }
})();
