import AuthButton from "./auth-button";

export default function Header() {
  return (
    <header className="w-full py-4 absolute top-0 flex items-center justify-center">
      <AuthButton />
    </header>
  );
}
