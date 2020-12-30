import upload from '../fn/uploadToIceworksOSS';
import { ZIP_NAME, EXTENSION_ZIP_FILE_PATH } from './constant';

/**
 * upload pack to OSS
 */
function uploadPack() {
  upload(`o2-packages/${ZIP_NAME}`, EXTENSION_ZIP_FILE_PATH);
}

uploadPack();
