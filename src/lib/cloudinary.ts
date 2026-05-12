
const cloudName = import.meta.env.CLOUDINARY_CLOUD_NAME;
const memberUploadPreset = import.meta.env.CLOUDINARY_MEMBER_UPLOAD_PRESET;
const eventUploadPreset = import.meta.env.CLOUDINARY_EVENT_UPLOAD_PRESET;


export default {
    uploadProfilePicture: async (file: File) => {
        const formData = new FormData();

        formData.append('file', file);
        formData.append('upload_preset', memberUploadPreset);

        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: 'POST',
            body: formData
        });

        const { secure_url } = await response.json();

        return secure_url;
    },

    uploadEventImage: async (file: File) => {
        const formData = new FormData();

        formData.append('file', file);
        formData.append('upload_preset', eventUploadPreset);

        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: 'POST',
            body: formData
        });

        const { secure_url } = await response.json();

        return secure_url;
    }
}