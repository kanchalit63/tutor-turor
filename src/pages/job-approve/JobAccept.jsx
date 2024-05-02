import { Button, Table } from 'antd';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { apiConfig } from '../../config/api.config';
import Cookies from 'js-cookie'
import { jwtDecode } from "jwt-decode"
import dayjs from "dayjs";
import { Modal } from 'antd';
import { toast, ToastContainer } from 'react-toastify';


function JobAccept() {

    const [dataAccept, setDataAccept] = useState(null)
    const [modalVisible, setModalVisible] = useState(false); // เพิ่ม state สำหรับควบคุมการแสดง modal
    const [selectedRow, setSelectedRow] = useState(null); // เพิ่ม state สำหรับเก็บข้อมูลที่ถูกเลือกสำหรับแสดงใน modal
    const [confirmModalVisible, setConfirmModalVisible] = useState(false); // เพิ่ม state สำหรับควบคุมการแสดง Modal ยืนยันการรับงาน

    const token = Cookies.get('tutor-token')
    const decodedToken = jwtDecode(token);
    const tutorId = decodedToken.id;


    useEffect(() => {
        getBookingPending();
    }, []);


    const getBookingPending = () => {
        axios.get(`${apiConfig.baseURL}/listbookingapproveTuTor/${tutorId}`)
            .then((res) => {
                setDataAccept(res.data.data)
            })
            .catch((err) => {
                console.log("Error fetching tutor data", err);
            });
    }


    const handleRowClick = (record) => {
        setSelectedRow(record); // เก็บข้อมูลของแถวที่ถูกคลิก
        setModalVisible(true); // แสดง modal
    };

    const handleModalClose = () => {
        setModalVisible(false); // ปิด modal
    };

    const handleConfirmModalClose = () => {
        setConfirmModalVisible(false); // ปิด Modal ยืนยันการรับงาน
    };



    const handleAccept = (id) => {
        axios.patch(`${apiConfig.baseURL}/updatebookingsuccess`, {
            id: id
        })
            .then((res) => {
                if (res.status === 200) {
                    toast.success("ยืนยันการสำเร็จงานสำเร็จ")
                    setConfirmModalVisible(false)
                    getBookingPending()
                }
            })
            .catch((err) => {
                console.log("Error updating booking", err);
            });
    }


    const columns = [
        {
            title: 'ชื่อ',
            dataIndex: 'firstname',
            key: 'firstname',
        },
        {
            title: 'นาสกุล',
            dataIndex: 'lastname',
            key: 'lastname',
        },
        {
            title: 'เบอร์โทร',
            dataIndex: 'tel',
            key: 'tel',
        },
        {
            title: 'ชื่อวิชา',
            dataIndex: 'subject',
            key: 'subject',
        },
        {
            title: 'วันที่ต้องการจะเรียน',
            dataIndex: 'date',
            key: 'date',
            render: (createdAt) => (
                createdAt ? dayjs(createdAt).add(543, 'year').format('DD-MM-YYYY') : ''
            ),
        },
        {
            title: 'เวลาที่ต้องการจะเรียน',
            dataIndex: 'time',
            key: 'time',
        },
        {
            title: 'สถานที่เรียน',
            dataIndex: 'study_place',
            key: 'study_place',
        },
        {
            title: 'ที่อยู่',
            dataIndex: 'note',
            key: 'note',
            render: (_, record) => (
                <Button type="link" onClick={() => handleRowClick(record)}>
                    ดูรายละเอียด
                </Button>
            ),
        },
        {
            title: 'สถานะ',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'จัดการ',
            key: 'edit',

            render: (_, record) => (
                <div className="space-x-4">
                    <button
                        type="button"
                        className="bg-green-500 w-24 h-8 text-white rounded-md hover:bg-main-green transition delay-[30ms]"
                        onClick={() => {
                            setSelectedRow(record); // เก็บข้อมูลของแถวที่ถูกคลิก
                            setConfirmModalVisible(true); // แสดง Modal ยืนยันการรับงาน
                        }}
                    >
                        สำเร็จงาน
                    </button>
                </div>

            ),
        }
    ]

    const dataSource = dataAccept
        ? dataAccept
            .filter(item => item.status === 2) // กรองข้อมูลเฉพาะที่ status เป็น 2
            .map((item) => ({
                id: item.id, // เพิ่มฟิลด์ id เพื่อให้สามารถเรียกใช้ได้ตามต้องการ
                firstname: item.user_firstname,
                lastname: item.user_lastname,
                tel: item.user_tel,
                subject: item.subject_name,
                date: item.date,
                time: item.time,
                study_place: item.study_place,
                note: item.note,
                status: <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">รับงาน</span>, // กำหนดให้ status เป็น "รับงาน" เฉพาะที่ผ่านการกรองแล้ว
            }))
        : [];



    return (
        <div>
            <ToastContainer />
            <Table dataSource={dataSource} columns={columns} />
            <Modal title="ที่อยู่" open={modalVisible} onCancel={handleModalClose} footer={null}>
                {selectedRow && (
                    <div>
                        <p>{`ที่อยู่: ${selectedRow.note}`}</p>
                    </div>
                )}
            </Modal>

            <Modal
                title="ยืนยันการรับงาน"
                open={confirmModalVisible}
                onCancel={handleConfirmModalClose}
                footer
            >
                <p>คุณแน่ใจที่จะสำเร็จงานของ <span className='text-red-500'>{selectedRow && `${selectedRow.firstname} ${selectedRow.lastname}`}</span>  ใช่หรือไม่ </p>
                <div className='flex space-x-2 justify-end mt-2'>
                    <button key="confirm" type="primary" className='bg-blue-500 text-white p-2 rounded-md' onClick={() => handleAccept(selectedRow.id)}>
                        ยืนยันรับงาน
                    </button>
                    <button key="cancel" className='bg-red-500 text-white p-2 rounded-md' onClick={handleConfirmModalClose}>
                        ยกเลิก
                    </button>
                </div>
            </Modal>
        </div>
    )
}

export default JobAccept