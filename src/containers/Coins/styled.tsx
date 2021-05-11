import styled from "styled-components";

const Table = styled.table`
  border-collapse: collapse;
`;

const TableHeaderRow = styled.tr`
  border: 0px;
  border-top: 1px solid ${(p) => p.theme.colors.secondary};
  border-bottom: 2px solid ${(p) => p.theme.colors.secondary};
  color: dimgrey;

  th {
    padding: 0.5rem 0;
  }
`;

const TableBodyRow = styled.tr`
  border: 0px;
  border-top: 1px solid ${(p) => p.theme.colors.secondary};
  border-bottom: 1px solid ${(p) => p.theme.colors.secondary};
  color: ${(p) => p.theme.colors.primary};
`;

const TableData = styled.td<{ color?: string }>`
  color: ${(p) => p.color || "dimgrey"};
  padding: 1.25rem 0;
  vertical-align: middle;

  * {
    vertical-align: middle;
    display: inline-block;
    padding-right: 0.5rem;
  }
`;

export const SC = {
  Table,
  TableHeaderRow,
  TableBodyRow,
  TableData,
};
