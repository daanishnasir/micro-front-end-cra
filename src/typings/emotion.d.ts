import type { Theme as ResiUITheme } from "@resi-media/resi-ui";

declare module "@emotion/react" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface Theme extends ResiUITheme {}
}

declare const __DEV__: boolean;
