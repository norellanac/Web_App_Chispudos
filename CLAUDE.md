# projectx-web — Agent Context

## Role
This is the **end-user web application**. It is a **read-only consumer** of the branding/customization config — it fetches the config from the backend on startup and applies it to the UI (theme, logo, links, copy, feature flags). It never writes to the branding API. All edits happen in the admin app.

## Tech Stack
| | |
|---|---|
| Framework | React 18 + Vite + TypeScript |
| State | Redux Toolkit + redux-persist (localStorage) |
| UI library | MUI v6 (Material UI) + Emotion |
| Forms | Formik + Yup |
| i18n | i18next + react-i18next |
| Routing | React Router DOM v6 |
| HTTP | RTK Query (`createApi` + `baseQueryWithReauth`) |
| Date | date-fns, dayjs, MUI X Date Pickers |
| Animation | Swiper (sliders) |

## Source Layout
```
src/
├── features/
│   ├── auth/           # Login, register, password reset, privacy policy, T&C
│   ├── home/           # Home dashboard
│   ├── landing/        # Public landing page
│   ├── Business/       # Business profiles
│   ├── Services/       # Service listings
│   ├── tasks/          # Task management
│   ├── messages/       # Chat/messaging
│   ├── favorites/      # Saved items
│   └── profile/        # User profile
├── components/
│   ├── atoms/          # Smallest units (Button, Text, Input...)
│   ├── molecules/
│   │   └── AppLogo.tsx # ← Uses hardcoded Reco_logo.png — must be made dynamic
│   ├── organisms/
│   └── templates/
├── services/           # RTK Query files (one per resource)
│   ├── brandingApi.ts  # ← Does NOT exist yet — must be created
│   └── baseQueryWithReauth.ts
├── redux/
│   ├── slices/
│   │   ├── authSlice.ts
│   │   ├── filterProductsSlice.ts
│   │   ├── roleSwitcherSlice.ts
│   │   └── serviceStepperSlice.ts
│   └── store/store.ts
├── hooks/              # Custom React hooks
├── routes/             # Route definitions and guards
├── theme/
│   ├── lightTheme.ts   # ← Hardcoded colors — must become a factory function
│   ├── darkTheme.ts    # ← Same
│   ├── textTheme.ts    # Typography scale (can be kept static)
│   └── index.ts        # Exports { themes: { light, dark } }
├── types/
│   └── api/            # API response/request types
├── utils/
│   ├── baseEnvironment.ts   # DEFAULT_IMAGE, base URL helpers
│   └── i18n.tsx             # i18n config (en/es)
└── assets/
    ├── tranlsations/   # en.json, es.json
    └── images/
        └── Reco_logo.png    # ← Will be replaced by dynamic URL
```

## Key Conventions
- **API calls**: RTK Query `createApi` + `baseQueryWithReauth`. One API slice per domain.
- **Auth**: `baseQueryWithReauth` auto-refreshes tokens on 401. Token stored in Redux `auth.token`.
- **State**: RTK Query for server state; regular slices for UI state (auth session, filters, etc.).
- **Theme**: MUI `sx` prop or `styled()`. Access palette via `useTheme()`. No hardcoded color hex values in components.
- **Logo**: currently `AppLogo.tsx` imports `Reco_logo.png` statically — must use dynamic branding URL.
- **i18n**: all user-visible strings through `t('key')`. Keys in `assets/tranlsations/` (note: folder has a typo — one `l`).
- **Forms**: Formik + Yup.
- **Imports**: relative paths (no path alias — unlike admin, this project does not use `@/`).
- **Feature flags**: currently no flags exist — gating components behind branding flags is part of the customization module.

## Scripts
```bash
yarn dev          # Vite dev server
yarn build        # tsc --noEmit + Vite build
yarn lint         # ESLint (quiet mode)
yarn extract      # i18next-parser — extract new i18n keys
yarn format       # Prettier
yarn deploy-github  # build + gh-pages deploy
```

## Environment Variables
```
VITE_BASE_API_URL         # e.g. http://localhost:8000/api/v1
VITE_FACEBOOK_APP_ID
VITE_FACEBOOK_SDK_VERSION
```

---

## Customization / Branding Module — Web's Role: READ-ONLY CONSUMER

The web app fetches branding config once on startup, persists it in Redux, and uses it to:
1. Build the MUI theme dynamically (colors, font, button radius)
2. Render the correct logo from a URL
3. Use configured URLs for terms/privacy links
4. Hide/show features based on feature flags
5. Override i18n copy with `copyOverrides` from the config

