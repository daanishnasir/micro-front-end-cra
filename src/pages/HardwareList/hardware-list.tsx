import * as React from "react";
import "./styles.css";
import {
  SearchOutlined,
  PlusOutlined,
  DownOutlined,
  UpOutlined,
} from "@ant-design/icons";
import type { Option } from "@resi-media/resi-ui";
import { css } from "@emotion/react";
import { Draft, Inline, Stack } from "@resi-media/resi-ui";
import { produce } from "immer";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { SearchList } from "../../components/SearchList";
import "urlpattern-polyfill";

export const routePattern = new URLPattern({
  pathname: "/admin/current-org/hardware",
});

type SearchForm = {
  buildDateEnd: string;
  buildDateStart: string;
  locationId: string;
  modelId: string;
  serialNumber: string;
  statusId: string;
  type: string;
  vendorSaleInvoice: string;
};

export type HardwareUnit = {
  buildDate: string;
  customerOwnerId: string;
  la1SaleInvoice: string | null;
  locationId: string;
  modelId: string;
  notes: string | null;
  saleDate: string | null;
  serial: string;
  statusId: string;
  type: string;
  uuid: string;
  vendorSaleInvoice: string | null;
  warrantyLength: number;
};

interface HardwareState {
  hardwareUnits: HardwareUnit[];
  isMoreFilters: boolean;
}

type Props = {
  authToken: string;
  navigate: (route: string) => void;
};

