const { Transport } = require('egg-logger');

export default class WebViewTransport extends Transport {
  constructor(options) {
    super(options);
    this.webview = options.webview;
  }

  log(level, args, meta) {
    const text = super.log(level, args, meta);
    return this.webview.postMessage({ eventId: 'codemodMessage', text });
  }
}