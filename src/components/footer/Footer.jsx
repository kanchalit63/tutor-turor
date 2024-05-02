


export default function Footer() {
    return (
        <div>
            <div className="h-80 flex justify-between items-center mx-32">
                <div>
                    <img src="/assets/home/Tutorlist-test.png" width={500} height={500} alt="" className="w-60 h-60" />
                </div>
                <div >
                    <p className="text-center text-4xl">Tutorlsit</p>
                    <div className="space-x-5 text-xl my-4 underline">
                        <span>หน้าแรก</span>
                        <span>สมัครติวเตอร์</span>
                        <span>เกี่ยวกับเรา</span>
                    </div>
                </div>
                <div>
                    <h3 className="text-center text-4xl">Contact US</h3>
                    <div className="flex justify-between py-4">
                        <img src="/assets/home/facebook.png" alt="" className="w-10 h-10" />
                        <img src="/assets/home/line.png" alt="" className="w-10 h-10" />
                        <img src="/assets/home/twitter.png" alt="" className="w-10 h-10" />
                        <img src="/assets/home/instagram.png" alt="" className="w-10 h-10" />
                    </div>
                    <p>เบอร์โทร 00000000</p>
                    <p>ที่อยู่</p>
                </div>
            </div>
            <div className="h-8 bg-main-green w-auto flex justify-center items-center">
                &copy;2024 tutorlist.com all rights reserved
            </div>
        </div>
    )
}
