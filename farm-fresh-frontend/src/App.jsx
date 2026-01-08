import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import FarmerDashboard from "./pages/FarmerDashboard";
import RetailerDashboard from "./pages/RetailerDashboard";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword.jsx";
import { Toaster } from "react-hot-toast";
import AdminRoute from "./routes/AdminRoute";
import LandingPage from "./pages/LandingPage.jsx";
import PendingApproval from "./pages/PendingApproval.jsx";
import MyOrders from "./pages/MyOrders.jsx";
import Marketplace from "./pages/MarketPlace.jsx";
import Profile from "./pages/RetailerProfile.jsx";
import Messages from "./pages/Messages.jsx";

import MyListings from "./pages/MyListings.jsx";
import Orders from "./pages/Orders.jsx";
import Bids from "./pages/Bids.jsx";
import NewListing from "./pages/NewListings.jsx";
import FarmerProfile from "./pages/FarmerProfile.jsx";
import FarmerNotifications from "./pages/FarmerNotification.jsx";
import PendingUsers from "./pages/PendingUsers.jsx";
import ApprovedUsers from "./pages/ApprovedUsers.jsx";
import Analytics from "./pages/Analytics.jsx";
import RejectedUsers from "./pages/RejectedUsers.jsx";
import Settings from "./pages/Settings.jsx";
import AdminHelp from "./pages/AdminHelp.jsx";


function App() {
    return (
        <>
            <Toaster position="top-right" reverseOrder={false}/>

    <BrowserRouter>
        <Routes>
            {/* ✅ ADMIN PROTECTED ROUTE */}
            <Route
                path="/admin"
                element={
                    <AdminRoute>
                        <AdminDashboard/>
                    </AdminRoute>
                }
            />


            <Route path="/register" element={<Register/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/admin" element={<AdminDashboard/>}/>
            <Route path="/farmer/dashboard" element={<FarmerDashboard/>}/>
            <Route path="/retailer" element={<RetailerDashboard/>}/>
            <Route path="*" element={< LandingPage/>}/>
            <Route path="/reset-password" element={<ResetPassword/>}/>
            <Route path="/pending-approval" element={<PendingApproval/>}/>
            <Route path="/retailer/dashboard" element={<RetailerDashboard />} />
            <Route path="/retailer/marketplace" element={<Marketplace />} />
            <Route path="/retailer/orders" element={<MyOrders />} />
            <Route path="/retailer/messages" element={<Messages />} />
            <Route path="/retailer/profile" element={<Profile />} />

            <Route path="/admin/pending" element={<PendingUsers />} />
            <Route path="/admin/help" element={<AdminHelp/>} />
            <Route path="/admin/settings" element={<Settings/>} />

            <Route path="/farmer/listings" element={<MyListings />} />
            <Route path="/farmer/new-listing" element={<NewListing/>} />
            <Route path="/farmer/orders" element={<Orders />} />
            <Route path="/farmer/bids/:id" element={<Bids />} />
            <Route path="/farmer/profile" element={<FarmerProfile/>}/>
            <Route path="/farmer/notifications" element={<FarmerNotifications/>}/>

        </Routes>
    </BrowserRouter>
</>

);

}
export default App;
