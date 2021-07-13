import Quill from "quill";

import ResponsiveImage from "./ResponsiveImageBlot";

Quill.register(ResponsiveImage);

const defaultOptions = {
  preloadMediaLibrary: true,
};

class QuillImageCloudinary {
  constructor(quill, options) {
    this.quill = quill;
    this.options = { ...defaultOptions, ...options };
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
      const otherOptions = this.options.srcset
        ? {
            default_transformations: this.options.srcset.map((size) => [
              {
                width: size,
                crop: "scale",
                fetch_format: "auto",
                quality: "auto",
                ...(this.options.defaultTransformations || []),
              },
            ]),
          }
        : undefined;

      const init = async () =>
        window.cloudinary.createMediaLibrary(
          {
            ...(await this.options.getAuthOption()),
            ...otherOptions,
          },
          {
            insertHandler: this.fileChanged.bind(this),
            multiple: false,
            resource_type: "image",
          }
        );

      this.ml = init();
    }

    return this.ml;
  }

  async selectImage() {
    this.range = this.quill.getSelection();
    const ml = await this.loadMediaLibrary();
    ml.show(this.options.getShowOption ? await this.options.getShowOption() : undefined);
  }

  fileChanged({ assets: [image] }) {
    const { srcset } = this.options;

    const range = this.range;
    this.quill.insertEmbed(
      range.index,
      "cloudinary-image",
      {
        src: (srcset ? image.derived[srcset.length - 1] : image).secure_url,
        srcset: srcset
          ? image.derived
              .map(({ secure_url }, index) => `${secure_url} ${srcset[index]}w`)
              .join(", ")
          : undefined,
      },
      "user"
    );
    range.index++;
    this.quill.setSelection(range, "user");
  }
}

window.QuillImageCloudinary = QuillImageCloudinary;
export default QuillImageCloudinary;
