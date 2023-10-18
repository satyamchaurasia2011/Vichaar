import { fetchCommunities } from "@/lib/actions/community.actions";
import React from "react";
import SuggestedCard from "../cards/SuggestedCard";
import { fetchUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import Link from "next/link";

async function RightSidebar() {
  const user = await currentUser();

  if (!user) return null;
  const allCommunities = await fetchCommunities({
    searchString: "",
    pageNumber: 1,
    pageSize: 20,
  });

  const allUsers = await fetchUsers({
    userId: user.id,
    searchString: "",
    pageNumber: 1,
    pageSize: 25,
  });

  return (
    <section className="custom-scrollbar rightsidebar">
      <div className="flex flex-1 flex-col justify-start">
        <h3 className="text-heading4-medium text-light-1">
          Suggested Communities
          {allCommunities.communities.map((community, index) => {
            if (index < 3)
              return (
                <Link href={`/communities/${community.id}`}>
                  <SuggestedCard
                    key={community.id}
                    id={community.id}
                    name={community.name}
                    username={community.username}
                    imgUrl={community.image}
                    personType="Community"
                  />
                </Link>
              );
          })}
        </h3>
      </div>
      <div className="flex flex-1 flex-col justify-start">
        <h3 className="text-heading4-medium text-light-1">
          Suggested Users
          {allUsers.users.map((person, index) => {
            if (index < 3)
              return (
                <Link href={`/profile/${person.id}`}>
                  <SuggestedCard
                    key={person.id}
                    id={person.id}
                    name={person.name}
                    username={person.username}
                    imgUrl={person.image}
                    personType="User"
                  />
                </Link>
              );
          })}
        </h3>
      </div>
    </section>
  );
}

export default RightSidebar;
