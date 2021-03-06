import { BLOCKQUOTE, HeadingType, ListType, PARAGRAPH } from 'elements';
import { Editor, Point, Range, Transforms } from 'slate';

const SHORTCUTS: { [key: string]: string } = {
  '*': ListType.LIST_ITEM,
  '-': ListType.LIST_ITEM,
  '+': ListType.LIST_ITEM,
  '>': BLOCKQUOTE,
  '#': HeadingType.H1,
  '##': HeadingType.H2,
  '###': HeadingType.H3,
  '####': HeadingType.H4,
  '#####': HeadingType.H5,
  '######': HeadingType.H6,
};

export const withShortcuts = <T extends Editor>(editor: T) => {
  const { deleteBackward, insertText } = editor;

  editor.insertText = text => {
    const { selection } = editor;

    if (text === ' ' && selection && Range.isCollapsed(selection)) {
      const { anchor } = selection;
      const block = Editor.above(editor, {
        match: n => Editor.isBlock(editor, n),
      });
      const path = block ? block[1] : [];
      const start = Editor.start(editor, path);
      const range = { anchor, focus: start };
      const beforeText = Editor.string(editor, range);
      const type = SHORTCUTS[beforeText];
      if (type) {
        Transforms.select(editor, range);
        Transforms.delete(editor);
        Transforms.setNodes(
          editor,
          { type },
          { match: n => Editor.isBlock(editor, n) }
        );
        if (type === ListType.LIST_ITEM) {
          const list = { type: ListType.UL_LIST, children: [] };
          Transforms.wrapNodes(editor, list, {
            match: n => n.type === ListType.LIST_ITEM,
          });
        }
        return;
      }
    }

    insertText(text);
  };

  editor.deleteBackward = (...args) => {
    const { selection } = editor;

    if (selection && Range.isCollapsed(selection)) {
      const match = Editor.above(editor, {
        match: n => Editor.isBlock(editor, n),
      });
      if (match) {
        const [block, path] = match;
        const start = Editor.start(editor, path);
        if (block.type !== PARAGRAPH && Point.equals(selection.anchor, start)) {
          Transforms.setNodes(editor, { type: PARAGRAPH });
          if (block.type === ListType.LIST_ITEM) {
            Transforms.unwrapNodes(editor, {
              match: n => n.type === ListType.UL_LIST,
            });
          }
          return;
        }
      }
    }

    deleteBackward(...args);
  };

  return editor;
};
