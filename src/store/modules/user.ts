import { defineStore } from "pinia";

import { loginApi, logoutApi } from "@/api/auth";
// import { getUserInfo } from "@/api/user";
import { store } from "@/store";

import { LoginData } from "@/api/auth/types";
import { UserInfo } from "@/api/user/types";
import { getUserInfo } from "@/api/user/index"

import { useStorage } from "@vueuse/core";
import { ref } from "vue";

export const useUserStore = defineStore("user", () => {
    // state
    const userId = ref();
    const token = useStorage("accessToken", "");
    const nickname = ref("");
    const avatar = ref("");
    const roles = ref<Array<string>>([]); // 用户角色集合 ==》 判断路由权限
    const perms = ref<Array<string>>([]); // 用户权限集合 ==》 判断按钮权限
    //登录调用 LoginData自定义的参数类型
    function login(loginData: LoginData) {
        //console.log('loginData',loginData);
        return new Promise<void>((resolve, reject) => {
            loginApi(loginData)
                .then((response) => {
                    //console.log("response",response); 
                    const { tokenType, accessToken } = response.data;
                    token.value = tokenType + " " + accessToken; //贮存用户token
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    // 获取信息(用户昵称、头像、角色集合、权限集合)
    function getInfo() {
        return new Promise<UserInfo>((resolve, reject) => {
            getUserInfo()
                .then(({ data }) => {
                    // console.log(da);

                    if (!data) {
                        return reject("验证失败，请重新登录。");
                    }
                    if (!data.roles || data.roles.length <= 0) {
                        reject(Error);
                    }
                    const userInfo = data
                    localStorage.setItem("userInfo", JSON.stringify(userInfo))
                    userId.value = data.userId;
                    nickname.value = data.nickname;
                    avatar.value = data.avatar;
                    roles.value = data.roles;
                    perms.value = data.perms;
                    resolve(data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    // 注销
    function logout() {
        return new Promise<void>((resolve, reject) => {
            logoutApi()
                .then(() => {
                    // resetRouter();
                    resetToken();
                    location.reload(); // 清空路由
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    // 重置
    function resetToken() {
        token.value = "";
        nickname.value = "";
        avatar.value = "";
        roles.value = [];
        perms.value = [];
    }
    return {
        token,
        nickname,
        avatar,
        roles,
        perms,
        login,
        getInfo,
        logout,
        resetToken,
        /**
         * 当前登录用户ID
         */
        userId,
    };
});

// 非setup
export function useUserStoreHook() {
    return useUserStore(store);
}
