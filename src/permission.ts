import router from "@/router";
import { useUserStoreHook } from "@/store/modules/user";
import { usePermissionStoreHook } from "@/store/modules/permission";
const permissionStore = usePermissionStoreHook();

const userStore = useUserStoreHook();
// 设置路由白名单
const whiteList = ["/login"];
// 路由导航守卫，用于在每次路由切换前进行权限验证
router.beforeEach(async (to, from, next) => {
    //获取登录令牌（token）
    const hasToken = localStorage.getItem("accessToken");
    //验证是否登录
    if (hasToken) {
        if (to.path === "/login") {
            // 如果已登录，跳转首页
            next({ path: "/" });
        } else {
            // 已登录且不是跳转到登录页，直接进入目标页面
            const userStore = useUserStoreHook();
            const hasRoles = userStore.roles && userStore.roles.length > 0;
            //console.log(hasRoles);
            if (hasRoles) {
                //console.log(to.matched);
                
                if (to.matched.length === 0) {
                    //console.log("to.matched.length",to.matched.length);
                    from.name ? next({ name: from.name }) : next("/404");
                } else {
                    next();
                }
            } else {
                // next();
                try {
                    // 调用userStore的getInfo方法，通过异步请求获取用户信息
                    const { roles } = await userStore.getInfo();
                    // console.log(roles);
                    const accessRoutes = await permissionStore.generateRoutes(roles);
                    //console.log(accessRoutes);
                    accessRoutes.forEach((route) => {
                        router.addRoute(route);
                    });
                    next({ ...to, replace: true });
                } catch (error) {
                    // 异步请求用户信息发生错误时的处理
                    // 移除 token 并跳转登录页
                    await userStore.resetToken();
                    next(`/login?redirect=${to.path}`);
                }
            }
        }
    } else {
        // 未登录可以访问白名单页面
        if (whiteList.indexOf(to.path) !== -1) {
            // 如果要访问的页面是白名单中的页面，则直接进入
            next();
        } else {
            // 未登录且访问非白名单页面，重定向到登录页面，并带上 redirect 参数
            next(`/login?redirect=${to.path}`);
        }
    }
});
