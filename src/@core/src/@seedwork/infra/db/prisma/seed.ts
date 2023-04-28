import { BcryptAdapter } from "../../../infra/cryptography";
import { User } from "#user/domain";
import { prismaClient } from "../testing";

async function main() {
  const user = new User(new BcryptAdapter.HasherAdapter(12), {
    email: "admin@admin.com",
    name: "Admin",
    password: "dev@123",
    email_confirmation: true,
  });
  await user.setPassword(user.password);
  await prismaClient.user.create({
    data: {
      id: user.id,
      email: user.email,
      name: user.name,
      password: user.password,
      email_confirmation: user.email_confirmation,
      created_at: user.created_at,
    },
  });
}

main()
  .then(async () => {
    await prismaClient.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prismaClient.$disconnect();
    process.exit(1);
  });
