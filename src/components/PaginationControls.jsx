// PaginationControls.jsx

import {
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

function PaginationControls({

  page,

  totalPages,

  totalRecords,

  limit,

  onPageChange,

}) {

  if (totalRecords === 0)
    return null;

  const getPageNumbers =
    () => {

      const pages = [];

      let start =
        Math.max(
          1,
          page - 2
        );

      let end =
        Math.min(
          totalPages,
          start + 4
        );

      if (end - start < 4) {

        start = Math.max(
          1,
          end - 4
        );
      }

      for (
        let i = start;
        i <= end;
        i++
      ) {
        pages.push(i);
      }

      return pages;
    };

  const startIndex =
    (page - 1) * limit;

  const btnBase = {
    minWidth: 36,
    height: 36,
    padding: "0 10px",
    borderRadius: 8,
    border:
      "1px solid rgba(212,175,55,0.25)",
    background:
      "rgba(255,255,255,0.04)",
    color: "#94a3b8",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent:
      "center",
  };

  const btnActive = {
    ...btnBase,
    background:
      "#d4af37",
    border:
      "1px solid #d4af37",
    color: "#0f172a",
    fontWeight: 700,
  };

  const btnDisabled = {
    ...btnBase,
    opacity: 0.3,
    cursor:
      "not-allowed",
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent:
          "space-between",
        flexWrap: "wrap",
        gap: 12,
        marginTop: 16,
        padding: "12px 4px",
      }}
    >
      <span
        style={{
          color: "#94a3b8",
          fontSize: 13,
          fontWeight: 500,
        }}
      >
        Showing{" "}
        {startIndex + 1}
        –
        {Math.min(
          startIndex + limit,
          totalRecords
        )}{" "}
        of {totalRecords} records
      </span>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        {/* FIRST */}
        <button
          onClick={() =>
            onPageChange(1)
          }
          disabled={
            page === 1
          }
          style={
            page === 1
              ? btnDisabled
              : btnBase
          }
        >
          «
        </button>

        {/* PREV */}
        <button
          onClick={() =>
            onPageChange(
              page - 1
            )
          }
          disabled={
            page === 1
          }
          style={
            page === 1
              ? btnDisabled
              : btnBase
          }
        >
          <FaChevronLeft />
        </button>

        {/* PAGE NUMBERS */}
        {getPageNumbers().map(
          (p) => (
            <button
              key={p}
              onClick={() =>
                onPageChange(
                  p
                )
              }
              style={
                p === page
                  ? btnActive
                  : btnBase
              }
            >
              {p}
            </button>
          )
        )}

        {/* NEXT */}
        <button
          onClick={() =>
            onPageChange(
              page + 1
            )
          }
          disabled={
            page ===
            totalPages
          }
          style={
            page ===
            totalPages
              ? btnDisabled
              : btnBase
          }
        >
          <FaChevronRight />
        </button>

        {/* LAST */}
        <button
          onClick={() =>
            onPageChange(
              totalPages
            )
          }
          disabled={
            page ===
            totalPages
          }
          style={
            page ===
            totalPages
              ? btnDisabled
              : btnBase
          }
        >
          »
        </button>
      </div>
    </div>
  );
}

export default PaginationControls;