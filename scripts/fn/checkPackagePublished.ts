
import { getLatestVersion, getNpmInfo } from 'ice-npm-utils';
import { getPublishedPackages } from './published-info';

async function getNpmVersion(name: string, isBeta: boolean): Promise<string> {
  let version = '';
  try {
    if (isBeta) {
      const data = await getNpmInfo(name);
      if (data['dist-tags'] && data['dist-tags'].beta) {
        version = data['dist-tags'].beta;
      }
    } else {
      version = await getLatestVersion(name);
    }
  } catch (e) {
    // ignore
  }
  return version;
}

// Check published packages can be installed.
export default function checkPackagePublished(isBeta?: boolean) {
  const publishedPackages: string[] = getPublishedPackages();

  const timeout = 10000;
  const maxDetectTimes = 30;
  return Promise.all(
    publishedPackages.map((publishedPackage) => {
      return new Promise((resolve, retject) => {
        const info = publishedPackage.split(':');
        // Example: @appworks/project-service:0.1.8
        const name = info[0];
        const version = info[1];

        let times = 0;
        const timer = setInterval(() => {
          if (times++ > maxDetectTimes) {
            // Exit if detect times over maxDetectTimes.
            clearInterval(timer);
            retject(new Error(`${name}@${version} publish failed! Please try again.`));
          } else {
            getNpmVersion(name, !!isBeta)
              .then((latestVersion) => {
                if (version === latestVersion) {
                  // Can be installed.
                  clearInterval(timer);
                  resolve();
                }
              })
              .catch(() => {
                // ignore
              });
          }
        }, timeout);
      });
    }),
  );
}
