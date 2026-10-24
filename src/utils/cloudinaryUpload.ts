/**
 * Shared Cloudinary upload utility.
 * Replaces the old S3 presigned URL PUT flow.
 *
 * Usage:
 *   const cdnUrl = await uploadToCloudinary(file, "product", "images", getPresignedUrlFn);
 */

type PresignedPayload = {
    uploadUrl: string;
    cdnUrl: string;
    signature: string;
    timestamp: number;
    cloud_name: string;
    api_key: string;
    folder: string;
    public_id: string;
};

type GetPresignedUrlFn = (
    fileName: string,
    functionality: string,
    subFunctionality: string
) => Promise<PresignedPayload>;

/**
 * Uploads a file to Cloudinary using a backend-signed upload.
 * @returns The CDN URL of the uploaded file.
 */
export async function uploadToCloudinary(
    file: File,
    functionality: string,
    subFunctionality: string,
    getPresignedUrl: GetPresignedUrlFn
): Promise<string> {
    // 1. Get signed upload payload from backend
    const payload = await getPresignedUrl(file.name, functionality, subFunctionality);

    // 2. Build FormData for Cloudinary's upload endpoint
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", payload.api_key);
    formData.append("timestamp", String(payload.timestamp));
    formData.append("signature", payload.signature);
    formData.append("folder", payload.folder);
    formData.append("public_id", payload.public_id);

    // 3. POST directly to Cloudinary
    const uploadRes = await fetch(payload.uploadUrl, {
        method: "POST",
        body: formData,
    });

    if (!uploadRes.ok) {
        const errText = await uploadRes.text();
        throw new Error(`Cloudinary upload failed: ${errText}`);
    }

    const result = await uploadRes.json();
    return result.secure_url as string;
}
