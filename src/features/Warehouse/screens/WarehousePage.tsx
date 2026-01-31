import { useState } from 'react';
import { Box, Grid3x3 } from 'lucide-react';

// Import tab components (only Shelves and Racks are used)
import ShelvesTab from '../components/ShelvesTab.tsx';
import RacksTab from '../components/RacksTab.tsx';

export default function WarehousePage() {
    const [activeTab, setActiveTab] = useState('shelves');

    const tabs = [
        { id: 'shelves', label: 'Shelves', icon: Grid3x3 },
        { id: 'racks', label: 'Racks', icon: Box }
    ];

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Storage Management</h1>
                <p className="text-gray-600 mt-1">Manage shelves and racks across all locations</p>
            </div>

            {/* Custom Tabs */}
            <div className="mb-6">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`
                    flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm
                    ${activeTab === tab.id
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }
                  `}
                                >
                                    <Icon className="w-4 h-4" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </div>

            {/* Tab Content */}
            <div className="mt-6">
                {activeTab === 'shelves' && <ShelvesTab />}
                {activeTab === 'racks' && <RacksTab />}
            </div>
        </div>
    );
}
