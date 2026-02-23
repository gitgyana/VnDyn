import React, { useState, useEffect } from "react";


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

    const [view, setView] = useState("home");


    const [user, setUser] = useState(null);
    const [selectedType, setSelectedType] = useState("");


    const [message, setMessage] = useState("");


    useEffect(() => {
        const savedUser = localStorage.getItem("vndyn_user");
        if (savedUser) {
            try {
                const userData = JSON.parse(savedUser);
                setUser(userData);
                setView("userData");
                setMessage("Welcome back!");
                setTimeout(() => setMessage(""), 3000);
            } catch (error) {
                localStorage.removeItem("vndyn_user");
            }
        }
    }, []);


    const goHome = () => {
        setView("home");
        setUser(null);
        setSelectedType("");
        setMessage("");
        localStorage.removeItem("vndyn_user");
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
        localStorage.setItem("vndyn_user", JSON.stringify(userData));
    };

    const goToVendorPortal = () => {
        if (!user || user.type !== "Street Vendor") return goHome();
        setView("vendor");
        setMessage("");
    };

    const goToSupplierPortal = () => {
        if (!user || user.type === "Street Vendor") return goHome();
        setView("supplier");
        setMessage("");
    };

    const goToAdmin = () => {
        if (!user || user.type !== "Admin") return goHome();
        setView("admin");
        setMessage("");
    };

    const goToPayments = () => {
        if (!user) return goHome();
        setView("payments");
        setMessage("");
    };

    const goToComplaints = () => {
        if (!user) return goHome();
        setView("complaints");
        setMessage("");
    };

    const handleAuthSuccess = (userData, successMessage) => {
        setUser(userData);
        setMessage(successMessage);
        setView("userData");
        localStorage.setItem("vndyn_user", JSON.stringify(userData));
    };


    const renderCurrentView = () => {
        switch (view) {
            case "home":
                return <Home onSelectType={goSignup} onLogin={goLogin} />;

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
                if (!user) return goHome();
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
                if (!user || user.type !== "Street Vendor") return goHome();
                return (
                    <VendorPortal
                        user={user}
                        onHome={goHome}
                        onUserData={() => setView("userData")}
                        onComplaints={goToComplaints}
                    />
                );

            case "supplier":
                if (!user || user.type === "Street Vendor") return goHome();
                return (
                    <SupplierPortal
                        user={user}
                        onHome={goHome}
                        onUserData={() => setView("userData")}
                        onPayments={goToPayments}
                    />
                );

            case "admin":
                if (!user || user.type !== "Admin") return goHome();
                return (
                    <Admin
                        user={user}
                        onHome={goHome}
                        onUserData={() => setView("userData")}
                        onPayments={goToPayments}
                    />
                );

            case "payments":
                if (!user) return goHome();
                return (
                    <PaymentProcessing
                        user={user}
                        onHome={goHome}
                        onUserData={() => setView("userData")}
                        onAdmin={goToAdmin}
                    />
                );

            case "complaints":
                if (!user) return goHome();
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
        <div className="app-container">
            {renderCurrentView()}
        </div>
    );
}

export default App;