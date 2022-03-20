import { useFormik } from "formik";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { dangNhapAction } from "../../redux/actions/QuanLyNguoiDungAction";
import "./login.css";
export default function Login(props) {
  const dispatch = useDispatch();

  const { userLogin } = useSelector((state) => state.QuanLyNguoiDungReducer);

  const formik = useFormik({
    initialValues: {
      taiKhoan: "",
      matKhau: "",
    },
    onSubmit: (values) => {
      const action = dangNhapAction(values);
      dispatch(action);
      console.log("valcl", values);
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      style={{ paddingTop: "30%" }}
      className=" w-6/12 h-full mx-auto flex items-center 	"
    >
      <div className="flex items-center  ">
        <div className="mt-1/2">
          <div>
            <div>
              <div className="container ">
                <div>
                  <p>Đăng Nhập</p>
                  <input name="taiKhoan" onChange={formik.handleChange} />
                  <br />
                  <input
                    type="password"
                    name="matKhau"
                    onChange={formik.handleChange}
                  />
                  <br />
                  <button
                    className="bg-indigo-500 text-gray-100 p-2  rounded-full tracking-wide
                  font-semibold font-display focus:outline-none focus:shadow-outline hover:bg-indigo-600
                  shadow-lg"
                  >
                    Đăng nhập
                  </button>
                  <br />
                  <div className="mt-12 text-sm font-display font-semibold text-gray-700 text-center">
                    Bạn chưa có tài khoản ?{" "}
                    <NavLink
                      to="register"
                      className="cursor-pointer text-white hover:text-indigo-800"
                    >
                      Đăng ký
                    </NavLink>
                  </div>
                </div>
                <div className="drops">
                  <div className="drop drop-1" />
                  <div className="drop drop-2" />
                  <div className="drop drop-3" />
                  <div className="drop drop-4" />
                  <div className="drop drop-5" />
                </div>
              </div>

              {/* <div className="text-sm font-bold text-gray-700 tracking-wide">
                Tài khoản
              </div>
              <input
                name="taiKhoan"
                onChange={formik.handleChange}
                className="w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500"
                placeholder="Nhập vào tài khoản"
              />
            </div>
            <div className="mt-8">
              <div className="flex justify-between items-center">
                <div className="text-sm font-bold text-gray-700 tracking-wide">
                  Mật khẩu
                </div>
                <div>
                  <a
                    className="text-xs font-display font-semibold text-indigo-600 hover:text-indigo-800
                          cursor-pointer"
                  >
                    Quên mật khẩu ?
                  </a>
                </div>
              </div>
              <input
                type="password"
                name="matKhau"
                onChange={formik.handleChange}
                className="w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500"
                placeholder="Nhập vào mật khẩu"
              /> */}
            </div>
            {/* <div className="mt-10">
              <button
                className="bg-indigo-500 text-gray-100 p-4 w-full rounded-full tracking-wide
                  font-semibold font-display focus:outline-none focus:shadow-outline hover:bg-indigo-600
                  shadow-lg"
              >
                Đăng nhập
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </form>
  );
}
