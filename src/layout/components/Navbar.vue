<template>
    <div class="nav">
        <div class="nav-box">
            <div class="left-collapse">
                <el-icon style="margin-left: 10px;font-size: 16px; cursor: pointer; " @click="isCollapse">
                    <Fold></Fold>
                </el-icon>
            </div>
            <div class="rghtinfo-avatar">
                <div>
                </div>
                <div class="loginUot">
                    <el-dropdown @visible-change="clickDown" trigger="click" style="color: white;">
                        <span>
                            <el-image style="width: 40px;height: 40px;border-radius: 5px;"
                                :src="parsedUserInfo.avatar"></el-image>
                            <el-icon class="arrow-down">
                                <DownIcon style="color: black;" />
                            </el-icon>
                        </span>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item @click="loginOut">退出登录</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                    <!-- <div @click="loginOut">退出登录</div> -->
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
// import { ElMessage } from 'element-plus'
import { CaretBottom, CaretTop ,Fold} from '@element-plus/icons-vue'
import { useRoute, useRouter } from "vue-router";
import { useUserStore, useUserStoreHook } from "@/store/modules/user";
import { useNavStore } from "@/store/modules/nav";
import { ref } from 'vue';
const navStore = useNavStore();
let DownIcon = CaretBottom

const userStore = useUserStore();

// 从 localStorage 中获取并解析 UserInfo 对象
const storedData: any = localStorage.getItem("userInfo");
const parsedUserInfo = JSON.parse(storedData);

//创建并且调用userStore的logout方法
const route = useRoute();
const router = useRouter();


const isCollapsed = ref(false); // 保存折叠状态的变量
function isCollapse(){
    isCollapsed.value = !isCollapsed.value; // 取反折叠状态
    navStore.toggleCollapse(); 
    console.log(isCollapsed.value);

}

function clickDown(e: any) {
    // DownIcon = CaretBottom
    // console.log("e", e);
    // if (e === true) {
    //     DownIcon = CaretBottom
    // }else{
    //     DownIcon=CaretTop
    // }
}
    function loginOut() {
        userStore.logout().then(() => {
            //重定向到登录页面，并且携带查询参数
            router.push(`/login?redirect=${route.fullPath}`);
        })

    }


</script>
<style lang="scss" scoped>
.nav-box {
    display: flex;
    //justify-content: flex-end;
    justify-content: space-between;

    .loginUot {
        padding-right: 30px;
    }
}

.arrow-down {
    position: relative;
    top: -10px;
    right: -10px;
}
.left-collapse{
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    align-content: center;
}
</style>

