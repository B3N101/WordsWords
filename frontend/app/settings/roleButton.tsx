import { Button } from "@/components/ui/button";

export default function RoleButton({
  action,
  label,
}: {
  action: () => Promise<void>;
  label: string;
}) {
  return (
    <form action={action}>
      <Button
        variant="outline"
        className="w-full rounded-md bg-[#00B894] text-white hover:bg-[#00D1B2] focus:ring-[#00D1B2]"
        type="submit"
      >
        <span>{label}</span>
      </Button>
    </form>
  );
}
