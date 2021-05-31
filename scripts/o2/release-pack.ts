/**
 * Release to marketplace
 */
import * as urllib from 'urllib';
import * as chalk from 'chalk';
import { EXTENSION_ZIP_FILE_PATH } from './constant';
import { ALI_EXTENSION_UPLOAD_URL, ALI_EXTENSION_STATUS_UPDATE_URL } from '@appworks/constant';

const PRIVATE_TOKEN = process.argv[2];
const EXTENSION_NAME = 'icework-kit';
const PUBLISHER = 'O2';

const SCANNING_CODE = 'EStateNoChangeFromSCANING';

async function uploadExtesion() {
  const response = await urllib.request(
    `${ALI_EXTENSION_UPLOAD_URL}?publisher=${PUBLISHER}`,
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
    throw new Error(`Code: ${code}, Message: ${message}`);
  }
}

async function updateExtensionStatus(extensionStatus: string, extensionReleaseId: string) {
  const response = await urllib.request(
    ALI_EXTENSION_STATUS_UPDATE_URL,
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
  const { code, message } = data;
  if (status === 200 || code === SCANNING_CODE) {
    return data;
  } else {
    throw new Error(`Code: ${code}, Message: ${message}`);
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
    console.log(chalk.green(chalk.black.bgGreen(' SUCCESS '), 'Extension was uploaded to ali marketplace successfully!'));
    const intervalId = setInterval(async () => {
      try {
        // pass review extension
        const { code } = await updateExtensionStatus('PASSED_REVIEW', extensionReleaseId);
        if (code === SCANNING_CODE) {
          console.log(chalk.yellow(chalk.black.bgYellow(' WARN '), 'Security scanning is in progress. Please wait for a while.'));
          return;
        }
        console.log(chalk.green(chalk.black.bgGreen(' SUCCESS '), 'Extension was passed review successfully!'));
        clearInterval(intervalId);
        // publish extension
        await updateExtensionStatus('PUBLISHED', extensionReleaseId);
        console.log(chalk.green(chalk.black.bgGreen(' SUCCESS '), 'Extension was published successfully!'));
      } catch (error) {
        console.log(error);
      }
    }, 10000);
  } catch (error) {
    console.log(error);
  }
})();
