import { useCallback, useEffect, useMemo, useState } from "react";
import { Users, User, ShieldCheck, Trash2, Edit, Search, X } from "lucide-react";
import Card from "../../components/common/Card.jsx";
import Badge from "../../components/common/Badge.jsx";
import Button from "../../components/common/Button.jsx";
import Input from "../../components/common/Input.jsx";
import Modal from "../../components/common/Modal.jsx";
import useUIStore from "../../store/uiStore.js";
import { formatDate } from "../../utils/formatters.js";
import { getAllUsers, updateUserRole, deleteUser } from "../../services/adminUserService.js";

const PAGE_SIZE = 10;

function AdminUsersManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState("");
    const [isRoleModalOpen, setRoleModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedRole, setSelectedRole] = useState("user");
    const [deleteUserTarget, setDeleteUserTarget] = useState(null);
    const [modalError, setModalError] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const showToast = useUIStore((s) => s.showToast);

    const getUserId = useCallback((user) => user?.id || user?._id, []);

    const parseApiError = useCallback((errorResponse) => {
        if (!errorResponse) return null;
        if (typeof errorResponse === "string") return errorResponse;
        if (errorResponse.message) return errorResponse.message;
        if (errorResponse.error) return errorResponse.error;
        if (Array.isArray(errorResponse)) return errorResponse.join(" ");
        const values = Object.values(errorResponse).flatMap((value) => {
            if (typeof value === "string") return [value];
            if (Array.isArray(value)) return value;
            return [];
        });
        return values.join(" ") || null;
    }, []);

    const getErrorMessage = useCallback((err, fallback) => {
        return parseApiError(err?.response?.data) || err?.message || fallback;
    }, [parseApiError]);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const response = await getAllUsers();
            setUsers(Array.isArray(response) ? response : []);
        } catch (err) {
            setError(getErrorMessage(err, "Unable to load users."));
            setUsers([]);
        } finally {
            setLoading(false);
        }
    }, [getErrorMessage]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const openEditModal = useCallback((user) => {
        setSelectedUser(user);
        setSelectedRole(user?.role === "admin" ? "admin" : "user");
        setModalError("");
        setRoleModalOpen(true);
    }, []);

    const closeRoleModal = useCallback(() => {
        setRoleModalOpen(false);
        setSelectedUser(null);
        setSelectedRole("user");
        setModalError("");
    }, []);

    const openDeleteModal = useCallback((user) => {
        setDeleteUserTarget(user);
        setModalError("");
        setDeleteModalOpen(true);
    }, []);

    const closeDeleteModal = useCallback(() => {
        setDeleteModalOpen(false);
        setDeleteUserTarget(null);
        setModalError("");
    }, []);

    const handleSaveRole = useCallback(async () => {
        if (!selectedUser) return;
        setSaving(true);
        setModalError("");

        try {
            const updated = await updateUserRole(getUserId(selectedUser), { role: selectedRole });
            const updatedUser = updated && typeof updated === "object" ? updated : null;

            if (updatedUser) {
                setUsers((prev) => prev.map((user) => (getUserId(user) === getUserId(updatedUser) ? updatedUser : user)));
            } else {
                await fetchUsers();
            }
            showToast("User role updated successfully");
            closeRoleModal();
        } catch (err) {
            setModalError(getErrorMessage(err, "Unable to update user role."));
        } finally {
            setSaving(false);
        }
    }, [selectedRole, selectedUser, getErrorMessage, fetchUsers, closeRoleModal, getUserId, showToast]);

    const handleDeleteConfirm = useCallback(async () => {
        if (!deleteUserTarget) return;
        setSaving(true);
        setError("");

        try {
            await deleteUser(getUserId(deleteUserTarget));
            setUsers((prev) => prev.filter((item) => getUserId(item) !== getUserId(deleteUserTarget)));
            showToast("User deleted successfully");
            closeDeleteModal();
        } catch (err) {
            setModalError(getErrorMessage(err, "Unable to delete user."));
        } finally {
            setSaving(false);
        }
    }, [deleteUserTarget, getErrorMessage, getUserId, showToast, closeDeleteModal]);

    const filteredUsers = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();
        const list = Array.isArray(users) ? users : [];
        if (!query) return list;

        return list.filter((user) => {
            const name = (user?.name || "").toLowerCase();
            const email = (user?.email || "").toLowerCase();
            const phone = (user?.phone || user?.phoneNumber || user?.mobile || "").toString().toLowerCase();
            return name.includes(query) || email.includes(query) || phone.includes(query);
        });
    }, [searchTerm, users]);

    const stats = useMemo(() => {
        const list = Array.isArray(users) ? users : [];
        const totalUsers = list.length;
        const totalAdmins = list.filter((user) => user?.role === "admin").length;
        const normalUsers = totalUsers - totalAdmins;
        return { totalUsers, totalAdmins, normalUsers };
    }, [users]);

    const pageCount = useMemo(() => Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE)), [filteredUsers.length]);

    const paginatedUsers = useMemo(() => {
        const list = Array.isArray(filteredUsers) ? filteredUsers : [];
        const start = (currentPage - 1) * PAGE_SIZE;
        return list.slice(start, start + PAGE_SIZE);
    }, [filteredUsers, currentPage]);

    useEffect(() => {
        if (currentPage > pageCount) {
            setCurrentPage(pageCount);
        }
    }, [currentPage, pageCount]);

    const getSkills = useCallback((user) => {
        if (Array.isArray(user?.skills)) return user.skills;
        if (typeof user?.skills === "string") return user.skills.split(",").map((item) => item.trim()).filter(Boolean);
        return [];
    }, []);

    const getJoinedDate = useCallback((user) => {
        return formatDate(user?.createdAt || user?.joinedAt || user?.registeredAt || user?.created_at);
    }, []);

    const getUserPhone = useCallback((user) => {
        return user?.phone || user?.phoneNumber || user?.mobile || "N/A";
    }, []);

    const getUserStatus = useCallback((user) => {
        return (user?.status || "active").toLowerCase();
    }, []);

    return (
        <div>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Manage Users</h1>
                    <p className="text-gray-400">Review users, update roles, and remove accounts safely.</p>
                </div>
                <div className="max-w-md w-full">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <Input
                            className="pl-11"
                            placeholder="Search by name, email, or phone"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className="grid gap-4 mb-6 sm:grid-cols-3">
                <Card>
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wider">Total Users</p>
                            <p className="text-3xl font-bold text-white mt-2">{stats.totalUsers}</p>
                        </div>
                        <Users size={28} className="text-accent" />
                    </div>
                </Card>
                <Card>
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wider">Total Admins</p>
                            <p className="text-3xl font-bold text-white mt-2">{stats.totalAdmins}</p>
                        </div>
                        <ShieldCheck size={28} className="text-success" />
                    </div>
                </Card>
                <Card>
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wider">Normal Users</p>
                            <p className="text-3xl font-bold text-white mt-2">{stats.normalUsers}</p>
                        </div>
                        <User size={28} className="text-warning" />
                    </div>
                </Card>
            </div>

            {error && (
                <div className="mb-4 rounded-lg border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-red-200">
                    {error}
                </div>
            )}

            <Card className="!p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[980px] text-sm">
                        <thead>
                            <tr className="text-left text-gray-400 bg-white/5 sticky top-0 backdrop-blur-sm">
                                <th className="px-4 py-3">#</th>
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Email</th>
                                <th className="px-4 py-3">Phone</th>
                                <th className="px-4 py-3">Role</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Skills</th>
                                <th className="px-4 py-3">Joined</th>
                                <th className="px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array.from({ length: 6 }).map((_, rowIndex) => (
                                    <tr key={rowIndex} className="border-t border-white/5">
                                        {Array.from({ length: 9 }).map((__, cellIndex) => (
                                            <td key={cellIndex} className="px-4 py-4">
                                                <div className="h-4 w-full rounded-full bg-white/5 animate-pulse" />
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : !Array.isArray(filteredUsers) || filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="px-4 py-16 text-center text-gray-400">
                                        <div className="flex flex-col items-center gap-3">
                                            <span className="text-4xl">👥</span>
                                            <p className="text-lg text-white font-semibold">No users found.</p>
                                            <p className="max-w-md text-sm text-gray-400">Try changing your search or create a new user.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                paginatedUsers.map((user, index) => {
                                    const rowNumber = (currentPage - 1) * PAGE_SIZE + index + 1;
                                    const phone = getUserPhone(user);
                                    const status = getUserStatus(user);
                                    const roleVariant = user?.role === "admin" ? "purple" : "blue";
                                    const statusVariant = status === "active" ? "success" : "danger";
                                    const skills = getSkills(user);

                                    return (
                                        <tr key={getUserId(user) || rowNumber} className="border-t border-white/5 hover:bg-white/5 transition-colors duration-200">
                                            <td className="px-4 py-3 text-gray-400">{rowNumber}</td>
                                            <td className="px-4 py-3 text-white">{user?.name || "—"}</td>
                                            <td className="px-4 py-3 text-gray-400 break-all">{user?.email || "—"}</td>
                                            <td className="px-4 py-3 text-gray-400">{phone}</td>
                                            <td className="px-4 py-3">
                                                <Badge variant={roleVariant}>{user?.role === "admin" ? "Admin" : "User"}</Badge>
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge variant={statusVariant}>{status === "active" ? "Active" : "Inactive"}</Badge>
                                            </td>
                                            <td className="px-4 py-3">
                                                {skills.length === 0 ? (
                                                    <span className="text-gray-400 text-xs">No Skills</span>
                                                ) : (
                                                    <div className="flex flex-wrap gap-2">
                                                        {skills.slice(0, 3).map((skill) => (
                                                            <Badge key={skill} variant="info" className="text-[11px] py-1 px-2">
                                                                {skill}
                                                            </Badge>
                                                        ))}
                                                        {skills.length > 3 && (
                                                            <span className="text-gray-300 text-xs self-center">+{skills.length - 3} more</span>
                                                        )}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-gray-400">{getJoinedDate(user)}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex flex-wrap gap-2">
                                                    <Button size="sm" variant="outline" onClick={() => openEditModal(user)}>
                                                        <Edit size={14} /> Role
                                                    </Button>
                                                    <Button size="sm" variant="ghost" onClick={() => openDeleteModal(user)} disabled={saving}>
                                                        <Trash2 size={14} /> Delete
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {filteredUsers.length > PAGE_SIZE && (
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-gray-300">
                    <p className="text-xs text-gray-500">Showing {Math.min(filteredUsers.length, PAGE_SIZE)} of {filteredUsers.length} users</p>
                    <div className="inline-flex flex-wrap items-center gap-2">
                        {Array.from({ length: pageCount }, (_, index) => (
                            <button
                                key={index}
                                type="button"
                                className={`rounded-2xl border px-3 py-2 transition ${currentPage === index + 1 ? "border-accent bg-accent/10 text-white" : "border-white/10 text-gray-400 hover:border-white/20 hover:text-white"}`}
                                onClick={() => setCurrentPage(index + 1)}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <Modal isOpen={isRoleModalOpen} onClose={closeRoleModal} title="Edit User Role">
                <div className="space-y-4">
                    <p className="text-sm text-gray-400">Update the role for {selectedUser?.name || selectedUser?.email}.</p>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                        <select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="w-full rounded-2xl border border-white/20 bg-white/5 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent"
                        >
                            <option value="user" className="bg-navy">User</option>
                            <option value="admin" className="bg-navy">Admin</option>
                        </select>
                    </div>

                    {modalError && (
                        <div className="rounded-lg border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-red-200">
                            {modalError}
                        </div>
                    )}

                    <div className="flex flex-wrap gap-3 justify-end pt-2">
                        <Button type="button" variant="outline" onClick={closeRoleModal}>Cancel</Button>
                        <Button type="button" onClick={handleSaveRole} loading={saving}>Save Role</Button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal} title="Delete User?">
                <div className="space-y-4">
                    <p className="text-sm text-gray-400">Are you sure you want to permanently delete this user? This action cannot be undone.</p>
                    {modalError && (
                        <div className="rounded-lg border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-red-200">
                            {modalError}
                        </div>
                    )}
                    <div className="flex flex-wrap gap-3 justify-end pt-2">
                        <Button type="button" variant="outline" onClick={closeDeleteModal}>Cancel</Button>
                        <Button type="button" variant="secondary" onClick={handleDeleteConfirm} loading={saving}>Delete</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default AdminUsersManagement;
