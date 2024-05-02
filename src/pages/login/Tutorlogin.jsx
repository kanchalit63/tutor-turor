import { useNavigate } from "react-router-dom"
import { useFormik } from "formik"
import * as Yup from "yup"
import Icon from "@mdi/react"
import { mdiEyeOffOutline, mdiEyeOutline } from "@mdi/js"
import { useState } from "react"
import Cookies from "js-cookie";
import axios from "axios";
import { apiConfig } from "../../config/api.config";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Toastifycon from "../../../global-components/Toastcon";


function Tutorlogin() {
    const [changepassword, setChangePassword] = useState(false)
    const navigate = useNavigate();
    const initialValues = {
        username: "",
        password: "",
    }

    const schema = Yup.object({
        username: Yup.string().required("กรุณากรอกชื่อผู้ใช้งาน"),
        password: Yup.string().required("กรุณากรอกรหัสผ่าน"),
    })

    const formik = useFormik({
        initialValues,
        validationSchema: schema,
        onSubmit: () => {
            axios.post(`${apiConfig.baseURL}/tutor-login`, {
                username: formik.values.username,
                password: formik.values.password
            })
                .then(response => {
                    if (response.status === 200) {
                        const token = response.data.data.token;
                        Cookies.set("tutor-token", token, { expires: 60 * 60 });
                        setTimeout(() => {
                            Cookies.remove("tutor-token");
                            // อื่นๆ ที่คุณต้องการทำหลังจากลบ token
                        }, 3600000);
                        formik.resetForm();
                        navigate("/");
                    } else {
                        console.error("Login failed. Status:", response.status);
                    }
                })
                .catch(() => {
                    toast.error("ชื่อผู้ใช้งานหรือรหัสผ่านผิดพลาด กรุณาลองใหม่อีกครั้ง")
                });
        },
    })

    return (
        <>
            <Toastifycon />
            <div className="bg-[#37DD95] h-[100vh] flex items-center justify-center">
                <div className="bg-white py-32 w-[500px] rounded-xl flex flex-col justify-center">
                    <form className="flex flex-col px-16 " onSubmit={formik.handleSubmit}>
                        <h1 className="text-4xl font-bold mb-6">เข้าสู่ระบบสำหรับติวเตอร์</h1>
                        <label htmlFor="">ชื่อผู้ใช้งาน</label>
                        <input
                            type="text"
                            id="username"
                            value={formik.values.username}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="กรุณากรอก Username"
                            className="border-2 p-2 rounded-md"
                        />
                        {formik.touched.username && formik.errors.username ? (
                            <small className="text-red-500">{formik.errors.username}</small>
                        ) : null}
                        <label htmlFor="">รหัสผ่าน</label>
                        <div className="relative">
                            <input
                                type={changepassword ? "text" : "password"}
                                id="password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="กรุณากรอก Password"
                                className="border-2 p-2 rounded-md w-full"
                            />
                            <Icon
                                path={changepassword ? mdiEyeOutline : mdiEyeOffOutline}
                                size={0.8}
                                className="absolute bottom-[11px] right-3 text-gray-400 cursor-pointer"
                                onClick={() => setChangePassword(!changepassword)}
                            />
                        </div>
                        {formik.touched.password && formik.errors.password ? (
                            <small className="text-red-500">{formik.errors.password}</small>
                        ) : null}{" "}
                        <button type="submit" className="bg-blue-500 text-white  rounded-lg h-10 my-3">
                            เข้าสู่ระบบ
                        </button>
                        <div className="space-y-1 text-end">
                            <p className=" text-blue-700 underline">ลืมรหัสผ่าน?</p>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Tutorlogin
