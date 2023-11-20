<template>
    <div class="login-box">
        <div class="login-form">
            <div class="login-title">
                <h2>login</h2>
            </div>
            <el-form ref="ruleFormData" :model="loginData" :rules="loginRules" class="demo-ruleForm">
                <el-form-item prop="username">
                    <el-input :prefix-icon="userIcon" v-model.number="loginData.username" placeholder="请输入账号"
                        @keyup.enter="handleLogin"></el-input>
                </el-form-item>
                <el-form-item style="margin-top: 20px" prop="password">
                    <el-input :prefix-icon="lockIcon" type="password" show-password v-model="loginData.password"
                        placeholder="请输入密码" @keyup.enter="handleLogin" @input="handleInput"></el-input>
                </el-form-item>
                <el-form-item style="margin-top: 20px" prop="verifyCode">
                    <div style="flex: 1;"> <el-input :prefix-icon="codeIcon" auto-complete="off"
                            v-model="loginData.verifyCode" placeholder="请输入验证码" @keyup.enter="handleLogin"></el-input></div>

                    <div class="code-box">
                        <el-image :src="captchaBase64" @click="getCaptcha" style="width: 120px;height: 32px;" />
                    </div>

                </el-form-item>

                <el-form-item style="margin-top: 40px">
                    <el-button style="width: 100%" type="primary" :loading="loading" @click="handleLogin">登录</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script setup lang="ts">
import router from "@/router";
import { User, Lock } from '@element-plus/icons-vue'
import SvgIcon from "@/components/SvgIcon/index.vue";
import { onMounted, onBeforeUnmount, ref, h, onUnmounted } from 'vue';
import { LoginData } from "@/api/auth/types";
//引入pinia状态管理依赖
import { useUserStore } from "@/store/modules/user";
import { getCaptchaApi } from '@/api/user';
import { LocationQuery, LocationQueryValue, useRoute } from "vue-router";
import { ElForm, ElNotification } from "element-plus";
const userStore = useUserStore();

const route = useRoute();
//自定义图标及其引入svg
const userIcon = User
const lockIcon = Lock
const codeIcon = SvgIcon


//表单绑定内容
// const formRef = ref<any>({});
const ruleFormData = ref<any>({});

const loginData = ref<LoginData>({
    username: "admin",
    password: "123456",
})
//密码框禁止输入字符
function handleInput() {
    loginData.value.password = loginData.value.password.replace(/[^a-zA-Z0-9]/g, "");
}
//表单验证
const loginRules = {
    username: [{ required: true, message: '请输入账号', trigger: "blur" }],
    password: [{ required: true, message: '请输入密码', trigger: "blur", validator: passwordValidator }],
    verifyCode: [{ required: true, message: '请输验证码', trigger: "blur" }],
};
//密码校验器
function passwordValidator(rule: any, value: any, callback: any) {
    // 使用正则表达式检查密码是否只包含字母和数字
    const alphanumericRegex = /^[a-zA-Z0-9]+$/;
    if (!alphanumericRegex.test(value)) {
        // 如果密码包含特殊符号或空格，通过回调函数返回一个包含错误信息的 Error 对象
        callback(new Error("密码只能包含字母和数字，不允许包含特殊符号或空格！"));
    } else if (value.length < 6) {
        // 检查密码长度是否小于6个字符
        // 如果密码长度小于6个字符，通过回调函数返回一个包含错误信息的 Error 对象
        callback(new Error("密码长度不能小于6个字符！"));
    } else {
        // 如果密码符合要求，通过回调函数返回空，表示验证通过
        callback();
    }
}
//验证码图片Base64字符串
const captchaBase64 = ref();
//按钮loadin加载
const loading = ref(false);
//点击验证码重新获取验证码
function getCaptcha() {
    console.log("点击重新获取验证码");
    getCaptchaApi().then(({ data }) => {
        console.log(data);
        const { captchaImgBase64, verifyCodeKey } = data;
        //验证码key值
        loginData.value.verifyCodeKey = verifyCodeKey;
        //验证码图片
        captchaBase64.value = captchaImgBase64
        //console.log(verifyCodeBase64);

    });
}

//登录按钮
function handleLogin() {
    //表单验证
    ruleFormData.value.validate((valid: boolean) => {
        //如果表单内容的所有值不为空，则调用异步请求的方法
        if (valid) {
            // 调用用户存储对象的登录方法，传入登录数据
            userStore
                .login(loginData.value)
                .then(() => {
                    // 获取当前页面的查询参数
                    loading.value = true
                    // 获取当前页面的查询参数
                    const query: LocationQuery = route.query;
                    // console.log(query);
                    // 获取重定向路径，默认为根路径"/"
                    const redirect = (query.redirect as LocationQueryValue) ?? "/";
                    // 处理除了"redirect"之外的其他查询参数
                    const otherQueryParams = Object.keys(query).reduce(
                        (acc: any, cur: string) => {
                            if (cur !== "redirect") {
                                acc[cur] = query[cur];
                            }
                            return acc;
                        },
                        {}
                    );
                    // 使用路由对象进行页面重定向
                    router.push({ path: redirect, query: otherQueryParams });

                })
                .catch(() => {
                    // 验证失败，重新生成验证码
                    getCaptcha();
                })
                .finally(() => {
                    // 无论登录成功或失败，都将loading设置为false
                    loading.value = true;
                    setTimeout(() => {
                        loading.value = false;
                    }, 2000);
                });
        }
    })
}
onMounted(() => {
    //调用重新获取验证码的方法
    getCaptcha();
});
//页面卸载钩子函数
onUnmounted(() => {
    let uerInfo = useUserStore()
    ElNotification({
        // title: 'Success',
        message: h('i', { style: 'color: teal' }, "欢迎回来" + "  " + uerInfo.nickname + "!"),
        type: 'success',
    })
})
</script>
<style lang="scss" scoped>
$bgColor: #2d3a4b;

*,
html {
    padding: 0px;
    margin: 0px;
}

.login-box {
    width: 100vw;
    height: 100vh;
    background-color: $bgColor;
    background-size: 100% 100%;
    padding: 0px;
    display: flex;
    justify-content: center;
    align-items: center;

    .login-title {
        text-align: center;
        padding-bottom: 50px;
    }
}

.login-form {
    width: 500px;
    margin: 10px;
    padding: 50px;
    background-color: white;
    border-radius: 10px;
}

.code-box {
    display: flex;
    justify-content: space-between;
}
</style>
