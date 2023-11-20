<script lang="ts" setup>
import { usePermissionStore } from "@/store/modules/permission";
//import variables from "@/styles/variables.module.scss";
import { useAppStore } from "@/store/modules/app";
import { User, Lock, House } from '@element-plus/icons-vue'
//import { translateRouteTitleI18n } from "@/utils/i18n";
import { useRouter } from "vue-router";
import { computed, onMounted,onBeforeUnmount , ref } from "vue";

//获取菜单折叠的贮存值
import { useNavStore } from "@/store/modules/nav";

const appStore = useAppStore();
//首页默认高亮
const activePath = computed(() => appStore.activeTopMenu);
const router = useRouter();
//贮存子菜单高亮变量
let activeIndex = ''
// 递归跳转
const goFirst = (menu: any[]) => {
    //清空子菜单高亮
    activeIndex = ''
    if (!menu.length) return;
    const [first] = menu;
    if (first.children) {
        goFirst(first.children);
    } else {
        router.push({
            name: first.name,
        });
    }
};
//导航栏事件
const selectMenu = (index: string) => {
    appStore.changeTopActive(index);
    permissionStore.getMixLeftMenu(index);
    const { mixLeftMenu } = permissionStore;
    goFirst(mixLeftMenu);
};
const permissionStore = usePermissionStore();
const topMenu = ref<any[]>([]);

//console.log("路由信息", topMenu);

const openedSubMenu = ref<string | null>(null);
const handleOpen = (index: string) => {
    openedSubMenu.value = index;
    localStorage.setItem('openedSubMenu', index);
};
const handleClose = () => {
    openedSubMenu.value = null;
    localStorage.removeItem('openedSubMenu');
};

//加载钩子
onMounted(() => {
    topMenu.value = permissionStore.routes.filter(
        (item) => !item.meta || !item.meta.hidden
    );
    const savedSubMenu = localStorage.getItem('openedSubMenu');
    if (savedSubMenu) {
        openedSubMenu.value = savedSubMenu;
    }
});
const handleMenuItemClick = (menuItem: any) => {
    // console.log("menuItem", menuItem);
    activeIndex = menuItem
    // 取消首页的高亮
    appStore.changeTopActive('');
    console.log('判断', activeIndex, activeIndex);
    //console.log();


    // 将菜单项的路由名称转换为小写
    //const routeName = menuItem.toLowerCase(); 
    //转化首字母大写
    const routeName = menuItem.charAt(0).toUpperCase() + menuItem.slice(1);
    //console.log(upperCaseString);

    // 检查是否存在对应的路由配置
    const routeExists = router.getRoutes().find((route) => route.name === routeName);
    if (routeExists) {
        // 路由配置存在，正常导航
        router.push({ name: routeName });
    } else {
        // 路由配置不存在，导航到404页面
        router.push({
            name: "NotFound"
        });
    }
    //页面卸载钩子
    onBeforeUnmount(() => {
    //localStorage.setItem('openedSubMenu', openedSubMenu.value);
});
};
</script>
<template>
    <el-scrollbar>
        <el-menu style="width: 220px;" router :unique-opened="true" :default-active="activeIndex"
            background-color="47,66,86" text-color="#bfcbd9" mode="vertical" active-text-color="#409eff"
            @select="selectMenu" @open="handleOpen" @close="handleClose">
            <template v-for="route in topMenu" :key="route.path">
                <template v-if="route.children.length === 1">
                    <el-menu-item :index="route.path" :class="{ 'active-menu-item': activePath === route.path }">
                        <el-icon>
                            <!-- <component :is="route.icon" /> -->
                            <House />
                        </el-icon>
                        <template #title v-if="route.meta">{{ route.meta.title }}</template>
                    </el-menu-item>
                </template>
                <template v-else>
                    <el-sub-menu :index="route.path" :opened="openedSubMenu === route.path">
                        <template #title>
                            <el-icon>
                                <User />
                            </el-icon>
                            <span>{{ route.meta.title }}</span>
                        </template>
                        <el-menu-item-group style="background-color: #1f2d3d;" v-for="routes in route.children">
                            <el-menu-item :class="{ 'active-menu-item': activeIndex === routes.path }" :index="routes.name"
                                @click="handleMenuItemClick(routes.path)">{{
                                    routes.meta.title
                                }}</el-menu-item>
                        </el-menu-item-group>
                    </el-sub-menu>
                </template>
            </template>
        </el-menu>
    </el-scrollbar>
</template>
<style lang="scss" scoped>
.el-menu {
    height: 50px !important;
    //color: white;
}

.el-menu {
    height: 50px !important;
}

.active-menu-item {
    //background-color: #409eff; // 设置高亮时的背景颜色
    color: #409eff; // 设置高亮时的文本颜色
}
</style>
