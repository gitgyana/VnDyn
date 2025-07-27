import React, { useState } from "react";

import Home from "./components/Home";
import Signup from "./components/Signup";
import Login from "./components/Login";
import UserData from "./components/UserData";
import VendorPortal from "./components/VendorPortal";
import SupplierPortal from "./components/SupplierPortal";
import Admin from "./components/Admin";
import PaymentProcessing from "./components/PaymentProcessing";
import ComplaintForm from "./components/ComplaintForm";

function App() {
    // Main view states: 'home', 'signup', 'login', 'userData', 'vendor', 'supplier', 'admin', 'payments', 'complaints'
    const [view, setView] = useState("home");

    // User and authentication state
    const [user, setUser] = useState(null);
    const [selectedType, setSelectedType] = useState("");

    // Message state for notifications
    const [message, setMessage] = useState("");

    // Navigation handlers
    const goHome = () => {
        setView("home");
        setUser(null);
        setSelectedType("");
        setMessage("");
    };

    const goSignup = (type) => {
        setSelectedType(type);
        setView("signup");
        setMessage("");
    };

    const goLogin = () => {
        setView("login");
        setMessage("");
    };

    const showUserData = (userData, msg = "") => {
        setUser(userData);
        setMessage(msg);
        setView("userData");
    };

    const goToVendorPortal = () => {
        setView("vendor");
        setMessage("");
    };

    const goToSupplierPortal = () => {
        setView("supplier");
        setMessage("");
    };

    const goToAdmin = () => {
        setView("admin");
        setMessage("");
    };

    const goToPayments = () => {
        setView("payments");
        setMessage("");
    };

    const goToComplaints = () => {
        setView("complaints");
        setMessage("");
    };

    const handleAuthSuccess = (userData, successMessage) => {
        setUser(userData);
        setMessage(successMessage);
        setView("userData");
    };

    // Render based on current view
    const renderCurrentView = () => {
        switch (view) {
            case "home":
                return <Home onSelectType={goSignup} />;

            case "signup":
                return (
                    <Signup
                        selectedType={selectedType}
                        onSuccess={handleAuthSuccess}
                        onHome={goHome}
                        onLogin={goLogin}
                    />
                );

            case "login":
                return (
                    <Login
                        onSuccess={handleAuthSuccess}
                        onSignup={() => setView("signup")}
                        onHome={goHome}
                    />
                );

            case "userData":
                return (
                    <UserData
                        user={user}
                        message={message}
                        onHome={goHome}
                        onVendorPortal={goToVendorPortal}
                        onSupplierPortal={goToSupplierPortal}
                        onAdmin={goToAdmin}
                        onPayments={goToPayments}
                        onComplaints={goToComplaints}
                    />
                );

            case "vendor":
                return (
                    <VendorPortal
                        user={user}
                        onHome={goHome}
                        onUserData={() => setView("userData")}
                        onComplaints={goToComplaints}
                    />
                );

            case "supplier":
                return (
                    <SupplierPortal
                        user={user}
                        onHome={goHome}
                        onUserData={() => setView("userData")}
                        onPayments={goToPayments}
                    />
                );

            case "admin":
                return (
                    <Admin
                        user={user}
                        onHome={goHome}
                        onUserData={() => setView("userData")}
                        onPayments={goToPayments}
                    />
                );

            case "payments":
                return (
                    <PaymentProcessing
                        user={user}
                        onHome={goHome}
                        onUserData={() => setView("userData")}
                        onAdmin={goToAdmin}
                    />
                );

            case "complaints":
                return (
                    <ComplaintForm
                        user={user}
                        onHome={goHome}
                        onUserData={() => setView("userData")}
                        onSuccess={(msg) => {
                            setMessage(msg);
                            setView("userData");
                        }}
                    />
                );

            default:
                return <Home onSelectType={goSignup} />;
        }
    };

    return (
        <div>
            {/*{renderCurrentView()}*/}
            <h1>Hello World</h1>
        </div>
    );
}

export default App;