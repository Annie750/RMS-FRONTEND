export const getUser = () => {
    try {
        return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
        return null;
    }
};

export const getRole = () => {
    const user = getUser();
    return user && user.role ? user.role : "";
};

export const isAdmin = () => getRole() === "ADMIN";

export const isViewer = () => getRole() === "VIEWER";