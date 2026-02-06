import React from "react";
import { Check } from "lucide-react";

interface ProductSoldSuccessProps {
    message?: string;
}

const ProductSoldSuccess: React.FC<ProductSoldSuccessProps> = ({ message = "Product Sold Successfully!" }) => {
    return (
        <div className="w-full min-h-[300px] sm:min-h-[460px] flex items-center justify-center">
            <div className="flex flex-col items-center text-center px-4 sm:px-6">
                {/* Success Circle */}
                <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full
                        border-2 border-green-600 bg-green-50
                        flex items-center justify-center mb-4 sm:mb-6">
                    <Check className="w-8 h-8 sm:w-12 sm:h-12 text-green-600" />
                </div>

                {/* Text */}
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                    {message}
                </h2>
            </div>
        </div>
    );
};

export default ProductSoldSuccess;
