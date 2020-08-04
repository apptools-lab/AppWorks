import monent from 'moment';

export default {
  monent,
  getTime() {
    return this.moment().format('YYYY-MM-DD');
  },
  transformToCss(input) {
    if (!window.sass) {
      console.warn('sass is not defined');
      return Promise.reject();
    }
    const compile = (input) => {
      if (typeof input !== 'string') Promise.resolve('');
      return new Promise((resolve, reject) => {
        window.sass.compile(input, (res) => {
          if (res && res.text) {
            resolve(res.text);
          } else {
            reject(new Error('sass编译失败'));
          }
        });
      });
    };
    if (typeof input === 'string') {
      return compile(input);
    } else if (typeof input === 'object') {
      const keys = Object.keys(input);
      return Promise.all(keys.map((key) => compile(input[key])))
        .then((data) => {
          const res = {};
          keys.forEach((key, idx) => {
            res[key] = data[idx];
          });
          return res;
        })
        .catch((err) => Promise.reject(err));
    }
  },
};
