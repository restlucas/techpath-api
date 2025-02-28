import prisma from "../lib/prisma";

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
    }

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
      user,
    };
  },
};

export default authService;
