import {
  create,
  listenForBySiloUid$,
  getByUid,
  update,
  deleteByUid,
} from "@/lib/silo/category"
import { Category } from "@/types/category"
import { doc, getDoc, setDoc, deleteDoc, collection, query, onSnapshot } from "firebase/firestore"
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

    const result = await create(siloUid, mockCategory.name, mockCategory.budgetedAmountInCents)

    expect(uid).toHaveBeenCalledWith(32)
    expect(setDoc).toHaveBeenCalledWith(mockDocRef, {
      uid: categoryUid,
      name: mockCategory.name,
      budgetedAmountInCents: mockCategory.budgetedAmountInCents,
    })
    expect(result).toEqual(mockCategory)
  })

  it("create: returns null on error", async () => {
    ;(doc as jest.Mock).mockImplementationOnce(() => {
      throw new Error("fail")
    })

    const result = await create(siloUid, mockCategory.name, mockCategory.budgetedAmountInCents)
    expect(result).toBeNull()
  })

  it("listenForBySiloUid$: emits categories from onSnapshot", (done) => {
    const mockUnsubscribe = jest.fn()
    const mockDocData = {
      data: () => ({
        name: "Rent",
        budgetedAmountInCents: 50000,
      }),
      id: "cat1",
    }

    ;(collection as jest.Mock).mockReturnValue("mockCol")
    ;(query as jest.Mock).mockReturnValue("mockQuery")
    ;(onSnapshot as jest.Mock).mockImplementation((query, next) => {
      next({ docs: [mockDocData] })
      return mockUnsubscribe
    })

    const observable$ = listenForBySiloUid$(siloUid)
    observable$.subscribe((categories) => {
      expect(categories).toEqual([
        {
          uid: "cat1",
          name: "Rent",
          budgetedAmountInCents: 50000,
        },
      ])
      done()
    })
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

  it("getByUid: returns null if document doesn't exist", async () => {
    ;(doc as jest.Mock).mockReturnValue(mockDocRef)
    ;(getDoc as jest.Mock).mockResolvedValue({
      exists: () => false,
    })

    const result = await getByUid(siloUid, "cat2")
    expect(result).toBeNull()
  })

  it("update: updates and returns the category", async () => {
    ;(doc as jest.Mock).mockReturnValue(mockDocRef)
    ;(setDoc as jest.Mock).mockResolvedValue(undefined)

    const result = await update(siloUid, categoryUid, mockCategory)
    expect(setDoc).toHaveBeenCalledWith(mockDocRef, mockCategory)
    expect(result).toEqual(mockCategory)
  })

  it("update: returns null on error", async () => {
    ;(doc as jest.Mock).mockImplementationOnce(() => {
      throw new Error("fail")
    })

    const result = await update(siloUid, categoryUid, mockCategory)
    expect(result).toBeNull()
  })

  it("deleteByUid: deletes the category", async () => {
    ;(doc as jest.Mock).mockReturnValue(mockDocRef)
    ;(deleteDoc as jest.Mock).mockResolvedValue(undefined)

    await deleteByUid(siloUid, categoryUid)
    expect(deleteDoc).toHaveBeenCalledWith(mockDocRef)
  })

  it("deleteByUid: handles errors silently", async () => {
    ;(doc as jest.Mock).mockReturnValue(mockDocRef)
    ;(deleteDoc as jest.Mock).mockRejectedValue(new Error("delete error"))

    await expect(deleteByUid(siloUid, categoryUid)).resolves.toBeUndefined()
  })
})
