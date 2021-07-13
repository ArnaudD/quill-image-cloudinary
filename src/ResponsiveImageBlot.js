import Quill from "quill";

const EmbedBlot = Quill.import("blots/embed");

const ATTRIBUTES = ["alt", "height", "width", "src", "srcset", "loading", "style", "data-align"];

class ResponsiveImage extends EmbedBlot {
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
        // Disable image resizing in Firefox
        document.execCommand("enableObjectResizing", false, false);
      }, 1);
    }
  }

  static value(domNode) {
    return {
      src: domNode.getAttribute("src"),
      srcset: domNode.getAttribute("srcset"),
      alt: domNode.getAttribute("alt"),
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
}
ResponsiveImage.blotName = "cloudinary-image";
ResponsiveImage.tagName = "IMG";
ResponsiveImage.className = "ql-cloudinary-image";

export default ResponsiveImage;
