import request from "@/utils/request";
import axios from "axios";
export function getUserPage(params:any){
    return  axios({
    url: "https://restapi.amap.com/v3/ip",
    method: "get",
    params
  })
}