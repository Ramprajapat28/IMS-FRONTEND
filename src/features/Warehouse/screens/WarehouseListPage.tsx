import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, ChevronRight, MapPin, Plus, Pencil, Trash2, X } from 'lucide-react';
import { warehousesApi, type Warehouse } from '../../Inventory/api/location.api';

export default function WarehouseListPage() {
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);
    const [formData, setFormData] = useState({ name: '', location: '' });
    const navigate = useNavigate();

    useEffect(() => {
        fetchWarehouses();
    }, []);

    const fetchWarehouses = async () => {
        try {
            setLoading(true);
            const response = await warehousesApi.getAll(1, 100);
            setWarehouses(response.data || []);
        } catch (error) {
            console.error('Failed to load warehouses', error);
            alert('Failed to load warehouses');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name) {
            alert('Please enter warehouse name');
            return;
        }

        try {
            if (editingWarehouse) {
                await warehousesApi.update(editingWarehouse.warehouse_id, formData);
                alert('Warehouse updated successfully');
            } else {
                await warehousesApi.create(formData);
                alert('Warehouse created successfully');
            }
            setDialogOpen(false);
            setEditingWarehouse(null);
            setFormData({ name: '', location: '' });
            fetchWarehouses();
        } catch (error: any) {
            alert(error.message || 'Failed to save warehouse');
        }
    };

    const handleEdit = (warehouse: Warehouse, e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingWarehouse(warehouse);
        setFormData({ name: warehouse.name, location: warehouse.location || '' });
        setDialogOpen(true);
    };

    const handleDelete = async (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this warehouse?')) return;

        try {
            await warehousesApi.delete(id);
            alert('Warehouse deleted successfully');
            fetchWarehouses();
        } catch (error: any) {
            alert(error.message || 'Failed to delete warehouse');
        }
    };

    if (loading) {
        return <div className="flex justify-center p-12"><div className="text-gray-600">Loading...</div></div>;
    }

    return (
        <div className="p-6">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Warehouses</h1>
                    <p className="text-gray-600 mt-1">Manage your warehouse locations</p>
                </div>
                <button
                    onClick={() => {
                        setEditingWarehouse(null);
                        setFormData({ name: '', location: '' });
                        setDialogOpen(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    <Plus className="w-4 h-4" />
                    Add Warehouse
                </button>
            </div>

            {warehouses.length === 0 ? (
                <div className="border rounded-lg p-12 text-center">
                    <Building2 className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 text-lg">No warehouses found</p>
                    <p className="text-gray-400 text-sm mt-2">Click "Add Warehouse" to create your first warehouse</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {warehouses.map((warehouse) => (
                        <div
                            key={warehouse.warehouse_id}
                            onClick={() => navigate(`/warehouse/${warehouse.warehouse_id}`)}
                            className="border rounded-lg p-6 hover:shadow-lg hover:border-blue-500 transition-all cursor-pointer group relative"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3 flex-1">
                                    <div className="p-3 bg-blue-50 rounded-lg">
                                        <Building2 className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors">
                                            {warehouse.name}
                                        </h3>
                                        {warehouse.location && (
                                            <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                                                <MapPin className="w-3 h-3" />
                                                {warehouse.location}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={(e) => handleEdit(warehouse, e)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={(e) => handleDelete(warehouse.warehouse_id, e)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors ml-2" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add/Edit Dialog */}
            {dialogOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">{editingWarehouse ? 'Edit Warehouse' : 'Add New Warehouse'}</h3>
                            <button onClick={() => setDialogOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Warehouse Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Enter warehouse name"
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Location (optional)</label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    placeholder="Enter location"
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                {editingWarehouse ? 'Update Warehouse' : 'Create Warehouse'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
