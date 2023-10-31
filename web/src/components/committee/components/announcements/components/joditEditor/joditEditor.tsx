import JoditEditor, { IJoditEditorProps } from "jodit-react";
import { useEffect, useMemo, useRef, useState } from "react";

export default function AnnouncementsJoditEditor() {
    const editor = useRef(null);
	const [content, setContent] = useState('');

	const config = useMemo<IJoditEditorProps["config"]>(
        () => ({
            readonly: false,
            placeholder: "Start typing...",
        }), []
	);

    useEffect(() => console.log(content), [content]);

	return (
		<JoditEditor
			ref={editor}
			value={content}
			config={config}
			onBlur={newContent => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
			onChange={newContent => {}}
		/>
	);
}
