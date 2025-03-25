import { useMemo, useState } from "react";
import {
  FinancialRecord,
  useFinancialRecords,
} from "../../contexts/financial-record-context";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  ColumnDef,
  CellContext
} from "@tanstack/react-table";

interface EditableCellProps<TData extends object, TValue> {
  getValue: () => TValue;
  row: { index: number, original: FinancialRecord };
  column: { id: string };
  table: { options: { meta?: { updateRecord?: (rowIndex: number, columnId: string, value: any) => void } } };
  editable: boolean;
}

const EditableCell = <TData extends object, TValue>({
  getValue,
  row,
  column,
  table,
  editable,
}: EditableCellProps<TData, TValue>) => {
  const initialValue = getValue() as string;
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);

  const onBlur = () => {
    setIsEditing(false);
    table.options.meta?.updateRecord?.(row.index, column.id, value);
  };

  return (
    <div
      onClick={() => editable && setIsEditing(true)}
      style={{ cursor: editable ? "pointer" : "default" }}
    >
      {isEditing ? (
        <input
          value={value as string}
          onChange={(e) => setValue(e.target.value as unknown as TValue)}
          autoFocus
          onBlur={onBlur}
          style={{ width: "100%" }}
        />
      ) : typeof value === "string" ? (
        value
      ) : (
        value?.toString() || ""
      )}
    </div>
  );
};

export const FinancialRecordList = () => {
  const { records, updateRecord, deleteRecord } = useFinancialRecords();
  const columnHelper = createColumnHelper<FinancialRecord>();

  const updateCellRecord = (rowIndex: number, columnId: string, value: any) => {
    const id = records[rowIndex]?._id;
    updateRecord(id ?? "", { ...records[rowIndex], [columnId]: value });
  };

  const columns = useMemo<ColumnDef<FinancialRecord>[]>(
    () => [
      columnHelper.accessor("description", {
        header: "Description",
        cell: (info) => (
          <EditableCell
            {...info}
            editable={true}
          />
        ),
      }),
      columnHelper.accessor("amount", {
        header: "Amount",
        cell: (info) => (
          <EditableCell
            {...info}
            editable={true}
          />
        ),
      }),
      columnHelper.accessor("category", {
        header: "Category",
        cell: (info) => (
          <EditableCell
            {...info}
            editable={true}
          />
        ),
      }),
      columnHelper.accessor("paymentMethod", {
        header: "Payment Method",
        cell: (info) => (
          <EditableCell
            {...info}
            editable={true}
          />
        ),
      }),
      columnHelper.accessor("date", {
        header: "Date",
        cell: (info) => (
          <EditableCell
            {...info}
            editable={false}
          />
        ),
      }),
      columnHelper.display({
        id: "delete",
        header: "Delete",
        cell: (info) => (
          <button
            onClick={() => deleteRecord(info.row.original._id ?? "")}
            className="button"
          >
            Delete
          </button>
        ),
      }),
    ],
    [records, deleteRecord]
  );

  const table = useReactTable({
    data: records,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      updateRecord: updateCellRecord,
    },
  });

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};