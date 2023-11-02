import JoditEditor, { IJoditEditorProps } from "jodit-react";
import { useMemo, useRef } from "react";

export default function AnnouncementsJoditEditor({content, onChange}: {content: string, onChange: (newContent: string) => void}) {
    const editor = useRef(null);

	const config = useMemo<IJoditEditorProps["config"]>(
        () => ({
            readonly: false,
            placeholder: "Start typing...",
        }), []
	);

	return (
		<JoditEditor
			ref={editor}
			value={content}
			config={config}
			onBlur={newContent => onChange(newContent)} // preferred to use only this option to update the content for performance reasons
		/>
	);
}
