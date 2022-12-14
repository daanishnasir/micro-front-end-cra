import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { createBrowserHistory } from "@remix-run/router";

(window as any).renderListViewHardware = (
  containerId: string,
  props: { navigate?: (route: string) => void }
) => {
  let navigate = props?.navigate ? props.navigate : undefined;
  if (!navigate) {
    const history = createBrowserHistory();
    navigate = history.push;
  }
  const root = ReactDOM.createRoot(
    document.getElementById(containerId) as HTMLElement
  );
  root.render(<App navigate={navigate} />);
};

(window as any).unmountListViewHardware = (containerId: string) => {
  const root = ReactDOM.createRoot(
    document.getElementById(containerId) as HTMLElement
  );
  root.unmount();
};
