import { useState, useEffect } from "react";
import { X, ArrowRight, Loader2 } from "lucide-react";
import { itemsApi } from "@/features/Inventory/api/item.api";
import { warehousesApi, roomsApi, shelvesApi, racksApi, type Warehouse, type Room, type Shelf, type Rack } from "@/features/Inventory/api/location.api";
import toast from "react-hot-toast";

interface TransferStockModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: any;
    onSuccess: () => void;
}

const TransferStockModal = ({ isOpen, onClose, product, onSuccess }: TransferStockModalProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [quantity, setQuantity] = useState("1");
    const [remark, setRemark] = useState("");

    // Source selection
    const [selectedSourceIndex, setSelectedSourceIndex] = useState<number | null>(null);

    // Destination selection
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [shelves, setShelves] = useState<Shelf[]>([]);
    const [racks, setRacks] = useState<Rack[]>([]);

    const [destWarehouseId, setDestWarehouseId] = useState("");
    const [destRoomId, setDestRoomId] = useState("");
    const [destShelfId, setDestShelfId] = useState("");
    const [destRackId, setDestRackId] = useState("");
    const [destType, setDestType] = useState<'shelf' | 'rack'>('shelf');

    useEffect(() => {
        if (isOpen) {
            fetchLocations();
        }
    }, [isOpen]);

    const fetchLocations = async () => {
        try {
            const [wRes, rRes, sRes, kRes] = await Promise.all([
                warehousesApi.getAll(1, 100),
                roomsApi.getAll(1, 100),
                shelvesApi.getAll(1, 100),
                racksApi.getAll(undefined, 1, 100)
            ]);

            // Be defensive: check both 'data' and specific naming patterns
            const warehousesList = (wRes as any).data || (wRes as any).warehouses || [];
            const roomsList = (rRes as any).rooms || (rRes as any).data || (rRes as any).rooms || [];
            const shelvesList = (sRes as any).data || (sRes as any).shelves || (sRes as any).shelfs || [];
            const racksList = (kRes as any).data || (kRes as any).racks || [];

            setWarehouses(warehousesList);
            setRooms(roomsList);
            setShelves(shelvesList);
            setRacks(racksList);
        } catch (err) {
            console.error("Failed to load locations:", err);
            toast.error("Failed to load some locations. Please try again.");
        }
    };

    const handleTransfer = async () => {
        if (selectedSourceIndex === null) {
            toast.error("Please select a source location");
            return;
        }

        const source = product.stock_details[selectedSourceIndex];
        const qty = parseInt(quantity);

        if (qty <= 0) {
            toast.error("Quantity must be greater than 0");
            return;
        }

        if (qty > source.item_count) {
            toast.error(`Not enough stock at source. Available: ${source.item_count}`);
            return;
        }

        if (!destRoomId || (!destShelfId && !destRackId)) {
            toast.error("Please select a valid destination");
            return;
        }

        setIsLoading(true);
        try {
            const payload = {
                product_id: product.product_id,
                quantity: qty,
                source: {
                    shelf_id: source.shelf_id,
                    rack_id: source.rack_id
                },
                destination: {
                    shelf_id: destType === 'shelf' ? Number(destShelfId) : undefined,
                    rack_id: destType === 'rack' ? Number(destRackId) : undefined
                },
                remark
            };

            const response = await itemsApi.transferStock(payload);
            if (response.success) {
                toast.success("Stock transferred successfully");
                onSuccess();
                onClose();
            } else {
                toast.error(response.message || "Transfer failed");
            }
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Transfer failed");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    const filteredRooms = rooms.filter(r => r.warehouse_id === Number(destWarehouseId));
    const filteredShelves = shelves.filter(s => s.room_id === Number(destRoomId));
    const filteredRacks = racks.filter(r => r.room_id === Number(destRoomId));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Transfer Stock</h2>
                        <p className="text-sm text-gray-500">{product.name} ({product.size})</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* LEFT: Source Selection */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">1</span>
                                Select Source Location
                            </h3>
                            <div className="border rounded-xl overflow-hidden divide-y">
                                {product.stock_details && product.stock_details.length > 0 ? (
                                    product.stock_details.map((s: any, idx: number) => (
                                        <label
                                            key={idx}
                                            className={`flex items-center p-4 cursor-pointer transition-colors hover:bg-gray-50 ${selectedSourceIndex === idx ? 'bg-blue-50 border-blue-200' : ''}`}
                                        >
                                            <input
                                                type="radio"
                                                name="source"
                                                className="w-4 h-4 text-blue-600"
                                                checked={selectedSourceIndex === idx}
                                                onChange={() => setSelectedSourceIndex(idx)}
                                            />
                                            <div className="ml-4 flex-1">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-medium text-gray-900">{s.warehouse_name}</span>
                                                    <span className="bg-white px-2 py-0.5 rounded border text-sm font-bold text-gray-700">
                                                        {s.item_count} units
                                                    </span>
                                                </div>
                                                <div className="text-xs text-gray-500 mt-0.5">
                                                    {s.room_name} › {s.shelf_name || s.rack_name || "Unassigned"}
                                                    <span className="ml-1 text-[10px] uppercase font-semibold text-gray-400">
                                                        ({s.shelf_id ? 'Shelf' : 'Rack'})
                                                    </span>
                                                </div>
                                            </div>
                                        </label>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-gray-500 italic">
                                        No stock available to transfer
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* RIGHT: Destination Selection */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">2</span>
                                Select Destination
                            </h3>
                            <div className="space-y-4 bg-gray-50 p-4 rounded-xl border">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Warehouse</label>
                                    <select
                                        value={destWarehouseId}
                                        onChange={(e) => {
                                            setDestWarehouseId(e.target.value);
                                            setDestRoomId("");
                                        }}
                                        className="w-full border p-2 rounded-lg text-sm bg-white"
                                    >
                                        <option value="">Select Warehouse</option>
                                        {warehouses.map(w => <option key={w.warehouse_id} value={w.warehouse_id}>{w.name}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Room</label>
                                    <select
                                        value={destRoomId}
                                        onChange={(e) => setDestRoomId(e.target.value)}
                                        disabled={!destWarehouseId}
                                        className="w-full border p-2 rounded-lg text-sm bg-white disabled:bg-gray-100"
                                    >
                                        <option value="">Select Room</option>
                                        {filteredRooms.map(r => <option key={r.room_id} value={r.room_id}>{r.name || (r as any).room_name}</option>)}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex p-1 bg-white border rounded-lg">
                                        <button
                                            type="button"
                                            onClick={() => { setDestType('shelf'); setDestRackId(""); }}
                                            className={`flex-1 py-1 text-xs font-bold rounded ${destType === 'shelf' ? 'bg-blue-600 text-white' : 'text-gray-500'}`}
                                        >
                                            Shelf
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => { setDestType('rack'); setDestShelfId(""); }}
                                            className={`flex-1 py-1 text-xs font-bold rounded ${destType === 'rack' ? 'bg-blue-600 text-white' : 'text-gray-500'}`}
                                        >
                                            Rack
                                        </button>
                                    </div>
                                    {destType === 'shelf' ? (
                                        <select
                                            value={destShelfId}
                                            onChange={(e) => setDestShelfId(e.target.value)}
                                            disabled={!destRoomId}
                                            className="w-full border p-2 rounded-lg text-sm bg-white disabled:bg-gray-100"
                                        >
                                            <option value="">Select Shelf</option>
                                            {filteredShelves.map(s => <option key={s.shelf_id} value={s.shelf_id}>{s.name || (s as any).shelf_name}</option>)}
                                        </select>
                                    ) : (
                                        <select
                                            value={destRackId}
                                            onChange={(e) => setDestRackId(e.target.value)}
                                            disabled={!destRoomId}
                                            className="w-full border p-2 rounded-lg text-sm bg-white disabled:bg-gray-100"
                                        >
                                            <option value="">Select Rack</option>
                                            {filteredRacks.map(r => <option key={r.rack_id} value={r.rack_id}>{r.rack_name || r.name}</option>)}
                                        </select>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 3: Quantity & Remark */}
                    <div className="p-6 rounded-2xl border border-gray-200 space-y-4">
                        <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">3</span>
                            Confirm Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Quantity to Transfer</label>
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    className="w-full border-2 border-gray-200 p-3 rounded-xl text-lg font-bold text-gray-900 focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Remark / Event Name</label>
                                <input
                                    type="text"
                                    value={remark}
                                    onChange={(e) => setRemark(e.target.value)}
                                    placeholder="e.g. Moving to Field Exhibition"
                                    className="w-full border-2 border-gray-200 p-3 rounded-xl text-sm focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 bg-gray-100 border-t flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 text-gray-600 font-medium hover:bg-gray-200 rounded-xl transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleTransfer}
                        disabled={isLoading || selectedSourceIndex === null}
                        className="px-8 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition flex items-center gap-2 disabled:bg-blue-300 shadow-lg"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : <ArrowRight size={20} />}
                        Execute Transfer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TransferStockModal;
