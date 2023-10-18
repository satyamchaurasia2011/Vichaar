"use client"
import Image from "next/image";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

interface Props {
  id: string;
  name: string;
  username: string;
  imgUrl: string;
  personType: string;
}

const SuggestedCard = ({ id, name, username, imgUrl, personType }: Props) => {
    const router = useRouter();
  return (
    <article className="user-card my-4">
      <div className="user-card_avatar">
        <Image
          src={imgUrl}
          alt="logo"
          width={42}
          height={42}
          className="rounded-full"
        />

        <div className="flex-1 text-ellipsis" onClick={() =>router.push(`/profile/${id}`)}>
            <h4 className="text-base-semibold text-light-1">{name}</h4>
            <p className="text-small-medium text-gray-1">@{username}</p>
        </div>
      </div>
    </article>
  );
};

export default SuggestedCard;
