"use client"

import { FaAngleDoubleUp } from "@react-icons/all-files/fa/FaAngleDoubleUp";
import ScrollToTop from "react-scroll-to-top";

export default function ScrollTop() {
    return (
        <>
            <ScrollToTop smooth component={<FaAngleDoubleUp className="mx-auto" size={24} />} style={{
                backgroundColor: "#ff5555", color: "#ffffff", borderRadius: "0", right: "24px",
                bottom: "24px", width: "50px", height: "50px"
            }} />
        </>
    )
}