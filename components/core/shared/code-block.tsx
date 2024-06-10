import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

interface CodeBlockProps extends React.HTMLAttributes<HTMLDivElement> {
    code?: string;
    language?: string;
}

export const CodeBlock = ({
    code = '(num) => num + 1',
    language = 'typescript',
}: CodeBlockProps) => {
    return <SyntaxHighlighter language={language} style={docco}
        className="rounded-md"
    >
        {code}
    </SyntaxHighlighter>
};