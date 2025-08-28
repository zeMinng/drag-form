/**
 * Vue样式生成器
 * 负责生成Vue组件的style部分
 */

/**
 * 生成Vue组件的样式代码
 * @returns CSS样式字符串
 */
export const generateVueStyle = (): string => {
  return `.form-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.el-form-item {
  margin-bottom: 20px;
}

/* 行内表单样式 */
.el-form--inline .el-form-item {
  margin-right: 20px;
  margin-bottom: 20px;
}

/* 水平布局样式 */
.el-form--label-position-top .el-form-item__label {
  padding-bottom: 8px;
}

/* 布局组件样式 */
.form-row {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.form-col {
  flex: 1;
}

.form-card {
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-group {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 20px;
  background-color: #fafafa;
}

.group-title {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e7eb;
}`
}
