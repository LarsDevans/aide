import {
  addParticipant,
  archive,
  getByUid,
  removeParticipant,
  unarchive,
  update,
} from "@/lib/silo/silo"
import { Silo } from "@/types/silo"
import { doc, getDoc, updateDoc } from "firebase/firestore"

jest.mock("../lib/firebase", () => ({
  db: {},
}))

jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
  updateDoc: jest.fn(),
}))

describe("Silo", () => {
  const uid = "silo-123"
  const mockDocRef = {}

  const mockSilo: Silo = {
    uid,
    name: "Test Silo",
    description: "A mock silo for testing",
    isArchived: false,
    ownerUid: "owner-123",
    participants: ["john@aide.com"],
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("getByUid: returns correct name and description when document exists", async () => {
    ;(doc as jest.Mock).mockReturnValue(mockDocRef)
    ;(getDoc as jest.Mock).mockResolvedValue({
      exists: () => true,
      data: () => mockSilo,
    })

    const result = await getByUid(uid)

    expect(result).toEqual(mockSilo)
    expect(result?.name).toBe("Test Silo")
    expect(result?.description).toBe("A mock silo for testing")
  })

  it("update: should return the updated silo", async () => {
    const updatedSilo: Silo = {
      ...mockSilo,
      name: "Updated Silo",
      description: "Updated description",
    }

    ;(doc as jest.Mock).mockReturnValue(mockDocRef)
    ;(updateDoc as jest.Mock).mockResolvedValue(undefined)

    const result = await update(uid, updatedSilo)

    expect(result).toEqual(updatedSilo)
  })

  it("archive: sets isArchived to true and saves silo", async () => {
    ;(doc as jest.Mock).mockReturnValue(mockDocRef)
    ;(getDoc as jest.Mock).mockResolvedValueOnce({
      exists: () => true,
      data: () => mockSilo,
    })
    ;(updateDoc as jest.Mock).mockResolvedValueOnce(undefined)

    const result = await archive(uid)

    expect(updateDoc).toHaveBeenCalledWith(mockDocRef, {
      ...mockSilo,
      isArchived: true,
    })
    expect(result?.isArchived).toBe(true)
  })

  it("unarchive: sets isArchived to false and saves silo", async () => {
    ;(doc as jest.Mock).mockReturnValue(mockDocRef)
    ;(getDoc as jest.Mock).mockResolvedValueOnce({
      exists: () => true,
      data: () => ({ ...mockSilo, isArchived: true }),
    })
    ;(updateDoc as jest.Mock).mockResolvedValueOnce(undefined)

    const result = await unarchive(uid)

    expect(updateDoc).toHaveBeenCalledWith(mockDocRef, {
      ...mockSilo,
      isArchived: false,
    })
    expect(result?.isArchived).toBe(false)
  })

  it("addParticipant: adds email if not present and updates silo", async () => {
    const newEmail = "newuser@aide.com"
    const result = await addParticipant(uid, newEmail)

    expect(result?.participants).toContain(newEmail)
    expect(result?.participants?.length).toBe(mockSilo.participants!.length + 1)
  })

  it("removeParticipant: removes email if present and updates silo", async () => {
    const emailToRemove = "john@aide.com"
    const result = await removeParticipant(uid, emailToRemove)

    expect(result?.participants).not.toContain(emailToRemove)
    expect(result?.participants?.length).toBe(0)
  })
})
