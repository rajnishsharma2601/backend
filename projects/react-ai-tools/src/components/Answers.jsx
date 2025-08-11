


function Answer({ ans, index }) {
  const renderAnswer = () => {
    // If answer looks like a list (bullet/numbered), split and render as <ul>
    const listPattern = /^(\s*[\d\-•▪●]+\s+)/gm;
    const isList = listPattern.test(ans);

    if (isList) {
      const lines = ans
        .split(/\n/)
        .filter((line) => line.trim() !== "")
        .map((line) => line.replace(/^(\s*[\d\-•▪●]+\s+)/, "").trim());

      return (
        <ul className="list-disc list-inside text-left">
          {lines.map((line, idx) => (
            <li key={idx}>{line}</li>
          ))}
        </ul>
      );
    }

    // If answer contains code block
    if (ans.includes("```")) {
      const parts = ans.split("```");
      return parts.map((part, idx) =>
        idx % 2 === 1 ? (
          <pre
            key={idx}
            className="bg-zinc-900 text-left text-green-300 overflow-x-auto p-3 rounded mb-2"
          >
            <code>{part}</code>
          </pre>
        ) : (
          <p key={idx} className="mb-2">
            {part}
          </p>
        )
      );
    }

    // Fallback to plain text
    return <p className="text-left">{ans}</p>;
  };

  return (
    <div className="text-sm md:text-base whitespace-pre-wrap">
      {renderAnswer()}
    </div>
  );
}

export default Answer;
