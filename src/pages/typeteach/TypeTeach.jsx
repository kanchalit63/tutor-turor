import { useState, useEffect } from 'react';
import { Checkbox, Card, Button } from 'antd';
import axios from 'axios';
import Cookies from 'js-cookie';
import { apiConfig } from '../../config/api.config';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TypeTeach = () => {
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedTeachStyles, setSelectedTeachStyles] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState([]);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    fetchProfileData();
  }, []);

  useEffect(() => {
    if (profileData) {
      setSelectedDays(profileData.teach_date || []);
      setSelectedTeachStyles(profileData.teach_style || []);
      setSelectedLevel(profileData.level || []);
    }
  }, [profileData]);

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
      } else {
        throw new Error('Failed to fetch profile data');
      }
    } catch (error) {
      toast.error("Failed to fetch profile data");
    }
  };

  const handleSaveData = async () => {
    try {
      const tokenFromCookie = Cookies.get('tutor-token');
      if (!tokenFromCookie) {
        throw new Error('Token not found in cookies');
      }
      const token = tokenFromCookie.replace('Bearer ', '');
      await updateTeachStyle(selectedDays, selectedTeachStyles, selectedLevel, token);
      toast.success("อัพเดตรูปแบบการสอนเสร็จสิ้น");
    } catch (error) {
      toast.error("Failed to update teach style");
    }
  };

  const updateTeachStyle = async (selectedDays, selectedTeachStyles, selectedLevel, token) => {
    await axios.patch(`${apiConfig.baseURL}/updateTeachStyle`, {
      id: profileData.id,
      selectedDays: selectedDays,
      selectedTeachStyles: selectedTeachStyles,
      selectedLevel: selectedLevel
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  };

  const optionsDay = [
    { label: "วันอาทิตย์", value: "วันอาทิตย์" },
    { label: "วันจันทร์", value: "วันจันทร์" },
    { label: "วันอังคาร", value: "วันอังคาร" },
    { label: "วันพุธ", value: "วันพุธ" },
    { label: "วันพฤหัสบดี", value: "วันพฤหัสบดี" },
    { label: "วันศุกร์", value: "วันศุกร์" },
    { label: "วันเสาร์", value: "วันเสาร์" },
  ];

  const optionTeachStyle = [
    { label: "ออนไลน์", value: "ออนไลน์" },
    { label: "ออนไซต์", value: "ออนไซต์" },
  ];

  const optionLevel = [
    { label: "ประถม", value: "ประถม" },
    { label: "มัธยมต้น", value: "มัธยมต้น" },
    { label: "มัธยมปลาย", value: "มัธยมปลาย" },
    { label: "มหาวิทยาลัย", value: "มหาวิทยาลัย" },
    { label: "วัยทำงาน", value: "วัยทำงาน" },
  ];

  return (
    <>
      <ToastContainer />
      <div className='bg-gray-200 h-[100vh] pt-12'>
        <Card
          title={<span className='text-2xl '>รูปแบบการสอน</span>}
          bordered={false}
          className='mx-16 '
        >
          <div className='px-4 space-y-4'>
            <div>
              <p className='text-lg'>วันที่สะดวกสอน</p>
              <Checkbox.Group
                options={optionsDay}
                onChange={setSelectedDays}
                value={selectedDays}
              />
            </div>
            <div>
              <p className='text-lg'>ลัษณะการสอน</p>
              <Checkbox.Group
                options={optionTeachStyle}
                onChange={setSelectedTeachStyles}
                value={selectedTeachStyles}
              />
            </div>
            <div>
              <p className='text-lg'>ระดับชั้น</p>
              <Checkbox.Group
                options={optionLevel}
                onChange={setSelectedLevel}
                value={selectedLevel}
              />
            </div>
            <div className='flex justify-end'>
              <Button className='bg-blue-500 text-white' onClick={handleSaveData}>บันทึกข้อมูล</Button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default TypeTeach;
