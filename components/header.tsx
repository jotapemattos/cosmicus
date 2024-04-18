import AuthButton from './auth-button'

export default function Header() {
  return (
    <header className="absolute top-0 flex w-full items-center justify-center border-b bg-background py-4">
      <AuthButton />
    </header>
  )
}
