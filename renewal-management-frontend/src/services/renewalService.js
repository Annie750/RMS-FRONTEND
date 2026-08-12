import axiosInstance from "../api/axiosInstance";

const BASE = "/renewals";

// Renewal CRUD
const getAll = (params) =>
    axiosInstance.get(BASE, { params }).then((r) => r.data);

const getById = (id) =>
    axiosInstance.get(`${BASE}/${id}`).then((r) => r.data);

const create = (payload) =>
    axiosInstance.post(BASE, payload).then((r) => r.data);

const update = (id, payload) =>
    axiosInstance.put(`${BASE}/${id}`, payload).then((r) => r.data);

const remove = (id) =>
    axiosInstance.delete(`${BASE}/${id}`).then((r) => r.data);

// =========================
// Supporting Documents
// =========================
const getPreviousPrices = (customerId, productId) =>
    axiosInstance
    .get("/renewals/previous-prices", {
        params: { customerId, productId }
    })
    .then((r) => r.data);
const getDocuments = (renewalId) =>
    axiosInstance
    .get(`${BASE}/${renewalId}/documents`)
    .then((r) => r.data);

const uploadDocument = (renewalId, file) => {
    const formData = new FormData();
    formData.append("file", file);

    return axiosInstance
        .post(`${BASE}/${renewalId}/documents`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        .then((r) => r.data);
};

const deleteDocument = (renewalId, documentId) =>
    axiosInstance
    .delete(`${BASE}/${renewalId}/documents/${documentId}`)
    .then((r) => r.data);

const downloadDocument = async(renewalId, documentId) => {
    const response = await axiosInstance.get(
        `${BASE}/${renewalId}/documents/${documentId}`, {
            responseType: "blob",
        }
    );

    const disposition = response.headers["content-disposition"];

    let filename = "document";

    if (disposition) {
        const match = disposition.match(/filename="(.+)"/);
        if (match) filename = match[1];
    }

    const blob = new Blob([response.data]);

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = filename;

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);
};

const renewalService = {
    getAll,
    getById,
    create,
    update,
    remove,
    getDocuments,
    uploadDocument,
    deleteDocument,
    downloadDocument,
};

export default renewalService;