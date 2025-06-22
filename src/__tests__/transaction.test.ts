import {
  getByUid as getTransactionByUid,
  create,
  deleteByUid,
  update,
  assignCategory,
} from "@/lib/silo/transaction"
import { Transaction } from "@/types/transaction"
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore"
import { getByUid as getSiloByUid } from "@/lib/silo/silo"
import { getByUid as getCategoryByUid } from "@/lib/silo/category"

jest.mock("../lib/firebase", () => ({
  db: {},
}))

jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  deleteDoc: jest.fn(),
}))

jest.mock("@/lib/silo/silo", () => ({
  getByUid: jest.fn(),
  documentName: "silos",
}))

jest.mock("@/lib/silo/category", () => ({
  getByUid: jest.fn(),
}))

describe("Transaction", () => {
  const siloUid = "silo-123"
  const transactionUid = "txn-123"
  const mockDocRef = {}

  const transactionData: Transaction = {
    uid: transactionUid,
    type: "expense",
    amountInCents: 5000,
    createdAt: new Date(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(console, "error").mockImplementation(() => {}) // suppress error logs
  })

  it("getByUid: returns transaction when it exists", async () => {
    ;(getSiloByUid as jest.Mock).mockResolvedValue({ uid: siloUid })
    ;(doc as jest.Mock).mockReturnValue(mockDocRef)
    ;(getDoc as jest.Mock).mockResolvedValue({
      exists: () => true,
      id: transactionUid,
      data: () => ({
        type: "expense",
        amountInCents: 5000,
        createdAt: transactionData.createdAt,
      }),
    })

    const result = await getTransactionByUid(siloUid, transactionUid)
    expect(result).toEqual(transactionData)
  })

  it("create: creates and returns a new transaction", async () => {
    ;(doc as jest.Mock).mockReturnValue(mockDocRef)
    ;(setDoc as jest.Mock).mockResolvedValue(undefined)

    const result = await create(siloUid, "income", 1500)
    expect(result).toHaveProperty("uid")
    expect(result?.type).toBe("income")
    expect(result?.amountInCents).toBe(1500)
  })

  it("update: updates and returns the transaction", async () => {
    ;(doc as jest.Mock).mockReturnValue(mockDocRef)
    ;(setDoc as jest.Mock).mockResolvedValue(undefined)

    const result = await update(siloUid, transactionUid, transactionData)
    expect(setDoc).toHaveBeenCalledWith(mockDocRef, expect.any(Object))
    expect(result).toEqual(transactionData)
  })

  it("deleteByUid: deletes the specified transaction", async () => {
    ;(doc as jest.Mock).mockReturnValue(mockDocRef)
    ;(deleteDoc as jest.Mock).mockResolvedValue(undefined)

    await expect(deleteByUid(siloUid, transactionUid)).resolves.toBeUndefined()
    expect(deleteDoc).toHaveBeenCalledWith(mockDocRef)
  })

  it("assignCategory: assigns category and returns updated transaction", async () => {
    const categoryUid = "cat-123"
    const mockCategory = {
      uid: categoryUid,
      name: "OV",
      budgetedAmountInCents: 10000,
    }

    ;(getSiloByUid as jest.Mock).mockResolvedValue({ uid: siloUid })
    ;(getCategoryByUid as jest.Mock).mockResolvedValue(mockCategory)
    ;(doc as jest.Mock).mockReturnValue(mockDocRef)
    ;(getDoc as jest.Mock).mockResolvedValue({
      exists: () => true,
      id: transactionUid,
      data: () => ({
        type: "expense",
        amountInCents: 5000,
        createdAt: transactionData.createdAt,
      }),
    })
    ;(setDoc as jest.Mock).mockResolvedValue(undefined)

    const result = await assignCategory(siloUid, transactionUid, categoryUid)

    expect(getCategoryByUid).toHaveBeenCalledWith(siloUid, categoryUid)
    expect(setDoc).toHaveBeenCalledWith(
      mockDocRef,
      expect.objectContaining({
        uid: transactionUid,
        categoryUid,
      }),
    )
    expect(result).toMatchObject({
      ...transactionData,
      categoryUid,
    })
  })
})
