
import JobAccept from "./JobAccept";
import JobPending from "./JobPending";
import JobReject from "./JobReject";
import { Tabs } from 'antd';


function JobApprove() {

    const items = [
        {
            key: "1",
            label: "งานรออนุมัติ",
            children: <JobPending />
        },
        {
            key: "2",
            label: "งานอนุมัติแล้ว",
            children: <JobAccept />
        },
        {
            key: "3",
            label: "งานถูกปฏิเสธ",
            children: <JobReject />
        },
    ]


    return (
        <div className='px-10 py-2'>
            <Tabs defaultActiveKey="1" items={items} size="large" />
        </div>
    )
}

export default JobApprove