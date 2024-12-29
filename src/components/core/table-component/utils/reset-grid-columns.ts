import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";

export default function resetGrid(ref: any, initialColumnDefs: React.RefObject<ColDef<any, any>[]>) {
    if (ref?.current && ref?.current.api) {
      ref.current.api.resetColumnState();
      if (initialColumnDefs.current) {
        const resetColumns = ref.current.api.applyColumnState({
          state: initialColumnDefs.current,
          applyOrder: true,
        });
        return resetColumns;
      }
    }
  }