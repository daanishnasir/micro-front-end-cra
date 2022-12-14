import { hardwareListRoute } from "./pages/HardwareList";
import ListViewHardware from "./pages/HardwareList/hardware-list";

type Props = {
  authToken: string;
  navigate: (route: string) => void;
};

const Router: React.FC<Props> = ({ navigate, authToken }) => {
  if (
    hardwareListRoute.test(window.location.href) &&
    (hardwareListRoute.exec(window.location.href) as URLPatternResult).pathname
      .input === hardwareListRoute.pathname
  )
    return <ListViewHardware navigate={navigate} authToken={authToken} />;

  return <div>Not Found</div>;
};

export default Router;
