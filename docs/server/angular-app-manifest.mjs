
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: 'C:/Program Files/Git/innoit-prime-ng-assignment/',
  locale: undefined,
  routes: undefined,
  entryPointToBrowserMapping: {
  "node_modules/@angular/animations/fesm2022/browser.mjs": [
    {
      "path": "chunk-QFRDZ74J.js",
      "dynamicImport": false
    }
  ]
},
  assets: {
    'index.csr.html': {size: 5179, hash: '0f76bf9a4f944290a34287bd8ac271add2f53c19d918789d40b2c26afb4f6946', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1118, hash: 'a629ead57aa104e90ae91fbecda9e79df2b8a83b46e77ce4d2dd4ace020464c4', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-QNYUU6Y7.css': {size: 364065, hash: 'ELRv7uU3VEA', text: () => import('./assets-chunks/styles-QNYUU6Y7_css.mjs').then(m => m.default)}
  },
};
