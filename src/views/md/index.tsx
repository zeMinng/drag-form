import { MarkdownRenderer } from '@/components/MarkdownRenderer'

const DesignIdeas: React.FC = () => {
  return (
    <div style={{ width: '100%', height: '100%', overflowY: 'auto' }}>
      <MarkdownRenderer fileName="designIdeas.md" />
    </div>
  )
}

export default DesignIdeas
