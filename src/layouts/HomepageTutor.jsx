import { Outlet } from "react-router-dom"
import Navbar from "../components/navbar/Navbar"

function HomepageTutor() {
    return (
        <>
            <Navbar />
            <div>
                <Outlet />
            </div>
        </>
    )
}

export default HomepageTutor