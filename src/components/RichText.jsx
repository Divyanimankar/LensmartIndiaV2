function Node({ node }) {
  const kids = (node.children || []).map((c, i) => <Node key={i} node={c} />);

  switch (node.type) {
    case "paragraph":
      return <p>{kids}</p>;
    case "heading": {
      const H = `h${node.level || 3}`;
      return <H>{kids}</H>;
    }
    case "list": {
      const L = node.listType === "ordered" ? "ol" : "ul";
      return <L>{kids}</L>;
    }
    case "list-item":
      return <li>{kids}</li>;
    case "link":
      return <a href={node.url}>{kids}</a>;
    case "text": {
      let t = node.value;
      if (node.bold) t = <strong>{t}</strong>;
      if (node.italic) t = <em>{t}</em>;
      return <>{t}</>;
    }
    default:
      return <>{kids}</>;
  }
}

export default function RichText({ value }) {
  if (!value) return null;

  let root;
  try {
    root = typeof value === "string" ? JSON.parse(value) : value;
  } catch {
    return null;
  }

  return <Node node={root} />;
}