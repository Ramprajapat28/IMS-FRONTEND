// import { ArrowLeft, Upload } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { useState } from "react";

// /* ----------------------------- TYPES ----------------------------- */
// type ProductForm = {
//   name: string;
//   sku: string;
//   category: string;
//   reorderLevel: string;
//   quantity: string;
//   warehouse: string;
//   room: string;
//   shelf: string;
//   description: string;
//   refundable: boolean;
//   image?: string;
// };

// /* ----------------------------- COMPONENT ----------------------------- */
// const AddProduct = () => {
//   const navigate = useNavigate();

//   const [form, setForm] = useState<ProductForm>({
//     name: "",
//     sku: "",
//     category: "",
//     reorderLevel: "",
//     quantity: "",
//     warehouse: "",
//     room: "",
//     shelf: "",
//     description: "",
//     refundable: false,
//   });

//   const [imagePreview, setImagePreview] = useState<string | null>(null);

//   /* ----------------------------- HANDLERS ----------------------------- */
//   const updateField = (key: keyof ProductForm, value: any) => {
//     setForm((prev) => ({ ...prev, [key]: value }));
//   };

//   const handleImageUpload = (file: File) => {
//     const url = URL.createObjectURL(file);
//     setImagePreview(url);
//     updateField("image", url);
//   };

//   const handleSubmit = () => {
//     // SIMPLE VALIDATION
//     if (
//       !form.name ||
//       !form.sku ||
//       !form.category ||
//       !form.quantity ||
//       !form.warehouse ||
//       !form.room ||
//       !form.shelf
//     ) {
//       alert("Please fill all required fields");
//       return;
//     }

//     console.log("Product Added:", form);

//     // NAVIGATE AFTER SUBMIT
//     navigate("/products");
//   };

//   /* ----------------------------- UI ----------------------------- */
//   return (
//     <div className="space-y-6">
//       {/* HEADER */}
//       <div className="flex items-start gap-3">
//         <button
//           onClick={() => navigate(-1)}
//           className="p-2 rounded-lg hover:bg-gray-100"
//         >
//           <ArrowLeft />
//         </button>

//         <div>
//           <h1 className="text-2xl font-bold">Add Products</h1>
//           <p className="text-gray-500">
//             Create and manage products in the inventory
//           </p>
//         </div>
//       </div>

//       {/* CONTENT */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* LEFT FORM */}
//         <div className="lg:col-span-2 bg-white rounded-xl border p-6 space-y-6">
//           {/* PRODUCT INFO */}
//           <section>
//             <h2 className="text-lg font-semibold mb-4">
//               Product Information:
//             </h2>

//             <div className="space-y-4">
//               <Input
//                 label="Product Name"
//                 required
//                 placeholder="Enter Product Name"
//                 value={form.name}
//                 onChange={(v) => updateField("name", v)}
//               />

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <Select
//                   label="SKU"
//                   required
//                   value={form.sku}
//                   onChange={(v) => updateField("sku", v)}
//                   options={["SKU-001", "SKU-002"]}
//                 />

//                 <Select
//                   label="Category"
//                   required
//                   value={form.category}
//                   onChange={(v) => updateField("category", v)}
//                   options={["Electronics", "Accessories"]}
//                 />
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <Input
//                   label="Re-Order Level"
//                   required
//                   placeholder="Set Re-Order Level"
//                   value={form.reorderLevel}
//                   onChange={(v) => updateField("reorderLevel", v)}
//                 />

//                 <Input
//                   label="Quantity"
//                   required
//                   placeholder="Enter Quantity"
//                   value={form.quantity}
//                   onChange={(v) => updateField("quantity", v)}
//                 />
//               </div>
//             </div>
//           </section>

//           {/* LOCATION */}
//           <section>
//             <h2 className="text-lg font-semibold mb-4">Location:</h2>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <Select
//                 label="Warehouse"
//                 required
//                 value={form.warehouse}
//                 onChange={(v) => updateField("warehouse", v)}
//                 options={["Warehouse A", "Warehouse B"]}
//               />

//               <Select
//                 label="Room"
//                 required
//                 value={form.room}
//                 onChange={(v) => updateField("room", v)}
//                 options={["Room 1", "Room 2"]}
//               />

//               <Select
//                 label="Shelf"
//                 required
//                 value={form.shelf}
//                 onChange={(v) => updateField("shelf", v)}
//                 options={["Shelf A", "Shelf B"]}
//               />
//             </div>
//           </section>