### BrandingConfig type (must match backend exactly)
```typescript
interface BrandingColors {
  primary: string; primaryContainer: string;
  secondary: string; secondaryContainer: string;
  tertiary: string; tertiaryContainer: string;
  error: string; errorContainer: string;
  background: string; surface: string;
  textPrimary: string; textSecondary: string;
  onPrimary: string; onSecondary: string; onTertiary: string;
}
interface BrandingFeatures {
  chatEnabled: boolean; tasksEnabled: boolean; newsletterEnabled: boolean;
  socialAuthEnabled: boolean; darkModeEnabled: boolean; biometricsEnabled: boolean;
}
interface BrandingConfig {
  id: number;
  appName: string; tagline: string; legalName: string;
  logoUrl: string | null; iconUrl: string | null; splashUrl: string | null;
  faviconUrl: string | null; defaultImageUrl: string | null;
  sliderImages: string[];
  colorsLight: BrandingColors; colorsDark: BrandingColors;
  fontFamily: string; buttonBorderRadius: number;
  termsUrl: string; privacyUrl: string; supportUrl: string;
  privacyEmail: string; legalEmail: string; companyAddress: string;
  mailchimpApiUrl: string;
  features: BrandingFeatures;
  copyOverrides: Record<string, Record<string, string>>;
}
```

### What needs to be built

#### 1. `src/types/branding.ts`
Export the `BrandingConfig`, `BrandingColors`, `BrandingFeatures` interfaces above.

#### 2. `src/services/brandingApi.ts`
RTK Query `createApi` with a single `getBranding` query endpoint:
```typescript
query: () => ({ url: 'branding/', method: 'GET' })
```
No auth header needed (public endpoint). `reducerPath: 'brandingApi'`.

#### 3. `src/redux/slices/brandingSlice.ts`
Slice that holds the fetched config:
```typescript
type BrandingState = { config: BrandingConfig | null; isLoaded: boolean }
// actions: setBranding(config), clearBranding()
// selector: selectBranding(state) → state.branding
```
Add `branding` to redux-persist whitelist (so config survives page refresh).

#### 4. Update `src/redux/store/store.ts`
- Import and add `brandingReducer` + `brandingApi`
- Add `brandingApi.middleware` to middleware chain
- Add `'branding'` to persist whitelist

#### 5. `src/hooks/useBranding.ts`
```typescript
// Returns { config, isLoaded, getLogoUrl, getImageUrl }
// getLogoUrl(): string — returns full URL if logoUrl exists, else local fallback
// getImageUrl(path): string — prepends VITE_BASE_API_URL for relative paths
```

#### 6. Convert theme to factory functions
`src/theme/lightTheme.ts` → export `createLightTheme(colors: BrandingColors): Theme`
`src/theme/darkTheme.ts` → export `createDarkTheme(colors: BrandingColors): Theme`
`src/theme/index.ts` → export `createThemes(colorsLight, colorsDark)` that returns `{ light, dark }`

Keep the existing static default exports as well so nothing breaks if branding hasn't loaded yet.

#### 7. Update `src/App.tsx`
- Fetch branding with `useGetBrandingQuery()` on mount
- Dispatch `setBranding(data)` when resolved
- Build theme from `branding.colorsLight` / `colorsDark` using the new factory
- Falls back to default theme until branding loads (no flash)
- Apply `copyOverrides` to i18n: after branding loads, call `i18n.addResourceBundle(lang, 'translation', overrides, true, true)` for each language

#### 8. Update `src/components/molecules/AppLogo.tsx`
- Use `useBranding().getLogoUrl()` as `src`
- Keep the existing `Reco_logo.png` import as fallback

#### 9. Replace hardcoded links (two files)
- `src/features/auth/components/pages/PrivacyPolicy.tsx` — use `config.privacyEmail`, `config.companyAddress`
- `src/features/auth/components/pages/TermsAndConditions.tsx` — use `config.legalEmail`
- Any "Terms" / "Privacy" navigation links — use `config.termsUrl` and `config.privacyUrl`

#### 10. Apply feature flags
Gate components/routes behind `config.features.chatEnabled`, `tasksEnabled`, etc. with a `useBranding` check. Disabled features should be hidden (not just disabled).

### Image URL resolution
Backend serves images at `/api/v1/uploads/branding/filename.png`.
The `VITE_BASE_API_URL` already points to the `/api/v1` prefix, so prepend it for relative paths:
```typescript
const getImageUrl = (path: string) =>
  path?.startsWith('http') ? path : `${import.meta.env.VITE_BASE_API_URL}${path}`;
```
