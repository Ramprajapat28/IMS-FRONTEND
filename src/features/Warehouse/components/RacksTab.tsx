import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { racksApi, type Rack, type CreateRackData, warehousesApi, type Warehouse, roomsApi, type Room } from '../../Inventory/api/location.api';

export default function RacksTab() {
    const [racks, setRacks] = useState<Rack[]>([]);
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingRack, setEditingRack] = useState<Rack | null>(null);

    const [formData, setFormData] = useState<CreateRackData>({
        rack_name: '',
        warehouse_id: 0,
        room_id: 0,
        capacity: undefined
    });

    useEffect(() => {
        fetchRacks();
        fetchWarehouses();
        fetchRooms();
    }, []);

    const fetchRacks = async () => {
        try {
            setLoading(true);
            const response = await racksApi.getAll(undefined, 1, 100);
            setRacks(response.data || []);
        } catch (error) {
            alert('Failed to load racks');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchWarehouses = async () => {
        try {
            const response = await warehousesApi.getAll(1, 100);
            setWarehouses(response.data || []);
        } catch (error) {
            console.error('Failed to load warehouses', error);
        }
    };

    const fetchRooms = async () => {
        try {
            const response = await roomsApi.getAll(1, 100);
            setRooms(response.rooms || []);
        } catch (error) {
            console.error('Failed to load rooms', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.rack_name || !formData.warehouse_id || !formData.room_id) {
            alert('Please fill in all required fields');
            return;
        }

        try {
            if (editingRack) {
                await racksApi.update(editingRack.rack_id, formData);
                alert('Rack updated successfully');
            } else {
                await racksApi.create(formData);
                alert('Rack created successfully');
            }

            setDialogOpen(false);
            setEditingRack(null);
            setFormData({ rack_name: '', warehouse_id: 0, room_id: 0, capacity: undefined });
            fetchRacks();
        } catch (error: any) {
            alert(error.message || 'Failed to save rack');
        }
    };

    const handleEdit = (rack: Rack) => {
        setEditingRack(rack);
        setFormData({
            rack_name: rack.rack_name,
            warehouse_id: rack.warehouse_id || 0,
            room_id: rack.room_id || 0,
            capacity: rack.capacity
        });
        setDialogOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this rack?')) return;

        try {
            await racksApi.delete(id);
            alert('Rack deleted successfully');
            fetchRacks();
        } catch (error: any) {
            alert(error.message || 'Failed to delete rack');
        }
    };

    if (loading) return <div className="flex justify-center p-12"><div className="text-gray-600">Loading...</div></div>;

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Racks ({racks.length})</h2>
                <button
                    onClick={() => {
                        setEditingRack(null);
                        setFormData({ rack_name: '', warehouse_id: 0, room_id: 0, capacity: undefined });
                        setDialogOpen(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    <Plus className="w-4 h-4" />
                    Add Rack
                </button>
            </div>

            {/* Table */}
            <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rack Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Warehouse</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Room</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Capacity</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {racks.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                    No racks found. Click "Add Rack" to create one.
                                </td>
                            </tr>
                        ) : (
                            racks.map((rack) => (
                                <tr key={rack.rack_id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{rack.rack_name}</td>
                                    <td className="px-6 py-4 text-gray-700">{rack.warehouse_name || '-'}</td>
                                    <td className="px-6 py-4 text-gray-700">{rack.room_name || '-'}</td>
                                    <td className="px-6 py-4 text-gray-700">{rack.capacity || '-'}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(rack)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(rack.rack_id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Dialog */}
            {dialogOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">{editingRack ? 'Edit Rack' : 'Add New Rack'}</h3>
                            <button onClick={() => setDialogOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Rack Name *</label>
                                <input
                                    type="text"
                                    value={formData.rack_name}
                                    onChange={(e) => setFormData({ ...formData, rack_name: e.target.value })}
                                    placeholder="Enter rack name"
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Warehouse *</label>
                                <select
                                    value={formData.warehouse_id}
                                    onChange={(e) => setFormData({ ...formData, warehouse_id: Number(e.target.value) })}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Select warehouse</option>
                                    {warehouses.map((w) => (
                                        <option key={w.warehouse_id} value={w.warehouse_id}>
                                            {w.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Room *</label>
                                <select
                                    value={formData.room_id}
                                    onChange={(e) => setFormData({ ...formData, room_id: Number(e.target.value) })}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Select room</option>
                                    {rooms.map((r) => (
                                        <option key={r.room_id} value={r.room_id}>
                                            {r.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Capacity (optional)</label>
                                <input
                                    type="number"
                                    value={formData.capacity || ''}
                                    onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) || undefined })}
                                    placeholder="Enter capacity"
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
