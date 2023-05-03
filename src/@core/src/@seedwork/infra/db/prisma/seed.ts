import { BcryptAdapter } from "../../../infra/cryptography";
import { User } from "#user/domain";
import { prismaClient } from "../testing";
import { UniqueEntityId } from "#seedwork/domain";
import { Card } from "#card/domain";

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

  const card = new Card(
    {
      name: "Salame man",
      number: 1,
      category: "blue",
      image_url:
        "https://images.tcdn.com.br/img/img_prod/1123713/salame_tipo_sopressa_defumado_400g_17_1_76c896b1ff6bcea1f87a56b960ed6c6b.jpg",
      description: "description very details",
      atk: "20",
      def: "10",
      effect: "snow",
      main_card: false,
    },
    new UniqueEntityId("c1813f74-6815-4639-b8c2-957f8c7ddceb")
  );

  await prismaClient.card.create({
    data: {
      id: card.id,
      name: card.name,
      number: card.number,
      description: card.description,
      category: card.category,
      atk: card.atk,
      def: card.def,
      effect: card.effect,
      image_url: card.image_url,
      main_card: card.main_card,
      created_at: card.created_at,
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
