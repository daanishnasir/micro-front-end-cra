import { hardwareListRoute } from "./pages/HardwareList";
import ListViewHardware from "./pages/HardwareList/hardware-list";
import HardwareView, {
  hardwareViewRoute,
} from "./pages/HardwareView/hardware-view";

type Props = {
  authToken: string;
  navigate: (route: string) => void;
};

const showHardwareListView = Boolean(
  hardwareListRoute.test(window.location.href) &&
    (hardwareListRoute.exec(window.location.href) as URLPatternResult).pathname
      .input === hardwareListRoute.pathname
);

const showHardwareDetailView = Boolean(
  hardwareViewRoute.test(window.location.href) &&
    (hardwareViewRoute.exec(window.location.href) as URLPatternResult).pathname
      .input === hardwareViewRoute.pathname
);

const Router: React.FC<Props> = ({ navigate, authToken }) => {
  if (showHardwareListView)
    return <ListViewHardware navigate={navigate} authToken={authToken} />;
  if (showHardwareDetailView) return <HardwareView token={authToken} />;
  return <div>Not Found</div>;
};

export default Router;
