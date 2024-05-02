import { createBrowserRouter } from "react-router-dom";
import TutorLogin from "../pages/login/Tutorlogin";
import Hometutor from "../pages/hometutor/HomeTutor";
import ProtectedRoute from "../components/protect/ProtectedRoute";

const router = createBrowserRouter([
    {
        path: "/",
        element: <ProtectedRoute><Hometutor /></ProtectedRoute>, // ใช้ ProtectedRoute เพื่อป้องกันการเข้าถึงหน้า Home
        children: [
            {
                index: true,
                element: <Hometutor />,
            },
        ],
    },
    {
        path: "/login",
        element: <TutorLogin />,
    },
]);

export default router;
