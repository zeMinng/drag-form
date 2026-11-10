import type { ReactNode } from 'react'
import { AlertTriangle, House, RotateCcw } from 'lucide-react'
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary'
import './index.scss'

type ErrorReport = {
  name: string
  message: string
  stack?: string
  componentStack?: string
}

function reportError(report: ErrorReport) {
  console.error('[drag-form] Unhandled render error', report)
}

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const message = error instanceof Error ? error.message : String(error)
  const stack = error instanceof Error ? error.stack : undefined

  return (
    <main className="error-boundary">
      <section className="error-result" aria-labelledby="error-heading">
        <div className="error-icon" aria-hidden="true">
          <AlertTriangle size={30} strokeWidth={1.8} />
        </div>
        <p className="error-eyebrow">APPLICATION ERROR</p>
        <h1 className="error-result-title" id="error-heading">
          页面暂时无法显示
        </h1>
        <p className="error-description">发生了一个意外错误。你可以重试，或者返回首页继续操作。</p>

        <div className="error-details">
          <h2 className="error-title">错误信息</h2>
          <pre className="error-message">{message}</pre>
          {stack && (
            <details className="error-stack">
              <summary>查看错误堆栈</summary>
              <pre>{stack}</pre>
            </details>
          )}
        </div>

        <div className="error-actions">
          <button className="error-btn error-btn-primary" onClick={resetErrorBoundary}>
            <RotateCcw size={16} aria-hidden="true" />
            重试
          </button>
          <a className="error-btn" href="/">
            <House size={16} aria-hidden="true" />
            返回首页
          </a>
        </div>
      </section>
    </main>
  )
}

export function ErrorBoundaryComponent({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, info) => {
        reportError({
          name: error instanceof Error ? error.name : 'UnknownError',
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          componentStack: info.componentStack ?? undefined,
        })
      }}
    >
      {children}
    </ErrorBoundary>
  )
}
