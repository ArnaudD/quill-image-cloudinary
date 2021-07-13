import pretty from 'pretty';
import Quill from 'quill';
import QuillImageCloudinary from "quill-image-cloudinary";

import 'quill/dist/quill.snow.css';

Quill.register("modules/cloudinary", QuillImageCloudinary);

const getAuthOption = async () => {
  return {
    cloud_name: window.prompt('please insert your cloudinary "cloud name"'),
    api_key: window.prompt('please insert your cloudinary api key'),
    // username: 'XXX',
    // timestamp: 'XXX',
    // signature: 'XXX',
  }
}

const getShowOption = async () => {
  return {
    folder: {
      // path: '/custom-image-path-in-libary',
      resource_type: "image",
    },
  };
}

const quill = new Quill('#quill-container', {
  modules: {
    toolbar: ['bold', 'italic', 'underline', 'image'],
    cloudinary: {
      getAuthOption,
      getShowOption,
      srcset: [400, 600, 1000, 1400],
    },
  },
  theme: 'snow'
});

quill.on('text-change', () => {
  const html = pretty(document.querySelector('#quill-container .ql-editor').innerHTML, {ocd: true})
  console.log(html)
  document.querySelector('#output').innerText = html
})
