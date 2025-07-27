import React, { useState, useRef, useCallback } from "react";

export default function Home({ onSelectType }) {
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

    React.useEffect(() => {
        return () => {
            if (intervals.current.del) clearInterval(intervals.current.del);
            if (intervals.current.type) clearInterval(intervals.current.type);
        };
    }, []);

    return (
        <>
            <div id="app">
                <h1 id="title" className={fadeIn ? "fade-in" : ""}>{title}</h1>
                <button
                    className="btn"
                    onMouseOver={() => setTitleTypedText("Street Vendor")}
                    onMouseOut={() => setTitleTypedText("")}
                    onClick={() => onSelectType("Street Vendor")}
                >
                    Vendor
                </button>
                <button
                    className="btn"
                    onMouseOver={() => setTitleTypedText("Retailer to Vendor")}
                   onMouseOut={() => setTitleTypedText("")}
                    onClick={() => onSelectType("Retailer to Vendor")}
                >
                    Retailer
                </button>
            </div>
        </>
    );
}
