import type * as React from "react";
import type { Theme } from "@emotion/react";
import styled from "@emotion/styled";

const getPadding = (size: string, theme: Theme) => {
  switch (size) {
    case "xs":
      return theme.spacing.xs;
    case "s":
      return theme.spacing.s;
    case "m":
      return theme.spacing.m;
    case "l":
      return theme.spacing.l;
    case "xl":
      return theme.spacing.xl;
    default:
      return theme.spacing.m;
  }
};

export const ListTable = styled.div`
  ${(props) => `
  width: 100%;
  box-sizing: border-box;
  border-collapse: collapse;
  font-size: 16px;
  box-shadow: ${props.theme.shadows[1]};
`}
`;

export const ListTableHeader = styled.div<{ isSticky?: boolean }>`
  ${(props) => `
    background-color: ${props.theme.palette.background.table};
    color: ${props.theme.palette.text.primary};
    text-transform: uppercase;
    text-align: left;
    padding: ${props.theme.spacing.m} ${props.theme.spacing.l};
    ${
      props.isSticky &&
      `
      position: sticky;
      top: 0;
      box-shadow: inset 0 1px 0 ${props.theme.palette.divider};
    `
    }
  `}
`;

export const ListTableData = styled.div<{
  height?: React.CSSProperties["height"];
  rowSpacing: string;
}>`
  ${({ height, rowSpacing, theme }) => `
  padding: ${theme.spacing.m};
  &:last-of-type {
    padding-right: ${theme.spacing.xs};
  }
  vertical-align: middle;
  ${height && `height: ${height};`}
  ${theme.mq.lg} {
    padding: ${theme.spacing.m};
    &:last-of-type {
      padding-right: ${theme.spacing.m};
    }
  }
  ${theme.mq.xl} {
    padding: ${getPadding(rowSpacing, theme)} ${theme.spacing.l};
    &:last-of-type {
      padding-right: ${theme.spacing.l};
    }
  }
  `}
`;

export const TableContainer = styled.div`
  ${(props) => `
  padding: ${props.theme.spacing.l} ${props.theme.spacing.xl};
  background-color: ${props.theme.palette.background.paper};
  box-sizing: border-box;
  width: 100%;
`}
`;

export const SubComponentWrapper = styled.div<{ isExpanded: boolean }>`
  max-height: ${({ isExpanded }) => (isExpanded ? "100%" : "0")};
  transform: ${({ isExpanded }) =>
    isExpanded ? "scaleY(1) translateY(0px)" : "scaleY(0) translateY(-100px)"};
  transition: transform 50ms;
`;
