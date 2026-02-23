import React, { useState, useRef, useCallback, useEffect } from "react";
import bgVideo from "../assets/videos/bg_vid.mp4";

export default function Home({ onSelectType, onLogin }) {

    const baseText = "VnDyn";
    const [title, setTitle] = useState(baseText);
    const [fadeIn, setFadeIn] = useState(false);
    const intervals = useRef({ del: null, type: null });

    const setTitleTypedText = useCallback((newSuffix) => {

        if (intervals.current.del) clearInterval(intervals.current.del);
        if (intervals.current.type) clearInterval(intervals.current.type);

        let currentText = title;
        setFadeIn(false);

        intervals.current.del = setInterval(() => {
            if (currentText.length > baseText.length) {
                currentText = currentText.slice(0, -1);
                setTitle(currentText);
            } else {
                clearInterval(intervals.current.del);
                intervals.current.del = null;

                if (newSuffix) {
                    let i = 0;
                    currentText = baseText + ": ";
                    setTitle(currentText);
                    setFadeIn(true);

                    intervals.current.type = setInterval(() => {
                        if (i < newSuffix.length) {
                            currentText += newSuffix[i];
                            setTitle(currentText);
                            i++;
                        } else {
                            clearInterval(intervals.current.type);
                            intervals.current.type = null;
                        }
                    }, 40);
                } else {
                    setFadeIn(false);
                }
            }
        }, 30);

    }, [baseText, title]);

    useEffect(() => {
        return () => {
            if (intervals.current.del) clearInterval(intervals.current.del);
            if (intervals.current.type) clearInterval(intervals.current.type);
        };
    }, []);

    return (
        <div className="landing-container">

            {/* Background Video */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="background-video"
            >
                <source src={bgVideo} type="video/mp4" />
            </video>

            {/* Dark Overlay + Content */}
            <div className="content-overlay">

                {/* Top Navigation */}
                <nav className="top-nav">
                    <h2 className="logo">VnDyn</h2>
                    <div>
                        <button
                            className="nav-btn"
                            onClick={() => onSelectType("")}
                        >
                            Sign Up
                        </button>
                        <button
                            className="nav-btn"
                            onClick={onLogin}
                        >
                            Login
                        </button>
                    </div>
                </nav>

                {/* Hero Section */}
                <div className="hero-section">
                    <h1 className={fadeIn ? "fade-in" : ""}>{title}</h1>

                    <p className="subtitle">
                        Digital Hub for Street Food Vendors & Resource Retailers
                    </p>

                    <div className="button-group">

                        <button
                            className="btn primary-btn"
                            onMouseOver={() => setTitleTypedText("Street Vendor")}
                            onMouseOut={() => setTitleTypedText("")}
                            onClick={() => onSelectType("Street Vendor")}
                        >
                            Join as Vendor
                        </button>

                        <button
                            className="btn secondary-btn"
                            onMouseOver={() => setTitleTypedText("Retailer to Vendor")}
                            onMouseOut={() => setTitleTypedText("")}
                            onClick={() => onSelectType("Retailer to Vendor")}
                        >
                            Join as Retailer
                        </button>

                    </div>
                </div>

            </div>
        </div>
    );
}