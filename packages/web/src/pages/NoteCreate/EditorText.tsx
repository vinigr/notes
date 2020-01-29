import React from 'react';

import { Editor } from 'react-draft-wysiwyg';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

interface Props {
  onEditorStateChange: any;
}

const EditorText = ({ onEditorStateChange }: Props) => (
  <Editor
    onEditorStateChange={onEditorStateChange}
    wrapperStyle={{ zIndex: 0, marginTop: 10 }}
    toolbarStyle={{ marginBottom: 0 }}
    editorStyle={{
      borderColor: '#F1F1F1',
      minHeight: 200,
      borderWidth: 1,
      borderStyle: 'solid',
      marginBottom: 16,
      padding: 10,
      marginTop: 0,
    }}
    toolbar={{
      options: ['inline', 'blockType', 'list', 'emoji', 'remove', 'history'],
      inline: {
        options: ['bold', 'italic', 'underline', 'strikethrough', 'monospace'],
        bold: { className: 'bordered-option-classname' },
        italic: { className: 'bordered-option-classname' },
        underline: { className: 'bordered-option-classname' },
        strikethrough: { className: 'bordered-option-classname' },
        code: { className: 'bordered-option-classname' },
      },
      blockType: {
        className: 'bordered-option-classname',
      },
      fontSize: {
        className: 'bordered-option-classname',
      },
    }}
  />
);

export default EditorText;
