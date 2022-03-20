import { quanLyNguoiDungService } from "../../services/QuanLyNguoiDung";
import {
  DANG_KY_ACTION,
  DANG_NHAP_ACTION,
  GET_THONG_TIN_NGUOI_DUNG,
  SET_THONG_TIN_NGUOI_DUNG,
} from "./types/QuanLyNguoiDungType";
import { history } from "../../App";

export const dangNhapAction = (thongTinDangNhap) => {
  return async (dispatch) => {
    try {
      const result = await quanLyNguoiDungService.dangNhap(thongTinDangNhap);
      console.log("dd", result);
      if (result.data.statusCode === 200) {
        dispatch({
          type: DANG_NHAP_ACTION,
          thongTinDangNhap: result.data.content,
        });
        //Chuyển hướng đăng nhập về trang trước đó
        history.goBack();
      }

      console.log("result", result);
    } catch (error) {
      console.log("error", error.response.data);
    }
  };
};

export const layThongTinNguoiDungAction = (thongTinDangNhap) => {
  return async (dispatch) => {
    try {
      const result = await quanLyNguoiDungService.layThongTinNguoiDung();

      if (result.data.statusCode === 200) {
        dispatch({
          type: SET_THONG_TIN_NGUOI_DUNG,
          thongTinNguoiDung: result.data.content,
        });
      }

      console.log("result", result);
    } catch (error) {
      console.log("error", error.response.data);
    }
  };
};
export const dangKyAction = (thongTinDangKy) => {
  return async (dispatch) => {
    try {
      const result = await quanLyNguoiDungService.dangKy(thongTinDangKy);

      if (result.data.statusCode === 200) {
        alert("Đăng Ký thành công!!!");
        history.push("/login");
      }
    } catch (error) {
      console.log("error", error.response.data);
    }
  };
};

export const layUsersAction = () => {
  return async (dispatch) => {
    try {
      const result = await quanLyNguoiDungService.layUsers();
      console.log("user", result);
      if (result.data.statusCode === 200) {
        dispatch({
          type: GET_THONG_TIN_NGUOI_DUNG,
          quanLyThongTin: result.data.content,
        });
      }
    } catch (error) {
      console.log("error", error.response?.data);
    }
  };
};
