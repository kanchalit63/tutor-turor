/* eslint-disable react-hooks/exhaustive-deps */
import { Input, Button } from 'antd';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { apiConfig } from '../../config/api.config';
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Select } from 'antd';

const TutorProfile = () => {

    const [profileData, setProfileData] = useState(null);
    const [selectedBank, setSelectedBank] = useState(null);
    const [username, setUsername] = useState(null);
    const [profileImage, setProfileImage] = useState(null);




    const fetchProfileData = async () => {
        try {
            const tokenFromCookie = Cookies.get('tutor-token');
            if (!tokenFromCookie) {
                throw new Error('Token not found in cookies');
            }
            const token = tokenFromCookie.replace('Bearer ', '');

            const response = await axios.get(`${apiConfig.baseURL}/tutorprofile`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                setProfileData(response.data.data);
                setUsername(response.data.data?.username); // Set username here
            } else {
                throw new Error('Failed to fetch profile data');
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchProfileData();
    }, []);



    useEffect(() => {
        // Initialize formik form after profileData is fetched
        if (profileData) {
            formik.setValues({
                firstname: profileData.firstname || "",
                lastname: profileData.lastname || "",
                description: profileData.description || "",
                experience: profileData.experience || "",
                address: profileData.address || "",
                tel: profileData.tel || "",
                bankaccount: profileData.bankaccount || "",
                bank: profileData.bank || "",
            });
        }
    }, [profileData]);

    const schema = Yup.object({
        firstname: Yup.string().required("กรุณากรอกชื่อจริงที่ต้องการแก้ไข"),
        lastname: Yup.string().required("กรุณากรอกนามสกุลที่ต้องการแก้ไข"),
        description: Yup.string().required("กรุณากรอกข้อมูลเกี่ยวกับตัวเองที่ต้องการแก้ไข"),
        experience: Yup.string().required("กรุณากรอกประสบการณ์ที่ต้องการแก้ไข"),
        address: Yup.string().required("กรุณากรอกที่อยู่ที่ต้องการแก้ไข"),
        tel: Yup.string().required("กรุณากรอกเบอร์โทรที่ต้องการแก้ไข"),
    });

    const formik = useFormik({
        initialValues: {
            firstname: "",
            lastname: "",
            description: "",
            experience: "",
            address: "",
            tel: "",
            bankaccount: "",
        },
        validationSchema: schema,
        onSubmit: async (values) => {
            try {
                const tokenFromCookie = Cookies.get('tutor-token');
                if (!tokenFromCookie) {
                    throw new Error('Token not found in cookies');
                }
                const token = tokenFromCookie.replace('Bearer ', '');


                await updateProfileTutor({
                    ...values,
                    bank: selectedBank,
                }, token);
            } catch (error) {
                console.error(error);
                toast.error('เกิดข้อผิดพลาด: ' + error.message);
            }
        }
    });

    const updateProfileTutor = async (values, token) => {
        try {
            const response = await axios.patch(`${apiConfig.baseURL}/updateTutorProfile`, {
                id: profileData.id,
                username: username,
                firstname: values.firstname,
                lastname: values.lastname,
                description: values.description,
                experience: values.experience,
                address: values.address,
                tel: values.tel,
                bankaccount: values.bankaccount,
                bank: values.bank,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                toast.success('อัปเดตข้อมูลผู้ใชงานสำเร็จ');
            } else {
                console.log('เกิดข้อผิดพลาดในการอัปเดตข้อมูล');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('เกิดข้อผิดพลาดในการอัปเดตข้อมูล');
        }
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setProfileImage(file);
    };

    const handleUploadImage = async () => {
        try {
            if (!profileImage) {
                toast.error("กรุณาเลือกรูปภาพก่อนทำการอัปโหลด");
                return;
            }

            const tokenFromCookie = Cookies.get("tutor-token");
            if (!tokenFromCookie) {
                throw new Error("Token not found in cookies");
            }
            const token = tokenFromCookie.replace("Bearer ", "");

            const formData = new FormData();
            formData.append("tutorId", profileData.id);
            formData.append("image", profileImage);

            await axios.patch(`${apiConfig.baseURL}/updateTutorImage`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            // Clear profileImage state after successful upload
            window.location.reload();
            setProfileImage(null);
        } catch (error) {
            console.error(error);
            toast.error("Failed to upload profile image");
        }
    };


    const bankOptions = [
        { label: "ธนาคารกรุงเทพ", value: "ธนาคารกรุงเทพ" },
        { label: "ธนาคารกสิกรไทย", value: "ธนาคารกสิกรไทย" },
        { label: "ธนาคารกรุงไทย", value: "ธนาคารกรุงไทย" },
        { label: "ธนาคารไทยพาณิชย์", value: "ธนาคารไทยพาณิชย์" },
        { label: "ธนาคารทหารไทย", value: "ธนาคารทหารไทย" },
        { label: "ธนาคารออมสิน", value: "ธนาคารออมสิน" },
    ];

    return (
        <div>
            <ToastContainer />
            {profileData && (
                <form className='flex flex-col justify-between mt-5 px-96' onSubmit={formik.handleSubmit}>
                    <div className='flex flex-col w-full space-y-2'>
                        <div className='flex items-center gap-5'>
                            {profileData?.image && profileData.image !== "http://localhost:8080/images/" ? (<img
                                src={profileData.image}
                                alt="โปรไฟล์"
                                className="w-40 h-40 rounded-full object-cover"
                            />
                            ) : (
                                <img
                                    src="./public/assets/user/profile/profile2.png"
                                    alt="โปรไฟล์"
                                    className="w-40 h-40 rounded-full object-cover"
                                />
                            )}
                            <div className='flex space-x-32 items-center'>
                                <div className='w-16'>
                                    <input type="file" className="w-48" accept="image/png, image/jpeg" onChange={handleImageChange} />
                                </div>
                                <div>
                                    <Button type="link" onClick={handleUploadImage}>
                                        บันทึกรูปภาพโปรไฟล์
                                    </Button>
                                </div>
                            </div>

                        </div>
                        <div className='flex w-full space-x-2 '>
                            <div className='w-[50%]'>
                                <p>ชื่อ</p>
                                <Input
                                    placeholder='กรุณากรอกชื่อ'
                                    id='firstname'
                                    value={formik.values.firstname}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur} />
                                {formik.touched.firstname && formik.errors.firstname ? (
                                    <small className="text-red-500">{formik.errors.firstname}</small>
                                ) : null}
                            </div>
                            <div className='w-[50%]'>
                                <p>นาสกุล</p>
                                <Input
                                    placeholder='กรุณากรอกนามสกุล'
                                    id='lastname'
                                    value={formik.values.lastname}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur} />
                                {formik.touched.lastname && formik.errors.lastname ? (
                                    <small className="text-red-500">{formik.errors.lastname}</small>
                                ) : null}
                            </div>
                        </div>
                        <div className='w-full'>
                            <p>เกี่ยวกับตัวเอง</p>
                            <Input.TextArea
                                className='!h-24'
                                placeholder='กรอกข้อมูลเกี่ยวกับตัวเอง'
                                id='description'
                                value={formik.values.description}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur} />
                            {formik.touched.description && formik.errors.description ? (
                                <small className="text-red-500">{formik.errors.description}</small>
                            ) : null}
                        </div>
                        <div className='w-full'>
                            <p>ประสบการณ์</p>
                            <Input.TextArea
                                placeholder='กรอกข้อมูลเกี่ยวกับประสบการณ์ตัวเอง'
                                id='experience'
                                value={formik.values.experience}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur} />
                            {formik.touched.experience && formik.errors.experience ? (
                                <small className="text-red-500">{formik.errors.experience}</small>
                            ) : null}
                        </div>
                        <div className='w-full'>
                            <p>ที่อยู่</p>
                            <Input.TextArea
                                placeholder='กรอกข้อมูลเกี่ยวกับที่อยู่'
                                id='address'
                                value={formik.values.address}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur} />
                            {formik.touched.address && formik.errors.address ? (
                                <small className="text-red-500">{formik.errors.address}</small>
                            ) : null}
                        </div>
                        <div className='flex space-x-4'>
                            <div className='w-full'>
                                <p>เบอร์โทร</p>
                                <Input
                                    placeholder='09x-xxxx-xxx'
                                    id='tel'
                                    value={formik.values.tel}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur} />
                                {formik.touched.tel && formik.errors.tel ? (
                                    <small className="text-red-500">{formik.errors.tel}</small>
                                ) : null}
                            </div>
                            <div className='w-full'>
                                <p>หมายเลขธนาคาร</p>
                                <Input
                                    placeholder='กรุณากรอกหมายเลขบัญชีธนาคาร'
                                    id='bankaccount'
                                    value={formik.values.bankaccount}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur} />
                                {formik.touched.bankaccount && formik.errors.bankaccount ? (
                                    <small className="text-red-500">{formik.errors.bankaccount}</small>
                                ) : null}
                            </div>
                            <div>
                                <p>ธนาคาร</p>
                                <Select
                                    value={selectedBank || profileData.bank || "กรุณาเลือกธนาคาร"}
                                    onChange={(value) => setSelectedBank(value)}
                                    className="w-44 "
                                >
                                    {bankOptions.map(option => (
                                        <Select.Option key={option.value} value={option.value}>
                                            {option.label}
                                        </Select.Option>
                                    ))}
                                </Select>

                            </div>
                        </div>


                    </div>
                    <div className='flex justify-end items-end'>
                        <Button htmlType="submit" className='bg-blue-500 w-32 mt-4 text-white'>บันทึกข้อมูล</Button>
                    </div>
                </form>
            )}
        </div>
    );
}

export default TutorProfile;
