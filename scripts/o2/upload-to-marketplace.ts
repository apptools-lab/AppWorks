import axios from 'axios';

async function uploadExtesion(name: string, url: string) {
  const response = await axios.post(
    'https://marketplace.antfin-inc.com/openapi/extension/upload',
    {
      name,
      url,
    },
  );
  return response;
}

async function updateExtensionStatus(status: string, extensionReleaseId: string) {
  const response = await axios.put(
    'https://marketplace.antfin-inc.com/openapi/extension/status',
    {
      status,
      extensionReleaseId,
    },
  );

  return response;
}

(async function () {
  try {
    const extensionName = '';
    const extensionUrl = '';
    // upload extension to marketplace
    const { extensionReleaseId } = await uploadExtesion(extensionName, extensionUrl);
    // pass review extension
    await updateExtensionStatus('PASSED_REVIEW', extensionReleaseId);
    // publish extension
    await updateExtensionStatus('PUBLISHED', extensionReleaseId);
  } catch (error) {
    console.log(error);
  }
})();
