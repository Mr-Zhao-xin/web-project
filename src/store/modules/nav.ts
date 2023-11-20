//定义一个 store来存储折叠状态的值
import { defineStore } from 'pinia';

export const useNavStore = defineStore({
    id: 'nav',
    state: () => ({
        isCollapsed: false,
    }),
    actions: {
        toggleCollapse() {
            this.isCollapsed = !this.isCollapsed;
        },
    },
});
