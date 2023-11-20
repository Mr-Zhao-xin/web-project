<template>
    <div class="layout">
        <Sidebar class="sidebar-container" />
        <div class="main-container">
            <Navbar class="nav" />
            <div>
                <el-main class="app-main">
                    <router-view />
                </el-main>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import Sidebar from "./components/Sidebar/index.vue";
import Navbar from "./components/Navbar.vue";
export default {
    name: "Layout",
    components: {
        Sidebar,
        Navbar,
    },
};
</script>
<style lang="scss">
.layout {
    position: relative;
}

.sidebar-container {
    transition: width 0.28s;
    width: 210px !important;
    background-color: #304156;
    height: 100%;
    position: fixed;
    font-size: 0px;
    // top: 50px;
    bottom: 0;
    left: 0;
    z-index: 1001;
    overflow: hidden;
}

.nav {
    // position: fixed;
    // height: 50px;
    // top: 0;
    // z-index: 1001;
    //background-color: aquamarine;
}

.app-main {
    /*50 = navbar  */
    min-height: calc(100vh - 50px);
    width: 100%;
    position: relative;
    overflow: hidden;
    background: #6666660f;
    //margin-top: 50px;
    padding: 0px !important;
}

.main-container {
    min-height: 100%;
    transition: margin-left 0.28s;
    margin-left: 210px;
    position: relative;
}

.app-main {
    /*50 = navbar  */
    min-height: calc(100vh - 50px);
    width: 100%;
    position: relative;
    overflow: hidden;
    background: #6666660f;
}
</style>
  