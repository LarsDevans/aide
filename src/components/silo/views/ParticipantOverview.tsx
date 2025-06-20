import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { User } from 'firebase/auth';
import { useEffect, useState } from 'react';

export default function ParticipantOverview() {
  const [participants, setParticipants] = useState<User[] | null>(null)

  useEffect(() => {

  }, [])

  return (
    <div className="w-96 space-y-2 text-center">
      <h1 className="text-center text-xl font-bold">Deelnemers</h1>

      {participants && participants.length > 0
        ? participants.map(p => (
          <p>{p.email}</p>
        ))
      : <i>Er zijn geen deelnemers</i>}

      <hr />

      <form className='flex gap-x-2'>
        <Input
          name="email"
          placeholder="Email"
          type="email"
          value="linde@aide.nl"
          onChange={() => {}}
        />
        <Button
          label="Toevoegen"
        />
      </form>
    </div>
  )
}
