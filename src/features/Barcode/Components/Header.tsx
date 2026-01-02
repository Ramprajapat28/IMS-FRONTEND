// import React from 'react';
import {
    ArrowLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function Header() {
    const navigate = useNavigate();
    return (
        <div className="mb-8">
            <div className="flex items-center gap-2 text-blue-700 text-2xl font-semibold">
                {/* <ArrowLeft className="w-6 h-6 hidden md:flex text-black" />*/}
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-lg hover:bg-gray-100 text-black hidden md:flex"
                >
                    <ArrowLeft />
                </button>
                <span>Barcode Scanner</span>
            </div>
            <p className="mt-1 text-sm text-gray-500">
                Upload an Image or use the camera to scan the barcode.
            </p>
        </div>
    )
}

export default Header
