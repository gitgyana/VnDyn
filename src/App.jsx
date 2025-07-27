import React, { useState } from "react";
import Home from "./components/Home";
import Signup from "./components/Signup";
import Login from "./components/Login";
import UserData from "./components/UserData";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Admin from "./components/Admin";
import VendorPortal from "./components/VendorPortal";
import SupplierPortal from "./components/SupplierPortal";
import PaymentProcessing from "./components/PaymentProcessing";

function App() {
    const [view, setView] = useState("home");
    const [selectedType, setSelectedType] = useState("");
    const [user, setUser] = useState(null);

    const goHome = () => { setView("home"); setUser(null); };
    const goSignup = (type) => { setSelectedType(type); setView("signup"); };
    const goLogin = () => setView("login");
    const showUserData = (userObj, msg) => { setUser({ ...userObj, msg }); setView("userData"); };

    return (
        <BrowserRouter>
            {view === "home" && <Home onSelectType={goSignup} />}
            {view === "signup" && (
                <Signup /* props */ onSuccess={(u) => setUser(u)} /* … */ />
            )}
            {view === "login" && (
                <Login /* props */ onSuccess={(u) => setUser(u)} /* … */ />
            )}
            {view === "userData" && (
                <UserData
                    user={user}
                    onHome={goHome}
                    // link to portal based on role
                    portal={
                        user?.type === "Street Vendor" ? (
                            <VendorPortal user={user} />
                        ) : (
                            <SupplierPortal user={user} />
                        )
                    }
                />
            )}

            {/* Role-specific dashboards via explicit routes */}
            <Routes>
                <Route path="/admin" element={<Admin />} />
                <Route path="/payments" element={<PaymentProcessing />} />
                {/* vendor and supplier dashboards handled above inside userData */}
            </Routes>
        </BrowserRouter>
    );
}

export default App;
