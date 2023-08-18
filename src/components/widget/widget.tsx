import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import './widget.css';

export default function Widget(props: {
    title: string,
    children: ReactJSXElement
}) {
    return (
        <div className="base">
            <div className="header">
                <h2>{props.title}</h2>
            </div>
            <div className="content">
                <>{props.children}</>
            </div>
        </div>
    )
}