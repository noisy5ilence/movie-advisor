if(!self.define){let e,s={};const n=(n,t)=>(n=new URL(n+".js",t).href,s[n]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=s,document.head.appendChild(e)}else e=n,importScripts(n),s()})).then((()=>{let e=s[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(t,c)=>{const i=e||("document"in self?document.currentScript.src:"")||location.href;if(s[i])return;let a={};const r=e=>n(e,i),d={module:{uri:i},exports:a,require:r};s[i]=Promise.all(t.map((e=>d[e]||r(e)))).then((e=>(c(...e),a)))}}define(["./workbox-4754cb34"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/app-build-manifest.json",revision:"d2ebae275467115fc4046c1059c956f8"},{url:"/_next/static/CnqO9Nmd8Ys9tD0cR3H89/_buildManifest.js",revision:"2ec694eb52ae4f523f265a46bae4d768"},{url:"/_next/static/CnqO9Nmd8Ys9tD0cR3H89/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/152.b96372f7a5392cef.js",revision:"b96372f7a5392cef"},{url:"/_next/static/chunks/23-e0259c2123520d87.js",revision:"CnqO9Nmd8Ys9tD0cR3H89"},{url:"/_next/static/chunks/26.286553a5ff2812fc.js",revision:"286553a5ff2812fc"},{url:"/_next/static/chunks/276.c3c1130f2adade69.js",revision:"c3c1130f2adade69"},{url:"/_next/static/chunks/344.05938a041227e582.js",revision:"05938a041227e582"},{url:"/_next/static/chunks/348-69892922065c6e19.js",revision:"CnqO9Nmd8Ys9tD0cR3H89"},{url:"/_next/static/chunks/383.78d47f7582340f53.js",revision:"78d47f7582340f53"},{url:"/_next/static/chunks/394-c16ee6aef4429bf3.js",revision:"CnqO9Nmd8Ys9tD0cR3H89"},{url:"/_next/static/chunks/403-c3f4dfeca48c9530.js",revision:"CnqO9Nmd8Ys9tD0cR3H89"},{url:"/_next/static/chunks/460.ac20021c7496f1d6.js",revision:"ac20021c7496f1d6"},{url:"/_next/static/chunks/497.48f1dfd129122432.js",revision:"48f1dfd129122432"},{url:"/_next/static/chunks/61.e269d4a699fba0b6.js",revision:"e269d4a699fba0b6"},{url:"/_next/static/chunks/621-fa4d2ff1cf645813.js",revision:"CnqO9Nmd8Ys9tD0cR3H89"},{url:"/_next/static/chunks/673.362c29137dd3e968.js",revision:"362c29137dd3e968"},{url:"/_next/static/chunks/695.156d21364de6e419.js",revision:"156d21364de6e419"},{url:"/_next/static/chunks/734-68b8dcd77683e9c2.js",revision:"CnqO9Nmd8Ys9tD0cR3H89"},{url:"/_next/static/chunks/755.5cd959eac5682527.js",revision:"5cd959eac5682527"},{url:"/_next/static/chunks/792.b51012549074b93f.js",revision:"b51012549074b93f"},{url:"/_next/static/chunks/810.6105e84414768b0d.js",revision:"6105e84414768b0d"},{url:"/_next/static/chunks/922.9ce4bf0553cfb724.js",revision:"9ce4bf0553cfb724"},{url:"/_next/static/chunks/app/(site)/favorites/page-8f95a12f147afb98.js",revision:"CnqO9Nmd8Ys9tD0cR3H89"},{url:"/_next/static/chunks/app/(site)/loading-96645736797edde7.js",revision:"CnqO9Nmd8Ys9tD0cR3H89"},{url:"/_next/static/chunks/app/(site)/page-a954c8460bc51232.js",revision:"CnqO9Nmd8Ys9tD0cR3H89"},{url:"/_next/static/chunks/app/(site)/popular/page-a96cd740ce7e8f6c.js",revision:"CnqO9Nmd8Ys9tD0cR3H89"},{url:"/_next/static/chunks/app/(site)/similar/page-054c21ea9f26b4ae.js",revision:"CnqO9Nmd8Ys9tD0cR3H89"},{url:"/_next/static/chunks/app/(site)/starring/page-62f2a5e60b7bf9f1.js",revision:"CnqO9Nmd8Ys9tD0cR3H89"},{url:"/_next/static/chunks/app/(site)/top/page-783ad3b5273154c0.js",revision:"CnqO9Nmd8Ys9tD0cR3H89"},{url:"/_next/static/chunks/app/(site)/watch-list/page-9482cccdc3b4de7b.js",revision:"CnqO9Nmd8Ys9tD0cR3H89"},{url:"/_next/static/chunks/app/_not-found/page-97bde446d7f1c840.js",revision:"CnqO9Nmd8Ys9tD0cR3H89"},{url:"/_next/static/chunks/app/layout-1b224c73f6d16bc4.js",revision:"CnqO9Nmd8Ys9tD0cR3H89"},{url:"/_next/static/chunks/c8bcbd21.63daf74955ffea8b.js",revision:"63daf74955ffea8b"},{url:"/_next/static/chunks/fd9d1056-d1448f0cd0a3dc26.js",revision:"CnqO9Nmd8Ys9tD0cR3H89"},{url:"/_next/static/chunks/framework-f66176bb897dc684.js",revision:"CnqO9Nmd8Ys9tD0cR3H89"},{url:"/_next/static/chunks/main-a339d49e77d6dbd3.js",revision:"CnqO9Nmd8Ys9tD0cR3H89"},{url:"/_next/static/chunks/main-app-51cdaff1a81e6b49.js",revision:"CnqO9Nmd8Ys9tD0cR3H89"},{url:"/_next/static/chunks/pages/_app-6a626577ffa902a4.js",revision:"CnqO9Nmd8Ys9tD0cR3H89"},{url:"/_next/static/chunks/pages/_error-1be831200e60c5c0.js",revision:"CnqO9Nmd8Ys9tD0cR3H89"},{url:"/_next/static/chunks/polyfills-42372ed130431b0a.js",revision:"846118c33b2c0e922d7b3a7676f81f6f"},{url:"/_next/static/chunks/webpack-2727b4b69a6c8e6c.js",revision:"CnqO9Nmd8Ys9tD0cR3H89"},{url:"/_next/static/css/0d5f6452b2682b9b.css",revision:"0d5f6452b2682b9b"},{url:"/_next/static/css/30fc28b4ca88767d.css",revision:"30fc28b4ca88767d"},{url:"/_next/static/media/a9b1453781eac9e6-s.p.woff2",revision:"c754cf60aba699077f00948285bf54b5"},{url:"/_next/static/media/dd843ebd3ff03195-s.p.woff2",revision:"333341dc4117f45b7fcee6b5223a56db"},{url:"/_next/static/media/e9ecf55e71a874cd-s.woff2",revision:"62348655e2d5baed97a39f0590491d09"},{url:"/apple-touch-icon.png",revision:"6ed7ad78b222698b2872b5a7f104fe08"},{url:"/favicon-48x48.png",revision:"d2db6eb5ce8ce1da63114250c9652da7"},{url:"/favicon.ico",revision:"d7c46eb2b2574863f72315ed861b1c99"},{url:"/favicon.svg",revision:"15b76ab693bd3a8320d8f8778332d396"},{url:"/manifest.json",revision:"5707bda32aaccb2ce142908f0baf8a1b"},{url:"/web-app-manifest-192x192.png",revision:"5d8538e4362b4ddbd7ff195fb24c25dc"},{url:"/web-app-manifest-512x512.png",revision:"e0a092cab607727cbe6f61adb0b1e6cf"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:n,state:t})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
