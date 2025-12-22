import { useMemo, useState } from "react";
import ProductsNavbar from "../components/ProductsNavbar";
import ProductsFooter from "../components/ProductsFooter";
import ProductsTable, {
//   BaseProduct,
} from "../components/ProductsTable";
import { TSHIRTS } from "../data/tshirts.data";

const CategoryProducts = () => {
  const [data, setData] = useState(TSHIRTS);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(10);

  const filtered = useMemo(() => {
    return data.filter((p) =>
      `${p.name} ${p.size} ${p.sku}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [data, search]);

  const totalPages = Math.ceil(filtered.length / rows);
  const paginated = filtered.slice(
    (page - 1) * rows,
    page * rows
  );

  return (
    <div className="bg-white rounded-xl border p-6 space-y-5">
      <ProductsNavbar
        breadcrumbs={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Products", path: "/products" },
          { label: "Blue Jersey T-Shirt" },
        ]}
      />

      <input
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        placeholder="Search by size / SKU"
        className="border rounded-lg px-4 py-2 text-sm w-full max-w-sm"
      />

      <ProductsTable
        data={paginated}
        mode="CATEGORY"
        onDelete={(id) =>
          setData((prev) => prev.filter((p) => p.id !== id))
        }
      />

      <ProductsFooter
        page={page}
        totalPages={totalPages}
        rowsPerPage={rows}
        onPageChange={setPage}
        onRowsChange={(n) => {
          setRows(n);
          setPage(1);
        }}
      />
    </div>
  );
};

export default CategoryProducts;
