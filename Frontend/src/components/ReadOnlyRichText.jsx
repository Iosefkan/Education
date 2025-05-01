import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const ReadOnlyRichText = ({ content }) => {
  return (
    <div className="readonly-editor">
      <ReactQuill
        value={content}
        readOnly={true}
        modules={{ toolbar: false }}
        theme="snow"
      />
    </div>
  );
};

export default ReadOnlyRichText;