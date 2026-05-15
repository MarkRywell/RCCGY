
const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const memberUploadPreset = import.meta.env.VITE_CLOUDINARY_MEMBER_UPLOAD_PRESET;
const eventUploadPreset = import.meta.env.VITE_CLOUDINARY_EVENT_UPLOAD_PRESET;


export default {
    uploadProfilePicture: async (file: File) => {
        const formData = new FormData();

        formData.append('file', file);
        formData.append('upload_preset', memberUploadPreset);

        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: 'POST',
            body: formData
        });

        const { secure_url, public_id } = await response.json();

        return { secure_url, public_id };
    },

    uploadEventImage: async (file: File) => {
        const formData = new FormData();

        formData.append('file', file);
        formData.append('upload_preset', eventUploadPreset);

        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: 'POST',
            body: formData
        });

        const { secure_url, public_id } = await response.json();

        return { secure_url, public_id };
    },
}