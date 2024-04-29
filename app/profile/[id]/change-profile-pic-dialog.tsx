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
import { getProfileByUserId, updateProfilePicture } from '@/data/profile'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Label } from '../../../components/ui/label'
import { useState, useTransition } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { createClient } from '@/utils/supabase/client'
import { Loader2 } from 'lucide-react'
import { Profile } from '@/db/schema'
import { toast } from 'sonner'

interface ChangeProfilePicDialogProps {
  id: string
  profilePicture: string | null
  profilePictureFileName: string | null
}

const ChangeProfilePicDialog = ({
  id,
  profilePicture,
  profilePictureFileName,
}: ChangeProfilePicDialogProps) => {
  const [open, setOpen] = useState(false)
  const supabase = createClient()
  const [avatarUrl, setAvatarUrl] = useState<string>('')
  const [isPending, startTransition] = useTransition()

  const queryClient = useQueryClient()

  const { mutateAsync: updateProfilePictureFn } = useMutation({
    mutationFn: updateProfilePicture,
    onSuccess: () => {
      queryClient.setQueryData(['profile', id], (data: Profile) => {
        return {
          ...data,
          picture: avatarUrl,
        }
      })

      toast.success('Perfil alterado com sucesso')

      setOpen(false)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const uploadAvatar: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    startTransition(async () => {
      try {
        if (!event.target.files || event.target.files.length === 0) {
          throw new Error('Você deve selecionar uma imagem para prosseguir')
        }

        const file = event.target.files[0]
        const fileExt = file.name.split('.').pop()
        const filePath = `${id}-${Math.random()}.${fileExt}`

        // if there  is a profile picture, delete it before creating a new one (update did not work as it should)
        if (profilePicture && profilePictureFileName) {
          const { error: deleteError } = await supabase.storage
            .from('avatars')
            .remove([profilePictureFileName])

          if (deleteError) {
            throw new Error('Não foi possível editar a foto de perfil.')
          }
        }
        const { data, error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, file)

        if (uploadError) {
          throw new Error('Não foi possível editar a foto de perfil.')
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from('avatars').getPublicUrl(data.path)

        setAvatarUrl(publicUrl)
        await updateProfilePictureFn({
          userId: id,
          picture: publicUrl,
          pictureFileName: data.path,
        })
      } catch (error) {
        if (error instanceof Error) {
          toast.error(
            error.message ?? 'Não foi possível editar a foto de perfil.',
          )
        }
      }
    })
  }
  const { data: profile } = useQuery({
    queryKey: ['profile', id],
    queryFn: () => getProfileByUserId({ userId: id }),
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <p className="flex h-full w-full items-center justify-center text-center">
          Trocar Imagem
        </p>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Trocar imagem de perfil</DialogTitle>
        </DialogHeader>
        <Avatar className="group size-24">
          <AvatarImage src={profile?.picture ?? undefined} />
          <AvatarFallback>
            {profile?.username?.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <form className="my-4 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="profilePic">Imagem de perfil</Label>
            <Input
              id="profilePic"
              accept="image/*"
              type="file"
              onChange={uploadAvatar}
            />
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

export default ChangeProfilePicDialog
