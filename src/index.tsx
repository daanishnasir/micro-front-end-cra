import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

(window as any).renderListViewHardware = (
  containerId: string,
  props: { studioHost: string }
) => {
  const root = ReactDOM.createRoot(
    document.getElementById(containerId) as HTMLElement
  );
  root.render(<App />);
};

(window as any).unmountListViewHardware = (containerId: string) => {
  const root = ReactDOM.createRoot(
    document.getElementById(containerId) as HTMLElement
  );
  root.unmount();
};
