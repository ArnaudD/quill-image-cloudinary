# quill-image-cloudinary

Quill module to insert images with [Cloudinary image library](https://cloudinary.com/documentation/media_library_widget)

## Features

* Optimized image loading :
  * `srcset` is set with derived images
  * Adds `loading="lazy"` to `<img />` tags
* Works well with [`quill-blot-formatter`](https://github.com/Fandom-OSS/quill-blot-formatter)

Example of inserted image :

```html
<img
  class="ql-cloudinary-image"
  src="https://res.cloudinary.com/quill-image-cloudinary/image/upload/c_scale,f_auto,q_auto,w_1400/img.png"
  srcset="https://res.cloudinary.com/quill-image-cloudinary/image/upload/c_scale,f_auto,q_auto,w_400/img.png 400w,
    https://res.cloudinary.com/quill-image-cloudinary/image/upload/c_scale,f_auto,q_auto,w_600/img.png 600w,
    https://res.cloudinary.com/quill-image-cloudinary/image/upload/c_scale,f_auto,q_auto,w_1000/img.png 1000w,
    https://res.cloudinary.com/quill-image-cloudinary/image/upload/c_scale,f_auto,q_auto,w_1400/img.png 1400w"
  loading="lazy"
/>
```

## Usage

### Install :
```sh
yarn add quill-image-cloudinary
# or
npm install quill-image-cloudinary
```

### Load Cloudinary media library sdk
```html
<script src="https://media-library.cloudinary.com/global/all.js"></script>
```

### Configure Quill
```js
import Quill from 'quill';
import QuillImageCloudinary from "quill-image-cloudinary";

Quill.register("modules/cloudinary", QuillImageCloudinary);

const getAuthOption = async () => {
  // Retrieve auth token generated on your server
  // See https://cloudinary.com/documentation/media_library_widget#3_set_the_configuration_options
  // and https://cloudinary.com/documentation/media_library_widget#2_optional_generate_the_authentication_signature

  return {
    cloud_name: 'XXX',
    api_key: 'XXX',
    username: 'XXX',
    timestamp: 'XXX',
    signature: 'XXX',
  }
}

const getShowOption = async () => {
  // Note: `folder.path` must already be exists in your library.
  // This function is async to let you create the folder before opening the
  // media library or retrieve it dynamicaly.

  return {
    folder: {
      path: '/custom-folder-in-libary',
      resource_type: "image",
    },
  };
}

var quill = new Quill('#editor', {
  modules: {
    toolbar: [/* 'bold', 'italic', 'underline', */ 'image'],
    cloudinary: {
      getAuthOption, // (required)
      getShowOption, // (optional)
      srcset: [400, 600, 1000, 1400], // (Optional) specifying this will set the
        // `srcset` attribute on <img/> tags with corresponding trahsformed
        // images. The larger size will be used as fallback for the `src` attribute.
      preloadMediaLibrary: false, // (Optional, default to true). Use this if you
        // want to delay cloudinary initialization until the quill image button
        // is clicked.
    },
    // ...
  },
  // ...
});
```
## Example of server-side token generation with express.js

[Cloudinary documentation](https://cloudinary.com/documentation/media_library_widget#2_optional_generate_the_authentication_signature)

```js
import crypto from "crypto";

const {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_USERNAME,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_API_KEY,
} = process.env;

app.get("/cloudinary-token", (request, response) => {
  // TODO Authenticate request here

  const timestamp = Math.floor(Date.now() / 1000);
  const params = [
    `cloud_name=${CLOUDINARY_CLOUD_NAME}`,
    `timestamp=${timestamp}`,
    `username=${CLOUDINARY_USERNAME}${CLOUDINARY_API_SECRET}`,
  ].join('&')
  const signature = crypto.createHash("sha256").update(params).digest("hex");

  return response.json({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    username: CLOUDINARY_USERNAME,
    timestamp,
    signature,
  });
});
```

## Running the demo

```sh
cd demo
npm install
npm run dev
```
