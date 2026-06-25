import React, { useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllPayouts,
  approvePayout,
  rejectPayout,
} from "../../actions/payoutAction";

const PayoutTable = () => {
  const dispatch = useDispatch();
  const { payouts } = useSelector((state) => state.allPayouts); // 'allPayouts' reducer setup karein

  useEffect(() => {
    dispatch(getAllPayouts());
  }, [dispatch]);

  const columns = [
    { field: "id", headerName: "ID", minWidth: 150, flex: 0.5 },
    { field: "seller", headerName: "Seller", minWidth: 150, flex: 0.4 },
    {
      field: "amount",
      headerName: "Amount",
      type: "number",
      minWidth: 100,
      flex: 0.2,
    },
    { field: "status", headerName: "Status", minWidth: 100, flex: 0.2 },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: (params) =>
        params.row.status === "Pending" && (
          <>
            <button
              onClick={() => dispatch(approvePayout(params.row.id))}
              className={`text-green-600 mr-2 ${params.row.status !== "Pending" ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={params.row.status !== "Pending"}
            >
              Approve
            </button>
            <button
              onClick={() => dispatch(rejectPayout(params.row.id))}
              className="text-red-600"
            >
              Reject
            </button>
          </>
        ),
    },
  ];

  const rows = payouts
    ? payouts.map((p) => ({
        id: p._id,
        seller: p.seller.name,
        amount: p.amount,
        status: p.status,
      }))
    : [];

  return (
    <div className="h-[400px] w-full bg-white">
      <DataGrid rows={rows} columns={columns} />
    </div>
  );
};

export default PayoutTable;
