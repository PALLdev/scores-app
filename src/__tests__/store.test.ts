import { describe, it, expect, beforeEach } from "vitest"
import { useGameStore } from "@/lib/store"

function createTestGame() {
  return useGameStore.getState().createGame(["Ana", "Luis"])
}

describe("GameStore", () => {
  beforeEach(() => {
    // Reset store
    useGameStore.setState({ games: {}, currentGameId: null })
  })

  describe("createGame", () => {
    it("creates a game with players and status in_progress", () => {
      const id = createTestGame()
      const game = useGameStore.getState().games[id]
      expect(game).toBeDefined()
      expect(game.players).toHaveLength(2)
      expect(game.players[0].name).toBe("Ana")
      expect(game.players[1].name).toBe("Luis")
      expect(game.status).toBe("in_progress")
      expect(game.currentRound).toBe(1)
    })

    it("sets currentGameId", () => {
      const id = createTestGame()
      expect(useGameStore.getState().currentGameId).toBe(id)
    })
  })

  describe("submitRound", () => {
    it("adds a round and advances to next", () => {
      const id = createTestGame()
      useGameStore.getState().submitRound(id, 1, [
        { playerId: useGameStore.getState().games[id].players[0].id, points: 10, won: false },
        { playerId: useGameStore.getState().games[id].players[1].id, points: 0, won: true },
      ])
      const game = useGameStore.getState().games[id]
      expect(game.rounds).toHaveLength(1)
      expect(game.currentRound).toBe(2)
      expect(game.status).toBe("in_progress")
    })

    it("marks game as completed on round 10", () => {
      const id = createTestGame()
      const players = useGameStore.getState().games[id].players

      for (let r = 1; r <= 10; r++) {
        useGameStore.getState().submitRound(id, r, [
          { playerId: players[0].id, points: r * 5, won: false },
          { playerId: players[1].id, points: r * 3, won: r === 1 || r === 10 },
        ])
      }
      const game = useGameStore.getState().games[id]
      expect(game.rounds).toHaveLength(10)
      expect(game.status).toBe("completed")
    })
  })

  describe("undoLastRound", () => {
    it("removes the last round and goes back", () => {
      const id = createTestGame()
      const players = useGameStore.getState().games[id].players
      useGameStore.getState().submitRound(id, 1, [
        { playerId: players[0].id, points: 10, won: false },
        { playerId: players[1].id, points: 0, won: true },
      ])
      useGameStore.getState().undoLastRound(id)
      const game = useGameStore.getState().games[id]
      expect(game.rounds).toHaveLength(0)
      expect(game.currentRound).toBe(1)
    })
  })

  describe("editRoundScore", () => {
    it("modifies a specific player's score in a round", () => {
      const id = createTestGame()
      const players = useGameStore.getState().games[id].players
      useGameStore.getState().submitRound(id, 1, [
        { playerId: players[0].id, points: 10, won: false },
        { playerId: players[1].id, points: 0, won: true },
      ])
      useGameStore.getState().editRoundScore(id, 1, players[0].id, 25, false)
      const game = useGameStore.getState().games[id]
      const score = game.rounds[0].scores.find((s) => s.playerId === players[0].id)
      expect(score?.points).toBe(25)
    })
  })

  describe("addLatePlayer", () => {
    it("adds a player with highest current score", () => {
      const id = createTestGame()
      const players = useGameStore.getState().games[id].players
      useGameStore.getState().submitRound(id, 1, [
        { playerId: players[0].id, points: 10, won: false },
        { playerId: players[1].id, points: 0, won: true },
      ])
      useGameStore.getState().addLatePlayer(id, "Carlos")
      const game = useGameStore.getState().games[id]
      expect(game.players).toHaveLength(3)

      const carlos = game.players.find((p) => p.name === "Carlos")
      expect(carlos).toBeDefined()

      const carlosScore = game.rounds[0].scores.find((s) => s.playerId === carlos!.id)
      expect(carlosScore?.points).toBe(10)
    })

    it("does not exceed 5 players", () => {
      const id = useGameStore.getState().createGame(["A", "B", "C", "D", "E"])
      useGameStore.getState().addLatePlayer(id, "F")
      const game = useGameStore.getState().games[id]
      expect(game.players).toHaveLength(5)
    })
  })

  describe("deleteGame", () => {
    it("removes a game from the store", () => {
      const id = createTestGame()
      useGameStore.getState().deleteGame(id)
      expect(useGameStore.getState().games[id]).toBeUndefined()
    })
  })
})
