import {
  create,
  getByUid,
  update,
  deleteByUid,
} from "@/lib/silo/category"
import { Category } from "@/types/category"
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
} from "firebase/firestore"
import { uid } from "uid"

jest.mock("../lib/firebase", () => ({
  db: {},
}))

jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  deleteDoc: jest.fn(),
  collection: jest.fn(),
  query: jest.fn(),
  onSnapshot: jest.fn(),
}))

jest.mock("uid", () => ({
  uid: jest.fn(() => "mock-uid"),
}))

describe("Category", () => {
  const siloUid = "silo-123"
  const categoryUid = "mock-uid"
  const mockDocRef = {}

  const mockCategory: Category = {
    uid: categoryUid,
    name: "Groceries",
    budgetedAmountInCents: 10000,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("create: creates and returns a new category", async () => {
    ;(doc as jest.Mock).mockReturnValueOnce(mockDocRef)
    ;(doc as jest.Mock).mockReturnValueOnce(mockDocRef)
    ;(setDoc as jest.Mock).mockResolvedValue(undefined)

    const result = await create(
      siloUid,
      mockCategory.name,
      mockCategory.budgetedAmountInCents,
    )

    expect(uid).toHaveBeenCalledWith(32)
    expect(setDoc).toHaveBeenCalledWith(mockDocRef, {
      uid: categoryUid,
      name: mockCategory.name,
      budgetedAmountInCents: mockCategory.budgetedAmountInCents,
    })
    expect(result).toEqual(mockCategory)
  })

  it("getByUid: returns category if it exists", async () => {
    ;(doc as jest.Mock).mockReturnValue(mockDocRef)
    ;(getDoc as jest.Mock).mockResolvedValue({
      exists: () => true,
      id: "cat2",
      data: () => ({
        name: "Utilities",
        budgetedAmountInCents: 20000,
      }),
    })

    const result = await getByUid(siloUid, "cat2")

    expect(result).toEqual({
      uid: "cat2",
      name: "Utilities",
      budgetedAmountInCents: 20000,
    })
  })

  it("update: updates and returns the category", async () => {
    ;(doc as jest.Mock).mockReturnValue(mockDocRef)
    ;(setDoc as jest.Mock).mockResolvedValue(undefined)

    const result = await update(siloUid, categoryUid, mockCategory)
    expect(setDoc).toHaveBeenCalledWith(mockDocRef, mockCategory)
    expect(result).toEqual(mockCategory)
  })

  it("deleteByUid: deletes the category", async () => {
    ;(doc as jest.Mock).mockReturnValue(mockDocRef)
    ;(deleteDoc as jest.Mock).mockResolvedValue(undefined)

    await deleteByUid(siloUid, categoryUid)
    expect(deleteDoc).toHaveBeenCalledWith(mockDocRef)
  })
})
