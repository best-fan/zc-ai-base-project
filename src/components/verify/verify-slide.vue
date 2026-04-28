<template>
  <div style="position: relative">
    <div class="verify-img-out" :style="{ height: setSize.imgHeight + vSpace + 'px' }">
      <div
        class="verify-img-panel"
        :style="{
          width: setSize.imgWidth + 'px',
          height: setSize.imgHeight + 'px',
        }"
      >
        <img
          :src="backImgBase ? 'data:image/png;base64,' + backImgBase : defaultImg"
          alt=""
          style="width: 100%; height: 100%; display: block"
        >
        <div v-show="showRefresh" class="verify-refresh" @click="refresh">
          <i class="iconfont icon-refresh" />
        </div>
        <transition name="tips">
          <span v-if="tipWords" class="verify-tips" :class="passFlag ? 'suc-bg' : 'err-bg'">{{
            tipWords
          }}</span>
        </transition>
      </div>
    </div>
    <!-- 公共部分 -->
    <div
      class="verify-bar-area"
      :style="{
        width: setSize.imgWidth + 'px',
        height: barSize.height,
        'line-height': barSize.height,
      }"
    >
      <span class="verify-msg" v-text="text" />
      <div
        class="verify-left-bar"
        :style="{
          width: leftBarWidth !== '' ? leftBarWidth : barSize.height,
          height: barSize.height,
          'border-color': leftBarBorderColor,
          transition: transitionWidth,
        }"
      >
        <span class="verify-msg" v-text="finishText" />
        <div
          class="verify-move-block"
          :style="{
            width: barSize.height,
            height: barSize.height,
            'background-color': moveBlockBackgroundColor,
            left: moveBlockLeft,
            transition: transitionLeft,
          }"
          @touchstart="start"
          @mousedown="start"
        >
          <i :class="['verify-icon iconfont', iconClass]" :style="{ color: iconColor }" />
          <div
            class="verify-sub-block"
            :style="{
              width: Math.floor((setSize.imgWidth * 47) / 310) + 'px',
              height: setSize.imgHeight + 'px',
              top: '-' + (setSize.imgHeight + vSpace) + 'px',
              'background-size': setSize.imgWidth + 'px ' + setSize.imgHeight + 'px',
            }"
          >
            <img
              :src="'data:image/png;base64,' + blockBackImgBase"
              alt=""
              style="width: 100%; height: 100%; display: block"
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
/**
 * VerifySlide
 * @description 滑块
 * */
import {
  ref,
  reactive,
  computed,
  getCurrentInstance,
  onMounted,
  PropType,
  type ComponentInternalInstance,
} from 'vue'
import { aesEncrypt } from '@/utils/crypto'
import { getCaptcha, checkCaptcha } from '@/services/verify'
import type {
  IGetCaptchaReqData,
  ICheckCaptchaReqData,
  IGetCaptchaRes,
  ICheckCaptchaRes,
} from '@/types'
import defaultImg from '@/assets/images/captcha-default.jpg'
import { resetSize, type IVerifyComponent } from './reset-size'

const props = defineProps({
  type: {
    type: String,
    default: '1',
  },
  // 弹出式pop，固定fixed
  vSpace: {
    type: Number,
    default: 5,
  },
  imgSize: {
    type: Object as PropType<{ width: string; height: string }>,
    default() {
      return {
        width: '310px',
        height: '155px',
      }
    },
  },
  blockSize: {
    type: Object as PropType<{ width: string; height: string }>,
    default() {
      return {
        width: '50px',
        height: '50px',
      }
    },
  },
  barSize: {
    type: Object,
    default() {
      return {
        width: '310px',
        height: '40px',
      }
    },
  },
})

