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
import { getProfileByUserId, updateProfile } from '@/app/actions/profile'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Label } from '../../../components/ui/label'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { type Profile } from '@/db/custom-types'
import { toast } from 'sonner'
import { Loader2, SquarePen } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'

const usernameSchema = z.object({
  username: z
    .string()
    .max(30, 'O nome do usuário não pode passar de 30 caracteres.')
    .min(3, 'O nome do usuário deve ter ao menos 3 caracteres.'),
  githubUrl: z
    .string()
    .url({ message: 'URL inválida.' })
    .includes('github.com', {
      message: 'Este link para o github está inválido.',
    })
    .nullable()
    .or(z.literal('')),
  bio: z
    .string()
    .max(256, { message: 'O texto não pode passar de 256 caracteres.' })
    .nullable()
    .or(z.literal('')),
})

type UsernameSchema = z.infer<typeof usernameSchema>

const EditProfileDialog = ({ id }: { id: string }) => {
  const [open, setOpen] = useState(false)

  const { data: profile } = useQuery({
    queryKey: ['profile', id],
    queryFn: () => getProfileByUserId({ profileId: id }),
  })

  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<UsernameSchema>({
    resolver: zodResolver(usernameSchema),
  })

  const username = watch('username')
  const bio = watch('bio')
  const githubUrl = watch('githubUrl')

  const { mutateAsync: updateProfileFn, isPending } = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.setQueryData(['profile', id], (data: Profile) => {
        return {
          ...data,
          username,
          bio,
          github_url: githubUrl,
        }
      })

      toast.success('Perfil alterado com sucesso')

      setOpen(false)
    },
  })

  const handleUpdateUsername = async ({
    username,
    githubUrl,
    bio,
  }: UsernameSchema) => {
    if (!errors.root) {
      try {
        await updateProfileFn({
          username,
          githubUrl,
          bio,
        })
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message)
        }
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size={'icon'} variant={'outline'} className="p-2">
          <SquarePen className="size-5" />
          <span className="sr-only">Editar pefil</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar perfil</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(handleUpdateUsername)}
          className="my-4 space-y-5"
        >
          <div className="space-y-2">
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
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Sobre mim</Label>
            <Textarea
              id="bio"
              defaultValue={profile?.bio ?? ''}
              {...register('bio')}
              className={cn('resize-none', {
                'ring-2 ring-red-500 focus-visible:ring-red-500': errors.bio,
              })}
            />
            {errors.bio && (
              <p className="my-2 text-red-500">{errors.bio?.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="github-url">Link para o github</Label>
            <Input
              id="github-url"
              defaultValue={profile?.github_url ?? ''}
              {...register('githubUrl')}
              className={cn({
                'ring-2 ring-red-500 focus-visible:ring-red-500':
                  errors.githubUrl,
              })}
            />
            {errors.githubUrl && (
              <p className="my-2 text-red-500">{errors.githubUrl?.message}</p>
            )}
          </div>
          <div className="flex w-full justify-end gap-4">
            <Button
              type="button"
              variant={'ghost'}
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Confirmar'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EditProfileDialog
