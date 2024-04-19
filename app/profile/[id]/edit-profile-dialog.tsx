'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import {
  getProfileByUserId,
  updateProfileUsernameByUserId,
} from '@/data/profile'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Label } from '../../../components/ui/label'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { type Profile } from '@/db/schema'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const usernameSchema = z.object({
  username: z
    .string()
    .max(30, 'O nome do usuário não pode passar de 30 caracteres.'),
})

type UsernameSchema = z.infer<typeof usernameSchema>

const EditProfileDialog = ({ id }: { id: string }) => {
  const [open, setOpen] = useState(false)

  const { data: profile } = useQuery({
    queryKey: ['profile', id],
    queryFn: () => getProfileByUserId({ userId: id }),
  })

  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<UsernameSchema>({
    resolver: zodResolver(usernameSchema),
  })

  const username = watch('username')

  const { mutateAsync: updateProfileUsernameByUserIdFn, isPending } =
    useMutation({
      mutationFn: updateProfileUsernameByUserId,
      onSuccess: () => {
        queryClient.setQueryData(['profile', id], (data: Profile) => {
          return { ...data, username }
        })

        toast.success('Nome alterado com sucesso')

        setOpen(false)
      },
    })

  const handleUpdateUsername = async ({ username }: UsernameSchema) => {
    if (!errors.username) {
      try {
        await updateProfileUsernameByUserIdFn({ username, userId: id })
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message)
        }

        reset({ username: profile?.username ?? '' })
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Editar Pefil</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar perfil</DialogTitle>
          <form
            onSubmit={handleSubmit(handleUpdateUsername)}
            className="my-4 space-y-3"
          >
            <Label htmlFor="username">Nome do usuário</Label>
            <Input
              id="username"
              defaultValue={profile?.username ?? ''}
              {...register('username')}
              className={cn({
                'ring-2 ring-red-500 focus-visible:ring-red-500':
                  errors.username,
              })}
            />
            {errors.username && (
              <p className="my-2 text-red-500">{errors.username?.message}</p>
            )}
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Confirmar'
              )}
            </Button>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default EditProfileDialog
