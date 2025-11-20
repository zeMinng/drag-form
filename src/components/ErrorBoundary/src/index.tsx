import React from 'react'
import { Button, Result, Space, Modal } from 'antd'
import { ReloadOutlined, DeleteOutlined, HomeOutlined } from '@ant-design/icons'
import './index.scss'

interface ErrorBoundaryProps {
  children: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

/**
 * ErrorBoundary 组件
 * 
 * 说明：React 要求 Error Boundary 必须使用类组件（函数组件无法实现）
 * 这是 React 的限制，目前没有更好的解决方案
 * 
 * @see https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
 */
export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // 记录错误信息
    console.error('Error caught by boundary:', error, errorInfo)
    
    // 保存错误信息到 state（用于详细显示）
    this.setState({
      errorInfo,
    })

    // 这里可以添加错误上报逻辑
    // 例如：上报到监控系统
    // reportError(error, errorInfo)
  }

  /**
   * 重置错误状态，尝试重新渲染
   */
  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  /**
   * 清除缓存
   */
  handleDeleteCache = (): void => {
    Modal.warning({
      title: '清除本地缓存',
      content: '拖入的组件信息会被清空，确定要清除缓存吗？',
      centered: true,
      onOk: () => {
        localStorage.clear()
        window.location.reload()
      }
    })
  }

  /**
   * 重新加载页面
   */
  handleReload = (): void => {
    window.location.reload()
  }

  /**
   * 返回首页
   */
  handleGoHome = (): void => {
    window.location.href = '/'
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      const { error, errorInfo } = this.state

      return (
        <div className="error-boundary-container">
          <Result
            status="error"
            title="出现了一些问题"
            subTitle={
              <div className="error-details">
                <p className="error-message">
                  {error?.message || '未知错误'}
                </p>
                {errorInfo && (
                  <details className="error-stack">
                    <summary>错误详情</summary>
                    <pre>{errorInfo.componentStack}</pre>
                  </details>
                )}
              </div>
            }
            extra={
              <Space size="middle">
                <Button
                  type="primary"
                  icon={<ReloadOutlined />}
                  onClick={this.handleReset}
                >
                  重试
                </Button>
                <Button
                  icon={<DeleteOutlined />}
                  onClick={this.handleDeleteCache}
                >
                  清空缓存
                </Button>
                <Button
                  icon={<HomeOutlined />}
                  onClick={this.handleGoHome}
                >
                  返回首页
                </Button>
                <Button
                  onClick={this.handleReload}
                >
                  重新加载页面
                </Button>
              </Space>
            }
          />
        </div>
      )
    }

    return this.props.children
  }
}
