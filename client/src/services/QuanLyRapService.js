import { baseService } from "./baseService";
export class QuanLyRapService  extends baseService{

    constructor() {
        super();
    }

    layDanhSachHeThongRap = () => {
        return this.get(`api/QuanLyRap/LayThongTinLichChieuHeThongRap`);
    }


    
   
}



export const quanLyRapService = new QuanLyRapService();
