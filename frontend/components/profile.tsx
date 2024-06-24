import Image from "next/image";
import Link from "next/link";

export default async function Profile({
  user,
}: {
  user: {
    name?: string | null;
    image?: string | null;
  };
}) {
  return (
    <div className="flex justify-between">
      <div>
        <h2 className="text-3xl font-semibold">{user.name}</h2>
      </div>
      <Link href={user.image || "https://www.gravatar.com/avatar/?d=mp"}>
        <div className="rounded-full h-20 w-20 overflow-hidden relative">
          <Image
            src={user.image || "https://www.gravatar.com/avatar/?d=mp"}
            alt="profile image"
            width={100}
            height={100}
          />
        </div>
      </Link>
    </div>
  );
}
