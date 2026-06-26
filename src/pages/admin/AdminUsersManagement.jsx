import { useEffect, useState } from "react";
import { Users, ShieldCheck, ShieldOff, Trash2 } from "lucide-react";
import Card from "../../components/common/Card.jsx";
import Badge from "../../components/common/Badge.jsx";
import Button from "../../components/common/Button.jsx";
import useUIStore from "../../store/uiStore.js";
import { getAdminUsers, updateAdminUser, deleteAdminUser } from "../../services/adminService.js";

function AdminUsersManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);
    const addToast = useUIStore((s) => s.addToast);

    useEffect(() => {
        fetchUsers();
    }, []);

    const getUserId = (user) => user.id || user._id;

    const fetchUsers = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await getAdminUsers();
            setUsers(Array.isArray(response) ? response : []);
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Unable to load users.");
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleRole = async (user) => {
        setSaving(true);
        setError("");

        try {
            const payload = { role: user.role === "admin" ? "user" : "admin" };
            const response = await updateAdminUser(getUserId(user), payload);
            const updatedUser = response && typeof response === "object" ? response : null;

            if (updatedUser) {
                setUsers((prev) => prev.map((item) => (getUserId(item) === getUserId(updatedUser) ? updatedUser : item)));
            } else {
                await fetchUsers();
            }
            addToast("User role updated successfully");
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Unable to update user role.");
        } finally {
            setSaving(false);
        }
    };

    const handleToggleStatus = async (user) => {
        setSaving(true);
        setError("");

        try {
            const payload = { status: user.status === "active" ? "inactive" : "active" };
            const response = await updateAdminUser(getUserId(user), payload);
            const updatedUser = response && typeof response === "object" ? response : null;

            if (updatedUser) {
                setUsers((prev) => prev.map((item) => (getUserId(item) === getUserId(updatedUser) ? updatedUser : item)));
            } else {
                await fetchUsers();
            }
            addToast("User status updated successfully");
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Unable to update user status.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (user) => {
        if (!window.confirm("Are you sure you want to permanently delete this user?")) return;

        try {
            await deleteAdminUser(getUserId(user));
            setUsers((prev) => prev.filter((item) => getUserId(item) !== getUserId(user)));
            addToast("User deleted successfully");
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Unable to delete user.");
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">User Management</h1>
                    <p className="text-gray-400">Review, update, and remove users from the platform.</p>
                </div>
            </div>

            {error && (
                <div className="mb-4 rounded-lg border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-red-200">
                    {error}
                </div>
            )}

            <Card className="!p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-gray-400 bg-white/5">
                                <th className="px-4 py-3">User ID</th>
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Email</th>
                                <th className="px-4 py-3">Role</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-4 py-8 text-center text-gray-400">Loading users...</td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-4 py-8 text-center text-gray-400">No users found.</td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={getUserId(user)} className="border-t border-white/5 hover:bg-white/5">
                                        <td className="px-4 py-3 text-gray-400">{getUserId(user)}</td>
                                        <td className="px-4 py-3 text-white">{user.name || "—"}</td>
                                        <td className="px-4 py-3 text-gray-400">{user.email || "—"}</td>
                                        <td className="px-4 py-3">
                                            <Badge variant={user.role === "admin" ? "success" : "secondary"}>{user.role || "user"}</Badge>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge variant={user.status === "active" ? "success" : "warning"}>{user.status || "inactive"}</Badge>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-wrap gap-2">
                                                <Button size="sm" variant="outline" onClick={() => handleToggleRole(user)} disabled={saving}>
                                                    {user.role === "admin" ? <ShieldOff size={14} /> : <ShieldCheck size={14} />} {user.role === "admin" ? "Demote" : "Promote"}
                                                </Button>
                                                <Button size="sm" variant="outline" onClick={() => handleToggleStatus(user)} disabled={saving}>
                                                    {user.status === "active" ? "Deactivate" : "Activate"}
                                                </Button>
                                                <Button size="sm" variant="ghost" onClick={() => handleDelete(user)} disabled={saving}>
                                                    <Trash2 size={14} /> Delete
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card >
        </div >
    );
}

export default AdminUsersManagement;
