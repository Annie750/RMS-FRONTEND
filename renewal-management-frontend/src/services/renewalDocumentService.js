import axiosInstance from "../api/axiosInstance";

const upload = async(renewalId, file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axiosInstance.post(
        `/renewals/${renewalId}/documents`,
        formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};

const getDocuments = async(renewalId) => {
    const response = await axiosInstance.get(
        `/renewals/${renewalId}/documents`
    );

    return response.data;
};

const download = async(renewalId, documentId) => {

    const response = await axiosInstance.get(
        `/renewals/${renewalId}/documents/${documentId}`, {
            responseType: "blob"
        }
    );

    const blob = new Blob([response.data]);

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = "document";

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);
};

const remove = async(renewalId, documentId) => {
    const response = await axiosInstance.delete(
        `/renewals/${renewalId}/documents/${documentId}`
    );

    return response.data;
};

export default {
    upload,
    getDocuments,
    download,
    remove,
};