//           {/* CHECKBOX */}
//           <label className="flex items-start gap-3 cursor-pointer">
//             <input
//               type="checkbox"
//               checked={form.refundable}
//               onChange={(e) => updateField("refundable", e.target.checked)}
//               className="mt-1"
//             />
//             <div>
//               <p className="font-medium">Refundable Item</p>
//               <p className="text-sm text-gray-500">
//                 This item can be returned and restocked
//               </p>
//             </div>
//           </label>
//         </div>

//         {/* RIGHT IMAGE */}
//         <div className="bg-white rounded-xl border p-6 space-y-4">
//           <h2 className="text-lg font-semibold">Product Image</h2>

//           <label className="border-2 border-dashed rounded-xl h-52 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50">
//             {imagePreview ? (
//               <img
//                 src={imagePreview}
//                 className="h-full object-cover rounded-lg"
//               />
//             ) : (
//               <>
//                 <Upload size={40} className="text-gray-400 mb-2" />
//                 <p className="text-gray-600">Drag images(s) here</p>
//                 <span className="text-blue-600 text-sm">Browse Images</span>
//               </>
//             )}
//             <input
//               type="file"
//               className="hidden"
//               accept="image/*"
//               onChange={(e) =>
//                 e.target.files && handleImageUpload(e.target.files[0])
//               }
//             />
//           </label>

//           <p className="text-xs text-gray-500">
//             You can upload up to 15 images, each not exceeding 5MB
//           </p>

//           <Textarea
//             label="Description (optional)"
//             placeholder="Enter Product Description"
//             value={form.description}
//             onChange={(v) => updateField("description", v)}
//           />
//         </div>
//       </div>

//       {/* FOOTER BUTTON */}
//       <button
//         onClick={handleSubmit}
//         className="w-full bg-black text-white py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-900"
//       >
//         + Add Product
//       </button>
//     </div>
//   );
// };

// export default AddProduct;

// /* ----------------------------- REUSABLE UI ----------------------------- */
// const Input = ({
//   label,
//   value,
//   onChange,
//   placeholder,
//   required,
// }: any) => (
//   <div>
//     <label className="text-sm font-medium">
//       {label} {required && <span className="text-red-500">*</span>}
//     </label>
//     <input
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//       placeholder={placeholder}
//       className="w-full border rounded-lg px-4 py-2 mt-1"
//     />
//   </div>
// );

// const Select = ({ label, value, onChange, options, required }: any) => (
//   <div>
//     <label className="text-sm font-medium">
//       {label} {required && <span className="text-red-500">*</span>}
//     </label>
//     <select
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//       className="w-full border rounded-lg px-4 py-2 mt-1"
//     >
//       <option value="">Select {label}</option>
//       {options.map((o: string) => (
//         <option key={o}>{o}</option>
//       ))}
//     </select>
//   </div>
// );

