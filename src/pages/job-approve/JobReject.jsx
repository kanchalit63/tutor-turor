import { Button, Table } from 'antd';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { apiConfig } from '../../config/api.config';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import dayjs from 'dayjs';
import { Modal } from 'antd';


function JobReject() {

    const [dataReject, setDataReject] = useState(null);
    const [modalVisible, setModalVisible] = useState(false); // เพิ่ม state สำหรับควบคุมการแสดง modal
    const [selectedRow, setSelectedRow] = useState(null); // เพิ่ม state สำหรับเก็บข้อมูลที่ถูกเลือกสำหรับแสดงใน modal
    const token = Cookies.get('tutor-token');
    const decodedToken = jwtDecode(token);
    const tutorId = decodedToken.id;
    
    const handleRowClick = (record) => {
        setSelectedRow(record); // เก็บข้อมูลของแถวที่ถูกคลิก
        setModalVisible(true); // แสดง modal
    };

    const handleModalClose = () => {
        setModalVisible(false); // ปิด modal
    };

    useEffect(() => {
        getBookingPending();
    }, []);

    const getBookingPending = () => {
        axios
            .get(`${apiConfig.baseURL}/listbookingrejectTuTor/${tutorId}`)
            .then((res) => {
                setDataReject(res.data.data);
            })
            .catch((err) => {
                console.log('Error fetching tutor data', err);
            });
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
    ]

    const dataSource = dataReject ? dataReject
        .filter(item => item.status === 3) // กรองข้อมูลเฉพาะที่ status เป็น 1
        .map((item) => ({
            key: item.id.toString(),
            firstname: item.user_firstname,
            lastname: item.user_lastname,
            tel: item.user_tel,
            subject: item.subject_name,
            date: item.date,
            time: item.time,
            study_place: item.study_place,
            note: item.note,
            status: <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">ปฏิเสธงาน</span>, // กำหนดให้ status เป็น "รับงาน" เฉพาะที่ผ่านการกรองแล้ว
        })) : [];

    return (
        <div>
            <Table dataSource={dataSource} columns={columns} />
            <Modal title="ที่อยู่" open={modalVisible} onCancel={handleModalClose} footer={null}>
                {selectedRow && (
                    <div>
                        <p>{`ที่อยู่: ${selectedRow.note}`}</p>
                    </div>
                )}
            </Modal>
        </div>
    )
}

export default JobReject