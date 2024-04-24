import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { deleteProfile } from '@/data/profile'
import { useMutation } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface DeleteProfileDialogProps {
  profileId: string
}

const DeleteProfileDialog = ({ profileId }: DeleteProfileDialogProps) => {
  const { push, refresh } = useRouter()

  const { mutateAsync: deleteProfileFn, isPending } = useMutation({
    mutationFn: deleteProfile,
    onSuccess: () => {
      toast.success('Conta removida com sucesso.')

      push('/sign-in')

      refresh()
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const handleDelete = async () => {
    await deleteProfileFn({ profileId })
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={'destructive'}>Excluir Conta</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
          <AlertDialogDescription>
            Essa ação não pode ser desfeita. Isso excluirá permanentemente sua
            conta e removerá seus dados de nossos servidores.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              className="bg-red-500/10 text-red-500 hover:bg-red-500/20"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Excluindo...</span>
                </>
              ) : (
                <span>Excluir</span>
              )}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteProfileDialog
