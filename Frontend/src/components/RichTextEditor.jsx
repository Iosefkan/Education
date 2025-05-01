import { Card } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const RichTextEditor = ({ value, onChange, placeholder = 'Enter your text...' }) => {

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false]}, {'font': ['', 'serif', 'monospace']}],
      ['bold', 'italic', 'underline', 'strike', { 'script': 'sub'}, { 'script': 'super' }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }, {'indent': '-1'}, {'indent': '+1'}, {'align': ['', 'center', 'right', 'justify']}],
      ['link'],
      ['blockquote', 'code-block'],
      [{ 'color': [] }, { 'background': [] }],
      ['clean']
    ]
  };

  const formats = [
    'header', 'font',
    'bold', 'italic', 'underline', 'strike', 'script',
    'list', 'bullet', 'indent', 'align',
    'link',
    'blockquote', 'code-block',
    'color', 'background'
  ];

  return (
    <Card className="border">
      <Card.Body className="p-0">
        <ReactQuill
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          theme="snow"
        />
      </Card.Body>
    </Card>
  );
};

export default RichTextEditor;