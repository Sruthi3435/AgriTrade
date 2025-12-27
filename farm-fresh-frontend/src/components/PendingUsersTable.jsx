export default function PendingUsersTable({ users, onApprove, onReject }) {
    return (
        <div className="bg-white mt-8 rounded-xl shadow overflow-x-auto">
            <h2 className="text-lg font-semibold p-4 border-b">
                Pending Users
            </h2>

            <table className="w-full text-left">
                <thead className="bg-gray-50 text-sm text-gray-600">
                <tr>
                    <th className="p-4">Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th className="text-center">Action</th>
                </tr>
                </thead>

                <tbody>
                {users.map(user => (
                    <tr key={user.id} className="border-t hover:bg-gray-50">
                        <td className="p-4 font-medium">{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                                <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700">
                                    {user.role}
                                </span>
                        </td>
                        <td className="text-center space-x-2">
                            <button
                                onClick={() => onApprove(user.id)}
                                className="px-3 py-1 bg-green-600 text-white rounded text-sm"
                            >
                                Approve
                            </button>
                            <button
                                onClick={() => onReject(user.id)}
                                className="px-3 py-1 bg-red-500 text-white rounded text-sm"
                            >
                                Reject
                            </button>
                        </td>
                    </tr>
                ))}

                {users.length === 0 && (
                    <tr>
                        <td colSpan="4" className="p-6 text-center text-gray-500">
                            No pending users
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
}
