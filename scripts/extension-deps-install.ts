import extensionDepsInstall from './fn/extension-deps-install';

try {
  extensionDepsInstall();
} catch (e) {
  console.trace(e);
  process.exit(128);
}