const actionTip = '向右滑动完成验证' // 操作提示
const captchaType = 'blockPuzzle' // 验证码类型
let secretKey = '' // 后端返回的加密秘钥 字段
let passFlag = false // 是否通过的标识
const backImgBase = ref('') // 验证码背景图片
const blockBackImgBase = ref('') // 验证滑块的背景图片
let backToken = '' // 后端返回的唯一token值
let startMoveTime: number // 移动开始的时间
let endMovetime: number // 移动结束的时间
const startLeft = ref(0) // 滑块距离左侧间距
const tipWords = ref('')
const text = ref('')
let finishText = ''
const setSize = reactive({
  imgHeight: 0,
  imgWidth: 0,
  barHeight: 0,
  barWidth: 0,
})
// let top = 0
// let left = 0
const moveBlockLeft = ref('')
const leftBarWidth = ref('')
// 移动中样式
const moveBlockBackgroundColor = ref('')
const leftBarBorderColor = ref('#ddd')
const iconColor = ref('')
const iconClass = ref('icon-right')
const status = ref(false) // 鼠标状态
const isEnd = ref(false) // 是够验证完成
const showRefresh = ref(true)
let transitionLeft = ''
let transitionWidth = ''

const { proxy } = getCurrentInstance() as ComponentInternalInstance
const barArea = computed<HTMLElement | null>(() => {
  return proxy?.$el?.querySelector('.verify-bar-area') ?? null
})

onMounted(() => {
  if (proxy?.$el) {
    proxy.$el.onselectstart = function () {
      return false
    }
  }
})

// 请求背景图片和验证图片
const getCaptchaPictrue = async () => {
  try {
    const reqData: IGetCaptchaReqData = {
      captchaType,
      clientUid: localStorage.getItem('slider') || '',
      ts: Date.now(), // 现在的时间戳
    }

    const res: IGetCaptchaRes = await getCaptcha(reqData)
    if (res.repCode === '0000') {
      backImgBase.value = res.repData.originalImageBase64
      blockBackImgBase.value = res.repData.jigsawImageBase64
      backToken = res.repData.token
      secretKey = res.repData.secretKey
    } else {
      tipWords.value = res.repMsg ?? '获取验证码失败'
    }

    // 判断接口请求次数是否失效
    if (res.repCode === '6201') {
      backImgBase.value = ''
      blockBackImgBase.value = ''
    }
    Object.assign(setSize, resetSize(proxy as unknown as IVerifyComponent))
  } catch (err) {
    // 获取验证码失败
  }
}

// 鼠标移动
const move = (e: MouseEvent | TouchEvent) => {
  const event = e || (window.event as MouseEvent | TouchEvent)
  if (status.value && isEnd.value === false && barArea.value) {
    let x = 0
    if (event instanceof TouchEvent) {
      // 兼容移动端
      x = event.touches[0].pageX
    } else {
      // 兼容PC端
      x = event.clientX
    }

    const barAreaLeft = barArea.value.getBoundingClientRect().left
    let moveBlockLeftTemp: number = x - barAreaLeft // 小方块相对于父元素的left值

    if (
      moveBlockLeftTemp >=
      barArea.value.offsetWidth - parseInt(props.blockSize.width, 10) / 2 - 2
    ) {
      moveBlockLeftTemp = barArea.value.offsetWidth - parseInt(props.blockSize.width, 10) / 2 - 2
    }
    if (moveBlockLeftTemp <= 0) {
      moveBlockLeftTemp = parseInt(props.blockSize.width, 10) / 2
    }
    // 拖动后小方块的left值
    moveBlockLeft.value = `${moveBlockLeftTemp - startLeft.value}px`
    leftBarWidth.value = `${moveBlockLeftTemp - startLeft.value}px`
  }
}

