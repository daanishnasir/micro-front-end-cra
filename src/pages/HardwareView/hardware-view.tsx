import * as React from "react";
import axios from "axios";
import "./styles.css";

export const hardwareViewRoute = new URLPattern({
  pathname: `/admin/current-org/hardware/test`,
  // pathname: `/admin/current-org/hardware/:uuid`,
});

interface Props {
  token: string;
}

const HardwareView: React.FC<Props> = ({ token }): JSX.Element => {
  const [hardwareDetails, setHardwareDetails] = React.useState<any>({});
  const [errorMsg, setErrorMsg] = React.useState<boolean>(false);

  const getCurrentHardwareData = async (uuid: string, token: string) => {
    try {
      const response = await axios.get(
        // `https://int-central.resi.io/internal/api/v1/hardwareunits/775c768c-42da-4f92-8298-d2421f04f0ca`,
        `https://int-central.resi.io/internal/api/v1/hardwareunits/${uuid}`,
        {
          headers: {
            authorization: `X-Bearer ${token}`,
          },
        }
      );

      setHardwareDetails(response.data);
      setErrorMsg(false);
    } catch (error) {
      console.log(error);
      setErrorMsg(true);
    }
  };

  React.useEffect(() => {
    getCurrentHardwareData("21495140-d02c-4a03-891d-c31e155e9c70", token);
  }, [token]);

  React.useEffect(() => {
    console.log({ hardwareDetails });
  }, [hardwareDetails]);

  return (
    <div className="main">
      {errorMsg && (
        <div className="error-message">
          An error occured, the requested Hardware Details were not found.
        </div>
      )}
      <div className="header">
        <div style={{ paddingLeft: "20px" }}>
          {hardwareDetails.serial || "null"}
        </div>
      </div>
      <div className="panel">
        <div className="panel-text">
          <div className="panel-title">Details</div>
          <div className="fields-row">
            <div className="field-row-item">
              <div className="field-title">Serial Number</div>
              <div className="field-data">{hardwareDetails.serial || "-"}</div>
            </div>
            <div className="field-row-item">
              <div className="field-title">Model</div>
              <div className="field-data">{hardwareDetails.modelId || "-"}</div>
            </div>
          </div>
          <div className="fields-row">
            <div className="field-row-item">
              <div className="field-title">Status</div>
              <div className="field-data">
                {hardwareDetails.statusId || "-"}
              </div>
            </div>
            <div className="field-row-item">
              <div className="field-title">Location</div>
              <div className="field-data">
                {hardwareDetails.locationId || "-"}
              </div>
            </div>
          </div>
          <div className="fields-row">
            <div className="field-row-item">
              <div className="field-title">Owner</div>
              <div className="field-data">
                {hardwareDetails.customOwnerId || "-"}
              </div>
            </div>
            <div className="field-row-item">
              <div className="field-title">Build Date</div>
              <div className="field-data">
                {hardwareDetails.buildDate || "-"}
              </div>
            </div>
          </div>
          <div className="fields-row">
            <div className="field-row-item">
              <div className="field-title">Notes</div>
              <div className="field-data">{hardwareDetails.notes || "-"}</div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ paddingTop: "50px" }}>
        <div className="panel">
          <div className="panel-text">
            <div className="panel-title">Sale Info</div>
            <div className="fields-row">
              <div className="field-row-item">
                <div className="field-title">Lat invoice</div>
                <div className="field-data">
                  {hardwareDetails.la1SaleInvoice ?? "-"}
                </div>
              </div>
              <div className="field-row-item">
                <div className="field-title">Vendor Invoice</div>
                <div className="field-data">
                  {hardwareDetails.vendorSaleInvoice ?? "-"}
                </div>
              </div>
            </div>
            <div className="fields-row">
              <div className="field-row-item">
                <div className="field-title">Sale Date</div>
                <div className="field-data">
                  {hardwareDetails.saleDate ?? "-"}
                </div>
              </div>
              <div className="field-row-item">
                <div className="field-title">Warranty Length</div>
                <div className="field-data">
                  {hardwareDetails.warrantyLength ?? "-"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HardwareView;
