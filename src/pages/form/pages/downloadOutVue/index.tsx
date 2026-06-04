import React from 'react'
import { Modal, Radio, Form, Input, message } from 'antd'
import { useFormStore } from '@/store/modules/form'
import { generateVueComponent, generateReactComponent } from '@/pages/form/static'

export type ExportCodeTarget = 'vue' | 'react'

interface Props {
  open: boolean
  onClose: () => void
}

type FieldType = {
  exportTarget?: ExportCodeTarget
  filename?: string
}

const DownloadOutVue: React.FC<Props> = ({ open, onClose }) => {
  const [form] = Form.useForm<FieldType>()
  const { centerItems, formConfig } = useFormStore()

  const onOk = async () => {
    try {
      const values = await form.validateFields()
      const { filename, exportTarget = 'vue' } = values

      const content =
        exportTarget === 'react'
          ? generateReactComponent(centerItems, formConfig)
          : generateVueComponent(centerItems, formConfig)

      const defaultExt = exportTarget === 'react' ? '.tsx' : '.vue'
      const finalName = filename!.endsWith(defaultExt)
        ? filename!
        : filename!.replace(/\.(vue|tsx)$/i, '') + defaultExt

      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
      const url = window.URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.download = finalName
      link.click()

      window.URL.revokeObjectURL(url)
      message.success('导出成功！')
      onClose()
    } catch {
      message.error('导出失败，请检查表单数据')
    }
  }

  return (
    <Modal
      title="导出代码文件"
      centered
      open={open}
      onCancel={onClose}
      onOk={onOk}
      okText="导出"
      cancelText="取消"
      destroyOnHidden
    >
      <Form
        form={form}
        name="exportCode"
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 19 }}
        initialValues={{ exportTarget: 'vue' }}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="代码类型"
          name="exportTarget"
          rules={[{ required: true, message: '请选择代码类型' }]}
        >
          <Radio.Group
            optionType="button"
            buttonStyle="solid"
            options={[
              { value: 'vue', label: 'Vue3 + Element Plus' },
              { value: 'react', label: 'React + Ant Design' },
            ]}
          />
        </Form.Item>
        <Form.Item<FieldType>
          label="文件名"
          name="filename"
          rules={[{ required: true, message: '请输入文件名' }]}
        >
          <Input placeholder="如 MyForm.vue 或 MyForm.tsx" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default DownloadOutVue
