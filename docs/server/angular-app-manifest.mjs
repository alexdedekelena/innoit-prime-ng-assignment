
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: 'alexdedekelena.github.io/innoit-prime-ng-assignment',
  locale: undefined,
  routes: undefined,
  entryPointToBrowserMapping: {
  "node_modules/@angular/animations/fesm2022/browser.mjs": [
    {
      "path": "chunk-LC7F34G6.js",
      "dynamicImport": false
    }
  ]
},
  assets: {
    'index.csr.html': {size: 5182, hash: 'f0b06d3d966b48bbffba6423c526a5e4000ffac055cfaeb1b5d8fbe08583882a', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1121, hash: '4d55e58ca3716bc355e5c77ab1548baea2c80e2cc4551a48a66df280791af84a', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-QNYUU6Y7.css': {size: 364065, hash: 'ELRv7uU3VEA', text: () => import('./assets-chunks/styles-QNYUU6Y7_css.mjs').then(m => m.default)}
  },
};
