import DashboardLayout from "../components/DashboardLayout";

export default function Settings() {
    return (
        <DashboardLayout>
            <h1 className="text-2xl font-bold mb-6">Admin Settings</h1>

            <div className="bg-white rounded-xl p-6 shadow-sm space-y-4 text-sm">
                <div>
                    <p className="font-medium">System Mode</p>
                    <p className="text-gray-500">Production</p>
                </div>

                <div>
                    <p className="font-medium">Notifications</p>
                    <p className="text-gray-500">Enabled</p>
                </div>

                <div>
                    <p className="font-medium">Access Level</p>
                    <p className="text-gray-500">Administrator</p>
                </div>
            </div>
        </DashboardLayout>
    );
}
