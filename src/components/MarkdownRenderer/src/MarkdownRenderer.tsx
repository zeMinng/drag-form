import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github.css'
import '../markdown.scss' 

interface Props {
  fileName: string // 相对于固定目录的文件名，比如 'designIdeas.md'
}

// 这里是相对于这个文件的 glob 路径
const mdModules = import.meta.glob('/src/views/md/md/*.md', { query: '?raw', import: 'default' })

export default function MarkdownRenderer({ fileName }: Props) {
  const [content, setContent] = useState('加载中...')

  useEffect(() => {
    const path = `/src/views/md/md/${fileName}`
    const loader = mdModules[path]
    if (!loader) {
      setContent(`❌ 找不到文件: ${fileName}`)
      return
    }
    loader()
    .then((md) => setContent(md as string))
    .catch(() => setContent('❌ 加载失败'))
  }, [fileName])

  return (
    <div className="markdown-body">
      <ReactMarkdown
        children={content}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
      />
    </div>
  )
}
