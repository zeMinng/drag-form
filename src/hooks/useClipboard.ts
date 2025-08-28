import { useCallback } from 'react'
import { message } from 'antd'
import { utils } from '@/views/form/static/utils/commonUtils'

/**
 * 剪贴板操作 hook
 * 提供复制文本到剪贴板的功能，包含降级方案
 */
export const useClipboard = () => {
  const copyText = useCallback(async (
    text: string, 
    fallbackElement?: HTMLElement,
    successMessage = '复制成功',
    errorMessage = '复制失败'
  ) => {
    const success = await utils.copyToClipboard(text, fallbackElement)
    
    if (success) {
      message.success(successMessage)
    } else {
      message.error(errorMessage)
    }
    
    return success
  }, [])

  return {
    copyText,
  }
}
