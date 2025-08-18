import Link from "next/link";

interface Group {
  id: string;
  title: string;
}

interface GroupListProps {
  groups: Group[];
}

export function GroupList({ groups }: GroupListProps) {
  return (
    <ul className={"divide-y divide"}>
      {groups.map((group) => (
        <li key={group.id} className={"text-lg px-1 py-2"}>
          <Link href={`/group/${group.id}`}>{group.title || "No title"}</Link>
        </li>
      ))}
    </ul>
  );
}
