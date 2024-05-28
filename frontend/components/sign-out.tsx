import { signOut } from "@/auth"
 
export function SignOut() {
  return (
    <form
      action={async () => {
        "use server"
        await signOut("github")
      }}
    >
      <button type="submit">SignOut with GitHub</button>
    </form>
  )
}
