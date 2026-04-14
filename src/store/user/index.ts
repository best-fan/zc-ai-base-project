/**
 * 用户状态管理
 */
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { login as userLogin, logout as userLogout, getUserInfo } from '@/services/user'
import { setToken, clearToken } from '@/utils/auth'
import { addDynamicRoutes, resetDynamicRoutes } from '@/router'
import type { IUserInfo, ILoginReqData, IMenu } from '@/types'

export const useUserStore = defineStore('user', () => {
  // State
  const userBo = ref<IUserInfo['userBo']>({
    id: '',
    account: '',
    realName: '',
    nickName: '',
    basicId: '',
    birthday: '',
    description: '',
    telephone: '',
    dingtalkPhone: '',
    education: '',
    email: '',
    firstLoginTime: '',
    gender: 1,
    headIcon: '',
    lastLoginIp: '',
  })
  const mainDept = ref<IUserInfo['mainDept']>({
    deptId: '',
    deptName: '',
  })
  const menuTreeBoList = ref<IMenu[]>([])
  const roleList = ref<IUserInfo['roleList']>([])
  const otherDeptList = ref<IUserInfo['otherDeptList']>([])
  const menuKeys = ref<Set<string>>(new Set())

  // Getters
  const userInfo = computed<IUserInfo>(() => ({
    userBo: userBo.value,
    mainDept: mainDept.value,
    menuTreeBoList: menuTreeBoList.value,
    roleList: roleList.value,
    otherDeptList: otherDeptList.value,
    menuKeys: menuKeys.value,
  }))

  const isLoggedIn = computed(() => !!userBo.value.id)

  // Actions
  const setInfo = (partial: Partial<IUserInfo>): void => {
    const getMenuKeys = (menuKeySet: Set<string>, menus: IMenu[]): void => {
      if (!menus || !Array.isArray(menus)) return
      menus.forEach((menu) => {
        if (menu.menuType === 'A') {
          return
        }
        if (menu.menuType === 'C') {
          menuKeySet.add(menu.enCode)
        }
        if (menu.children && menu.children.length > 0) {
          getMenuKeys(menuKeySet, menu.children)
        }
      })
    }

    const menuKeySet = new Set<string>()
    const menuList = partial.menuTreeBoList ?? []
    getMenuKeys(menuKeySet, menuList)

    if (partial.userBo) userBo.value = partial.userBo
    if (partial.mainDept) mainDept.value = partial.mainDept
    // 无论菜单是否为空，都设置动态路由（空数组也会标记为已处理）
    menuTreeBoList.value = menuList
    addDynamicRoutes(menuList)
    if (partial.roleList) roleList.value = partial.roleList
    if (partial.otherDeptList) otherDeptList.value = partial.otherDeptList
    menuKeys.value = menuKeySet
  }

  const resetInfo = (): void => {
    userBo.value = {
      id: '',
      account: '',
      realName: '',
      nickName: '',
      basicId: '',
      birthday: '',
      description: '',
      telephone: '',
      dingtalkPhone: '',
      education: '',
      email: '',
      firstLoginTime: '',
      gender: 1,
      headIcon: '',
      lastLoginIp: '',
    }
    mainDept.value = {
      deptId: '',
      deptName: '',
    }
    menuTreeBoList.value = []
    roleList.value = []
    otherDeptList.value = []
    menuKeys.value = new Set()
    // 重置动态路由
    resetDynamicRoutes()
  }

  const info = async (): Promise<IUserInfo | undefined> => {
    if (userBo.value.id) return userInfo.value
    const res = await getUserInfo()
    setInfo(res.data)
  }

  const login = async (loginForm: ILoginReqData): Promise<void> => {
    try {
      const res = await userLogin(loginForm)
      if(res?.data?.tokenInfo){
        setToken(res.data.tokenInfo)
        // 登录成功后立即获取用户信息并设置动态路由
        const userInfoRes = await getUserInfo()
        setInfo(userInfoRes.data)
      } else {
        return Promise.reject(new Error('登录失败：未获取到 token')) 
      }

    } catch (err) {
      clearToken()
      throw err
    }
  }

  const logoutCallBack = (): void => {
    resetInfo()
    clearToken()
  }

  const logout = async (): Promise<void> => {
    try {
      await userLogout()
    } finally {
      logoutCallBack()
    }
  }

  return {
    // State
    userBo,
    mainDept,
    menuTreeBoList,
    roleList,
    otherDeptList,
    menuKeys,
    // Getters
    userInfo,
    isLoggedIn,
    // Actions
    setInfo,
    resetInfo,
    info,
    login,
    logout,
    logoutCallBack,
  }
}, {
  persist: {
    key: 'user_info',
    paths: ['userBo', 'mainDept', 'menuTreeBoList', 'roleList', 'otherDeptList', 'menuKeys'],
    // menuKeys 是 Set 类型，需要自定义序列化
    serializer: {
      serialize: (state) => JSON.stringify({
        userBo: state.userBo,
        mainDept: state.mainDept,
        menuTreeBoList: state.menuTreeBoList,
        roleList: state.roleList,
        otherDeptList: state.otherDeptList,
        menuKeys: state.menuKeys ? Array.from(state.menuKeys as Set<string>) : [],
      }),
      deserialize: (value) => {
        const parsed = JSON.parse(value)
        return {
          userBo: parsed.userBo,
          mainDept: parsed.mainDept ?? { deptId: '', deptName: '' },
          menuTreeBoList: parsed.menuTreeBoList ?? [],
          roleList: parsed.roleList ?? [],
          otherDeptList: parsed.otherDeptList ?? [],
          menuKeys: parsed.menuKeys ? new Set(parsed.menuKeys) : new Set(),
        }
      },
    },
  },
})