// const Textarea = ({ label, value, onChange, placeholder }: any) => (
//   <div>
//     <label className="text-sm font-medium">{label}</label>
//     <textarea
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//       placeholder={placeholder}
//       rows={5}
//       className="w-full border rounded-lg px-4 py-2 mt-1"
//     />
//   </div>
// );
import { ArrowLeft, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

/* ----------------------------- TYPES ----------------------------- */
type ProductForm = {
  name: string;
  sku: string;
  category: string;
  reorderLevel: string;
  quantity: string;
  warehouse: string;
  room: string;
  shelf: string;
  description: string;
  refundable: boolean;
  image?: string;
};

/* ----------------------------- COMPONENT ----------------------------- */
const AddProduct = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<ProductForm>({
    name: "",
    sku: "",
    category: "",
    reorderLevel: "",
    quantity: "",
    warehouse: "",
    room: "",
    shelf: "",
    description: "",
    refundable: false,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  /* ----------------------------- HANDLERS ----------------------------- */
  const updateField = <K extends keyof ProductForm>(
    key: K,
    value: ProductForm[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleImageUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    setImagePreview(url);
    updateField("image", url);
  };

  const handleSubmit = () => {
    if (
      !form.name ||
      !form.sku ||
      !form.category ||
      !form.quantity ||
      !form.warehouse ||
      !form.room ||
      !form.shelf
    ) {
      alert("Please fill all required fields");
      return;
    }

    console.log("Product Added:", form);
    navigate("/products");
  };

  /* ----------------------------- UI ----------------------------- */
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-start gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <ArrowLeft />
        </button>

        <div>
          <h1 className="text-2xl font-bold">Add Products</h1>
          <p className="text-gray-500">
            Create and manage products in the inventory
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT FORM */}
        <div className="lg:col-span-2 bg-white rounded-xl border p-4 md:p-6 space-y-6">
          {/* PRODUCT INFO */}
          <section>
            <h2 className="text-lg font-semibold mb-4">
              Product Information:
            </h2>

            <div className="space-y-4">
              <Input
                label="Product Name"
                required
                placeholder="Enter Product Name"
                value={form.name}
                onChange={(v) => updateField("name", v)}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="SKU"
                  required
                  value={form.sku}
                  onChange={(v) => updateField("sku", v)}
                  options={["SKU-001", "SKU-002"]}
                />

                <Select
                  label="Category"
                  required
                  value={form.category}
                  onChange={(v) => updateField("category", v)}
                  options={["Electronics", "Accessories"]}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Re-Order Level"
                  required
                  placeholder="Set Re-Order Level"
                  value={form.reorderLevel}
                  onChange={(v) => updateField("reorderLevel", v)}
                />

                <Input
                  label="Quantity"
                  required
                  placeholder="Enter Quantity"
                  value={form.quantity}
                  onChange={(v) => updateField("quantity", v)}
                />
              </div>
            </div>
          </section>

          {/* LOCATION */}
          <section>
            <h2 className="text-lg font-semibold mb-4">Location:</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                label="Warehouse"
                required
                value={form.warehouse}
                onChange={(v) => updateField("warehouse", v)}
                options={["Warehouse A", "Warehouse B"]}
              />

              <Select
                label="Room"
                required
                value={form.room}
                onChange={(v) => updateField("room", v)}
                options={["Room 1", "Room 2"]}
              />

              <Select
                label="Shelf"
                required
                value={form.shelf}
                onChange={(v) => updateField("shelf", v)}
                options={["Shelf A", "Shelf B"]}
              />
            </div>
          </section>

          {/* CHECKBOX */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.refundable}
              onChange={(e) =>
                updateField("refundable", e.target.checked)
              }
              className="mt-1"
            />
            <div>
              <p className="font-medium">Refundable Item</p>
              <p className="text-sm text-gray-500">
                This item can be returned and restocked
              </p>
            </div>
          </label>
        </div>

        {/* RIGHT IMAGE */}
        <div className="bg-white rounded-xl border p-4 md:p-6 space-y-4">
          <h2 className="text-lg font-semibold">Product Image</h2>

          <label className="border-2 border-dashed rounded-xl h-52 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50">
            {imagePreview ? (
              <img
                src={imagePreview}
                className="h-full w-full object-cover rounded-lg"
                alt="preview"
              />
            ) : (
              <>
                <Upload size={40} className="text-gray-400 mb-2" />
                <p className="text-gray-600">Drag images(s) here</p>
                <span className="text-blue-600 text-sm">Browse Images</span>
              </>
            )}
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) =>
                e.target.files && handleImageUpload(e.target.files[0])
              }
            />
          </label>

          <p className="text-xs text-gray-500">
            You can upload up to 15 images, each not exceeding 5MB
          </p>

          <Textarea
            label="Description (optional)"
            placeholder="Enter Product Description"
            value={form.description}
            onChange={(v) => updateField("description", v)}
          />
        </div>
      </div>

      {/* FOOTER BUTTON */}
      <button
        onClick={handleSubmit}
        className="w-full bg-black text-white py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-900"
      >
        + Add Product
      </button>
    </div>
  );
};

export default AddProduct;

/* ----------------------------- REUSABLE UI ----------------------------- */
type InputProps = {
  label: string;
  value: string;
  placeholder?: string;
  required?: boolean;
  onChange: (value: string) => void;
};

const Input = ({
  label,
  value,
  onChange,
  placeholder,
  required,
}: InputProps) => (
  <div>
    <label className="text-sm font-medium">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full border rounded-lg px-4 py-2 mt-1"
    />
  </div>
);

type SelectProps = {
  label: string;
  value: string;
  options: string[];
  required?: boolean;
  onChange: (value: string) => void;
};

const Select = ({
  label,
  value,
  onChange,
  options,
  required,
}: SelectProps) => (
  <div>
    <label className="text-sm font-medium">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border rounded-lg px-4 py-2 mt-1"
    >
      <option value="">Select {label}</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  </div>
);

type TextareaProps = {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
};

const Textarea = ({
  label,
  value,
  onChange,
  placeholder,
}: TextareaProps) => (
  <div>
    <label className="text-sm font-medium">{label}</label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={5}
      className="w-full border rounded-lg px-4 py-2 mt-1"
    />
  </div>
);
