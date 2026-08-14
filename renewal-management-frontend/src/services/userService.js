import axiosInstance from "../api/axiosInstance";

const BASE = "/users";

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

const resetPassword = (id, payload) =>
  axiosInstance
    .post(`${BASE}/${id}/reset-password`, payload)
    .then((r) => r.data);

const toggleActive = (id) =>
  axiosInstance
    .patch(`${BASE}/${id}/toggle-active`)
    .then((r) => r.data);

/*
 * Update the currently logged-in user's profile.
 *
 * Backend:
 * PUT /api/users/me/profile
 */
const updateMyProfile = (payload) =>
  axiosInstance
    .put(`${BASE}/me/profile`, payload)
    .then((r) => r.data);

const userService = {
  getAll,
  getById,
  create,
  update,
  remove,
  resetPassword,
  toggleActive,
  updateMyProfile,
  getAccountOwners,
};
const getAccountOwners = () =>
  axiosInstance
    .get(`${BASE}/account-owners`)
    .then((r) => r.data);

export default userService;
