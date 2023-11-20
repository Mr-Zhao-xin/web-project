import { RouteRecordRaw, useRouter } from "vue-router"; // 导入Vue Router相关的模块
import { defineStore } from "pinia"; // 导入Pinia用于状态管理的模块
import { constantRoutes } from "@/router"; // 导入常量路由配置
import { store } from "@/store"; // 导入全局状态管理
import { listRoutes } from "@/api/menu"; // 导入用于获取路由配置的接口
import { ref } from "vue"; // 导入Vue的响应式引用
// 动态导入 views 目录下的所有 .vue 文件
// console.log('viewsContext', modules);
const modules = import.meta.glob("../../views/**/**.vue");
// console.log('modules',modules);



//const modules = require.context("../../views", true, /\.vue$/); // 使用Webpack的上下文获取views目录下的.vue文件
const Layout = () => import("@/layout/index.vue"); // 异步加载布局组件

//使用 meta.role 确定当前用户是否具有权限
// param roles 用户角色集合
// param route 路由
const hasPermission = (roles: string[], route: RouteRecordRaw) => {
    if (route.meta && route.meta.roles) {
        // 如果角色包含 "ROOT" 角色，即超级管理员，忽略权限校验
        if (roles.includes("ROOT")) {
            return true;
        }
        return roles.some((role) => {
            if (route.meta?.roles !== undefined) {
                return (route.meta.roles as string[]).includes(role);
            }
        });
    }
    // returns
    return false;
};



//param routes 接口返回的异步(动态)路由
// param roles 用户角色集合

//递归过滤有权限的异步(动态)路由
const filterAsyncRoutes = (routes: RouteRecordRaw[], roles: string[]) => {
    const asyncRoutes: any = [];
    routes.forEach((route) => {
        const tmpRoute = { ...route }; // ES6扩展运算符复制新对象
        if (!route.name) {
            tmpRoute.name = route.path;
        }
        // 判断用户(角色)是否有该路由的访问权限
        if (hasPermission(roles, tmpRoute)) {
            //console.log('0000',tmpRoute);

            if (tmpRoute.component?.toString() == "Layout") {
                tmpRoute.component = Layout;
                // console.log("1111111", tmpRoute.component);

            } else {
                const component = modules[`../../views/${tmpRoute.component}.vue`];
                if (component) {
                    tmpRoute.component = component;
                } else {
                    tmpRoute.component = modules[`../../views/error-page/404.vue`];
                }
            }

            if (tmpRoute.children) {
                tmpRoute.children = filterAsyncRoutes(tmpRoute.children, roles);
            }

            asyncRoutes.push(tmpRoute);
        }
    });
    //returns 返回用户有权限的异步(动态)路由
    return asyncRoutes;
};

// 设置权限管理的Pinia store
export const usePermissionStore = defineStore("permission", () => {
    // 声明状态
    const routes = ref<RouteRecordRaw[]>([]);

    // 定义操作
    function setRoutes(newRoutes: RouteRecordRaw[]) {
        routes.value = constantRoutes.concat(newRoutes);
    }

    /**
     * 生成动态路由
     * param roles 用户角色集合
     * returns
     */
    function generateRoutes(roles: string[]) {
        return new Promise<RouteRecordRaw[]>((resolve, reject) => {
            // 通过接口获取所有路由配置
            listRoutes()
                .then(({ data: asyncRoutes }) => {
                    // 根据用户角色过滤获取有权限访问的路由
                    const accessedRoutes = filterAsyncRoutes(asyncRoutes, roles);
                    setRoutes(accessedRoutes);
                    resolve(accessedRoutes);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    /**
     * 获取混合模式左侧菜单
     */
    const mixLeftMenu = ref<RouteRecordRaw[]>([]);
    function getMixLeftMenu(activeTop: string) {
        routes.value.forEach((item) => {
            if (item.path === activeTop) {
                mixLeftMenu.value = item.children || [];
            }
        });
    }

    return { routes, setRoutes, generateRoutes, getMixLeftMenu, mixLeftMenu };
});

// 在非setup环境中使用权限管理的store
export function usePermissionStoreHook() {
    return usePermissionStore(store);
}
