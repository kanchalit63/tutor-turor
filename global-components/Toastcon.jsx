
import { ToastContainer } from "react-toastify"

function Toastifycon() {
  return (
    <>
    <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      </>
  )
}

export default Toastifycon