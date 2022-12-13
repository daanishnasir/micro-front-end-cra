import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

(window as any).renderListViewHardware = (
  containerId: string,
  { studioHost }: { studioHost: string } = {
    studioHost: "http://localhost:5002",
  }
) => {
  const root = ReactDOM.createRoot(
    document.getElementById(containerId) as HTMLElement
  );
  root.render(<App studioHost={studioHost} />);
};

(window as any).unmountListViewHardware = (containerId: string) => {
  const root = ReactDOM.createRoot(
    document.getElementById(containerId) as HTMLElement
  );
  root.unmount();
};
