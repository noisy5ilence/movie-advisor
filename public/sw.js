if(!self.define){let e,s={};const i=(i,n)=>(i=new URL(i+".js",n).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(n,a)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(s[t])return;let c={};const r=e=>i(e,t),o={module:{uri:t},exports:c,require:r};s[t]=Promise.all(n.map((e=>o[e]||r(e)))).then((e=>(a(...e),c)))}}define(["./workbox-4754cb34"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/app-build-manifest.json",revision:"c786e70688e27bf51e79fb1f962a86a9"},{url:"/_next/static/FvrSApKq1vmT0KiFi0CzV/_buildManifest.js",revision:"2ec694eb52ae4f523f265a46bae4d768"},{url:"/_next/static/FvrSApKq1vmT0KiFi0CzV/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/152.431d65c3703a61be.js",revision:"431d65c3703a61be"},{url:"/_next/static/chunks/209-1ea5ffd6f6715d57.js",revision:"FvrSApKq1vmT0KiFi0CzV"},{url:"/_next/static/chunks/23-e0259c2123520d87.js",revision:"FvrSApKq1vmT0KiFi0CzV"},{url:"/_next/static/chunks/26.286553a5ff2812fc.js",revision:"286553a5ff2812fc"},{url:"/_next/static/chunks/276.c3c1130f2adade69.js",revision:"c3c1130f2adade69"},{url:"/_next/static/chunks/329-eb2b4d4edbe9c401.js",revision:"FvrSApKq1vmT0KiFi0CzV"},{url:"/_next/static/chunks/344.05938a041227e582.js",revision:"05938a041227e582"},{url:"/_next/static/chunks/383.78d47f7582340f53.js",revision:"78d47f7582340f53"},{url:"/_next/static/chunks/460.ac20021c7496f1d6.js",revision:"ac20021c7496f1d6"},{url:"/_next/static/chunks/497.48f1dfd129122432.js",revision:"48f1dfd129122432"},{url:"/_next/static/chunks/61.e269d4a699fba0b6.js",revision:"e269d4a699fba0b6"},{url:"/_next/static/chunks/621-fa4d2ff1cf645813.js",revision:"FvrSApKq1vmT0KiFi0CzV"},{url:"/_next/static/chunks/67-89c4f398bd663eeb.js",revision:"FvrSApKq1vmT0KiFi0CzV"},{url:"/_next/static/chunks/673.362c29137dd3e968.js",revision:"362c29137dd3e968"},{url:"/_next/static/chunks/674-7c487cb45ac8eb18.js",revision:"FvrSApKq1vmT0KiFi0CzV"},{url:"/_next/static/chunks/695.156d21364de6e419.js",revision:"156d21364de6e419"},{url:"/_next/static/chunks/755.5cd959eac5682527.js",revision:"5cd959eac5682527"},{url:"/_next/static/chunks/792.b51012549074b93f.js",revision:"b51012549074b93f"},{url:"/_next/static/chunks/810.6105e84414768b0d.js",revision:"6105e84414768b0d"},{url:"/_next/static/chunks/858-aa1e4a5b92e93402.js",revision:"FvrSApKq1vmT0KiFi0CzV"},{url:"/_next/static/chunks/922.9ce4bf0553cfb724.js",revision:"9ce4bf0553cfb724"},{url:"/_next/static/chunks/960.a4d728274961d42c.js",revision:"a4d728274961d42c"},{url:"/_next/static/chunks/app/(site)/favorites/page-5fbd02d32d986e0a.js",revision:"FvrSApKq1vmT0KiFi0CzV"},{url:"/_next/static/chunks/app/(site)/page-69f78256e0fb2603.js",revision:"FvrSApKq1vmT0KiFi0CzV"},{url:"/_next/static/chunks/app/(site)/popular/page-c665d4d630e59fd6.js",revision:"FvrSApKq1vmT0KiFi0CzV"},{url:"/_next/static/chunks/app/(site)/similar/page-60353a69b8cdc8fa.js",revision:"FvrSApKq1vmT0KiFi0CzV"},{url:"/_next/static/chunks/app/(site)/starring/page-096f9a35bb46826b.js",revision:"FvrSApKq1vmT0KiFi0CzV"},{url:"/_next/static/chunks/app/(site)/top/page-91aeb5735cbc0a91.js",revision:"FvrSApKq1vmT0KiFi0CzV"},{url:"/_next/static/chunks/app/(site)/watch-list/page-d514ebbaf8bdd7d4.js",revision:"FvrSApKq1vmT0KiFi0CzV"},{url:"/_next/static/chunks/app/_not-found/page-97bde446d7f1c840.js",revision:"FvrSApKq1vmT0KiFi0CzV"},{url:"/_next/static/chunks/app/layout-64951f9dc7bc2681.js",revision:"FvrSApKq1vmT0KiFi0CzV"},{url:"/_next/static/chunks/c8bcbd21.63daf74955ffea8b.js",revision:"63daf74955ffea8b"},{url:"/_next/static/chunks/fd9d1056-d1448f0cd0a3dc26.js",revision:"FvrSApKq1vmT0KiFi0CzV"},{url:"/_next/static/chunks/framework-f66176bb897dc684.js",revision:"FvrSApKq1vmT0KiFi0CzV"},{url:"/_next/static/chunks/main-a339d49e77d6dbd3.js",revision:"FvrSApKq1vmT0KiFi0CzV"},{url:"/_next/static/chunks/main-app-51cdaff1a81e6b49.js",revision:"FvrSApKq1vmT0KiFi0CzV"},{url:"/_next/static/chunks/pages/_app-6a626577ffa902a4.js",revision:"FvrSApKq1vmT0KiFi0CzV"},{url:"/_next/static/chunks/pages/_error-1be831200e60c5c0.js",revision:"FvrSApKq1vmT0KiFi0CzV"},{url:"/_next/static/chunks/polyfills-42372ed130431b0a.js",revision:"846118c33b2c0e922d7b3a7676f81f6f"},{url:"/_next/static/chunks/webpack-134a99c33ababfb0.js",revision:"FvrSApKq1vmT0KiFi0CzV"},{url:"/_next/static/css/08f675b4c37cc586.css",revision:"08f675b4c37cc586"},{url:"/_next/static/css/0d5f6452b2682b9b.css",revision:"0d5f6452b2682b9b"},{url:"/_next/static/media/a9b1453781eac9e6-s.p.woff2",revision:"c754cf60aba699077f00948285bf54b5"},{url:"/_next/static/media/dd843ebd3ff03195-s.p.woff2",revision:"333341dc4117f45b7fcee6b5223a56db"},{url:"/_next/static/media/e9ecf55e71a874cd-s.woff2",revision:"62348655e2d5baed97a39f0590491d09"},{url:"/apple-touch-icon.png",revision:"80176a1581e3877c7585417687e01445"},{url:"/favicon-48x48-dark.png",revision:"76638ae99056c9c69403992d9019171b"},{url:"/favicon-48x48.png",revision:"11472f80e55027b3b4ccbe70925c6f45"},{url:"/favicon-96x96-dark.png",revision:"1ed603a4029c1809b645c8f917d1f165"},{url:"/favicon-96x96.png",revision:"606fe5f4ea2e2fb291f243b0f195dcd2"},{url:"/favicon-dark.ico",revision:"4081cfcf0a78496f9f1a78f355d4070a"},{url:"/favicon-dark.svg",revision:"a479dbdd39552e9d13e6c2e6898ae49e"},{url:"/favicon.ico",revision:"e74831ef30debdf1f21d7d3cfb7810b0"},{url:"/favicon.svg",revision:"3039271cbbda9d1e6b2290ac2dbcc04f"},{url:"/manifest.json",revision:"5707bda32aaccb2ce142908f0baf8a1b"},{url:"/web-app-manifest-192x192.png",revision:"51dfcd7c6a64611126d5fc8223c55b31"},{url:"/web-app-manifest-512x512.png",revision:"02752f26b7efa7e167b10d489d82ce7c"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:i,state:n})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
