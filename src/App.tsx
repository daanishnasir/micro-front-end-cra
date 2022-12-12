import "./App.css";
import {
  theme,
  BreakpointProvider,
  ThemeProvider,
  BreakpointConsumer,
} from "@resi-media/resi-ui";
import ListViewHardware from "./pages/HardwareList/hardware-list";

function App() {
  return (
    <BreakpointProvider queries={theme.mq}>
      <BreakpointConsumer>
        {() => {
          const isDesktopPage = !document.querySelector(
            "meta[content='width=device-width, initial-scale=1.0']"
          );
          return (
            <ThemeProvider
              theme={{
                ...theme,
                mq: {
                  xs: isDesktopPage ? "@media all" : theme.mq.xs,
                  sm: isDesktopPage ? "@media all" : theme.mq.sm,
                  md: isDesktopPage ? "@media all" : theme.mq.md,
                  lg: isDesktopPage ? "@media all" : theme.mq.lg,
                  xl: isDesktopPage ? "@media all" : theme.mq.xl,
                  xxl: isDesktopPage ? "@media all" : theme.mq.xxl,
                },
              }}
            >
              <div className="App">
                <ListViewHardware />
              </div>
            </ThemeProvider>
          );
        }}
      </BreakpointConsumer>
    </BreakpointProvider>
  );
}

export default App;
