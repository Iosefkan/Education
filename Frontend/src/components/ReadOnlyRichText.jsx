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
        style={{
          border: 'none',
          fontFamily: 'inherit',
          backgroundColor: 'transparent'
        }}
      />
      <style>{`
        .readonly-editor .ql-container.ql-snow {
          border: none !important;
          padding: 0;
        }
        .readonly-editor .ql-editor {
          padding: 0;
          cursor: default;
        }
        .readonly-editor .ql-clipboard {
          display: none !important;
        }
      `}
      </style>
    </div>
  );
};

export default ReadOnlyRichText;