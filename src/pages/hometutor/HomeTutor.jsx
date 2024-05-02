import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Menu } from "antd";
import { mdiAccountCircle } from '@mdi/js';
import Icon from '@mdi/react';
import JobApprove from "../job-approve/JobApprove";
import TutorProfile from "../profile/TutorProfile";
import TutorSubject from "../techstyle/TutorSubject";
import TypeTeach from "../typeteach/TypeTeach";
import { useNavigate } from "react-router-dom"; // เปลี่ยนการ import เพื่อใช้งาน useNavigate
import { apiConfig } from "../../config/api.config";

const items = [
  {
    key: "1",
    label: "จัดการข้อมูลส่วนตัว",
    children: <TutorProfile />
  },
  {
    key: "2",
    label: "รูปแปปการสอน",
    children: <TypeTeach />
  },
  {
    key: "3",
    label: "จัดการรายวิชา",
    children: <TutorSubject />
  },
  {
    key: "4",
    label: "ตรวจสอบการจอง",
    children: <JobApprove />
  },
]

function Hometutor() {
  const [selectedKey, setSelectedKey] = useState("1");
  const [isOpen, setIsOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [, setError] = useState(null);
  const navigate = useNavigate(); // เปลี่ยนการใช้ useHistory เป็น useNavigate

  const menuClickHandler = ({ key }) => {
    setSelectedKey(key);
  }

  const handleLogout = () => {
    Cookies.remove('tutor-token'); // ลบ Token ออกจาก cookies
    navigate('/login'); // นำทางไปยังหน้า /login โดยใช้ useNavigate
  }

  useEffect(() => {
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
        setError(error.message);
      }
    };

    fetchProfileData();
  }, []);

  return (
    <div>
      <div className="flex h-[100vh]">
        <div className="w-52 bg-[#001529] pt-4">
          <p className="text-white text-center">TUTOR</p>
          <Menu mode="vertical" theme="dark" selectedKeys={[selectedKey]} onClick={menuClickHandler}>
            {items.map((item) => (
              <Menu.Item key={item.key}>{item.label}</Menu.Item>
            ))}
          </Menu>
        </div>
        <div className="w-full">
          <div className="flex justify-between items-center p-2 text-white bg-gray-400 px-4">
            <div className="text-xl">
              จัดการข้อมูลติวเตอร์
            </div>
            {profileData && (
              <div className="flex items-center space-x-1">
                <span>{profileData.firstname}</span>
                {profileData?.image && profileData.image !== "http://localhost:8080/images/" ? (<img
                  src={profileData.image}
                  alt="โปรไฟล์"
                  className="w-12 h-12 rounded-full object-cover"
                  onClick={() => setIsOpen(!isOpen)}
                />
                ) : (
                  <img
                    src="./public/assets/user/profile/profile2.png"
                    alt="โปรไฟล์"
                    className="w-12 h-12 rounded-full object-cover"
                    onClick={() => setIsOpen(!isOpen)}
                  />
                )}
                {isOpen && (
                  <ul className="dropdown-menu absolute top-[50px] right-8 text-er-700 pt-1">
                    <li className="rounded bg-main-green py-2 px-4 cursor-pointer hover:bg-blue-400 hover:text-white" onClick={handleLogout}>
                      <a>ออกจากระบบ</a>
                    </li>
                  </ul>
                )}
              </div>
            )}
          </div>
          {items.map((item) => (item.key === selectedKey ? <div key={`${item.key}-`}>{item.children}</div> : null))}
        </div>
      </div>
    </div>
  )
}

export default Hometutor;
