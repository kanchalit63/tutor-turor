import { Table, Button, Modal, Select, Input } from 'antd';
import Icon from '@mdi/react';
import { mdiSquareEditOutline, mdiDeleteOutline } from '@mdi/js';
import { useState, useEffect } from 'react';
import { apiConfig } from '../../config/api.config';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFormik } from "formik";
import * as Yup from "yup";
    import { jwtDecode } from "jwt-decode"


const TutorSubject = () => {
    const [subjectList, setSubjectList] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalEditOpen, setIsModalEditOpen] = useState(false);
    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
    const [tutorSubject, setTutorSubject] = useState(null);
    const [subjectById, setSubjectById] = useState(null);

    const token = Cookies.get('tutor-token');
    const decodedToken = jwtDecode(token);
    const tutorId = decodedToken.id;


    const showModal = () => {
        formik.setFieldValue('price', '');
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const ModalEditClose = () => {
        setIsModalEditOpen(false);
    }



    useEffect(() => {
        getSubject();
        getTutorSubject(tutorId);
    }, []);

    useEffect(() => {
        if (Array.isArray(subjectById) && subjectById.length > 0) {
            // ทำการรวมค่า price จากอาร์เรย์ของ subjectById
            const totalPrice = subjectById.reduce((acc, curr) => acc + curr.price, 0);
            const subjectNames = subjectById.map(subject => subject.subject_name);
            // ตั้งค่าให้ formik.values.price เป็นค่า totalPrice
            formik.setValues({
                ...formik.values,
                subject_name: subjectNames,
                price: totalPrice
            });
        }
    }, [subjectById]);


    const getSubject = () => {
        axios
            .get(`${apiConfig.baseURL}/subject`)
            .then((res) => {
                setSubjectList(res.data.data);
            })
            .catch((err) => {
                console.log("เกิดข้อผิดพลาดในการแสดงผลรายวิชา", err);
            });
    };

    const getTutorSubject = (id) => {
        axios.get(`${apiConfig.baseURL}/tutor-subject/${id}`)
            .then((res) => {
                setTutorSubject(res.data.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const getTutorSubjectById = (id) => {
        axios.get(`${apiConfig.baseURL}/tutor-subject-single/${id}`)
            .then((res) => {
                setSubjectById(res.data.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const schema = Yup.object().shape({
        price: Yup.string().required('กรุณากรอกราคา'),
    });

    const initialValues = {
        tutor_id: tutorId,
        subject_id: '',
        subject_name: '',
        price: subjectById && subjectById.price,
    }

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: schema,
        onSubmit: (values) => {
            if (isModalEditOpen) {
                updateSubjectTutor(subjectById[0].tutor_subject_id); // ส่ง id ไปพร้อมกับการเรียกใช้งาน
            } else {
                try {
                    const tokenFromCookie = Cookies.get('tutor-token');
                    if (!tokenFromCookie) {
                        throw new Error('Token not found in cookies');
                    }
                    const token = tokenFromCookie.replace('Bearer ', '');
                    addSubject(values, token);
                } catch (error) {
                    console.error(error);
                }
            }
        },


    });

    const addSubject = async (values, token) => {
        try {
            console.log(values.subject_id); // ตรวจสอบค่า subject_id ใน console log
            // ตรวจสอบค่า values.subject_id ว่ามีค่าหรือไม่
            if (!values.subject_id) {
                console.error('subject_id is empty');
                return;
            }

            const response = await axios.post(`${apiConfig.baseURL}/addtutorsubject`, {
                tutor_id: tutorId,
                subject_id: values.subject_id,
                price: values.price,
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.status === 200) {
                toast.success('เพิ่มรายวิชาสำเร็จ');
                setIsModalOpen(false);
                getTutorSubject(tutorId)
            } else {
                toast.error('เกิดข้อผิดพลาดในการเพิ่มรายวิชา');
            }
        } catch (error) {
            console.error(error);
        }
    };


    const updateSubjectTutor = (id) => {
        axios.patch(`${apiConfig.baseURL}/update-tutor-subject`, {
            id: id, 
            price: formik.values.price,
        })
            .then((res) => {
                if (res.status === 200) {
                    toast.success('แก้ไขรายวิชาสำเร็จ');
                    getTutorSubject(tutorId);
                    ModalEditClose();
                } else {
                    toast.error('เกิดข้อผิดพลาดในการแก้ไขรายวิชา');
                }
            })
            .catch((error) => {
                console.error(error);
                toast.error('เกิดข้อผิดพลาดในการแก้ไขรายวิชา');
            });
    }

    const showModalDelete = async (id) => {
        try {
            const response = await axios.get(`${apiConfig.baseURL}/tutor-subject-single/${id}`);
            setSubjectById(response.data.data);
            setIsModalDeleteOpen(true);
        } catch (error) {
            console.log("เกิดข้อผิดพลาดในการดึงข้อมูลรายวิชา", error)
        }
    }
    

    const handleDelete = () => {
    axios.patch(`${apiConfig.baseURL}/delete-tutor-subject`, {
        id: subjectById[0].tutor_subject_id,
    })
        .then((res) => {
            if (res.status === 200) {
                toast.success('ลบรายวิชาสำเร็จ');
                getTutorSubject(tutorId);
                setIsModalDeleteOpen(false); // แก้ไขให้เป็น setIsModalDeleteOpen(false) เมื่อลบสำเร็จ
            } else {
                toast.error('เกิดข้อผิดพลาดในการลบรายวิชา');
            }
        })
        .catch((error) => {
            console.error(error);
            toast.error('เกิดข้อผิดพลาดในการลบรายวิชา');
        });
}

    

    

    const handleCancelDelete = () => {
        setIsModalDeleteOpen(false);
    }

    const editSubject = (id) => {
        getTutorSubjectById(id);
        setIsModalEditOpen(true);
    }


    const columns = [
        {
            title: 'ชื่อวิชา',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'ราคา ( บาท )',
            dataIndex: 'price',
            key: 'price'
        },
        {
            title: 'จัดการ',
            dataIndex: 'edit',
            width: 150,
            render: (_, record) => (
                <div className=" flex space-x-2">
                    <Icon path={mdiSquareEditOutline} size={1} onClick={() => editSubject(record.key)} className="cursor-pointer" />
                    <Icon path={mdiDeleteOutline} size={1} onClick={() => showModalDelete(record.key)} className="text-red-500 cursor-pointer" />
                </div>
            ),
        },
    ];

    const dataSource = tutorSubject && tutorSubject.map(item => ({
        key: item.tutor_subject_id,
        name: item.subject_name,
        price: item.price,
    }));


    return (
        <>
            <ToastContainer />
            <div className='px-20 space-y-4 pt-10'>
                <h3 className='text-2xl font-bold'>จัดการรายวิชา</h3>
                <div className='flex justify-end'>
                    <Button className="bg-blue-500 text-white" onClick={showModal}>เพิ่มรายวิชา</Button>
                </div>
                <Table dataSource={dataSource} columns={columns} />
            </div>

            <Modal title={<div className="text-2xl ">เพิ่มรายวิชา</div>}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                footer>
                <form onSubmit={formik.handleSubmit}>
                    <div className='flex justify-around '>
                        <div>
                            <p>ชื่อรายวิชา</p>
                            <Select
                                className='w-60'
                                id='subject_id'
                                value={formik.values.subject_id} // ตรวจสอบการกำหนดค่า value ให้ถูกต้อง
                                onChange={(value) => formik.setFieldValue('subject_id', value)}
                            >
                                {subjectList && subjectList.map((subject) => (
                                    <Select.Option key={subject.id} value={subject.id}>
                                        {subject.name}
                                    </Select.Option>
                                ))}
                            </Select>

                        </div>
                        <div>
                            <p>ราคา</p>
                            <Input
                                id='price'
                                value={formik.values.price}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                    </div>
                    <div className='flex justify-end m-4'>
                        <button
                            type="submit"
                            className="bg-blue-500 w-24 h-8 text-white rounded-md hover:bg-main-green transition delay-[30ms]"
                        > เพิ่มรายวิชา </button>
                    </div>
                </form>
            </Modal>

            <Modal
                title={<div className="text-2xl ">แก้ไขรายวิชา</div>}
                open={isModalEditOpen}
                onCancel={ModalEditClose}
                footer={null}
            >
                <form action="" onSubmit={formik.handleSubmit}>
                    <label htmlFor="">ชื่อรายวิชา</label>
                    <Input
                        placeholder="กรุณากรอกชื่อรายวิชาที่ต้องการจะแก้ไข"
                        className="my-1"
                        id="subject_name"
                        value={formik.values.subject_name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        disabled
                    />
                    <label htmlFor="">ราคา ( บาท )  </label>
                    <Input
                        placeholder="กรุณากรอกชื่อรายวิชาที่ต้องการจะแก้ไข"
                        className="my-1"
                        id="price"
                        value={formik.values.price}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.price && formik.errors.price ? (
                        <small className="text-red-500">{formik.errors.price}</small>
                    ) : null}
                    <div className="space-x-4  flex items-end justify-end mt-3">
                        <button
                            type="submit"
                            className="bg-blue-500 w-24 h-8 text-white rounded-md hover:bg-main-green transition delay-[30ms]"
                        >
                            บันทึก
                        </button>
                        <button type="button" className="bg-red-500 w-24 h-8 text-white rounded-md" onClick={ModalEditClose}>
                            ยกเลิก
                        </button>
                    </div>
                </form>
            </Modal>

            <Modal
                title={<div className="text-2xl font-bold">รายการที่จะลบ</div>}
                open={isModalDeleteOpen}
                onCancel={handleCancelDelete}
                footer={null}
            >
                <p className="text-md">
                    ต้องการที่จะลบวิชา <span className="text-red-500"></span> ใช่หรือไหม ?
                </p>
                <div className="space-x-4  flex items-end justify-end mt-3">
                    <button
                        type="button"
                        className="bg-blue-500 w-24 h-8 text-white rounded-md hover:bg-main-green transition delay-[30ms]"
                        onClick={handleDelete}
                    >
                        ตกลง
                    </button>
                    <button type="button" className="bg-red-500 w-24 h-8 text-white rounded-md" onClick={handleCancelDelete}>
                        ยกเลิก
                    </button>
                </div>
            </Modal>
        </>
    );
}

export default TutorSubject;
