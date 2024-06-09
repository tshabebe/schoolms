export default async function Student({
  params,
}: {
  params: { sectionId: string };
}) {
  return <div>{params.sectionId}</div>;
}
