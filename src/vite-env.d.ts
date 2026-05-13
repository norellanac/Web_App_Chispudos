/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE_API_URL: string;
  readonly VITE_FACEBOOK_APP_ID: string;
  readonly VITE_FACEBOOK_SDK_VERSION: string;
  readonly VITE_MAILCHIMP_API_KEY: string;
  readonly VITE_MAILCHIMP_API_URL: string;
  readonly VITE_MAILCHIMP_LIST_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
