import * as React from "react";
import { Stack, Text } from "@resi-media/resi-ui";
import type { Option } from "@resi-media/resi-ui";
import type { ResiColumn } from "react-table";
import { useSortBy } from "react-table";
import { HardwareUnit } from "../../pages/HardwareList/hardware-list";
import { TableList } from "../TableList";
import { customerNamesData } from "../../assets/customers";
import { makeKebabCase } from "../../text-casing";

type _Props = {
  handleFormSubmit: () => void;
  hardwareLocations: Option[];
  hardwareModels: Option[];
  hardwareStatuses: Option[];
  hardwareUnits: HardwareUnit[];
  navigate: (route: string) => void;
};

const SearchList = ({
  handleFormSubmit,
  hardwareLocations,
  hardwareModels,
  hardwareStatuses,
  hardwareUnits,
  navigate,
}: _Props): JSX.Element => {
  const statuses = [
    "Needs Repair",
    "Demo-Out",
    "Rental-Out",
    "Internal Use",
    "Stock-New",
  ];
  // const getStatus = () => statuses[Math.floor(Math.random() * statuses.length)];

  const getStatus = (statusId: string) =>
    hardwareStatuses.find((status) => status.value === statusId);

  const getLocation = (locationId: string) =>
    hardwareLocations.find((loc) => loc.value === locationId);

  const getOwner = (ownerId: string) =>
    customerNamesData?.find((org) => org.uuid === ownerId);
  const getModel = (modelId: string) =>
    hardwareModels.find((mod) => mod.value === modelId);

  /* eslint-disable react/display-name */
  const headers: ResiColumn<HardwareUnit>[] = [
    {
      Header: "Serial",
      accessor: "serial",
    },
    {
      Header: "Model",
      accessor: "modelId",
      disableSortBy: true,
      Cell: ({ cellData }) => {
        const model = getModel(cellData.modelId);
        return <Text colorVariant="secondary">{model?.label}</Text>;
      },
    },
    {
      Header: "Owner",
      accessor: "customerOwnerId",
      disableSortBy: true,
      Cell: ({ cellData }) => {
        const owner = getOwner(cellData.customerOwnerId);
        return (
          <Text
            colorVariant="secondary"
            data-testid={`hardware-${makeKebabCase(cellData.customerOwnerId)}`}
          >
            {owner?.name}
          </Text>
        );
      },
    },
    {
      Header: "Status",
      accessor: "statusId",
      disableSortBy: true,
      Cell: ({ cellData }) => {
        const status = getStatus(cellData.statusId);
        return <Text colorVariant="secondary">{status?.label}</Text>;
      },
    },
    {
      Header: "Location",
      accessor: "locationId",
      disableSortBy: true,
      Cell: ({ cellData }) => {
        const location = getLocation(cellData.locationId);
        return <Text colorVariant="secondary">{location?.label}</Text>;
      },
    },
  ];

  return (
    <Stack
      alignItems="flex-end"
      dataTestId="hardware-list"
      marginTop="xl"
      scale="m"
    >
      <TableList<HardwareUnit>
        columnHeaders={headers}
        dataTestId="hardware-table-list"
        pluginHooks={[useSortBy]}
        rowData={hardwareUnits}
        rowSpacing="m"
        onRowClick={(cellData) =>
          navigate(`/admin/current-org/hardware/${cellData.uuid}`)
        }
      />
    </Stack>
  );
};

SearchList.displayName = "SearchList";

export default React.memo(SearchList);
