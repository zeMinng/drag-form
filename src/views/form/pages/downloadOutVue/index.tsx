/*
 * @Author: zeMing 2439340964@qq.com
 * @Date: 2025-08-04 15:45:01
 * @LastEditors: zeMing 2439340964@qq.com
 * @LastEditTime: 2025-08-06 11:09:56
 * @FilePath: \drag-vue-form\src\views\form\pages\downloadOutVue\index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React from 'react'
import { Modal, Radio, Form, Input, message } from 'antd'
import { useFormStore } from '@/store/modules/form'
import { generateVueComponent } from '@/utils/codeGenerator'

interface Props {
  open: boolean
  onClose: () => void
}

type FieldType = {
  buildType?: number
  filename?: string
}

const DownloadOutVue: React.FC<Props> = ({ open, onClose }) => {
  const [form] = Form.useForm<FieldType>()
  const { centerItems } = useFormStore()

  const onOk = async () => {
    try {
      const values = await form.validateFields()
      const { filename } = values

      // 使用新的代码生成器生成Vue 3 + TypeScript + Element Plus代码
      const vueContent = generateVueComponent(centerItems)

      const blob = new Blob([vueContent], { type: 'text/plain;charset=utf-8' })
      const url = window.URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.download = filename!.endsWith('.vue') ? filename! : filename + '.vue'
      link.click()

      window.URL.revokeObjectURL(url)
      message.success('导出成功！')
      onClose()
    } catch {
      message.error('导出失败，请检查表单数据')
    }
  }

  return (
    <>
      <Modal
        title="导出 Vue 3 + TypeScript + Element Plus 文件"
        centered
        open={open}
        onCancel={onClose}
        onOk={onOk}
        okText="导出"
        cancelText="取消"
      >
        <Form
          form={form}
          name="basic"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 19 }}
          initialValues={{ buildType: 1 }}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            label="生成类型" 
            name="buildType"
            rules={[{ required: true, message: '请选择生成类型' }]}
          >
            <Radio.Group
              id="buildType"
              optionType="button"
              buttonStyle="solid"
              disabled
              options={[
                { value: 1, label: '页面' },
                { value: 2, label: '弹窗' },
              ]}
            />
          </Form.Item>
          <Form.Item<FieldType>
            label="文件名"
            name="filename"
            rules={[{ required: true, message: '请输入文件名' }]}
          >
            <Input
              placeholder="请输入文件名，如 MyForm.vue"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default DownloadOutVue
