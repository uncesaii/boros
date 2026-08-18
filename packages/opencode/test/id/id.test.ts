import { describe, expect, test } from "bun:test"
import { Identifier } from "../../src/id/id"

// A 2026 timestamp in milliseconds — the regime where the old 0x1000 layout
// overflowed the 48-bit time field and wrapped.
const TS_2026 = Date.parse("2026-08-18T00:00:00Z")

describe("Identifier", () => {
  test("round-trips a 2026 timestamp through create/timestamp", () => {
    const id = Identifier.create("ses", "ascending", TS_2026)
    expect(Identifier.timestamp(id)).toBe(TS_2026)
  })

  test("ascending IDs preserve timestamp ordering", () => {
    const a = Identifier.create("ses", "ascending", TS_2026)
    const b = Identifier.create("ses", "ascending", TS_2026 + 1000)
    expect(Identifier.timestamp(a)).toBeLessThan(Identifier.timestamp(b))
    // The serialized IDs must order the same way, not just the decoded timestamps.
    expect(a < b).toBe(true)
  })

  test("allows up to 127 IDs per millisecond", () => {
    // A fresh millisecond so the module-level counter starts at 0.
    const ts = TS_2026 + 1_000_000
    for (let i = 0; i < 127; i++) {
      expect(Identifier.timestamp(Identifier.create("ses", "ascending", ts))).toBe(ts)
    }
  })

  test("throws on the 128th ID in a millisecond", () => {
    // A fresh millisecond so the module-level counter starts at 0.
    const ts = TS_2026 + 2_000_000
    for (let i = 0; i < 127; i++) {
      Identifier.create("ses", "ascending", ts)
    }
    expect(() => Identifier.create("ses", "ascending", ts)).toThrow()
  })
})