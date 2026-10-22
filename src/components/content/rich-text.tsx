export function RichText({ content }: { content: string }) {
  const blocks = content
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <div className="prose-luxe max-w-2xl text-[0.9375rem]">
      {blocks.map((block, index) => {
        const heading = block.match(/^##\s+(.+)$/);
        if (heading) {
          return <h2 key={index}>{heading[1]}</h2>;
        }

        const lines = block.split("\n");
        if (lines.length > 1 && lines.every((line) => /^[-*]\s+/.test(line))) {
          return (
            <ul key={index}>
              {lines.map((line) => (
                <li key={line}>{line.replace(/^[-*]\s+/, "")}</li>
              ))}
            </ul>
          );
        }

        return <p key={index}>{block}</p>;
      })}
    </div>
  );
}
