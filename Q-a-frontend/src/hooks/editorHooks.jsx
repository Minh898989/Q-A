import { useEffect } from 'react';

export function useTextFormatting(textareaRef, setContent) {
    const insertAtCursor = (before, after = '', replaceSelection = true) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selected = textarea.value.substring(start, end);

        let newText;
        if (replaceSelection) {
            newText = before + selected + after;
        } else {
            newText = before;
        }

        const newValue =
            textarea.value.substring(0, start) +
            newText +
            textarea.value.substring(end);

        setContent(newValue);

        setTimeout(() => {
            textarea.focus();
            if (!replaceSelection || selected.length === 0) {
                textarea.selectionStart = textarea.selectionEnd = start + newText.length;
            } else {
                textarea.selectionStart = start + before.length;
                textarea.selectionEnd = start + before.length + selected.length;
            }
        }, 0);
    };

    const insertAlignAtCursor = (alignment) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selected = textarea.value.substring(start, end);
        const contentToWrap = selected || 'Nội dung căn lề';

        const wrapped = `<p style="text-align: ${alignment};">${contentToWrap}</p>`;
        const newValue = textarea.value.substring(0, start) + wrapped + textarea.value.substring(end);
        setContent(newValue);

        setTimeout(() => {
            textarea.focus();
            if (selected.length === 0) {
                const pos = textarea.value.indexOf('>') + 1;
                textarea.selectionStart = textarea.selectionEnd = start + pos;
            } else {
                textarea.selectionStart = start + wrapped.indexOf('>') + 1;
                textarea.selectionEnd = start + wrapped.indexOf('>') + 1 + contentToWrap.length;
            }
        }, 0);
    };

    return { insertAtCursor, insertAlignAtCursor };
}

export function useInsertList(textareaRef, setContent) {
    const insertListAtCursor = () => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const value = textarea.value;

        const beforeCursor = value.substring(0, start);
        const afterCursor = value.substring(end);
        let insertText = '- ';

        if (!beforeCursor.endsWith('\n')) {
            insertText = '\n' + insertText;
        }

        const newValue = beforeCursor + insertText + afterCursor;
        setContent(newValue);

        setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = beforeCursor.length + insertText.length;
            textarea.focus();
        }, 0);
    };

    return { insertListAtCursor };
}

export function useAutoList(textareaRef, setContent, cursorPosRef, content) {
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea && cursorPosRef.current !== null) {
            textarea.selectionStart = textarea.selectionEnd = cursorPosRef.current;
            cursorPosRef.current = null;
        }
    }, [content, cursorPosRef, textareaRef]);

    const handleContentKeyDown = (e) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const { selectionStart, selectionEnd, value } = textarea;
        const lines = value.substring(0, selectionStart).split('\n');
        const currentLine = lines[lines.length - 1];
        const listMatch = currentLine.match(/^(\s*)([-*+]|\d+\.)\s/);

        if (e.key === 'Enter' && listMatch) {
            e.preventDefault();

            const indent = listMatch[1].replace(/\t/g, '  ');
            const bullet = listMatch[2];
            const lineContent = currentLine.trim().slice(bullet.length).trim();

            if (lineContent === '') {
                const before = value.substring(0, selectionStart - currentLine.length);
                const after = value.substring(selectionEnd);
                setContent(before + '\n' + after);
                setTimeout(() => {
                    textarea.selectionStart = textarea.selectionEnd = before.length + 1;
                }, 0);
            } else {
                const before = value.substring(0, selectionStart);
                const after = value.substring(selectionEnd);
                const newValue = before + '\n' + indent + bullet + ' ' + after;
                setContent(newValue);
                setTimeout(() => {
                    const pos = before.length + 1 + indent.length + bullet.length + 1;
                    textarea.selectionStart = textarea.selectionEnd = pos;
                }, 0);
            }
        }

        if (e.key === 'Tab') {
            e.preventDefault();
            const isShift = e.shiftKey;
            const lastLineBreak = value.lastIndexOf('\n', selectionStart - 1);
            const lineStart = lastLineBreak + 1;
            const nextLineBreak = value.indexOf('\n', selectionStart);
            const lineEnd = nextLineBreak === -1 ? value.length : nextLineBreak;

            const currentLineText = value.substring(lineStart, lineEnd);
            let newLineText = currentLineText;

            if (isShift) {
                if (currentLineText.startsWith('  ')) {
                    newLineText = currentLineText.substring(2);
                } else if (currentLineText.startsWith('\t')) {
                    newLineText = currentLineText.substring(1);
                }
            } else {
                newLineText = '  ' + currentLineText;
            }

            const newValue = value.substring(0, lineStart) + newLineText + value.substring(lineEnd);
            setContent(newValue);

            const cursorOffset = newLineText.length - currentLineText.length;
            cursorPosRef.current = selectionStart + cursorOffset;
        }
    };

    return { handleContentKeyDown };
}
