/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$3=globalThis,e$4=t$3.ShadowRoot&&(void 0===t$3.ShadyCSS||t$3.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s$2=Symbol(),o$4=new WeakMap;let n$3 = class n{constructor(t,e,o){if(this._$cssResult$=true,o!==s$2)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e;}get styleSheet(){let t=this.o;const s=this.t;if(e$4&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=o$4.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&o$4.set(s,t));}return t}toString(){return this.cssText}};const r$4=t=>new n$3("string"==typeof t?t:t+"",void 0,s$2),i$4=(t,...e)=>{const o=1===t.length?t[0]:e.reduce((e,s,o)=>e+(t=>{if(true===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[o+1],t[0]);return new n$3(o,t,s$2)},S$1=(s,o)=>{if(e$4)s.adoptedStyleSheets=o.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of o){const o=document.createElement("style"),n=t$3.litNonce;void 0!==n&&o.setAttribute("nonce",n),o.textContent=e.cssText,s.appendChild(o);}},c$2=e$4?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return r$4(e)})(t):t;

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:i$3,defineProperty:e$3,getOwnPropertyDescriptor:h$1,getOwnPropertyNames:r$3,getOwnPropertySymbols:o$3,getPrototypeOf:n$2}=Object,a$1=globalThis,c$1=a$1.trustedTypes,l$1=c$1?c$1.emptyScript:"",p$1=a$1.reactiveElementPolyfillSupport,d$1=(t,s)=>t,u$1={toAttribute(t,s){switch(s){case Boolean:t=t?l$1:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t);}return t},fromAttribute(t,s){let i=t;switch(s){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t);}catch(t){i=null;}}return i}},f$1=(t,s)=>!i$3(t,s),b$1={attribute:true,type:String,converter:u$1,reflect:false,useDefault:false,hasChanged:f$1};Symbol.metadata??=Symbol("metadata"),a$1.litPropertyMetadata??=new WeakMap;let y$1 = class y extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t);}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,s=b$1){if(s.state&&(s.attribute=false),this._$Ei(),this.prototype.hasOwnProperty(t)&&((s=Object.create(s)).wrapped=true),this.elementProperties.set(t,s),!s.noAccessor){const i=Symbol(),h=this.getPropertyDescriptor(t,i,s);void 0!==h&&e$3(this.prototype,t,h);}}static getPropertyDescriptor(t,s,i){const{get:e,set:r}=h$1(this.prototype,t)??{get(){return this[s]},set(t){this[s]=t;}};return {get:e,set(s){const h=e?.call(this);r?.call(this,s),this.requestUpdate(t,h,i);},configurable:true,enumerable:true}}static getPropertyOptions(t){return this.elementProperties.get(t)??b$1}static _$Ei(){if(this.hasOwnProperty(d$1("elementProperties")))return;const t=n$2(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties);}static finalize(){if(this.hasOwnProperty(d$1("finalized")))return;if(this.finalized=true,this._$Ei(),this.hasOwnProperty(d$1("properties"))){const t=this.properties,s=[...r$3(t),...o$3(t)];for(const i of s)this.createProperty(i,t[i]);}const t=this[Symbol.metadata];if(null!==t){const s=litPropertyMetadata.get(t);if(void 0!==s)for(const[t,i]of s)this.elementProperties.set(t,i);}this._$Eh=new Map;for(const[t,s]of this.elementProperties){const i=this._$Eu(t,s);void 0!==i&&this._$Eh.set(i,t);}this.elementStyles=this.finalizeStyles(this.styles);}static finalizeStyles(s){const i=[];if(Array.isArray(s)){const e=new Set(s.flat(1/0).reverse());for(const s of e)i.unshift(c$2(s));}else void 0!==s&&i.push(c$2(s));return i}static _$Eu(t,s){const i=s.attribute;return  false===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=false,this.hasUpdated=false,this._$Em=null,this._$Ev();}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this));}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.();}removeController(t){this._$EO?.delete(t);}_$E_(){const t=new Map,s=this.constructor.elementProperties;for(const i of s.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t);}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return S$1(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(true),this._$EO?.forEach(t=>t.hostConnected?.());}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.());}attributeChangedCallback(t,s,i){this._$AK(t,i);}_$ET(t,s){const i=this.constructor.elementProperties.get(t),e=this.constructor._$Eu(t,i);if(void 0!==e&&true===i.reflect){const h=(void 0!==i.converter?.toAttribute?i.converter:u$1).toAttribute(s,i.type);this._$Em=t,null==h?this.removeAttribute(e):this.setAttribute(e,h),this._$Em=null;}}_$AK(t,s){const i=this.constructor,e=i._$Eh.get(t);if(void 0!==e&&this._$Em!==e){const t=i.getPropertyOptions(e),h="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:u$1;this._$Em=e;const r=h.fromAttribute(s,t.type);this[e]=r??this._$Ej?.get(e)??r,this._$Em=null;}}requestUpdate(t,s,i,e=false,h){if(void 0!==t){const r=this.constructor;if(false===e&&(h=this[t]),i??=r.getPropertyOptions(t),!((i.hasChanged??f$1)(h,s)||i.useDefault&&i.reflect&&h===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,i))))return;this.C(t,s,i);} false===this.isUpdatePending&&(this._$ES=this._$EP());}C(t,s,{useDefault:i,reflect:e,wrapped:h},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??s??this[t]),true!==h||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||i||(s=void 0),this._$AL.set(t,s)),true===e&&this._$Em!==t&&(this._$Eq??=new Set).add(t));}async _$EP(){this.isUpdatePending=true;try{await this._$ES;}catch(t){Promise.reject(t);}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,s]of this._$Ep)this[t]=s;this._$Ep=void 0;}const t=this.constructor.elementProperties;if(t.size>0)for(const[s,i]of t){const{wrapped:t}=i,e=this[s];true!==t||this._$AL.has(s)||void 0===e||this.C(s,void 0,i,e);}}let t=false;const s=this._$AL;try{t=this.shouldUpdate(s),t?(this.willUpdate(s),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(s)):this._$EM();}catch(s){throw t=false,this._$EM(),s}t&&this._$AE(s);}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=true,this.firstUpdated(t)),this.updated(t);}_$EM(){this._$AL=new Map,this.isUpdatePending=false;}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return  true}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM();}updated(t){}firstUpdated(t){}};y$1.elementStyles=[],y$1.shadowRootOptions={mode:"open"},y$1[d$1("elementProperties")]=new Map,y$1[d$1("finalized")]=new Map,p$1?.({ReactiveElement:y$1}),(a$1.reactiveElementVersions??=[]).push("2.1.2");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$2=globalThis,i$2=t=>t,s$1=t$2.trustedTypes,e$2=s$1?s$1.createPolicy("lit-html",{createHTML:t=>t}):void 0,h="$lit$",o$2=`lit$${Math.random().toFixed(9).slice(2)}$`,n$1="?"+o$2,r$2=`<${n$1}>`,l=document,c=()=>l.createComment(""),a=t=>null===t||"object"!=typeof t&&"function"!=typeof t,u=Array.isArray,d=t=>u(t)||"function"==typeof t?.[Symbol.iterator],f="[ \t\n\f\r]",v=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_=/-->/g,m=/>/g,p=RegExp(`>|${f}(?:([^\\s"'>=/]+)(${f}*=${f}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),g=/'/g,$=/"/g,y=/^(?:script|style|textarea|title)$/i,x=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),b=x(1),E=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),C=new WeakMap,P=l.createTreeWalker(l,129);function V(t,i){if(!u(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==e$2?e$2.createHTML(i):i}const N=(t,i)=>{const s=t.length-1,e=[];let n,l=2===i?"<svg>":3===i?"<math>":"",c=v;for(let i=0;i<s;i++){const s=t[i];let a,u,d=-1,f=0;for(;f<s.length&&(c.lastIndex=f,u=c.exec(s),null!==u);)f=c.lastIndex,c===v?"!--"===u[1]?c=_:void 0!==u[1]?c=m:void 0!==u[2]?(y.test(u[2])&&(n=RegExp("</"+u[2],"g")),c=p):void 0!==u[3]&&(c=p):c===p?">"===u[0]?(c=n??v,d=-1):void 0===u[1]?d=-2:(d=c.lastIndex-u[2].length,a=u[1],c=void 0===u[3]?p:'"'===u[3]?$:g):c===$||c===g?c=p:c===_||c===m?c=v:(c=p,n=void 0);const x=c===p&&t[i+1].startsWith("/>")?" ":"";l+=c===v?s+r$2:d>=0?(e.push(a),s.slice(0,d)+h+s.slice(d)+o$2+x):s+o$2+(-2===d?i:x);}return [V(t,l+(t[s]||"<?>")+(2===i?"</svg>":3===i?"</math>":"")),e]};class S{constructor({strings:t,_$litType$:i},e){let r;this.parts=[];let l=0,a=0;const u=t.length-1,d=this.parts,[f,v]=N(t,i);if(this.el=S.createElement(f,e),P.currentNode=this.el.content,2===i||3===i){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes);}for(;null!==(r=P.nextNode())&&d.length<u;){if(1===r.nodeType){if(r.hasAttributes())for(const t of r.getAttributeNames())if(t.endsWith(h)){const i=v[a++],s=r.getAttribute(t).split(o$2),e=/([.?@])?(.*)/.exec(i);d.push({type:1,index:l,name:e[2],strings:s,ctor:"."===e[1]?I:"?"===e[1]?L:"@"===e[1]?z:H}),r.removeAttribute(t);}else t.startsWith(o$2)&&(d.push({type:6,index:l}),r.removeAttribute(t));if(y.test(r.tagName)){const t=r.textContent.split(o$2),i=t.length-1;if(i>0){r.textContent=s$1?s$1.emptyScript:"";for(let s=0;s<i;s++)r.append(t[s],c()),P.nextNode(),d.push({type:2,index:++l});r.append(t[i],c());}}}else if(8===r.nodeType)if(r.data===n$1)d.push({type:2,index:l});else {let t=-1;for(;-1!==(t=r.data.indexOf(o$2,t+1));)d.push({type:7,index:l}),t+=o$2.length-1;}l++;}}static createElement(t,i){const s=l.createElement("template");return s.innerHTML=t,s}}function M(t,i,s=t,e){if(i===E)return i;let h=void 0!==e?s._$Co?.[e]:s._$Cl;const o=a(i)?void 0:i._$litDirective$;return h?.constructor!==o&&(h?._$AO?.(false),void 0===o?h=void 0:(h=new o(t),h._$AT(t,s,e)),void 0!==e?(s._$Co??=[])[e]=h:s._$Cl=h),void 0!==h&&(i=M(t,h._$AS(t,i.values),h,e)),i}class R{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i;}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:i},parts:s}=this._$AD,e=(t?.creationScope??l).importNode(i,true);P.currentNode=e;let h=P.nextNode(),o=0,n=0,r=s[0];for(;void 0!==r;){if(o===r.index){let i;2===r.type?i=new k(h,h.nextSibling,this,t):1===r.type?i=new r.ctor(h,r.name,r.strings,this,t):6===r.type&&(i=new Z(h,this,t)),this._$AV.push(i),r=s[++n];}o!==r?.index&&(h=P.nextNode(),o++);}return P.currentNode=l,e}p(t){let i=0;for(const s of this._$AV) void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++;}}class k{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,i,s,e){this.type=2,this._$AH=A,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cv=e?.isConnected??true;}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===t?.nodeType&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=M(this,t,i),a(t)?t===A||null==t||""===t?(this._$AH!==A&&this._$AR(),this._$AH=A):t!==this._$AH&&t!==E&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):d(t)?this.k(t):this._(t);}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t));}_(t){this._$AH!==A&&a(this._$AH)?this._$AA.nextSibling.data=t:this.T(l.createTextNode(t)),this._$AH=t;}$(t){const{values:i,_$litType$:s}=t,e="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=S.createElement(V(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===e)this._$AH.p(i);else {const t=new R(e,this),s=t.u(this.options);t.p(i),this.T(s),this._$AH=t;}}_$AC(t){let i=C.get(t.strings);return void 0===i&&C.set(t.strings,i=new S(t)),i}k(t){u(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const h of t)e===i.length?i.push(s=new k(this.O(c()),this.O(c()),this,this.options)):s=i[e],s._$AI(h),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e);}_$AR(t=this._$AA.nextSibling,s){for(this._$AP?.(false,true,s);t!==this._$AB;){const s=i$2(t).nextSibling;i$2(t).remove(),t=s;}}setConnected(t){ void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t));}}class H{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,i,s,e,h){this.type=1,this._$AH=A,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=h,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=A;}_$AI(t,i=this,s,e){const h=this.strings;let o=false;if(void 0===h)t=M(this,t,i,0),o=!a(t)||t!==this._$AH&&t!==E,o&&(this._$AH=t);else {const e=t;let n,r;for(t=h[0],n=0;n<h.length-1;n++)r=M(this,e[s+n],i,n),r===E&&(r=this._$AH[n]),o||=!a(r)||r!==this._$AH[n],r===A?t=A:t!==A&&(t+=(r??"")+h[n+1]),this._$AH[n]=r;}o&&!e&&this.j(t);}j(t){t===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"");}}class I extends H{constructor(){super(...arguments),this.type=3;}j(t){this.element[this.name]=t===A?void 0:t;}}class L extends H{constructor(){super(...arguments),this.type=4;}j(t){this.element.toggleAttribute(this.name,!!t&&t!==A);}}class z extends H{constructor(t,i,s,e,h){super(t,i,s,e,h),this.type=5;}_$AI(t,i=this){if((t=M(this,t,i,0)??A)===E)return;const s=this._$AH,e=t===A&&s!==A||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,h=t!==A&&(s===A||e);e&&this.element.removeEventListener(this.name,this,s),h&&this.element.addEventListener(this.name,this,t),this._$AH=t;}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t);}}class Z{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s;}get _$AU(){return this._$AM._$AU}_$AI(t){M(this,t);}}const B=t$2.litHtmlPolyfillSupport;B?.(S,k),(t$2.litHtmlVersions??=[]).push("3.3.3");const D=(t,i,s)=>{const e=s?.renderBefore??i;let h=e._$litPart$;if(void 0===h){const t=s?.renderBefore??null;e._$litPart$=h=new k(i.insertBefore(c(),t),t,void 0,s??{});}return h._$AI(t),h};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const s=globalThis;let i$1 = class i extends y$1{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0;}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=D(r,this.renderRoot,this.renderOptions);}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(true);}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(false);}render(){return E}};i$1._$litElement$=true,i$1["finalized"]=true,s.litElementHydrateSupport?.({LitElement:i$1});const o$1=s.litElementPolyfillSupport;o$1?.({LitElement:i$1});(s.litElementVersions??=[]).push("4.2.2");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$1=t=>(e,o)=>{ void 0!==o?o.addInitializer(()=>{customElements.define(t,e);}):customElements.define(t,e);};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const o={attribute:true,type:String,converter:u$1,reflect:false,hasChanged:f$1},r$1=(t=o,e,r)=>{const{kind:n,metadata:i}=r;let s=globalThis.litPropertyMetadata.get(i);if(void 0===s&&globalThis.litPropertyMetadata.set(i,s=new Map),"setter"===n&&((t=Object.create(t)).wrapped=true),s.set(r.name,t),"accessor"===n){const{name:o}=r;return {set(r){const n=e.get.call(this);e.set.call(this,r),this.requestUpdate(o,n,t,true,r);},init(e){return void 0!==e&&this.C(o,void 0,t,e),e}}}if("setter"===n){const{name:o}=r;return function(r){const n=this[o];e.call(this,r),this.requestUpdate(o,n,t,true,r);}}throw Error("Unsupported decorator location: "+n)};function n(t){return (e,o)=>"object"==typeof o?r$1(t,e,o):((t,e,o)=>{const r=e.hasOwnProperty(o);return e.constructor.createProperty(o,t),r?Object.getOwnPropertyDescriptor(e,o):void 0})(t,e,o)}

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function r(r){return n({...r,state:true,attribute:false})}

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t={ATTRIBUTE:1},e$1=t=>(...e)=>({_$litDirective$:t,values:e});class i{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i;}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}

/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const e=e$1(class extends i{constructor(t$1){if(super(t$1),t$1.type!==t.ATTRIBUTE||"class"!==t$1.name||t$1.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(t){return " "+Object.keys(t).filter(s=>t[s]).join(" ")+" "}update(s,[i]){if(void 0===this.st){this.st=new Set,void 0!==s.strings&&(this.nt=new Set(s.strings.join(" ").split(/\s/).filter(t=>""!==t)));for(const t in i)i[t]&&!this.nt?.has(t)&&this.st.add(t);return this.render(i)}const r=s.element.classList;for(const t of this.st)t in i||(r.remove(t),this.st.delete(t));for(const t in i){const s=!!i[t];s===this.st.has(t)||this.nt?.has(t)||(s?(r.add(t),this.st.add(t)):(r.remove(t),this.st.delete(t)));}return E}});

const ALL_SOURCES = '__all__';
function getFeedLabel(hass, entityId) {
    const attrs = hass.states[entityId]?.attributes;
    return String(attrs?.feed_name ?? entityId);
}
function listRssSensorEntities(hass) {
    return Object.keys(hass.states)
        .filter((entityId) => entityId.startsWith('sensor.') &&
        hass.states[entityId]?.attributes?.feed_name !== undefined)
        .map((entityId) => ({
        entity: entityId,
        name: getFeedLabel(hass, entityId),
    }))
        .sort((a, b) => a.name.localeCompare(b.name));
}
function resolveSourceOptions(hass, configuredFeeds) {
    const configured = configuredFeeds.filter((feed) => feed.entity?.trim());
    if (configured.length > 0) {
        return configured.map((feed) => ({
            entity: feed.entity,
            name: getFeedLabel(hass, feed.entity),
        }));
    }
    return listRssSensorEntities(hass);
}
function isAllSources(activeSource) {
    return !activeSource || activeSource === ALL_SOURCES;
}

function mergeConfig(config) {
    return {
        ...DEFAULT_CONFIG,
        ...config,
        display: {
            ...DEFAULT_CONFIG.display,
            ...config.display,
            image: {
                ...DEFAULT_CONFIG.display?.image,
                ...config.display?.image,
            },
        },
        animation: {
            ...DEFAULT_CONFIG.animation,
            ...config.animation,
        },
        features: {
            ...DEFAULT_CONFIG.features,
            ...config.features,
        },
    };
}
const DEFAULT_CONFIG = {
    feeds: [],
    active_source: ALL_SOURCES,
    display: {
        preset: 'compact',
        show: 'title_image',
        max_items: 5,
        image: {
            position: 'start',
            size: 'medium',
            fit: 'cover',
            fallback: 'none',
        },
    },
    animation: {
        enabled: false,
        type: 'carousel',
        speed_preset: 'medium',
        speed: 50,
        interval: 5,
        transition: 'fade',
        pause_on_hover: true,
    },
    features: {
        show_relative_time: true,
        show_new_badge: true,
        new_badge_duration: 3600,
        show_refresh_button: true,
        show_source_selector: true,
        show_last_updated: true,
        show_article_navigation: true,
        advance_on_read: true,
        track_read_unread: true,
    },
    always_show_latest: true,
    rtl: 'auto',
    tap_action: { action: 'url' },
};

const SPEED_PRESET_VALUES = {
    slow: 30,
    medium: 50,
    fast: 80,
    custom: 50,
};
function showIncludesImage(show) {
    return show === 'title_image' || show === 'title_image_summary';
}
function showIncludesSummary(show) {
    return show === 'title_summary' || show === 'title_image_summary';
}

let HassRssCardEditor = class HassRssCardEditor extends i$1 {
    setConfig(config) {
        this._config = mergeConfig(config);
    }
    render() {
        if (!this.hass || !this._config)
            return b ``;
        return b `
      ${this._renderSources()}
      ${this._renderDisplay()}
      ${this._renderAnimation()}
      ${this._renderFeatures()}
      ${this._renderLayout()}
    `;
    }
    _renderSources() {
        const sourceOptions = listRssSensorEntities(this.hass);
        const options = [
            { value: ALL_SOURCES, label: 'All sources' },
            ...sourceOptions.map((source) => ({
                value: source.entity,
                label: source.name,
            })),
        ];
        return b `
      <div class="section">
        <div class="section-title">Sources</div>
        <ha-form
          .hass=${this.hass}
          .data=${{
            active_source: this._config.active_source ?? ALL_SOURCES,
        }}
          .schema=${[
            {
                name: 'active_source',
                selector: {
                    select: {
                        mode: 'dropdown',
                        options,
                    },
                },
            },
        ]}
          @value-changed=${(ev) => this._updateConfig('active_source', ev.detail.value.active_source)}
        ></ha-form>
      </div>
    `;
    }
    _renderDisplay() {
        const display = this._config.display ?? {};
        const showImage = showIncludesImage(display.show);
        return b `
      <div class="section">
        <div class="section-title">Display</div>
        <ha-form
          .hass=${this.hass}
          .data=${display}
          .schema=${[
            {
                name: 'preset',
                selector: {
                    select: {
                        options: [
                            { value: 'compact', label: 'Compact' },
                            { value: 'ticker', label: 'Ticker' },
                            { value: 'card', label: 'Card' },
                            { value: 'list', label: 'List' },
                            { value: 'magazine', label: 'Magazine' },
                        ],
                    },
                },
            },
            {
                name: 'show',
                selector: {
                    select: {
                        options: [
                            { value: 'title', label: 'Title' },
                            { value: 'title_summary', label: 'Title + Summary' },
                            { value: 'title_image', label: 'Title + Image' },
                            {
                                value: 'title_image_summary',
                                label: 'Title + Image + Summary',
                            },
                        ],
                    },
                },
            },
            {
                name: 'max_items',
                selector: { number: { min: 1, max: 50, step: 1 } },
            },
            ...(showImage
                ? [
                    {
                        type: 'expandable',
                        name: 'image',
                        title: 'Image',
                        schema: [
                            {
                                name: 'position',
                                selector: {
                                    select: {
                                        options: [
                                            { value: 'start', label: 'Start' },
                                            { value: 'end', label: 'End' },
                                            { value: 'top', label: 'Top' },
                                        ],
                                    },
                                },
                            },
                            {
                                name: 'size',
                                selector: {
                                    select: {
                                        options: [
                                            { value: 'small', label: 'Small' },
                                            { value: 'medium', label: 'Medium' },
                                            { value: 'large', label: 'Large' },
                                        ],
                                    },
                                },
                            },
                            {
                                name: 'fit',
                                selector: {
                                    select: {
                                        options: [
                                            { value: 'cover', label: 'Cover' },
                                            { value: 'contain', label: 'Contain' },
                                        ],
                                    },
                                },
                            },
                            {
                                name: 'fallback',
                                selector: {
                                    select: {
                                        options: [
                                            { value: 'none', label: 'No placeholder' },
                                            { value: 'placeholder', label: 'Placeholder icon' },
                                        ],
                                    },
                                },
                            },
                        ],
                    },
                ]
                : []),
        ]}
          @value-changed=${(ev) => this._updateConfig('display', {
            ...display,
            ...ev.detail.value,
        })}
        ></ha-form>
      </div>
    `;
    }
    _renderAnimation() {
        const animation = this._config.animation ?? {};
        const enabled = animation.enabled ?? false;
        const isTickerScroll = animation.type === 'ticker';
        const isCarousel = animation.type === 'carousel';
        const isCustomSpeed = animation.speed_preset === 'custom';
        const schema = [
            { name: 'enabled', selector: { boolean: {} } },
            ...(enabled
                ? [
                    {
                        name: 'type',
                        selector: {
                            select: {
                                options: [
                                    { value: 'carousel', label: 'Rotate headlines' },
                                    { value: 'ticker', label: 'Continuous scroll' },
                                ],
                            },
                        },
                    },
                ]
                : []),
            ...(enabled && isCarousel
                ? [
                    {
                        name: 'interval',
                        selector: {
                            number: { min: 3, max: 60, step: 1, unit_of_measurement: 's' },
                        },
                    },
                    {
                        name: 'transition',
                        selector: {
                            select: {
                                options: [
                                    { value: 'fade', label: 'Fade' },
                                    { value: 'slide', label: 'Slide' },
                                    { value: 'none', label: 'None' },
                                ],
                            },
                        },
                    },
                ]
                : []),
            ...(enabled && isTickerScroll
                ? [
                    {
                        name: 'speed_preset',
                        selector: {
                            select: {
                                options: [
                                    { value: 'slow', label: 'Slow (30 px/s)' },
                                    { value: 'medium', label: 'Medium (50 px/s)' },
                                    { value: 'fast', label: 'Fast (80 px/s)' },
                                    { value: 'custom', label: 'Custom' },
                                ],
                            },
                        },
                    },
                    ...(isCustomSpeed
                        ? [
                            {
                                name: 'speed',
                                selector: {
                                    number: {
                                        min: 20,
                                        max: 120,
                                        step: 5,
                                        unit_of_measurement: 'px/s',
                                    },
                                },
                            },
                        ]
                        : []),
                ]
                : []),
            ...(enabled
                ? [{ name: 'pause_on_hover', selector: { boolean: {} } }]
                : []),
        ];
        return b `
      <div class="section">
        <div class="section-title">Animation</div>
        <ha-form
          .hass=${this.hass}
          .data=${animation}
          .schema=${schema}
          @value-changed=${(ev) => this._updateConfig('animation', {
            ...animation,
            ...ev.detail.value,
        })}
        ></ha-form>
      </div>
    `;
    }
    _renderFeatures() {
        const features = this._config.features ?? {};
        return b `
      <div class="section">
        <div class="section-title">Features</div>
        <ha-form
          .hass=${this.hass}
          .data=${features}
          .schema=${[
            { name: 'show_relative_time', selector: { boolean: {} } },
            { name: 'show_last_updated', selector: { boolean: {} } },
            { name: 'show_new_badge', selector: { boolean: {} } },
            {
                name: 'new_badge_duration',
                selector: {
                    number: { min: 300, max: 86400, step: 300, unit_of_measurement: 's' },
                },
            },
            { name: 'show_refresh_button', selector: { boolean: {} } },
            { name: 'show_source_selector', selector: { boolean: {} } },
            { name: 'show_article_navigation', selector: { boolean: {} } },
            { name: 'advance_on_read', selector: { boolean: {} } },
            { name: 'track_read_unread', selector: { boolean: {} } },
        ]}
          @value-changed=${(ev) => this._updateConfig('features', {
            ...features,
            ...ev.detail.value,
        })}
        ></ha-form>
      </div>
    `;
    }
    _renderLayout() {
        return b `
      <div class="section">
        <div class="section-title">Layout</div>
        <ha-form
          .hass=${this.hass}
          .data=${{
            rtl: this._config.rtl,
            always_show_latest: this._config.always_show_latest,
        }}
          .schema=${[
            {
                name: 'rtl',
                selector: {
                    select: {
                        options: [
                            { value: 'auto', label: 'Auto' },
                            { value: 'true', label: 'RTL' },
                            { value: 'false', label: 'LTR' },
                        ],
                    },
                },
            },
            { name: 'always_show_latest', selector: { boolean: {} } },
        ]}
          @value-changed=${(ev) => {
            this._updateConfig('rtl', ev.detail.value.rtl);
            this._updateConfig('always_show_latest', ev.detail.value.always_show_latest);
        }}
        ></ha-form>
      </div>
    `;
    }
    _updateConfig(key, value) {
        this._config = { ...this._config, [key]: value };
        this._dispatchConfig();
    }
    _dispatchConfig() {
        const feeds = (this._config.feeds ?? []).filter((feed) => typeof feed === 'object' &&
            feed !== null &&
            typeof feed.entity === 'string' &&
            feed.entity.trim().length > 0);
        this.dispatchEvent(new CustomEvent('config-changed', {
            detail: {
                config: {
                    ...this._config,
                    feeds,
                },
            },
            bubbles: true,
            composed: true,
        }));
    }
};
HassRssCardEditor.styles = i$4 `
    .section {
      margin-top: 8px;
      border-top: 1px solid var(--divider-color);
      padding-top: 8px;
    }
    .section:first-child {
      margin-top: 0;
      border-top: none;
      padding-top: 0;
    }
    .section-title {
      font-size: 1.1em;
      font-weight: 500;
      margin-bottom: 8px;
    }
  `;
__decorate([
    n({ attribute: false })
], HassRssCardEditor.prototype, "hass", void 0);
__decorate([
    r()
], HassRssCardEditor.prototype, "_config", void 0);
HassRssCardEditor = __decorate([
    t$1('hass-rss-card-editor')
], HassRssCardEditor);

const compactStyles = i$4 `
  .compact-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    text-align: start;
  }

  .compact-item.image-top {
    flex-direction: column;
  }

  .compact-item.image-end {
    flex-direction: row-reverse;
  }

  .compact-content {
    flex: 1;
    min-width: 0;
  }

  .compact-title {
    font-size: 1em;
    font-weight: 500;
    line-height: 1.35;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .compact-summary {
    font-size: 0.85em;
    opacity: 0.75;
    margin-top: 4px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .compact-row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 8px;
  }

  .carousel-container {
    position: relative;
    min-height: 48px;
  }

  .carousel-item {
    transition: opacity 0.4s ease, transform 0.4s ease;
  }

  .carousel-item.fade-out {
    opacity: 0;
  }

  .carousel-item.slide-out {
    opacity: 0;
    transform: translateX(-20px);
  }

  [dir='rtl'] .carousel-item.slide-out {
    transform: translateX(20px);
  }

  .carousel-dots {
    display: flex;
    justify-content: center;
    gap: 4px;
    margin-top: 8px;
  }

  .carousel-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--divider-color, rgba(0, 0, 0, 0.2));
  }

  .carousel-dot.active {
    background: var(--primary-color);
  }

  .list-items {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .list-item {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));
  }

  .list-item:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  .card-item {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .card-item.image-top .item-image,
  .card-item.image-top .placeholder-image {
    width: 100%;
    height: 160px;
  }

  .magazine-item {
    position: relative;
    border-radius: 8px;
    overflow: hidden;
    min-height: 180px;
  }

  .magazine-bg {
    width: 100%;
    height: 180px;
    object-fit: cover;
    display: block;
  }

  .magazine-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(transparent 30%, rgba(0, 0, 0, 0.75));
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 16px;
    color: #fff;
  }

  .magazine-title {
    font-size: 1.1em;
    font-weight: 600;
    line-height: 1.3;
  }
`;

const cardStyles = i$4 `
  :host {
    display: block;
  }

  ha-card {
    overflow: hidden;
    padding: 12px 16px;
    position: relative;
  }

  ha-card.loading {
    opacity: 0.7;
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
    gap: 8px;
  }

  .header-left {
    flex: 1;
    min-width: 0;
  }

  .header-title {
    font-size: 0.85em;
    font-weight: 500;
    opacity: 0.7;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .source-label {
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
    font-size: 0.85em;
    font-weight: 500;
    opacity: 0.85;
  }

  .source-select {
    flex: 1;
    min-width: 0;
    max-width: 100%;
    border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
    border-radius: 6px;
    background: var(--card-background-color, var(--ha-card-background, white));
    color: inherit;
    font: inherit;
    padding: 4px 8px;
    cursor: pointer;
  }

  .source-select:focus {
    outline: none;
    border-color: var(--primary-color);
  }

  .refresh-btn {
    cursor: pointer;
    opacity: 0.7;
    border: none;
    background: none;
    color: inherit;
    padding: 4px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .refresh-btn:hover {
    opacity: 1;
    background: var(--divider-color, rgba(0, 0, 0, 0.08));
  }

  .refresh-btn.spinning ha-icon {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .error {
    color: var(--error-color, #db4437);
    font-size: 0.9em;
    padding: 8px 0;
  }

  .empty {
    opacity: 0.6;
    font-size: 0.9em;
    padding: 8px 0;
  }

  .new-badge {
    display: inline-block;
    font-size: 0.65em;
    font-weight: 700;
    text-transform: uppercase;
    background: var(--primary-color);
    color: var(--text-primary-color, #fff);
    padding: 2px 6px;
    border-radius: 4px;
    margin-inline-end: 6px;
    vertical-align: middle;
    line-height: 1.4;
  }

  .item.read {
    opacity: 0.55;
  }

  .item-link {
    color: inherit;
    text-decoration: none;
    cursor: pointer;
  }

  .item-link:hover {
    text-decoration: underline;
  }

  .meta {
    font-size: 0.75em;
    opacity: 0.6;
    white-space: nowrap;
    flex-shrink: 0;
    direction: ltr;
    unicode-bidi: isolate;
  }

  .last-updated {
    font-size: 0.75em;
    opacity: 0.6;
    margin-bottom: 8px;
    direction: ltr;
    unicode-bidi: isolate;
    text-align: end;
  }

  .article-nav {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin-top: 8px;
    direction: ltr;
  }

  .nav-btn {
    cursor: pointer;
    opacity: 0.7;
    border: none;
    background: none;
    color: inherit;
    padding: 4px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .nav-btn:hover:not(:disabled) {
    opacity: 1;
    background: var(--divider-color, rgba(0, 0, 0, 0.08));
  }

  .nav-btn:disabled {
    opacity: 0.3;
    cursor: default;
  }

  .article-nav-position {
    font-size: 0.75em;
    opacity: 0.6;
    min-width: 3em;
    text-align: center;
  }

  .feed-name {
    font-size: 0.7em;
    opacity: 0.5;
  }
`;
const imageStyles = i$4 `
  .item-image {
    object-fit: cover;
    border-radius: 6px;
    flex-shrink: 0;
    background: var(--divider-color, rgba(0, 0, 0, 0.08));
  }

  .item-image.size-small {
    width: 32px;
    height: 32px;
  }

  .item-image.size-medium {
    width: 64px;
    height: 64px;
  }

  .item-image.size-large {
    width: 96px;
    height: 96px;
  }

  .item-image.fit-contain {
    object-fit: contain;
  }

  .item-image.hidden {
    display: none;
  }

  .placeholder-image {
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--divider-color, rgba(0, 0, 0, 0.08));
    border-radius: 6px;
    flex-shrink: 0;
    opacity: 0.5;
  }

  .placeholder-image.size-small {
    width: 32px;
    height: 32px;
  }

  .placeholder-image.size-medium {
    width: 64px;
    height: 64px;
  }

  .placeholder-image.size-large {
    width: 96px;
    height: 96px;
  }
`;

const tickerStyles = i$4 `
  .ticker-wrap {
    overflow: hidden;
    width: 100%;
    mask-image: linear-gradient(
      to right,
      transparent,
      black 5%,
      black 95%,
      transparent
    );
  }

  [dir='rtl'] .ticker-wrap {
    mask-image: linear-gradient(
      to left,
      transparent,
      black 5%,
      black 95%,
      transparent
    );
  }

  .ticker-track {
    display: flex;
    width: max-content;
    gap: 32px;
    animation: ticker-scroll var(--ticker-duration, 30s) linear infinite;
  }

  .ticker-track.paused {
    animation-play-state: paused;
  }

  .ticker-track.no-animation {
    animation: none;
  }

  @keyframes ticker-scroll {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(-50%);
    }
  }

  [dir='rtl'] .ticker-track {
    animation-name: ticker-scroll-rtl;
  }

  @keyframes ticker-scroll-rtl {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(50%);
    }
  }

  .ticker-item {
    display: flex;
    align-items: center;
    gap: 8px;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .ticker-separator {
    opacity: 0.4;
    margin-inline: 8px;
  }

  .ticker-title {
    font-size: 0.95em;
    font-weight: 500;
  }

  .ticker-item .item-image.size-small,
  .ticker-item .placeholder-image.size-small {
    width: 28px;
    height: 28px;
  }

  .ticker-wrap.ticker-single {
    mask-image: none;
    padding: 4px 0;
  }

  .ticker-single .ticker-item {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    min-width: 0;
    animation: ticker-fade-in 0.45s ease;
  }

  .ticker-single .ticker-title {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ticker-single .feed-name {
    font-size: 0.7em;
    opacity: 0.5;
    text-align: end;
    margin-top: 2px;
  }

  @keyframes ticker-fade-in {
    from {
      opacity: 0;
      transform: translateY(4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

function parseItemTimestamp(item) {
    if (!item.published)
        return 0;
    const timestamp = Date.parse(item.published);
    return Number.isNaN(timestamp) ? 0 : timestamp;
}
function sortItemsNewestFirst(items) {
    return [...items].sort((a, b) => parseItemTimestamp(b) - parseItemTimestamp(a));
}
function mergeFeedItems(hass, feeds, maxItems) {
    const allItems = [];
    for (const feed of feeds) {
        const state = hass.states[feed.entity];
        if (!state)
            continue;
        const attrs = state.attributes ?? {};
        const entityCategory = attrs.category ?? '';
        if (feed.category && feed.category !== entityCategory) {
            continue;
        }
        const items = attrs.items ?? [];
        const feedName = attrs.feed_name ?? feed.entity;
        const latestHeadline = state.state && state.state !== 'unavailable'
            ? state.state
            : '';
        for (const item of items) {
            const normalized = {
                ...item,
                feed_name: item.feed_name ?? feedName,
                category: item.category ?? entityCategory,
            };
            if (latestHeadline &&
                normalized.title === latestHeadline &&
                parseItemTimestamp(normalized) === 0) {
                normalized.published =
                    normalized.published ?? attrs.published;
            }
            allItems.push(normalized);
        }
        if (items.length === 0 && latestHeadline) {
            allItems.push({
                title: latestHeadline,
                link: attrs.link ?? '',
                published: attrs.published,
                summary: attrs.summary,
                image: attrs.image,
                has_image: attrs.has_image,
                feed_name: feedName,
                category: entityCategory,
            });
        }
    }
    const sorted = sortItemsNewestFirst(allItems);
    const seen = new Set();
    const deduped = [];
    for (const item of sorted) {
        const key = item.link || item.guid || item.title;
        if (seen.has(key))
            continue;
        seen.add(key);
        deduped.push(item);
    }
    return deduped.slice(0, maxItems);
}
function getFeedEntityIds(feeds) {
    return feeds.map((f) => f.entity);
}
function getNewestItem(items) {
    return sortItemsNewestFirst(items)[0];
}

const READ_KEY = 'hass_rss_read';
function loadReadSet() {
    try {
        const raw = localStorage.getItem(READ_KEY);
        if (!raw)
            return new Set();
        return new Set(JSON.parse(raw));
    }
    catch {
        return new Set();
    }
}
function saveReadSet(set) {
    try {
        localStorage.setItem(READ_KEY, JSON.stringify([...set].slice(-500)));
    }
    catch {
        // ignore storage errors
    }
}
function isRead(link) {
    if (!link)
        return false;
    return loadReadSet().has(link);
}
function markRead(link) {
    if (!link)
        return;
    const set = loadReadSet();
    set.add(link);
    saveReadSet(set);
}
function isNewItem(published, durationSeconds, link) {
    if (!published || isRead(link))
        return false;
    const ts = Date.parse(published);
    if (Number.isNaN(ts))
        return false;
    const ageMs = Date.now() - ts;
    return ageMs >= 0 && ageMs <= durationSeconds * 1000;
}

function formatRelativeTime(published, locale) {
    if (!published)
        return '';
    const ts = Date.parse(published);
    if (Number.isNaN(ts))
        return '';
    const diffSec = Math.round((ts - Date.now()) / 1000);
    const rtf = new Intl.RelativeTimeFormat(locale ?? undefined, {
        numeric: 'always',
    });
    const abs = Math.abs(diffSec);
    if (abs < 60)
        return rtf.format(diffSec, 'second');
    if (abs < 3600)
        return rtf.format(Math.round(diffSec / 60), 'minute');
    if (abs < 86400)
        return rtf.format(Math.round(diffSec / 3600), 'hour');
    if (abs < 2592000)
        return rtf.format(Math.round(diffSec / 86400), 'day');
    return rtf.format(Math.round(diffSec / 2592000), 'month');
}

const RTL_CHAR_RE = /[\u0590-\u08FF\uFB1D-\uFDFF\uFE70-\uFEFF]/;
function detectRtlFromText(text) {
    return RTL_CHAR_RE.test(text);
}
function resolveDirection(rtl, sampleText) {
    if (rtl === 'true')
        return 'rtl';
    if (rtl === 'false')
        return 'ltr';
    if (sampleText && detectRtlFromText(sampleText)) {
        return 'rtl';
    }
    const docDir = document.documentElement.getAttribute('dir');
    if (docDir === 'rtl')
        return 'rtl';
    return 'ltr';
}
function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

let HassRssCard = class HassRssCard extends i$1 {
    constructor() {
        super(...arguments);
        this._carouselIndex = 0;
        this._refreshing = false;
        this._tickerPaused = false;
        this._readVersion = 0;
        this._lastLatestKey = '';
        this._carouselSetupKey = '';
    }
    setConfig(config) {
        const feeds = (config.feeds ?? []).filter((feed) => feed.entity && feed.entity.trim().length > 0);
        this._config = mergeConfig({ ...config, feeds });
        this._applyPresetDefaults();
        this._carouselSetupKey = '';
    }
    getCardSize() {
        const preset = this._config?.display?.preset;
        if (preset === 'ticker')
            return 1;
        if (preset === 'list')
            return 4;
        if (preset === 'magazine')
            return 4;
        return 2;
    }
    connectedCallback() {
        super.connectedCallback();
        this._carouselSetupKey = '';
        this._ensureCarouselTimer();
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this._clearCarouselTimer();
        this._carouselSetupKey = '';
    }
    updated(changed) {
        if (!changed.has('hass') && !changed.has('_config')) {
            return;
        }
        if (changed.has('hass')) {
            const newest = getNewestItem(this._getItems());
            if (newest) {
                const latestKey = newest.link || newest.title || '';
                if (latestKey && latestKey !== this._lastLatestKey) {
                    this._carouselIndex = 0;
                    this._lastLatestKey = latestKey;
                }
            }
        }
        this._ensureCarouselTimer();
    }
    render() {
        if (!this._config || !this.hass)
            return b ``;
        const items = this._getItems();
        const dir = resolveDirection(this._config.rtl, items[0]?.title);
        const preset = this._config.display?.preset ?? 'compact';
        const features = this._config.features ?? {};
        return b `
      <ha-card
        class=${e({ loading: this._refreshing })}
        dir=${dir}
      >
        ${this._renderHeader(features)}
        ${this._renderLastUpdated(features, dir)}
        ${items.length === 0
            ? this._renderEmpty()
            : this._renderPreset(preset, items, dir, features)}
      </ha-card>
    `;
    }
    _renderHeader(features) {
        const sources = this._getSourceOptions();
        const showSelector = features.show_source_selector !== false && sources.length > 1;
        const showRefresh = features.show_refresh_button !== false;
        if (!showSelector && !showRefresh) {
            return A;
        }
        const selection = this._getSourceSelection();
        return b `
      <div class="header">
        <div class="header-left">
          ${showSelector
            ? b `
                <label class="source-label">
                  <select
                    class="source-select"
                    .value=${selection}
                    @change=${this._onSourceChange}
                    @click=${(event) => event.stopPropagation()}
                  >
                    <option value=${ALL_SOURCES}>All sources</option>
                    ${sources.map((source) => b `
                        <option value=${source.entity}>${source.name}</option>
                      `)}
                  </select>
                </label>
              `
            : b `
                <span class="header-title">${this._getSourceLabel(sources)}</span>
              `}
        </div>
        ${showRefresh
            ? b `
              <button
                class="refresh-btn ${this._refreshing ? 'spinning' : ''}"
                title="Refresh feed"
                @click=${(event) => {
                event.stopPropagation();
                void this._handleRefresh();
            }}
              >
                <ha-icon icon="mdi:refresh"></ha-icon>
              </button>
            `
            : A}
      </div>
    `;
    }
    _renderLastUpdated(features, dir) {
        if (features.show_last_updated === false) {
            return A;
        }
        const lastSuccess = this._getActiveLastSuccess();
        if (!lastSuccess) {
            return A;
        }
        const locale = dir === 'rtl'
            ? this.hass.locale?.language?.startsWith('he')
                ? this.hass.locale.language
                : 'he'
            : this.hass.locale?.language;
        const relative = formatRelativeTime(lastSuccess, locale);
        if (!relative) {
            return A;
        }
        return b `<div class="last-updated">Updated ${relative}</div>`;
    }
    _getActiveLastSuccess() {
        let latest;
        for (const feed of this._getActiveFeeds()) {
            const lastSuccess = this.hass.states[feed.entity]?.attributes
                ?.last_success;
            if (!lastSuccess) {
                continue;
            }
            if (!latest || Date.parse(lastSuccess) > Date.parse(latest)) {
                latest = lastSuccess;
            }
        }
        return latest;
    }
    _renderEmpty() {
        const sources = this._getSourceOptions();
        if (sources.length === 0) {
            return b `
        <div class="empty">
          No RSS sensors found. Add a feed in Settings → Devices &amp; Services →
          HASS RSS.
        </div>
      `;
        }
        const activeFeeds = this._getActiveFeeds();
        const hasMissing = activeFeeds.some((feed) => !this.hass.states[feed.entity]);
        if (hasMissing) {
            return b `<div class="error">The selected RSS sensor is unavailable.</div>`;
        }
        return b `<div class="empty">No articles available.</div>`;
    }
    _renderPreset(preset, items, dir, features) {
        switch (preset) {
            case 'ticker':
                return this._renderTicker(items, dir, features);
            case 'list':
                return this._renderList(items, features);
            case 'card':
                return this._renderCard(items, features);
            case 'magazine':
                return this._renderMagazine(items, features);
            default:
                return this._renderCompact(items, features);
        }
    }
    _renderCompact(items, features) {
        const animation = this._config.animation ?? {};
        const useCarousel = animation.enabled &&
            animation.type === 'carousel' &&
            !prefersReducedMotion() &&
            items.length > 1;
        const useIndex = this._usesArticleIndex(items, features, !!useCarousel);
        const index = useIndex ? this._normalizeIndex(items) : 0;
        const item = items[index] ?? items[0];
        if (useCarousel || useIndex) {
            return b `
        <div class="carousel-container">
          ${this._renderCompactItem(item, features, useCarousel ? animation.transition : undefined)}
          ${this._renderArticleNavigation(items, features, useIndex)}
        </div>
      `;
        }
        return this._renderCompactItem(item, features);
    }
    _renderCompactItem(item, features, transition) {
        void this._readVersion;
        const display = this._config.display ?? {};
        const imageCfg = display.image ?? {};
        const position = imageCfg.position ?? 'start';
        const read = !!(features.track_read_unread && isRead(item.link));
        return b `
      <div
        class=${e({
            'compact-item': true,
            item: true,
            read: read,
            'image-top': position === 'top',
            'image-end': position === 'end',
            'carousel-item': !!transition,
            'fade-out': false,
        })}
      >
        ${this._renderImage(item, display, imageCfg)}
        <div class="compact-content">
          <div class="compact-row">
            <div class="compact-title">
              ${this._renderNewBadge(item, features)}
              <span
                class="item-link"
                @click=${() => this._openItem(item)}
              >${item.title}</span>
            </div>
            ${this._renderRelativeTime(item.published)}
          </div>
          ${showIncludesSummary(display.show)
            ? b `<div class="compact-summary">${item.summary ?? ''}</div>`
            : A}
          ${item.feed_name
            ? b `<div class="feed-name">${item.feed_name}</div>`
            : A}
        </div>
      </div>
    `;
    }
    _renderTicker(items, dir, features) {
        void this._readVersion;
        const animation = this._config.animation ?? {};
        const useCarousel = animation.enabled !== false &&
            animation.type === 'carousel' &&
            !prefersReducedMotion() &&
            items.length > 1;
        if (useCarousel) {
            const index = this._normalizeIndex(items);
            const item = items[index] ?? items[0];
            const display = this._config.display ?? {};
            const transition = animation.transition ?? 'fade';
            const useIndex = this._usesArticleIndex(items, features, true);
            return b `
        <div
          class="ticker-wrap ticker-single"
          dir=${dir}
          @mouseenter=${() => {
                if (animation.pause_on_hover)
                    this._tickerPaused = true;
            }}
          @mouseleave=${() => {
                this._tickerPaused = false;
            }}
        >
          <div
            class="ticker-item item carousel-item ${transition} ${features.track_read_unread && isRead(item.link) ? 'read' : ''}"
            key=${`${index}-${item.link}`}
          >
            ${this._renderImage(item, display, display.image ?? {}, 'small')}
            ${this._renderNewBadge(item, features)}
            <span class="ticker-title item-link" @click=${() => this._openItem(item)}>
              ${item.title}
            </span>
            ${this._renderRelativeTime(item.published)}
          </div>
          ${item.feed_name
                ? b `<div class="feed-name">${item.feed_name}</div>`
                : A}
          ${this._renderArticleNavigation(items, features, useIndex)}
        </div>
      `;
        }
        const enabled = animation.enabled !== false && !prefersReducedMotion();
        const speed = this._resolveSpeed(animation);
        const duration = this._estimateTickerDuration(items.length, speed);
        const display = this._config.display ?? {};
        const doubled = enabled ? [...items, ...items] : items;
        return b `
      <div
        class="ticker-wrap"
        @mouseenter=${() => {
            if (animation.pause_on_hover)
                this._tickerPaused = true;
        }}
        @mouseleave=${() => {
            this._tickerPaused = false;
        }}
      >
        <div
          class=${e({
            'ticker-track': true,
            paused: this._tickerPaused,
            'no-animation': !enabled,
        })}
          style=${enabled ? `--ticker-duration: ${duration}s` : A}
        >
          ${doubled.map((item, i) => b `
              <div class="ticker-item item ${features.track_read_unread && isRead(item.link) ? 'read' : ''}">
                ${this._renderImage(item, display, display.image ?? {}, 'small')}
                ${this._renderNewBadge(item, features)}
                <span class="ticker-title item-link" @click=${() => this._openItem(item)}>
                  ${item.title}
                </span>
                ${i < doubled.length - 1
            ? b `<span class="ticker-separator">•</span>`
            : A}
              </div>
            `)}
        </div>
      </div>
    `;
    }
    _renderList(items, features) {
        void this._readVersion;
        const display = this._config.display ?? {};
        return b `
      <div class="list-items">
        ${items.map((item) => b `
            <div class="list-item item ${features.track_read_unread && isRead(item.link) ? 'read' : ''}">
              ${this._renderImage(item, display, display.image ?? {})}
              <div class="compact-content">
                <div class="compact-title">
                  ${this._renderNewBadge(item, features)}
                  <span class="item-link" @click=${() => this._openItem(item)}>${item.title}</span>
                </div>
                ${showIncludesSummary(display.show)
            ? b `<div class="compact-summary">${item.summary ?? ''}</div>`
            : A}
                ${this._renderRelativeTime(item.published)}
              </div>
            </div>
          `)}
      </div>
    `;
    }
    _renderCard(items, features) {
        const useIndex = this._usesArticleIndex(items, features, false);
        const index = useIndex ? this._normalizeIndex(items) : 0;
        const item = items[index] ?? items[0];
        void this._readVersion;
        const display = this._config.display ?? {};
        const imageCfg = display.image ?? {};
        return b `
      <div class="card-item image-top item">
        ${this._renderImage(item, display, { ...imageCfg, position: 'top' }, 'large')}
        <div class="compact-title">
          ${this._renderNewBadge(item, features)}
          <span class="item-link" @click=${() => this._openItem(item)}>${item.title}</span>
        </div>
        ${showIncludesSummary(display.show)
            ? b `<div class="compact-summary">${item.summary ?? ''}</div>`
            : A}
        ${item.feed_name
            ? b `<div class="feed-name">${item.feed_name}</div>`
            : A}
        ${this._renderArticleNavigation(items, features, useIndex)}
      </div>
    `;
    }
    _renderMagazine(items, features) {
        const item = items[0];
        void this._readVersion;
        return b `
      <div class="magazine-item item">
        ${item.image && item.has_image
            ? b `<img
              class="magazine-bg"
              src=${item.image}
              alt=""
              loading="lazy"
              @error=${(e) => this._hideImage(e)}
            />`
            : b `<div class="magazine-bg" style="background: var(--primary-color); opacity: 0.3;"></div>`}
        <div class="magazine-overlay">
          ${this._renderNewBadge(item, features)}
          <div class="magazine-title item-link" @click=${() => this._openItem(item)}>
            ${item.title}
          </div>
        </div>
      </div>
    `;
    }
    _renderImage(item, display, imageCfg, sizeOverride) {
        if (!showIncludesImage(display.show))
            return A;
        const size = sizeOverride ?? imageCfg.size ?? 'medium';
        const fit = imageCfg.fit === 'contain' ? 'fit-contain' : '';
        if (item.image && item.has_image) {
            return b `
        <img
          class="item-image size-${size} ${fit}"
          src=${item.image}
          alt=""
          loading="lazy"
          @error=${(e) => this._hideImage(e)}
        />
      `;
        }
        if (imageCfg.fallback === 'placeholder') {
            return b `
        <div class="placeholder-image size-${size}">
          <ha-icon icon="mdi:image-off-outline"></ha-icon>
        </div>
      `;
        }
        return A;
    }
    _renderNewBadge(item, features) {
        if (!features.show_new_badge)
            return A;
        const duration = features.new_badge_duration ?? 3600;
        if (!isNewItem(item.published, duration, item.link))
            return A;
        return b `<span class="new-badge">NEW</span>`;
    }
    _getRelativeTimeLocale() {
        const presetDir = resolveDirection(this._config.rtl, this._getItems()[0]?.title);
        if (presetDir === 'rtl') {
            return this.hass.locale?.language?.startsWith('he')
                ? this.hass.locale.language
                : 'he';
        }
        return this.hass.locale?.language;
    }
    _renderRelativeTime(published) {
        if (this._config.features?.show_relative_time === false) {
            return A;
        }
        const text = formatRelativeTime(published, this._getRelativeTimeLocale());
        if (!text) {
            return A;
        }
        return b `<span class="meta">${text}</span>`;
    }
    _usesArticleIndex(items, features, carouselActive) {
        if (items.length <= 1) {
            return false;
        }
        const preset = this._config.display?.preset ?? 'compact';
        if (preset === 'list' || preset === 'magazine') {
            return false;
        }
        if (preset === 'ticker' &&
            this._config.animation?.enabled !== false &&
            this._config.animation?.type === 'ticker') {
            return false;
        }
        return (carouselActive || features.show_article_navigation !== false);
    }
    _normalizeIndex(items) {
        if (items.length === 0) {
            return 0;
        }
        return (((this._carouselIndex % items.length) + items.length) % items.length);
    }
    _renderArticleNavigation(items, features, enabled) {
        if (!enabled || features.show_article_navigation === false) {
            return A;
        }
        const index = this._normalizeIndex(items);
        return b `
      <div class="article-nav">
        <button
          class="nav-btn"
          title="Previous article"
          ?disabled=${items.length <= 1}
          @click=${(event) => {
            event.stopPropagation();
            this._goToArticle(-1, items.length);
        }}
        >
          <ha-icon icon="mdi:chevron-left"></ha-icon>
        </button>
        <span class="article-nav-position">${index + 1}/${items.length}</span>
        <button
          class="nav-btn"
          title="Next article"
          ?disabled=${items.length <= 1}
          @click=${(event) => {
            event.stopPropagation();
            this._goToArticle(1, items.length);
        }}
        >
          <ha-icon icon="mdi:chevron-right"></ha-icon>
        </button>
      </div>
    `;
    }
    _goToArticle(delta, count) {
        if (count <= 1) {
            return;
        }
        this._carouselIndex = (this._carouselIndex + delta + count) % count;
        this._tickerPaused = true;
        this.requestUpdate();
    }
    _getSourceOptions() {
        if (!this.hass) {
            return [];
        }
        return resolveSourceOptions(this.hass, this._config.feeds ?? []);
    }
    _getSourceSelection() {
        const sources = this._getSourceOptions();
        const active = this._config.active_source;
        if (isAllSources(active)) {
            return ALL_SOURCES;
        }
        if (active && sources.some((source) => source.entity === active)) {
            return active;
        }
        return ALL_SOURCES;
    }
    _getSourceLabel(sources) {
        if (isAllSources(this._config.active_source)) {
            return 'All sources';
        }
        const active = sources.find((source) => source.entity === this._config.active_source);
        return active?.name ?? sources[0]?.name ?? 'RSS';
    }
    _getActiveFeeds() {
        const sources = this._getSourceOptions();
        if (sources.length === 0) {
            return [];
        }
        if (sources.length === 1) {
            return [{ entity: sources[0].entity }];
        }
        if (isAllSources(this._config.active_source)) {
            return sources.map((source) => ({ entity: source.entity }));
        }
        const active = this._config.active_source;
        if (active && sources.some((source) => source.entity === active)) {
            return [{ entity: active }];
        }
        return sources.map((source) => ({ entity: source.entity }));
    }
    _onSourceChange(event) {
        const entity = event.target.value;
        if (!entity || entity === this._config.active_source) {
            return;
        }
        this._config = mergeConfig({ ...this._config, active_source: entity });
        this._carouselIndex = 0;
        this._lastLatestKey = '';
        this._carouselSetupKey = '';
        this._fireConfigChanged();
        this.requestUpdate();
    }
    _fireConfigChanged() {
        const feeds = (this._config.feeds ?? []).filter((feed) => feed.entity && feed.entity.trim().length > 0);
        this.dispatchEvent(new CustomEvent('config-changed', {
            detail: {
                config: {
                    ...this._config,
                    feeds,
                },
            },
            bubbles: true,
            composed: true,
        }));
    }
    _getItems() {
        const maxItems = this._config.display?.max_items ?? 5;
        return mergeFeedItems(this.hass, this._getActiveFeeds(), maxItems);
    }
    _openItem(item) {
        const items = this._getItems();
        const index = items.findIndex((entry) => (entry.link && entry.link === item.link) ||
            (!entry.link && entry.title === item.title));
        if (this._config.features?.track_read_unread) {
            markRead(item.link);
            this._readVersion += 1;
        }
        if (item.link) {
            window.open(item.link, '_blank', 'noopener,noreferrer');
        }
        if (this._config.features?.advance_on_read !== false &&
            index >= 0 &&
            items.length > 1) {
            this._carouselIndex = (index + 1) % items.length;
            this._tickerPaused = true;
            this.requestUpdate();
        }
    }
    async _handleRefresh() {
        if (this._refreshing || !this.hass)
            return;
        this._refreshing = true;
        const entities = getFeedEntityIds(this._getActiveFeeds());
        if (entities.length === 0) {
            return;
        }
        const before = this._snapshotEntities(entities);
        try {
            if (entities.length === 1) {
                await this.hass.callService('hass_rss', 'refresh_feed', {
                    entity_id: entities[0],
                });
            }
            else {
                await this.hass.callService('hass_rss', 'refresh_all', {});
            }
            await this._waitForEntityRefresh(entities, before, 15000);
            const items = this._getItems();
            const newest = getNewestItem(items);
            if (newest) {
                this._carouselIndex = 0;
                this._lastLatestKey = newest.link || newest.title || '';
            }
            this.requestUpdate();
        }
        catch (error) {
            console.error('HASS RSS refresh failed', error);
        }
        finally {
            this._refreshing = false;
        }
    }
    _snapshotEntities(entities) {
        return new Map(entities.map((entityId) => {
            const entity = this.hass.states[entityId];
            const items = entity?.attributes?.items;
            return [
                entityId,
                {
                    state: entity?.state,
                    lastUpdated: entity?.last_updated,
                    lastSuccess: entity?.attributes?.last_success,
                    newestTitle: items?.[0]?.title,
                },
            ];
        }));
    }
    _entitiesRefreshed(entities, before) {
        return entities.some((entityId) => {
            const entity = this.hass.states[entityId];
            const previous = before.get(entityId);
            if (!entity || !previous) {
                return false;
            }
            const items = entity.attributes?.items;
            const newestTitle = items?.[0]?.title;
            return (entity.state !== previous.state ||
                entity.last_updated !== previous.lastUpdated ||
                entity.attributes?.last_success !== previous.lastSuccess ||
                newestTitle !== previous.newestTitle);
        });
    }
    _waitForEntityRefresh(entities, before, timeoutMs) {
        const started = Date.now();
        return new Promise((resolve) => {
            const check = () => {
                if (this._entitiesRefreshed(entities, before) ||
                    Date.now() - started >= timeoutMs) {
                    resolve();
                    return;
                }
                window.setTimeout(check, 300);
            };
            check();
        });
    }
    _getCarouselSetupKey() {
        const animation = this._config?.animation ?? {};
        const display = this._config?.display ?? {};
        return [
            display.preset ?? 'compact',
            String(animation.enabled ?? false),
            animation.type ?? '',
            String(animation.interval ?? 5),
            String(this._getItems().length),
            this._getSourceSelection(),
            (this._config?.feeds ?? []).map((feed) => feed.entity).join('|'),
        ].join(':');
    }
    _ensureCarouselTimer() {
        if (!this._config || !this.hass) {
            return;
        }
        const key = this._getCarouselSetupKey();
        if (key === this._carouselSetupKey && this._carouselTimer) {
            return;
        }
        this._carouselSetupKey = key;
        this._syncCarousel();
    }
    _applyPresetDefaults() {
        const preset = this._config.display?.preset;
        if (!this._config.animation)
            this._config.animation = {};
        if (preset === 'ticker') {
            if (this._config.animation.enabled === undefined) {
                this._config.animation.enabled = true;
            }
            if (!this._config.animation.type) {
                this._config.animation.type = 'carousel';
            }
            if (!this._config.animation.interval) {
                this._config.animation.interval = 5;
            }
        }
    }
    _resolveSpeed(animation) {
        const preset = (animation.speed_preset ?? 'medium');
        if (preset === 'custom')
            return animation.speed ?? 50;
        return SPEED_PRESET_VALUES[preset];
    }
    _estimateTickerDuration(itemCount, speedPxPerSec) {
        const estimatedWidth = Math.max(itemCount, 1) * 280;
        return Math.max(estimatedWidth / speedPxPerSec, 10);
    }
    _syncCarousel() {
        this._clearCarouselTimer();
        const animation = this._config?.animation;
        const items = this._getItems();
        const preset = this._config?.display?.preset ?? 'compact';
        const supportsCarousel = preset === 'compact' || preset === 'ticker';
        if (!animation?.enabled ||
            animation.type !== 'carousel' ||
            !supportsCarousel ||
            prefersReducedMotion() ||
            items.length <= 1) {
            return;
        }
        const interval = (animation.interval ?? 5) * 1000;
        this._carouselTimer = setInterval(() => {
            if (this._tickerPaused)
                return;
            const count = this._getItems().length;
            if (count <= 1)
                return;
            this._carouselIndex = (this._carouselIndex + 1) % count;
            this.requestUpdate();
        }, interval);
    }
    _clearCarouselTimer() {
        if (this._carouselTimer) {
            clearInterval(this._carouselTimer);
            this._carouselTimer = undefined;
        }
    }
    _hideImage(e) {
        const img = e.target;
        img.classList.add('hidden');
    }
    static getConfigElement() {
        return document.createElement('hass-rss-card-editor');
    }
    static getStubConfig(hass) {
        return {
            ...DEFAULT_CONFIG,
            feeds: [],
        };
    }
};
HassRssCard.styles = [cardStyles, imageStyles, compactStyles, tickerStyles];
__decorate([
    n({ attribute: false })
], HassRssCard.prototype, "hass", void 0);
__decorate([
    r()
], HassRssCard.prototype, "_config", void 0);
__decorate([
    r()
], HassRssCard.prototype, "_carouselIndex", void 0);
__decorate([
    r()
], HassRssCard.prototype, "_refreshing", void 0);
__decorate([
    r()
], HassRssCard.prototype, "_tickerPaused", void 0);
__decorate([
    r()
], HassRssCard.prototype, "_readVersion", void 0);
HassRssCard = __decorate([
    t$1('hass-rss-card')
], HassRssCard);
window.customCards =
    window.customCards ?? [];
window.customCards.push({
    type: 'hass-rss-card',
    name: 'HASS RSS Card',
    description: 'Display RSS feeds from the HASS RSS integration',
    preview: true,
    documentationURL: 'https://github.com/il90il90/hass-rss-card#readme',
});

export { HassRssCard };
