import { GamePageClient } from "./client"

export default async function GamePage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  return <GamePageClient gameId={id} />
}
