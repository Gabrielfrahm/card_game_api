import { BcryptAdapter } from "../../../infra/cryptography";
import { User } from "#user/domain";
import { prismaClient } from "../testing";
import { UniqueEntityId } from "#seedwork/domain";

async function main() {
  const user = new User(
    new BcryptAdapter.HasherAdapter(12),
    {
      email: "admin@admin.com",
      name: "Admin",
      password: "dev@123",
      email_confirmation: true,
    },
    new UniqueEntityId("8c85dc97-ee89-4a87-b776-daef12976e0a")
  );
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

  const cardPrans = [
    {
      id: "c1813f74-6815-4639-b8c2-957f8c7ddceb",
      name: "MALENIA BLADE OF MIQUELLA",
      number: 1,
      category: "sword",
      image_url:
        "https://firebasestorage.googleapis.com/v0/b/card-game-18c32.appspot.com/o/malenia.png?alt=media&token=fd093cd7-b962-4ad9-9a46-f8d32d814152",

      description: "when this is invoked it deals damage to the first row",
      atk: "10",
      def: "0",
      effect: "poison",
      main_card: true,
    },
    {
      id: "6c292cf2-7dc6-496b-955c-79a75450e124",
      name: "RENNALA QUEEN OF THE FULL MOON",
      number: 2,
      category: "mage",
      image_url:
        "https://firebasestorage.googleapis.com/v0/b/card-game-18c32.appspot.com/o/rennala.png?alt=media&token=9a238555-d092-47d5-8832-21d5442a827a",
      description: "when this is invoked it deals damage to the second row",
      atk: "10",
      def: "0",
      effect: "freeze",
      main_card: true,
    },
  ];

  cardPrans.forEach(async (item) => {
    await prismaClient.card.create({
      data: {
        id: item.id,
        name: item.name,
        number: item.number,
        description: item.description,
        category: item.category,
        atk: item.atk,
        def: item.def,
        effect: item.effect,
        image_url: item.image_url,
        main_card: item.main_card,
        created_at: new Date(),
      },
    });
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
