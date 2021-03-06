import React, { useMemo, useState } from 'react';
import { createEditor } from 'slate';
import { withHistory } from 'slate-history';
import { Slate, withReact } from 'slate-react';
import {
  BlockquotePlugin,
  EditablePlugins,
  HeadingPlugin,
  ListPlugin,
  withBlock,
  withList,
  withShortcuts,
} from '../../packages/slate-plugins/src';
import { initialValueMarkdownShortcuts } from '../config/initialValues';

export default {
  title: 'Plugins/withShortcuts',
};

export const MarkdownShortcuts = () => {
  const plugins = [BlockquotePlugin(), ListPlugin(), HeadingPlugin()];

  const createReactEditor = () => () => {
    const [value, setValue] = useState(initialValueMarkdownShortcuts);

    const editor = useMemo(
      () =>
        withShortcuts(
          withList(withBlock(withHistory(withReact(createEditor()))))
        ),
      []
    );

    return (
      <Slate
        editor={editor}
        value={value}
        onChange={newValue => setValue(newValue)}
      >
        <EditablePlugins
          plugins={plugins}
          placeholder="Write some markdown..."
          spellCheck
          autoFocus
        />
      </Slate>
    );
  };

  const Editor = createReactEditor();

  return <Editor />;
};
