import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Breadcrumb = {
    label: string;
    path?: string;
};

type InventoryNavbarProps = {
    breadcrumbs: Breadcrumb[];
};

const InventoryNavbar = ({ breadcrumbs }: InventoryNavbarProps) => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col gap-2">
            {/* BREADCRUMB */}
            <div className="flex items-center gap-2">
                {breadcrumbs.length > 1 && (
                    <button
                        onClick={() => navigate(-1)}
                        className="hover:bg-gray-100 p-1 rounded-lg transition"
                    >
                        <ChevronLeft size={20} />
                    </button>
                )}

                <div className="flex flex-col">
                    <h1 className="text-xl font-semibold">Inventory</h1>
                    <div className="text-sm text-gray-500 flex gap-1 flex-wrap">
                        {breadcrumbs.map((b, i) => (
                            <span key={i} className="flex gap-1">
                                {b.path ? (
                                    <button
                                        onClick={() => navigate(b.path!)}
                                        className="hover:underline"
                                    >
                                        {b.label}
                                    </button>
                                ) : (
                                    <span>{b.label}</span>
                                )}
                                {i < breadcrumbs.length - 1 && <span>›</span>}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InventoryNavbar;
