import { Publication } from "../../../../../../model/interfaces";
import PaperLink from "../../../../../shared/paperLink";

export default function PublicationsList({ publications }: { publications: Publication[] }) {
    return (
        <>
            {publications.length === 0 ? (
                <tr>
                <td>No Papers Yet :(</td>
                </tr>
            ) : (
                <>
                {publications.map((paper, index) => (
                    <tr key={index}>
                    <td>{paper.publication_name}</td>
                    <td>
                        <PaperLink link={paper.paper_link} />
                    </td>
                    </tr>
                ))}
                </>
            )}
        </>
    )
}