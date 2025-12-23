// UI/UX blueprint extracted from the Twenty frontend. This file is intended
// to be imported into other codebases to quickly identify which pieces to
// reuse or mirror when recreating the application shell and user experience.

export type UiUxBlueprintEntry = {
  name: string;
  summary: string;
  keyFiles: string[];
  integrationNotes: string;
};

export type UiUxBlueprint = {
  appShell: UiUxBlueprintEntry[];
  navigation: UiUxBlueprintEntry[];
  layout: UiUxBlueprintEntry[];
  dataEntry: UiUxBlueprintEntry[];
  dataPresentation: UiUxBlueprintEntry[];
  feedback: UiUxBlueprintEntry[];
  designSystem: UiUxBlueprintEntry[];
};

export const frontendUiUxCodefile: UiUxBlueprint = {
  appShell: [
    {
      name: 'Root providers',
      summary:
        'Sets up Recoil for state, Lingui i18n, error boundaries, icon registry, and click-outside handling before rendering the router.',
      keyFiles: [
        'src/modules/app/components/App.tsx',
        'src/modules/app/components/AppRouter.tsx',
        'src/modules/app/hooks/useCreateAppRouter.tsx',
        'src/utils/i18n/initialI18nActivate.ts',
      ],
      integrationNotes:
        'Wrap your root with the providerStackExample to retain global error handling (AppErrorBoundary + AppRootErrorFallback), internationalization, snack-bar context, icon provisioning, and click-outside guards.',
    },
    {
      name: 'Routing with access toggles',
      summary:
        'React Router is created via useCreateAppRouter and toggles admin/serverless surfaces based on the authenticated user.',
      keyFiles: [
        'src/modules/app/components/AppRouter.tsx',
        'src/modules/app/hooks/useCreateAppRouter.tsx',
        'src/modules/auth/states/currentUserState.ts',
      ],
      integrationNotes:
        'Propagate feature flags (isFunctionSettingsEnabled, isAdminPageEnabled) and hydrate currentUserState before mounting <RouterProvider> to keep route availability aligned with permissions.',
    },
  ],
  navigation: [
    {
      name: 'Primary navigation drawer',
      summary:
        'Resizable left rail that swaps between fixed items and favorites, persists width in Recoil, and exposes collapse/resize affordances.',
      keyFiles: [
        'src/modules/navigation/components/MainNavigationDrawer.tsx',
        'src/modules/ui/navigation/navigation-drawer/components/NavigationDrawer.tsx',
        'src/modules/ui/navigation/navigation-drawer/states/navigationDrawerWidthState.ts',
      ],
      integrationNotes:
        'Use NavigationDrawer with NavigationDrawerFixedContent and NavigationDrawerScrollableContent to mirror the hover-to-expand, resize, and favorites behavior on desktop.',
    },
    {
      name: 'Mobile navigation',
      summary:
        'Compact bottom navigation optimized for MOBILE_VIEWPORT breakpoints, keeping critical actions reachable on small screens.',
      keyFiles: [
        'src/modules/navigation/components/MobileNavigationBar.tsx',
        'src/modules/ui/utilities/responsive/hooks/useIsMobile.ts',
      ],
      integrationNotes:
        'Conditionally render MobileNavigationBar alongside or instead of the drawer when useIsMobile() is true to preserve parity across devices.',
    },
  ],
  layout: [
    {
      name: 'Workspace page layout grid',
      summary:
        'Page layout renderer builds grid/canvas-based screens with drag selection, resizable panels, and tabbed surfaces for widgets.',
      keyFiles: [
        'src/modules/page-layout/components/PageLayoutRenderer.tsx',
        'src/modules/page-layout/components/PageLayoutGridLayout.tsx',
        'src/modules/page-layout/PageLayoutMainContent.tsx',
      ],
      integrationNotes:
        'Mount PageLayoutRenderer inside the workspace shell to reuse drag-selection and grid-resize behaviors; pair with PageLayoutTabList components to manage multi-tab layouts.',
    },
  ],
  dataEntry: [
    {
      name: 'Form inputs and controls',
      summary:
        'Composable inputs with shared labeling/error affordances, including SelectInput, MultiSelectControl, IconPicker, and SettingsTextInput.',
      keyFiles: [
        'src/modules/ui/input/components/SelectInput.tsx',
        'src/modules/ui/input/components/MultiSelectControl.tsx',
        'src/modules/ui/input/components/IconPicker.tsx',
        'src/modules/ui/input/components/SettingsTextInput.tsx',
        'src/modules/ui/input/components/InputErrorHelper.tsx',
        'src/modules/ui/input/components/InputLabel.tsx',
      ],
      integrationNotes:
        'Reuse the label/hint/error trio to keep vertical rhythm consistent, and co-locate controls within shared FormSection containers when mirroring settings views.',
    },
    {
      name: 'Rich text editor',
      summary:
        'AdvancedTextEditor wraps Tiptap with bubble menus for links, images, and turn-into blocks plus workflow attachment chips.',
      keyFiles: [
        'src/modules/advanced-text-editor/components/AdvancedTextEditor.tsx',
        'src/modules/advanced-text-editor/components/BubbleMenuIconButton.tsx',
        'src/modules/advanced-text-editor/components/ImageBubbleMenu.tsx',
        'src/modules/advanced-text-editor/components/LinkBubbleMenu.tsx',
      ],
      integrationNotes:
        'Embed AdvancedTextEditor where comment/note bodies are edited and wire its menu components to your toolbar system to preserve contextual editing UX.',
    },
  ],
  dataPresentation: [
    {
      name: 'Record table',
      summary:
        'Data grid with row selection, empty states, and column width persistence driven by Recoil state and resize effects.',
      keyFiles: [
        'src/modules/object-record/record-table/components/RecordTable.tsx',
        'src/modules/object-record/record-table/components/RecordTableContextProvider.tsx',
        'src/modules/object-record/record-table/components/RecordTableColumnWidthEffect.tsx',
      ],
      integrationNotes:
        'Keep RecordTableContextProvider in the tree to coordinate column widths, empty states, and resize handling across record list views.',
    },
  ],
  feedback: [
    {
      name: 'Global error handling',
      summary:
        'AppErrorBoundary and ExceptionHandlerProvider wrap the tree to render AppRootErrorFallback and centralize exception reporting.',
      keyFiles: [
        'src/modules/error-handler/components/AppErrorBoundary.tsx',
        'src/modules/error-handler/components/AppRootErrorFallback.tsx',
        'src/modules/error-handler/components/ExceptionHandlerProvider.tsx',
      ],
      integrationNotes:
        'Retain the boundary/provider pairing at the top of your app to capture runtime failures and surface user-friendly recovery messaging.',
    },
    {
      name: 'Dialogs and snack bars',
      summary:
        'Centralized dialog manager and snack bar system keyed by SnackBarComponentInstanceContext to unify modals and toasts.',
      keyFiles: [
        'src/modules/ui/feedback/dialog-manager',
        'src/modules/ui/feedback/snack-bar-manager',
        'src/modules/ui/feedback/snack-bar-manager/contexts/SnackBarComponentInstanceContext.ts',
      ],
      integrationNotes:
        'Provide the SnackBarComponentInstanceContext at the root (as done in App) so downstream hooks can enqueue toasts; colocate dialog manager alongside AppRouter to keep overlays mounted.',
    },
  ],
  designSystem: [
    {
      name: 'Theme and tokens',
      summary:
        'The twenty-ui theme barrel exports ThemeContextProvider plus light/dark tokens (THEME_LIGHT/THEME_DARK), spacing, typography, and helpers like getNextThemeColor.',
      keyFiles: ['packages/twenty-ui/src/theme/index.ts'],
      integrationNotes:
        'Wrap screens with ThemeContextProvider and pull constants such as THEME_LIGHT, THEME_DARK, and ANIMATION to match spacing, color, and motion guidelines. Paths are rooted at the shared packages/twenty-ui design-system package.',
    },
    {
      name: 'Reusable UI components',
      summary:
        'Barrel exports across display, input, navigation, and feedback include Avatars/Banners/Icons, Button and form controls, navigation bars/drawers, and loaders/progress indicators.',
      keyFiles: [
        'packages/twenty-ui/src/display/index.ts',
        'packages/twenty-ui/src/input/index.ts',
        'packages/twenty-ui/src/navigation/index.ts',
        'packages/twenty-ui/src/feedback/index.ts',
      ],
      integrationNotes:
        'Import from the top-level barrels (e.g., import { Avatar, IconsProvider } from "twenty-ui/display") to reuse the visual system without reimplementing primitives. These paths live inside packages/twenty-ui.',
    },
  ],
};

