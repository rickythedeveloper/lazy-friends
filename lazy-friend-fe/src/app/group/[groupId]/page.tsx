export default async function GroupViewPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const { groupId } = await params;

  return <div>{groupId}</div>;
}
