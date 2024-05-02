import React, { useState, useEffect } from 'react';
import { Table, Modal, Button } from 'antd';
import axios from 'axios';
import { apiConfig } from '../../config/api.config';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import dayjs from 'dayjs';
import { toast, ToastContainer } from 'react-toastify';

function JobPending() {
    const [dataPending, setDataPending] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const [rejectModalVisible, setRejectModalVisible] = useState(false);
    const token = Cookies.get('tutor-token');
    const decodedToken = jwtDecode(token);
    const tutorId = decodedToken.id;

    useEffect(() => {
        getBookingPending();
    }, []);

    const getBookingPending = () => {
        axios
            .get(`${apiConfig.baseURL}/listbookingpendingTuTor/${tutorId}`)
            .then((res) => {
                setDataPending(res.data.data);
            })
            .catch((err) => {
                console.log('Error fetching tutor data', err);
            });
    };

    const handleRowClick = (record) => {
        setSelectedRow(record);
        setModalVisible(true);
    };

    const handleModalClose = () => {
        setModalVisible(false);
    };

    const handleConfirmModalClose = () => {
        setConfirmModalVisible(false);
    };

    const handleRejectModalClose = () => {
        setRejectModalVisible(false);
    };

    const handleApprove = (id) => {
        if (selectedRow) {
            axios.patch(`${apiConfig.baseURL}/updatebookingapprove`, {
                id: id
            })
                .then((res) => {
                    if (res.status === 200) {
                        toast.success("ยืนยันการรับงานสำเร็จ");
                        getBookingPending(); // เรียกใช้ฟังก์ชันเพื่อ refresh ข้อมูล
                        setConfirmModalVisible(false);
                    } else {
                        console.log("เกิดข้อผิดพลาดในการรับงาน");
                    }
                });
        }
    };

    const handleReject = (id) => {
        if (selectedRow) {
            axios.patch(`${apiConfig.baseURL}/updatebookingreject`, {
                id: id
            })
                .then((res) => {
                    if (res.status === 200) {
                        toast.success("ปฏิเสธการรับงานสำเร็จ");
                        getBookingPending(); // เรียกใช้ฟังก์ชันเพื่อ refresh ข้อมูล
                        setRejectModalVisible(false);
                    } else {
                        console.log("เกิดข้อผิดพลาดในการปฏิเสธการรับงาน");
                    }
                });
        }
    };

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
            render: (createdAt) => (createdAt ? dayjs(createdAt).add(543, 'year').format('DD-MM-YYYY') : ''),
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
            width: 300,
            render: (_, record) => (
                <div className="space-x-4 ">
                    <button
                        key="confirm" // Add unique key prop here
                        type="button"
                        className="bg-blue-500 w-24 h-8 text-white rounded-md hover:bg-main-green transition delay-[30ms]"
                        onClick={() => {
                            setSelectedRow(record);
                            setConfirmModalVisible(true);
                        }}
                    >
                        รับงาน
                    </button>
                    <button
                        key="cancel" // Add unique key prop here
                        type="button"
                        className="bg-red-500 w-24 h-8 text-white rounded-md"
                        onClick={() => {
                            setSelectedRow(record);
                            setRejectModalVisible(true);
                        }}
                    >
                        ปฏิเสธ
                    </button>
                </div>
            ),
        },
    ];

    const renderTable = () => {
        return (
            <div>
                <ToastContainer />
                <Table dataSource={dataSource} columns={columns} />
                <Modal title="ที่อยู่" open={modalVisible} onCancel={handleModalClose} footer={null}>
                    {selectedRow && (
                        <div>
                            <p>{`ที่อยู่: ${selectedRow.address || ''}`}</p>
                        </div>
                    )}
                </Modal>
            </div>
        );
    };

    const dataSource = dataPending
        ? dataPending.map((item) => ({
            id: item.id,
            firstname: item.user_firstname,
            lastname: item.user_lastname,
            tel: item.user_tel,
            subject: item.subject_name,
            date: item.date,
            time: item.time,
            study_place: item.study_place,
            address: item.note,
            status: item.status === 1 ? <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">กำลังรออนุมัติ</span> : 'อนุมัติแล้ว',
        }))
        : null;

    return (
        <div>
            {renderTable()}
            <Modal
                title="ยืนยันการรับงาน"
                open={confirmModalVisible}
                onCancel={handleConfirmModalClose}
                footer={null}
            >
                <p>คุณแน่ใจหรือไม่ที่จะรับงานของ <span className='text-red-500'>{selectedRow && `${selectedRow.firstname} ${selectedRow.lastname}`}</span>  ใช่หรือไม่ </p>
                <div className='flex space-x-2 justify-end mt-2'>
                    <button key="confirm" type="primary" className='bg-blue-500 text-white p-2 rounded-md' onClick={() => handleApprove(selectedRow.id)}>
                        ยืนยันรับงาน
                    </button>
                    <button key="cancel" className='bg-red-500 text-white p-2 rounded-md' onClick={handleConfirmModalClose}>
                        ยกเลิก
                    </button>
                </div>
            </Modal>

            <Modal
                title="ยืนยันการปฏิเสธการรับงาน"
                open={rejectModalVisible}
                onCancel={handleRejectModalClose}
                footer={null}
            >
                <p>คุณแน่ใจหรือไม่ที่จะปฏิเสธงานของ <span className='text-red-500'>{selectedRow && `${selectedRow.firstname} ${selectedRow.lastname}`}</span>  ใช่หรือไม่ </p>
                <div className='flex space-x-2 justify-end mt-2'>
                    <button key="confirm" type="primary" className='bg-blue-500 text-white p-2 rounded-md' onClick={() => handleReject(selectedRow.id)}>
                        ยืนยันการปฏิเสธงาน
                    </button>
                    <button key="cancel" className='bg-red-500 text-white p-2 rounded-md' onClick={handleRejectModalClose}>
                        ยกเลิก
                    </button>
                </div>
            </Modal>

        </div>
    );
}

export default JobPending;
