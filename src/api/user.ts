
import axios from "../utils/request";

export const login = (params: any) => {

    const formData = new FormData();
    //console.log("params", params);
    formData.append("verifyCodeKey", params.verifyCodeKey || "");
    formData.append("verifyCode", params.verifyCode || "");
    return axios({
        url: "/auth/login",
        method: "post",
        params
    })
}

export const getCaptchaApi = async () => {
    return axios({
        url: "/auth/captcha",
        method: "get",

    })
}
export const userInfo = async (params: any) => {
    return axios({
        url: "/users/me",
        method: "get",
        params
    })
}

