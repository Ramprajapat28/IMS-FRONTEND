import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Grid3x3, Box, ChevronRight, ChevronLeft, DoorOpen, Plus, Pencil, Trash2, X } from 'lucide-react';
import { warehousesApi, roomsApi, shelvesApi, racksApi, type Warehouse, type Room, type Shelf, type Rack, type CreateRackData } from '../../Inventory/api/location.api';

export default function RoomDetailsPage() {
    const { id: warehouseId, roomId } = useParams();
    const navigate = useNavigate();
    const [warehouse, setWarehouse] = useState<Warehouse | null>(null);
    const [room, setRoom] = useState<Room | null>(null);
    const [shelves, setShelves] = useState<Shelf[]>([]);
    const [racks, setRacks] = useState<Rack[]>([]);
    const [loading, setLoading] = useState(true);

    // Dialog states
    const [shelfDialogOpen, setShelfDialogOpen] = useState(false);
    const [rackDialogOpen, setRackDialogOpen] = useState(false);
    const [editingShelf, setEditingShelf] = useState<Shelf | null>(null);
    const [editingRack, setEditingRack] = useState<Rack | null>(null);

    const [shelfFormData, setShelfFormData] = useState({ name: '', room_id: Number(roomId) });
    const [rackFormData, setRackFormData] = useState<CreateRackData>({
        rack_name: '',
        warehouse_id: Number(warehouseId),
        room_id: Number(roomId),
        capacity: undefined
    });

    useEffect(() => {
        if (warehouseId && roomId) {
            fetchRoomData(Number(warehouseId), Number(roomId));
        }
    }, [warehouseId, roomId]);

    const fetchRoomData = async (whId: number, rmId: number) => {
        try {
            setLoading(true);
            const [warehousesRes, roomsRes, shelvesRes, racksRes] = await Promise.all([
                warehousesApi.getAll(1, 100),
                roomsApi.getAll(1, 100),
                shelvesApi.getAll(1, 100),
                racksApi.getAll(undefined, 1, 100)
            ]);

            const foundWarehouse = warehousesRes.data?.find(w => w.warehouse_id === whId);
            setWarehouse(foundWarehouse || null);

            const foundRoom = roomsRes.rooms?.find(r => r.room_id === rmId);
            setRoom(foundRoom || null);

            const roomShelves = shelvesRes.data?.filter(s => s.room_id === rmId) || [];
            // Map shelf_name to name for display
            const mappedShelves = roomShelves.map((s: any) => ({
                ...s,
                name: s.shelf_name || s.name
            }));
            setShelves(mappedShelves);

            const roomRacks = racksRes.data?.filter(r => r.room_id === rmId) || [];
            setRacks(roomRacks);
        } catch (error) {
            console.error('Failed to load data', error);
            alert('Failed to load room details');
        } finally {
            setLoading(false);
        }
    };

    // Shelf handlers
    const handleShelfSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!shelfFormData.name) {
            alert('Please enter shelf name');
            return;
        }

        try {
            // Backend expects shelf_name, not name
            const payload = {
                shelf_name: shelfFormData.name,
                room_id: shelfFormData.room_id,
                warehouse_id: Number(warehouseId)
            };

            if (editingShelf) {
                await shelvesApi.update(editingShelf.shelf_id, payload);
                alert('Shelf updated successfully');
            } else {
                await shelvesApi.create(payload);
                alert('Shelf created successfully');
            }
            setShelfDialogOpen(false);
            setEditingShelf(null);
            setShelfFormData({ name: '', room_id: Number(roomId) });
            fetchRoomData(Number(warehouseId), Number(roomId));
        } catch (error: any) {
            alert(error.message || 'Failed to save shelf');
        }
    };

    const handleShelfEdit = (shelf: Shelf) => {
        setEditingShelf(shelf);
        setShelfFormData({ name: shelf.name, room_id: shelf.room_id || Number(roomId) });
        setShelfDialogOpen(true);
    };

    const handleShelfDelete = async (shelfId: number) => {
        if (!confirm('Are you sure you want to delete this shelf?')) return;

        try {
            await shelvesApi.delete(shelfId);
            alert('Shelf deleted successfully');
            fetchRoomData(Number(warehouseId), Number(roomId));
        } catch (error: any) {
            alert(error.message || 'Failed to delete shelf');
        }
    };

    // Rack handlers
    const handleRackSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!rackFormData.rack_name) {
            alert('Please enter rack name');
            return;
        }

        try {
            // Prepare payload and exclude capacity if empty
            const payload: any = {
                rack_name: rackFormData.rack_name,
                warehouse_id: rackFormData.warehouse_id,
                room_id: rackFormData.room_id
            };

            // Only include capacity if it has a positive value
            if (rackFormData.capacity && rackFormData.capacity > 0) {
                payload.capacity = rackFormData.capacity;
            }

            if (editingRack) {
                await racksApi.update(editingRack.rack_id, payload);
                alert('Rack updated successfully');
            } else {
                await racksApi.create(payload);
                alert('Rack created successfully');
            }
            setRackDialogOpen(false);
            setEditingRack(null);
            setRackFormData({
                rack_name: '',
                warehouse_id: Number(warehouseId),
                room_id: Number(roomId),
                capacity: undefined
            });
            fetchRoomData(Number(warehouseId), Number(roomId));
        } catch (error: any) {
            alert(error.message || 'Failed to save rack');
        }
    };

    const handleRackEdit = (rack: Rack) => {
        setEditingRack(rack);
        setRackFormData({
            rack_name: rack.rack_name,
            warehouse_id: rack.warehouse_id || Number(warehouseId),
            room_id: rack.room_id || Number(roomId),
            capacity: rack.capacity
        });
        setRackDialogOpen(true);
    };

    const handleRackDelete = async (rackId: number) => {
        if (!confirm('Are you sure you want to delete this rack?')) return;

        try {
            await racksApi.delete(rackId);
            alert('Rack deleted successfully');
            fetchRoomData(Number(warehouseId), Number(roomId));
        } catch (error: any) {
            alert(error.message || 'Failed to delete rack');
        }
    };

    if (loading) {
        return <div className="flex justify-center p-12"><div className="text-gray-600">Loading...</div></div>;
    }

    if (!room || !warehouse) {
        return (
            <div className="p-6">
                <div className="border rounded-lg p-12 text-center">
                    <p className="text-gray-500">Room not found</p>
                    <button onClick={() => navigate('/warehouse')} className="mt-4 text-blue-600 hover:underline">
                        Back to Warehouses
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-6 text-sm">
                <button onClick={() => navigate('/warehouse')} className="text-blue-600 hover:underline">
                    Warehouses
                </button>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <button onClick={() => navigate(`/warehouse/${warehouseId}`)} className="text-blue-600 hover:underline">
                    {warehouse.name}
                </button>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{room.name}</span>
            </div>

            {/* Header */}
            <div className="mb-6 flex items-center gap-4">
                <button
                    onClick={() => navigate(`/warehouse/${warehouseId}`)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-green-50 rounded-lg">
                        <DoorOpen className="w-8 h-8 text-green-600" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{room.name}</h1>
                        <p className="text-gray-600 mt-1">in {warehouse.name}</p>
                    </div>
                </div>
            </div>

            {/* Shelves & Racks */}
            <div className="space-y-8">
                {/* Shelves Section */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold">Shelves ({shelves.length})</h2>
                        <button
                            onClick={() => {
                                setEditingShelf(null);
                                setShelfFormData({ name: '', room_id: Number(roomId) });
                                setShelfDialogOpen(true);
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                        >
                            <Plus className="w-4 h-4" />
                            Add Shelf
                        </button>
                    </div>

                    {shelves.length === 0 ? (
                        <div className="border rounded-lg p-8 text-center text-gray-500">
                            No shelves in this room. Click "Add Shelf" to create one.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {shelves.map((shelf) => (
                                <div
                                    key={shelf.shelf_id}
                                    className="border rounded-lg p-6 hover:shadow-md transition-all group"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3 flex-1">
                                            <div className="p-3 bg-purple-50 rounded-lg">
                                                <Grid3x3 className="w-6 h-6 text-purple-600" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-lg">{shelf.name}</h3>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => handleShelfEdit(shelf)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleShelfDelete(shelf.shelf_id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Racks Section */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold">Racks ({racks.length})</h2>
                        <button
                            onClick={() => {
                                setEditingRack(null);
                                setRackFormData({
                                    rack_name: '',
                                    warehouse_id: Number(warehouseId),
                                    room_id: Number(roomId),
                                    capacity: undefined
                                });
                                setRackDialogOpen(true);
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                        >
                            <Plus className="w-4 h-4" />
                            Add Rack
                        </button>
                    </div>

                    {racks.length === 0 ? (
                        <div className="border rounded-lg p-8 text-center text-gray-500">
                            No racks in this room. Click "Add Rack" to create one.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {racks.map((rack) => (
                                <div
                                    key={rack.rack_id}
                                    className="border rounded-lg p-6 hover:shadow-md transition-all group"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3 flex-1">
                                            <div className="p-3 bg-orange-50 rounded-lg">
                                                <Box className="w-6 h-6 text-orange-600" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-lg">{rack.rack_name}</h3>
                                                {rack.capacity && (
                                                    <p className="text-sm text-gray-400 mt-1">Capacity: {rack.capacity}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => handleRackEdit(rack)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleRackDelete(rack.rack_id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Shelf Dialog */}
            {shelfDialogOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">{editingShelf ? 'Edit Shelf' : 'Add New Shelf'}</h3>
                            <button onClick={() => setShelfDialogOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleShelfSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Shelf Name *</label>
                                <input
                                    type="text"
                                    value={shelfFormData.name}
                                    onChange={(e) => setShelfFormData({ ...shelfFormData, name: e.target.value })}
                                    placeholder="Enter shelf name"
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                            >
                                {editingShelf ? 'Update Shelf' : 'Create Shelf'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Rack Dialog */}
            {rackDialogOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">{editingRack ? 'Edit Rack' : 'Add New Rack'}</h3>
                            <button onClick={() => setRackDialogOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleRackSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Rack Name *</label>
                                <input
                                    type="text"
                                    value={rackFormData.rack_name}
                                    onChange={(e) => setRackFormData({ ...rackFormData, rack_name: e.target.value })}
                                    placeholder="Enter rack name"
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    required
                                />
                            </div>
                            {/* <div>
                                <label className="block text-sm font-medium mb-1">Capacity (optional)</label>
                                <input
                                    type="number"
                                    value={rackFormData.capacity || ''}
                                    onChange={(e) => setRackFormData({ ...rackFormData, capacity: Number(e.target.value) || undefined })}
                                    placeholder="Enter capacity"
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div> */}
                            <button
                                type="submit"
                                className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                            >
                                {editingRack ? 'Update Rack' : 'Create Rack'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
