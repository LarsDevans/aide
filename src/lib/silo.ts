import { Silo } from "@/types/silo";

export async function getByUid(Uid: string): Promise<Silo> {
  return { uid: "", name: "", description: "", ownerUid: "" };
}

export async function getAll(): Promise<Silo[]> {
  return [{ uid: "", name: "", description: "", ownerUid: "" }];
}

export async function create(silo: Silo): Promise<Silo> {
  return { uid: "", name: "", description: "", ownerUid: "" };
}

export async function update(silo: Silo): Promise<Silo> {
  return { uid: "", name: "", description: "", ownerUid: "" };
}
