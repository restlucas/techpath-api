import prisma from "../lib/prisma";
import { createUserMissions } from "../utils/createUserMissions";

type SignInProps = {
  name: string;
  email: string;
  image: string;
  username: string;
  provider: string;
  providerAccountId: string;
};

const authService = {
  async signIn(data: SignInProps) {
    const { name, email, image, username, provider, providerAccountId } = data;

    let user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name,
          email,
          image,
          username,
        },
      });

      const trails = await prisma.trail.findMany();

      for (const index in trails) {
        const firstModule = await prisma.module.findFirst({
          where: {
            trailId: trails[index].id,
          },
          select: {
            id: true,
          },
        });

        if (firstModule) {
          await prisma.userModuleProgress.create({
            data: {
              userId: user.id,
              unlocked: true,
              moduleId: firstModule.id,
            },
          });
        }
      }

      await createUserMissions(user.id);
    }

    const followingIds = await prisma.userFollowing.findMany({
      where: {
        followerId: user.id,
      },
      select: {
        followedId: true,
      },
    });

    await prisma.account.upsert({
      where: { providerAccountId },
      update: {},
      create: {
        userId: user.id,
        provider,
        providerAccountId,
      },
    });

    return {
      user: {
        ...user,
        following: [...followingIds.map((following) => following.followedId)],
      },
    };
  },
};

export default authService;
