import axiosInstance from "../api/axiosInstance";

const BASE = "/customers";

const getAll = (params) => axiosInstance.get(BASE, { params }).then((r) => r.data);
const getById = (id) => axiosInstance.get(`${BASE}/${id}`).then((r) => r.data);
const create = (payload) => axiosInstance.post(BASE, payload).then((r) => r.data);
const update = (id, payload) => axiosInstance.put(`${BASE}/${id}`, payload).then((r) => r.data);
const remove = (id) => axiosInstance.delete(`${BASE}/${id}`).then((r) => r.data);

const customerService = { getAll, getById, create, update, remove };
export default customerService;
