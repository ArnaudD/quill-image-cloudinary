var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/index.js
__export(exports, {
  default: () => src_default
});
var import_quill2 = __toModule(require("quill"));

// src/ResponsiveImageBlot.js
var import_quill = __toModule(require("quill"));
var EmbedBlot = import_quill.default.import("blots/embed");
var ATTRIBUTES = ["alt", "height", "width", "src", "srcset", "loading", "style", "data-align"];
var ResponsiveImage = class extends EmbedBlot {
  static create(value) {
    const node = super.create();
    if (typeof value === "string") {
      node.setAttribute("src", value);
    } else {
      Object.keys(value).forEach((attribute) => {
        if (ATTRIBUTES.includes(attribute) && value[attribute]) {
          node.setAttribute(attribute, value[attribute]);
        }
      });
    }
    node.setAttribute("loading", "lazy");
    return node;
  }
  static formats(domNode) {
    return ATTRIBUTES.reduce((formats, attribute) => {
      if (domNode.hasAttribute(attribute)) {
        formats[attribute] = domNode.getAttribute(attribute);
      }
      return formats;
    }, {});
  }
  static register() {
    if (/Firefox/i.test(navigator.userAgent)) {
      setTimeout(() => {
        document.execCommand("enableObjectResizing", false, false);
      }, 1);
    }
  }
  static value(domNode) {
    return {
      src: domNode.getAttribute("src"),
      srcset: domNode.getAttribute("srcset"),
      alt: domNode.getAttribute("alt")
    };
  }
  format(name, value) {
    if (ATTRIBUTES.includes(name)) {
      if (value) {
        this.domNode.setAttribute(name, value);
      } else {
        this.domNode.removeAttribute(name);
      }
    } else {
      super.format(name, value);
    }
  }
};
ResponsiveImage.blotName = "cloudinary-image";
ResponsiveImage.tagName = "IMG";
ResponsiveImage.className = "ql-cloudinary-image";
var ResponsiveImageBlot_default = ResponsiveImage;

// src/index.js
import_quill2.default.register(ResponsiveImageBlot_default);
var defaultOptions = {
  preloadMediaLibrary: true
};
var QuillImageCloudinary = class {
  constructor(quill, options) {
    this.quill = quill;
    this.options = __spreadValues(__spreadValues({}, defaultOptions), options);
    this.range = null;
    if (this.options.srcset) {
      this.options.srcset = this.options.srcset.sort((a, b) => a - b);
    }
    if (typeof this.options.getAuthOption !== "function") {
      console.warn("'getAuthOption' function is missing in quill-image-cloudinary config.");
    }
    var toolbar = this.quill.getModule("toolbar");
    toolbar.addHandler("image", this.selectImage.bind(this));
    if (this.options.preloadMediaLibrary) {
      this.loadMediaLibrary();
    }
  }
  loadMediaLibrary() {
    if (!this.ml) {
      const otherOptions = this.options.srcset ? {
        default_transformations: this.options.srcset.map((size) => [
          __spreadValues({
            width: size,
            crop: "scale",
            fetch_format: "auto",
            quality: "auto"
          }, this.options.defaultTransformations || [])
        ])
      } : void 0;
      const init = () => __async(this, null, function* () {
        return window.cloudinary.createMediaLibrary(__spreadValues(__spreadValues({}, yield this.options.getAuthOption()), otherOptions), {
          insertHandler: this.fileChanged.bind(this),
          multiple: false,
          resource_type: "image"
        });
      });
      this.ml = init();
    }
    return this.ml;
  }
  selectImage() {
    return __async(this, null, function* () {
      this.range = this.quill.getSelection();
      const ml = yield this.loadMediaLibrary();
      ml.show(this.options.getShowOption ? yield this.options.getShowOption() : void 0);
    });
  }
  fileChanged({ assets: [image] }) {
    const { srcset } = this.options;
    const range = this.range;
    this.quill.insertEmbed(range.index, "cloudinary-image", {
      src: (srcset ? image.derived[srcset.length - 1] : image).secure_url,
      srcset: srcset ? image.derived.map(({ secure_url }, index) => `${secure_url} ${srcset[index]}w`).join(", ") : void 0
    }, "user");
    range.index++;
    this.quill.setSelection(range, "user");
  }
};
window.QuillImageCloudinary = QuillImageCloudinary;
var src_default = QuillImageCloudinary;
//# sourceMappingURL=index.cjs.js.map