export const providerStackExample = `<RecoilRoot>
  <AppErrorBoundary resetOnLocationChange={false} FallbackComponent={AppRootErrorFallback}>
    <I18nProvider i18n={i18n}>
      <RecoilDebugObserverEffect />
      <ApolloDevLogEffect />
      <SnackBarComponentInstanceContext.Provider value={{ instanceId: 'snack-bar-manager' }}>
        <IconsProvider>
          <ExceptionHandlerProvider>
            <HelmetProvider>
              <ClickOutsideListenerContext.Provider value={{ excludedClickOutsideId: undefined }}>
                <AppRouter />
              </ClickOutsideListenerContext.Provider>
            </HelmetProvider>
          </ExceptionHandlerProvider>
        </IconsProvider>
      </SnackBarComponentInstanceContext.Provider>
    </I18nProvider>
  </AppErrorBoundary>
</RecoilRoot>`;

export const designSystemImportsExample =
  "import { ThemeContextProvider, THEME_LIGHT, THEME_DARK } from 'twenty-ui/theme';\nimport { Avatar, IconsProvider } from 'twenty-ui/display';\nimport { Button } from 'twenty-ui/input';\nimport { NavigationBar } from 'twenty-ui/navigation';\nimport { Loader } from 'twenty-ui/feedback';";
