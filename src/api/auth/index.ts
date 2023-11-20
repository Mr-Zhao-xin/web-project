import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { CaptchaResult, LoginData, LoginResult } from "./types";

/**
 * 登录API
 *
 * param data {LoginData}
 * 
 */
export function loginApi(data: LoginData): AxiosPromise<LoginResult> {
    //console.log('data传参', data);
    // const formData = {
    // };
    // formData.append("username", data.username);
    // formData.append("password", data.password);
    // formData.append("verifyCodeKey", data.verifyCodeKey || "");
    // formData.append("verifyCode", data.verifyCode || "");
    return request({
        url: "/auth/login",
        method: "post",
        params: {
            username: data.username,
            password: data.password,
            verifyCodeKey: data.verifyCodeKey || "",
            verifyCode: data.verifyCode || ""

        },
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}

/**
 * 注销API
 */
export function logoutApi() {
    return request({
        url: "/auth/logout",
        method: "delete",
    });
}

/**
 * 获取验证码
 */
export function getCaptchaApi(): AxiosPromise<CaptchaResult> {
    return request({
        url: "/api/v1/auth/captcha",
        method: "get",
    });
}
