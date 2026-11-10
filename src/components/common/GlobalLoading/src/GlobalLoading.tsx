import './GlobalLoading.scss'

const appTitle = import.meta.env.VITE_APP_TITLE

export function GlobalLoadingComponent() {
  return (
    <div className="global-loading">
      <div className="global-loading__container">
        <div className="center-loading">
          <div className="loading-title">{appTitle}</div>
        </div>
      </div>
    </div>
  )
}
