import React, { useState } from "react";
import Home from "./components/Home";
import Signup from "./components/Signup";
import Login from "./components/Login";
import UserData from "./components/UserData";

function App() {
    const [view, setView] = useState("home");
    const [selectedType, setSelectedType] = useState("");
    const [user, setUser] = useState(null);

    const goHome = () => { setView("home"); setUser(null); };
    const goSignup = (type) => { setSelectedType(type); setView("signup"); };
    const goLogin = () => setView("login");
    const showUserData = (userObj, msg) => { setUser({ ...userObj, msg }); setView("userData"); };

    return (
        <div>
            {view === "home" && <Home onSelectType={goSignup} />}
            {view === "signup" &&
                <Signup
                    selectedType={selectedType}
                    onHome={goHome}
                    onLogin={goLogin}
                    onSuccess={showUserData}
                />}
            {view === "login" &&
                <Login
                    onHome={goHome}
                    onSignup={() => setView("signup")}
                    onSuccess={showUserData}
                />}
            {view === "userData" &&
                <UserData user={user} onHome={goHome} />}
        </div>
    );
}

export default App;
