module.exports=function(e){function t(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,t),o.l=!0,o.exports}var n={};return t.m=e,t.c=n,t.i=function(e){return e},t.d=function(e,t,n){Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:n})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=14)}([function(e,t){e.exports=require("@angular/core")},function(e,t,n){"use strict";function r(e,t){t.render("index",{req:e,res:t,ngModule:s.a,preboot:!1,baseUrl:"/",requestUrl:e.originalUrl,originUrl:e.hostname})}var o=n(11),i=(n.n(o),n(13)),u=(n.n(i),n(12)),a=(n.n(u),n(0)),c=(n.n(a),n(9)),s=(n.n(c),n(3)),f=n(5),l=u(),p=i.join(i.resolve(__dirname,"..")),d=process.env.PORT||4200;f.a.production&&n.i(a.enableProdMode)(),l.engine(".html",n.i(c.createEngine)({})),l.set("views",__dirname),l.set("view engine","html"),l.use(u.static(i.join(p,"dist"),{index:!1})),l.get("/",r),l.get("/about",r),l.get("/about/*",r),l.get("*",function(e,t){t.setHeader("Content-Type","application/json");var n={status:404,message:"No Content"},r=JSON.stringify(n,null,2);t.status(404).send(r)}),l.listen(d)},function(e,t,n){"use strict";var r=n(0);n.n(r);n.d(t,"a",function(){return u});var o=this&&this.__decorate||function(e,t,n,r){var o,i=arguments.length,u=i<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)u=Reflect.decorate(e,t,n,r);else for(var a=e.length-1;a>=0;a--)(o=e[a])&&(u=(i<3?o(u):i>3?o(t,n,u):o(t,n))||u);return i>3&&u&&Object.defineProperty(t,n,u),u},i=this&&this.__metadata||function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)},u=function(){function e(){this.title="app works!"}return e=o([n.i(r.Component)({selector:"app-root",template:n(7),styles:[n(6)]}),i("design:paramtypes",[])],e)}()},function(e,t,n){"use strict";var r=n(0),o=(n.n(r),n(10)),i=(n.n(o),n(8)),u=(n.n(i),n(4));n.d(t,"a",function(){return s});var a=this&&this.__decorate||function(e,t,n,r){var o,i=arguments.length,u=i<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)u=Reflect.decorate(e,t,n,r);else for(var a=e.length-1;a>=0;a--)(o=e[a])&&(u=(i<3?o(u):i>3?o(t,n,u):o(t,n))||u);return i>3&&u&&Object.defineProperty(t,n,u),u},c=this&&this.__metadata||function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)},s=function(){function e(){}return e=a([n.i(r.NgModule)({bootstrap:[u.a],declarations:[u.a],imports:[o.UniversalModule,i.FormsModule]}),c("design:paramtypes",[])],e)}()},function(e,t,n){"use strict";var r=n(2);n.d(t,"a",function(){return r.a})},function(e,t,n){"use strict";n.d(t,"a",function(){return r});var r={production:!0}},function(e,t){e.exports=""},function(e,t){e.exports="<h1>\n  {{title}}\n</h1>\n"},function(e,t){e.exports=require("@angular/forms")},function(e,t){e.exports=require("angular2-express-engine")},function(e,t){e.exports=require("angular2-universal")},function(e,t){e.exports=require("angular2-universal-polyfills")},function(e,t){e.exports=require("express")},function(e,t){e.exports=require("path")},function(e,t,n){e.exports=n(1)}]);
//# sourceMappingURL=server.bundle.js.map