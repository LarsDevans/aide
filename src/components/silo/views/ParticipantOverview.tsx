import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { addParticipant, listenForByOwnerUid, removeParticipant } from '@/lib/silo/silo';
import { Silo } from '@/types/silo';
import { X } from 'lucide-react';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';

export default function ParticipantOverview({ siloUid }: { siloUid: string }) {
  const [email, setEmail] = useState<string>("");
  const [participants, setParticipants] = useState<string[] | undefined>()
  const currentUser = useCurrentUser()

  useEffect(() => {
    const unsubscribe = listenForByOwnerUid(
      currentUser.uid,
      (silos: Silo[]) => {
        const activeSilo = silos.filter((silo) => silo.uid === siloUid)
        if (activeSilo.length > 0) {
          setParticipants(activeSilo[0].participants)
        }
      },
    )
    return () => unsubscribe()
  }, [currentUser.uid])

  const handleInputUpdate = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setEmail(value)
  }

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await addParticipant(siloUid, email);
  }

  const handleRemoveButton = async (email: string) => {
    await removeParticipant(siloUid, email);
  };

  return (
    <div className="w-96 space-y-2 text-center">
      <h1 className="text-center text-xl font-bold">Deelnemers</h1>

      {participants && participants.length > 0
        ? participants.map(p => (
          <div key={p} className='flex justify-between items-center'>
            <i>{p}</i>
            <Button
              label={<X />}
              onClick={() => handleRemoveButton(p)}
            />
          </div>
        ))
      : <i>Er zijn geen deelnemers</i>}

      <hr />

      <form
        className='flex gap-x-2'
        onSubmit={handleFormSubmit}
      >
        <Input
          name="email"
          placeholder="Email"
          type="email"
          value={email}
          onChange={handleInputUpdate}
        />
        <Button
          label="Toevoegen"
        />
      </form>
    </div>
  )
}
