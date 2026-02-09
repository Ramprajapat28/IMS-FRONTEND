import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DoorOpen, ChevronRight, ChevronLeft, Building2, Plus, Pencil, Trash2, X, User, Phone, MapPin } from 'lucide-react';
import { warehousesApi, roomsApi, type Warehouse, type Room } from '../../Inventory/api/location.api';

export default function WarehouseDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [warehouse, setWarehouse] = useState<Warehouse | null>(null);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState<Room | null>(null);
    const [formData, setFormData] = useState({ name: '', warehouse_id: Number(id) });

    useEffect(() => {
        if (id) {
            fetchWarehouseAndRooms(Number(id));
        }
    }, [id]);

    const fetchWarehouseAndRooms = async (warehouseId: number) => {
        try {
            setLoading(true);
            const [warehousesRes, roomsRes] = await Promise.all([
                warehousesApi.getAll(1, 100),
                roomsApi.getAll(1, 100)
            ]);

            const foundWarehouse = warehousesRes.data?.find(w => w.warehouse_id === warehouseId);
            setWarehouse(foundWarehouse || null);

            const warehouseRooms = roomsRes.rooms?.filter(r => r.warehouse_id === warehouseId) || [];
            // Map room_name to name for display
            const mappedRooms = warehouseRooms.map((r: any) => ({
                ...r,
                name: r.room_name || r.name
            }));
            setRooms(mappedRooms);
        } catch (error) {
            console.error('Failed to load data', error);
            alert('Failed to load warehouse details');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name) {
            alert('Please enter room name');
            return;
        }

        try {
            // Backend expects room_name, not name
            const payload = {
                room_name: formData.name,
                warehouse_id: formData.warehouse_id
            };

            if (editingRoom) {
                await roomsApi.update(editingRoom.room_id, payload);
                alert('Room updated successfully');
            } else {
                await roomsApi.create(payload);
                alert('Room created successfully');
            }
            setDialogOpen(false);
            setEditingRoom(null);
            setFormData({ name: '', warehouse_id: Number(id) });
            fetchWarehouseAndRooms(Number(id));
        } catch (error: any) {
            alert(error.message || 'Failed to save room');
        }
    };

    const handleEdit = (room: Room, e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingRoom(room);
        setFormData({ name: room.name, warehouse_id: room.warehouse_id || Number(id) });
        setDialogOpen(true);
    };

    const handleDelete = async (roomId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this room?')) return;

        try {
            await roomsApi.delete(roomId);
            alert('Room deleted successfully');
            fetchWarehouseAndRooms(Number(id));
        } catch (error: any) {
            alert(error.message || 'Failed to delete room');
        }
    };

    if (loading) {
        return <div className="flex justify-center p-12"><div className="text-gray-600">Loading...</div></div>;
    }

    if (!warehouse) {
        return (
            <div className="p-6">
                <div className="border rounded-lg p-12 text-center">
                    <p className="text-gray-500">Warehouse not found</p>
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
                <span className="text-gray-600">{warehouse.name}</span>
                <span className="ml-2 px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs font-medium">Warehouse</span>
            </div>

            {/* Header */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/warehouse')}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-50 rounded-lg">
                            <Building2 className="w-8 h-8 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{warehouse.name}</h1>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                                {warehouse.location && (
                                    <div className="flex items-center gap-1 text-gray-600 text-sm sm:text-base">
                                        <MapPin className="w-4 h-4" />
                                        {warehouse.location}
                                    </div>
                                )}
                                {warehouse.contact_person && (
                                    <div className="flex items-center gap-1 text-gray-600 text-sm sm:text-base">
                                        <User className="w-4 h-4" />
                                        {warehouse.contact_person}
                                    </div>
                                )}
                                {warehouse.contact_number && (
                                    <div className="flex items-center gap-1 text-gray-600 text-sm sm:text-base">
                                        <Phone className="w-4 h-4" />
                                        {warehouse.contact_number}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => {
                        setEditingRoom(null);
                        setFormData({ name: '', warehouse_id: Number(id) });
                        setDialogOpen(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 w-full sm:w-auto justify-center"
                >
                    <Plus className="w-4 h-4" />
                    Add Room
                </button>
            </div>

            {/* Rooms */}
            <div>
                <h2 className="text-xl font-semibold mb-4">Rooms ({rooms.length})</h2>

                {rooms.length === 0 ? (
                    <div className="border rounded-lg p-12 text-center">
                        <DoorOpen className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500 text-lg">No rooms in this warehouse</p>
                        <p className="text-gray-400 text-sm mt-2">Click "Add Room" to create a room</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {rooms.map((room) => (
                            <div
                                key={room.room_id}
                                onClick={() => navigate(`/warehouse/${id}/room/${room.room_id}`)}
                                className="border rounded-lg p-6 hover:shadow-lg hover:border-green-500 transition-all cursor-pointer group relative"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className="p-3 bg-green-50 rounded-lg">
                                            <DoorOpen className="w-6 h-6 text-green-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-lg group-hover:text-green-600 transition-colors">
                                                {room.name}
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={(e) => handleEdit(room, e)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={(e) => handleDelete(room.room_id, e)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors ml-2" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add/Edit Dialog */}
            {dialogOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">{editingRoom ? 'Edit Room' : 'Add New Room'}</h3>
                            <button onClick={() => setDialogOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Room Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Enter room name"
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                                {editingRoom ? 'Update Room' : 'Create Room'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