const ListViewHardware: React.FC<Props> = ({ navigate, authToken }) => {
  const [hardwareState, setHardwareState] = React.useState<HardwareState>({
    hardwareUnits: [],
    isMoreFilters: false,
  });
  const [allModelOptions, setAllModelOptions] = React.useState<Option[]>([]);
  const [allStatusOptions, setAllStatusOptions] = React.useState<Option[]>([]);
  const [allLocationOptions, setAllLocationOptions] = React.useState<Option[]>(
    []
  );

  React.useEffect(() => {
    fetch("https://int-central.resi.io/internal/api/v1/hardwaremodels", {
      headers: {
        authorization: `X-Bearer ${authToken}`,
      },
    })
      .then((res) => res.json())
      .then((json) => {
        setAllModelOptions(
          json.map((item: { name: string; uuid: string }) => ({
            label: item.name,
            value: item.uuid,
          }))
        );
      })
      .catch((err) => console.error(err));

    fetch("https://int-central.resi.io/internal/api/v1//hardwarestatuses", {
      headers: {
        authorization: `X-Bearer ${authToken}`,
      },
    })
      .then((res) => res.json())
      .then((json) => {
        setAllStatusOptions(
          json.map((item: { name: string; uuid: string }) => ({
            label: item.name,
            value: item.uuid,
          }))
        );
      })
      .catch((err) => console.error(err));

    fetch("https://int-central.resi.io/internal/api/v1//hardwarelocations", {
      headers: {
        authorization: `X-Bearer ${authToken}`,
      },
    })
      .then((res) => res.json())
      .then((json) => {
        setAllLocationOptions(
          json.map((item: { name: string; uuid: string }) => ({
            label: item.name,
            value: item.uuid,
          }))
        );
      })
      .catch((err) => console.error(err));
  }, []);

  React.useEffect(() => {
    if (
      allModelOptions.length === 0 ||
      allStatusOptions.length === 0 ||
      allLocationOptions.length === 0
    )
      return;
    fetch("https://int-central.resi.io/internal/api/v1/hardwareunits", {
      headers: {
        authorization: `X-Bearer ${authToken}`,
      },
    })
      .then((res) => res.json())
      .then((json) =>
        setHardwareState(
          produce((draft) => {
            draft.hardwareUnits = json;
          })
        )
      )
      .catch((err) => console.error(err));
  }, [allModelOptions, allStatusOptions, allLocationOptions]);

  const initialEditState: SearchForm = {
    buildDateEnd: "",
    buildDateStart: "",
    locationId: "",
    modelId: "",
    serialNumber: "",
    statusId: "",
    type: "",
    vendorSaleInvoice: "",
  };

  const methods = useForm<SearchForm>({
    defaultValues: initialEditState,
    mode: "all",
  });

  const { control, getValues, handleSubmit, setValue } = methods;

  const hardwareTypeOptions: Option[] = React.useMemo(
    () => [
      { label: "All Hardware", value: "" },
      { label: "Encoder", value: "encoder" },
      { label: "Decoder", value: "decoder" },
    ],
    []
  );

  const handleFormSubmit = async (data: SearchForm) => {
    const filteredSerailUnits = hardwareState.hardwareUnits.filter((unit) =>
      data.serialNumber.includes(unit.serial)
    );

    const filteredStatusUnits = hardwareState.hardwareUnits.filter(
      (unit) => unit.statusId === data.statusId
    );

    if (Boolean(data.serialNumber)) {
      setHardwareState(
        produce((draft) => {
          draft.hardwareUnits = filteredSerailUnits;
        })
      );
    } else if (Boolean(data.statusId)) {
      setHardwareState(
        produce((draft) => {
          draft.hardwareUnits = filteredStatusUnits;
        })
      );
    } else {
      setHardwareState(
        produce((draft) => {
          draft.hardwareUnits = [];
        })
      );
    }
  };

  const handleClick: React.ReactEventHandler<Element> = (e) => {
    e.preventDefault();
    navigate("/admin/current-org/hardware/create");
  };

  return (
    <div data-testid="hardware-search-page" className="hardware-page">
      <FormProvider {...methods}>
        <form id="search-hardware" onSubmit={handleSubmit(handleFormSubmit)}>
          <header className="header">
            <h3 className="titleIcon-container">
              <SearchOutlined
                style={{ fontSize: "32px", marginRight: "1rem" }}
              />
              <span className="hardware-search-title"> Hardware Search </span>
            </h3>

            {/* ADD DECODER BUTTON IS RIGHT HERE!!!!! */}

            <Draft.Button
              data-testid="add-preset-button"
              label="Add Decoder"
              startNode={<PlusOutlined />}
              onClick={handleClick}
            />
          </header>

          <div className="hardware-search-list-content">
            <Stack scale="xl">
              <Draft.Card>
                <Draft.CardSection>
                  <Inline scale="m">
                    <Controller
                      control={control}
                      name="serialNumber"
                      render={({
                        field: { name, onBlur, onChange, value },
                        fieldState: { error, invalid, isDirty, isTouched },
                        formState: { isSubmitted },
                      }) => {
                        return (
                          <Draft.FormField
                            error={error?.message}
                            fieldLabel="Serial Number"
                            htmlFor="serialNumber"
                            touched={isTouched || isSubmitted || isDirty}
                          >
                            <Draft.TextInput
                              data-testid="serial-number-edit"
                              hasError={invalid && Boolean(error?.message)}
                              id="serialNumber"
                              name={name}
                              onBlur={onBlur}
                              onChange={onChange}
                              value={value}
                            />
                          </Draft.FormField>
                        );
                      }}
                    />

                    <Controller
                      control={control}
                      name="vendorSaleInvoice"
                      render={({
                        field: { name, onBlur, onChange, value },
                        fieldState: { error, invalid, isDirty, isTouched },
                        formState: { isSubmitted },
                      }) => {
                        return (
                          <Draft.FormField
                            error={error?.message}
                            fieldLabel="Vendor Invoice #"
                            htmlFor="vendorSaleInvoice"
                            touched={isTouched || isSubmitted || isDirty}
                          >
                            <Draft.TextInput
                              data-testid="vendor-invoice-edit"
                              hasError={invalid && Boolean(error?.message)}
                              id="vendorSaleInvoice"
                              name={name}
                              onBlur={onBlur}
                              onChange={onChange}
                              value={value}
                            />
                          </Draft.FormField>
                        );
                      }}
                    />
                  </Inline>

                  {/* More Filters Block  */}
                  {hardwareState.isMoreFilters && (
                    <div data-testid="more-filters-section">
                      <Inline
                        marginTop="l"
                        scale="m"
                        className="Test test"
                        style={{ textAlign: "start" }}
                      >
                        <Controller
                          name="type"
                          render={({
                            field: { name, onBlur, value },
                            fieldState: { error, isTouched },
                            formState: { isSubmitted },
                          }) => {
                            return (
                              <Draft.FormField
                                error={error?.message}
                                fieldLabel="Types"
                                htmlFor="type"
                                touched={isTouched || isSubmitted}
                              >
                                <Draft.Select
                                  customCss={{
                                    container: css`
                                      display: "flex";
                                    `,
                                  }}
                                  appendToBody
                                  dataTestId="type-select"
                                  hasError={Boolean(error)}
                                  inputId="type"
                                  name={name}
                                  onBlur={onBlur}
                                  onChange={(option) => {
                                    if (option) {
                                      setValue("type", option.value);
                                    }
                                  }}
                                  options={hardwareTypeOptions}
                                  value={hardwareTypeOptions.find(
                                    (opt) => opt.value === value
                                  )}
                                />
                              </Draft.FormField>
                            );
                          }}
                        />
                        <Controller
                          name="modelId"
                          render={({
                            field: { name, onBlur, value },
                            fieldState: { error, isTouched },
                            formState: { isSubmitted },
                          }) => {
                            return (
                              <Draft.FormField
                                error={error?.message}
                                fieldLabel="Models"
                                htmlFor="modelId"
                                touched={isTouched || isSubmitted}
                              >
                                <Draft.Select
                                  appendToBody
                                  customCss={{
                                    container: css`
                                      display: "flex";
                                    `,
                                  }}
                                  dataTestId="model-select"
                                  hasError={Boolean(error)}
                                  inputId="modelId"
                                  name={name}
                                  onBlur={onBlur}
                                  onChange={(option) => {
                                    if (option) {
                                      setValue("modelId", option.value);
                                    }
                                  }}
                                  options={allModelOptions}
                                  value={allModelOptions.find(
                                    (opt) => opt.value === value
                                  )}
                                />
                              </Draft.FormField>
                            );
                          }}
                        />

                        <Controller
                          name="locationId"
                          render={({
                            field: { name, onBlur, value },
                            fieldState: { error, isTouched },
                            formState: { isSubmitted },
                          }) => {
                            return (
                              <Draft.FormField
                                error={error?.message}
                                fieldLabel="Location"
                                htmlFor="locationId"
                                touched={isTouched || isSubmitted}
                              >
                                <Draft.Select
                                  appendToBody
                                  dataTestId="location-select"
                                  hasError={Boolean(error)}
                                  inputId="locationId"
                                  name={name}
                                  onBlur={onBlur}
                                  onChange={(option) => {
                                    if (option) {
                                      setValue("locationId", option.value);
                                    }
                                  }}
                                  options={allLocationOptions}
                                  value={allLocationOptions.find(
                                    (opt) => opt.value === value
                                  )}
                                />
                              </Draft.FormField>
                            );
                          }}
                        />
                        <Controller
                          name="statusId"
                          render={({
                            field: { name, onBlur, value },
                            fieldState: { error, isTouched },
                            formState: { isSubmitted },
                          }) => {
                            return (
                              <Draft.FormField
                                error={error?.message}
                                fieldLabel={"Status"}
                                htmlFor="statusId"
                                touched={isTouched || isSubmitted}
                              >
                                <Draft.Select
                                  appendToBody
                                  dataTestId="status-select"
                                  hasError={Boolean(error)}
                                  inputId="statusId"
                                  name={name}
                                  onBlur={onBlur}
                                  onChange={(option) => {
                                    if (option) {
                                      setValue("statusId", option.value);
                                    }
                                  }}
                                  options={allStatusOptions}
                                  value={allStatusOptions.find(
                                    (opt) => opt.value === value
                                  )}
                                />
                              </Draft.FormField>
                            );
                          }}
                        />
                      </Inline>
                    </div>
                  )}

                  <Inline justifyContent="space-between" marginTop="xl">
                    <Draft.Button
                      data-testid="more-filters-button"
                      label={
                        !hardwareState.isMoreFilters
                          ? "More Filters"
                          : "Less Filters"
                      }
                      onClick={() => {
                        setHardwareState(
                          produce((draft) => {
                            draft.isMoreFilters = !hardwareState.isMoreFilters;
                          })
                        );
                      }}
                      startNode={
                        !hardwareState.isMoreFilters ? (
                          <DownOutlined />
                        ) : (
                          <UpOutlined />
                        )
                      }
                      variant="outlined"
                    />

                    <Draft.Button
                      data-testid="search-button"
                      label="Search"
                      startNode={<SearchOutlined />}
                      type="submit"
                    />
                  </Inline>
                </Draft.CardSection>
              </Draft.Card>
            </Stack>

            <SearchList
              handleFormSubmit={() => handleFormSubmit(getValues())}
              hardwareLocations={allLocationOptions}
              hardwareModels={allModelOptions}
              hardwareStatuses={allStatusOptions}
              hardwareUnits={hardwareState.hardwareUnits}
              navigate={navigate}
            />
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default ListViewHardware;
