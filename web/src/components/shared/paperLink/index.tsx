export default function PaperLink({ link }: { link: string }) {
  return (
    <a
      href={!link.startsWith("http") ? "https://" + link : link}
      target="_blank"
      rel="noopener noreferrer"
    >
      {link}
    </a>
  );
}
