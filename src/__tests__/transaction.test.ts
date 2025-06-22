import {
  getByUid,
  create,
  deleteByUid,
  update,
  assignCategory,
} from "@/lib/silo/transaction"
import { Transaction } from "@/types/transaction"
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore"
import * as transactionModule from "@/lib/silo/transaction"
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
    (getSiloByUid as jest.Mock).mockResolvedValue({ uid: siloUid })
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

    const result = await getByUid(siloUid, transactionUid)
    expect(result).toEqual(transactionData)
  })

  it("getByUid: returns null if silo does not exist", async () => {
    (getSiloByUid as jest.Mock).mockResolvedValue(null)

    const result = await getByUid(siloUid, transactionUid)
    expect(result).toBeNull()
  })

  it("getByUid: returns null if transaction does not exist", async () => {
    (getSiloByUid as jest.Mock).mockResolvedValue({ uid: siloUid })
    ;(doc as jest.Mock).mockReturnValue(mockDocRef)
    ;(getDoc as jest.Mock).mockResolvedValue({
      exists: () => false,
    })

    const result = await getByUid(siloUid, transactionUid)
    expect(result).toBeNull()
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

  it("assignCategory: assigns category if transaction and category exist", async () => {
    const mockCategory = { uid: "cat-001" }

    const getByUidSpy = jest.spyOn(transactionModule, "getByUid").mockResolvedValue(transactionData)
    ;(getCategoryByUid as jest.Mock).mockResolvedValueOnce(mockCategory)
    const updateSpy = jest.spyOn(transactionModule, "update").mockResolvedValue(undefined)

    await assignCategory(siloUid, transactionUid, mockCategory.uid)

    expect(updateSpy).toHaveBeenCalledWith(
      siloUid,
      transactionUid,
      expect.objectContaining({ categoryUid: mockCategory.uid }),
    )

    getByUidSpy.mockRestore()
    updateSpy.mockRestore()
  })

  it("assignCategory: does nothing if transaction is missing", async () => {
    const getByUidSpy = jest.spyOn(transactionModule, "getByUid").mockResolvedValue(null)
    const updateSpy = jest.spyOn(transactionModule, "update").mockResolvedValue(undefined)

    await assignCategory(siloUid, transactionUid, "cat-001")

    expect(updateSpy).not.toHaveBeenCalled()

    getByUidSpy.mockRestore()
    updateSpy.mockRestore()
  })

  it("assignCategory: does nothing if category is missing", async () => {
    const getByUidSpy = jest.spyOn(transactionModule, "getByUid").mockResolvedValue(transactionData)
    ;(getCategoryByUid as jest.Mock).mockResolvedValueOnce(null)
    const updateSpy = jest.spyOn(transactionModule, "update").mockResolvedValue(undefined)

    await assignCategory(siloUid, transactionUid, "missing-cat")

    expect(updateSpy).not.toHaveBeenCalled()

    getByUidSpy.mockRestore()
    updateSpy.mockRestore()
  })
})