// 鼠标松开
const end = async () => {
  try {
    endMovetime = +new Date()
    // 判断是否重合
    if (status.value && isEnd.value === false) {
      let moveLeftDistance = parseInt((moveBlockLeft.value || '0').replace('px', ''), 10)
      moveLeftDistance = (moveLeftDistance * 310) / setSize.imgWidth
      const data: ICheckCaptchaReqData = {
        captchaType,
        pointJson: secretKey
          ? aesEncrypt(JSON.stringify({ x: moveLeftDistance, y: 5.0 }), secretKey)
          : JSON.stringify({ x: moveLeftDistance, y: 5.0 }),
        token: backToken,
      }

      // 接口返回与标准返回类型不符，临时处理
      const res: ICheckCaptchaRes = await checkCaptcha(data)

      if (res.repCode === '0000') {
        moveBlockBackgroundColor.value = '#5cb85c'
        leftBarBorderColor.value = '#5cb85c'
        iconColor.value = '#fff'
        iconClass.value = 'icon-check'
        showRefresh.value = false
        isEnd.value = true
        passFlag = true

        tipWords.value = `${((endMovetime - startMoveTime) / 1000).toFixed(2)}s验证成功`

        const captchaVerification = secretKey
          ? aesEncrypt(
              `${backToken}---${JSON.stringify({
                x: moveLeftDistance,
                y: 5.0,
              })}`,
              secretKey
            )
          : `${backToken}---${JSON.stringify({ x: moveLeftDistance, y: 5.0 })}`
        setTimeout(() => {
          tipWords.value = ''
          ;(proxy?.$parent as unknown as { close: () => void })?.close()
          ;(proxy?.$parent as unknown as { $emit: (event: string, data: string) => void })?.$emit(
            'verifySuccess',
            captchaVerification
          )
        }, 1000)
      } else {
        moveBlockBackgroundColor.value = '#d9534f'
        leftBarBorderColor.value = '#d9534f'
        iconColor.value = '#fff'
        iconClass.value = 'icon-close'
        passFlag = false
        setTimeout(function () {
          refresh()
        }, 1000)
        ;(proxy?.$parent as { $emit: (event: string) => void })?.$emit('error')
        tipWords.value = '验证失败'
        setTimeout(() => {
          tipWords.value = ''
        }, 1000)
      }
      status.value = false
    }
  } catch (err) {
    // 验证请求失败
  }
}

const init = () => {
  // 重置滑块状态
  showRefresh.value = true
  finishText = ''
  transitionLeft = 'left .3s'
  moveBlockLeft.value = '0'
  leftBarWidth.value = ''
  transitionWidth = 'width .3s'
  leftBarBorderColor.value = '#ddd'
  moveBlockBackgroundColor.value = '#fff'
  iconColor.value = '#000'
  iconClass.value = 'icon-right'
  isEnd.value = false

  text.value = actionTip
  getCaptchaPictrue()
  Object.assign(setSize, resetSize(proxy as unknown as IVerifyComponent)) // 重新设置宽度高度

  // 300ms 后清除过渡效果，避免滑动时卡顿
  setTimeout(() => {
    transitionWidth = ''
    transitionLeft = ''
  }, 300)

  // 移除旧的事件监听器
  window.removeEventListener('touchmove', move)
  window.removeEventListener('mousemove', move)
  window.removeEventListener('touchend', end)
  window.removeEventListener('mouseup', end)

  // 添加新的事件监听器
  window.addEventListener('touchmove', move)
  window.addEventListener('mousemove', move)
  window.addEventListener('touchend', end)
  window.addEventListener('mouseup', end)
}

const start = (e: MouseEvent | TouchEvent) => {
  const event = e || (window.event as MouseEvent | TouchEvent)
  if (!barArea.value) return

  let x = 0
  if (event instanceof TouchEvent) {
    // 兼容移动端
    x = event.touches[0].pageX
  } else {
    // 兼容PC端
    x = event.clientX
  }
  startLeft.value = Math.floor(x - barArea.value.getBoundingClientRect().left)

  startMoveTime = +new Date() // 开始滑动的时间
  if (isEnd.value === false) {
    text.value = ''
    moveBlockBackgroundColor.value = '#337ab7'
    leftBarBorderColor.value = '#337AB7'
    iconColor.value = '#fff'
    e.stopPropagation()
    status.value = true
  }
}

const refresh = () => {
  showRefresh.value = true
  finishText = ''

  transitionLeft = 'left .3s'
  moveBlockLeft.value = '0'

  leftBarWidth.value = ''
  transitionWidth = 'width .3s'

  leftBarBorderColor.value = '#ddd'
  moveBlockBackgroundColor.value = '#fff'
  iconColor.value = '#000'
  iconClass.value = 'icon-right'
  isEnd.value = false

  getCaptchaPictrue()
  setTimeout(() => {
    transitionWidth = ''
    transitionLeft = ''
    text.value = actionTip
  }, 300)
}

defineExpose({ init, refresh })
</script>

<script lang="ts">
export default {
  name: 'VerifySlide',
}
</script>
