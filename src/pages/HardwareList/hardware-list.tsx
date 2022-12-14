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
import { hardwareUnits } from "../../assets/hardware-units";
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

const initialHardwareState = {
  hardwareUnits: hardwareUnits,
  isMoreFilters: false,
};

const defaultUnits = [...hardwareUnits];

type Props = {
  navigate: (route: string) => void;
};

const ListViewHardware: React.FC<Props> = ({ navigate }) => {
  const mounted = React.useRef(false);
  const [state, setState] = React.useState<HardwareState>(initialHardwareState);

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

  const allModelOptions: Option[] = React.useMemo(() => {
    return [
      {
        value: "",
        label: "All Models",
      },
      {
        value: "D2100",
        label: "D2100",
      },
      {
        value: "E1210",
        label: "E1210",
      },
      {
        value: "E4300",
        label: "E4300",
      },
      {
        value: "E2211-2",
        label: "E2211-2",
      },
    ];
  }, []);

  const allLocationOptions: Option[] = React.useMemo(() => {
    return [
      {
        value: "",
        label: "All Locations",
      },
      {
        value: "Plano Office",
        label: "Plano Office",
      },
      {
        value: "Twisted Transistor",
        label: "Twisted Transistor",
      },
    ];
  }, []);

  const allStatusOptions: Option[] = React.useMemo(() => {
    return [
      {
        value: "",
        label: "All Statuses",
      },
      {
        value: "Customer Owned",
        label: "Customer Owned",
      },
      {
        value: "Dealer Owned",
        label: "Dealer Owned",
      },
    ];
  }, []);

  const hardwareTypeOptions: Option[] = React.useMemo(
    () => [
      { label: "All Hardware", value: "" },
      { label: "Encoder", value: "encoder" },
      { label: "Decoder", value: "decoder" },
    ],
    []
  );

  const handleFormSubmit = async (data: SearchForm) => {
    const filters = {
      ...(data.type && { type: data.type }),
      ...(data.modelId && { modelId: data.modelId }),
      ...(data.serialNumber && { serial: data.serialNumber }),
      ...(data.vendorSaleInvoice && {
        vendorSaleInvoice: data.vendorSaleInvoice,
      }),
      ...(data.locationId && { locationId: data.locationId }),
      ...(data.statusId && { statusId: data.statusId }),
    };

    const filteredSerailUnits = defaultUnits.filter((unit) =>
      data.serialNumber.includes(unit.serial)
    );

    const filteredStatusUnits = defaultUnits.filter(
      (unit) => unit.statusId === data.statusId
    );

    if (Boolean(data.serialNumber)) {
      setState(
        produce((draft) => {
          draft.hardwareUnits = filteredSerailUnits;
        })
      );
    } else if (Boolean(data.statusId)) {
      setState(
        produce((draft) => {
          draft.hardwareUnits = filteredStatusUnits;
        })
      );
    } else {
      setState(
        produce((draft) => {
          draft.hardwareUnits = defaultUnits;
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
                  {state.isMoreFilters && (
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
                        !state.isMoreFilters ? "More Filters" : "Less Filters"
                      }
                      onClick={() => {
                        setState(
                          produce((draft) => {
                            draft.isMoreFilters = !state.isMoreFilters;
                          })
                        );
                      }}
                      startNode={
                        !state.isMoreFilters ? <DownOutlined /> : <UpOutlined />
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
              hardwareUnits={state.hardwareUnits}
              navigate={navigate}
            />
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default ListViewHardware;
