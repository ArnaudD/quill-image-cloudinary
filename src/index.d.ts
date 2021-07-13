import Quill from 'quill';

export interface QuillImageCloudinaryAuth {
    cloud_name: string;
    api_key: string;
    username?: string;
    timestamp?: number;
    signature?: string;
}

export interface QuillImageCloudinaryOptions {
  getAuthOption: Promise<QuillImageCloudinaryAuth> | QuillImageCloudinaryAuth;
  getShowOption?: Promise<any> | any;
  preloadMediaLibrary?: boolean;
  srcset?: number[];
}

export default class QuillImageCloudinary {
  constructor(quill: Quill, options: QuillImageCloudinaryOptions)
}
