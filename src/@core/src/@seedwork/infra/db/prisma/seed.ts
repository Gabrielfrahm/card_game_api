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
        "https://firebasestorage.googleapis.com/v0/b/card-game-18c32.appspot.com/o/malenia-min.png?alt=media&token=9680b9a2-64ff-410d-9029-2412adf122e2",

      description:
        "when this is invoked it deals damage to the first row, Malenia, Blade of Miquella and Malenia, Goddess of Rot is two-phase a Demigod Boss in Elden Ring. She's the twin of Miquella, the most powerful of the Empyreans, and gained renown for her legendary battle against Starscourge Radahn during the Shattering, in which she unleashed the power of the Scarlet Rot and reduced Caelid to ruins.",
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
        "https://firebasestorage.googleapis.com/v0/b/card-game-18c32.appspot.com/o/rennala-min.png?alt=media&token=20547ecc-2e8c-47ce-9f3b-b56d73da2dc8",
      description:
        "when this is invoked it deals damage to the second row, Rennala, Queen of the Full Moon is a Legend Boss in Elden Ring. Though not a demigod, Rennala is one of the shardbearers who resides in the Academy of Raya Lucaria. Rennala is a powerful sorceress, head of the Carian Royal family, and erstwhile leader of the Academy. Rennala is an optional boss, and doesn't need to be defeated in order to advance in Elden Ring. However, she is a shardbearer, and two of the four available shardbearers must be defeated before entering Leyndell, Royal Capital. In addition, she must be defeated to achieve a certain ending.",
      atk: "10",
      def: "0",
      effect: "freeze",
      main_card: true,
    },
    {
      id: "e8f90a4f-049a-46cd-8f8d-363708fa77fd",
      name: "GOLEM",
      number: 3,
      category: "range",
      image_url:
        "https://firebasestorage.googleapis.com/v0/b/card-game-18c32.appspot.com/o/golem-min.png?alt=media&token=248aaa8a-85c2-4ab2-8bae-b38b164efab4",
      description:
        "when this is invoked it deals damage to the third row. Golems are a type of Giant Humanoid Enemy in Elden Ring. They are massive humanoid constructs created to protect and guard against intruders, wielding their massive weapons. Though large, their weakness is their low mobility and their ankles, which will topple them with ease.",
      atk: "10",
      def: "0",
      effect: "blood",
      main_card: true,
    },
    {
      id: "e4df9fd0-104b-4576-b845-42deafb925ea",
      name: "GODRICK KNIGHT",
      number: 4,
      category: "sword",
      image_url:
        "https://firebasestorage.googleapis.com/v0/b/card-game-18c32.appspot.com/o/GODRICK%20KNIGHT-min.png?alt=media&token=080dd552-4661-488b-a9fe-79946bd098cd",
      description:
        "Godrick Knights are Humanoid enemies in Elden Ring. Godrick Knights wield large, heavy melee Weapons and protect themselves with Greatshields and full Body Armor.",
      atk: "3",
      def: "0",
      effect: " ",
      main_card: false,
    },
    {
      id: "4c1f3d73-e5b8-4a88-8dde-e437480485f5",
      name: "Crucible Knight Ordovis",
      number: 5,
      category: "sword",
      image_url:
        "https://firebasestorage.googleapis.com/v0/b/card-game-18c32.appspot.com/o/CRUCIBLE%20KNIGHT%20ORDOVIS-min.png?alt=media&token=5d4151ca-c66d-4040-9a60-152d071ee63e",
      description:
        "Crucible Knight Ordovis is a Field Boss in Elden Ring. Crucible Knight Ordovis is a quite heavy and large knight that wields a greatsword and a shield, while also having the ability to materialize wings and fly. Crucible Knight Ordovis is found in Auriza Hero's Grave. This is an optional Boss as players do not need to defeat it in order to advance to the Legacy Dungeon.",
      atk: "5",
      def: "0",
      effect: " ",
      main_card: false,
    },
    {
      id: "3ff74034-7819-4ec8-955f-4ef7dc7f3f31",
      name: "LEYNDELL KNIGHT",
      number: 6,
      category: "sword",
      image_url:
        "https://firebasestorage.googleapis.com/v0/b/card-game-18c32.appspot.com/o/LEYNDELL%20KNIGHT-min.png?alt=media&token=737000cd-cae3-4f4a-823c-0309d76df225",
      description:
        "Leyndell Knights are a Humanoid Enemy in Elden Ring. Leyndell Knights are knights of Leyndell, the Royal Capital. They wield a heavy sword in their right arm and has a large shield on their left. They are entirely covered by golden armor and are highly dangerous due to their fine combat skills. The spirit of a particular Leyndell Knight, Kristoff, can be summoned for aid in battle by using the Ancient Dragon Knight Kristoff Ashes.",
      atk: "4",
      def: "0",
      effect: " ",
      main_card: false,
    },
    {
      id: "710b5838-a960-4ba0-aacd-29348b12fcc6",
      name: "LESSER BLOODHOUND KNIGHT",
      number: 7,
      category: "sword",
      image_url:
        "https://firebasestorage.googleapis.com/v0/b/card-game-18c32.appspot.com/o/LESSER%20BLOODHOUND%20KNIGHT-min.png?alt=media&token=99a4c358-e05c-44f8-90d8-2b8295f9f54d",
      description:
        "Lesser Bloodhound Knight is a Humanoid Enemy in Elden Ring. Lesser Bloodhound Knights are Non-Boss variants of Bloodhound Knight and Bloodhound Knight Darriwil. Bloodhound Knights are large, lightly-armored humanoids, notorious for their fierce agility and an aggressive attack behavior. These Knights move by walking with their feet and hands on the ground, and wield large curved greatswords with great dexterity.",
      atk: "6",
      def: "0",
      effect: " ",
      main_card: false,
    },
    {
      id: "60bae6f3-d5a8-42bb-9e04-d64316f8d35c",
      name: "CUCKOO KNIGHT",
      number: 8,
      category: "sword",
      image_url:
        "https://firebasestorage.googleapis.com/v0/b/card-game-18c32.appspot.com/o/CUCKOO%20KNIGHT-min.png?alt=media&token=1c6e2626-51e1-45cc-bfbe-f22f45b96df1",
      description:
        "Cuckoo Knight is a Humanoid Enemy in Elden Ring. They serve the Raya Lucaria Academy and utilize sorcery alongside their combat prowess.",
      atk: "5",
      def: "0",
      effect: " ",
      main_card: false,
    },
    {
      id: "11c2a228-2aeb-4617-834e-813db4339a12",
      name: "ALBINAURIC ARCHER",
      number: 9,
      category: "range",
      image_url:
        "https://firebasestorage.googleapis.com/v0/b/card-game-18c32.appspot.com/o/ALBINAURIC%20ARCHER-min.png?alt=media&token=37108a3f-11c3-49af-84c6-1e3c50aa38c4",
      description:
        "The Albinauric Archer is a Humanoid in Elden Ring. Albinauric Archers are found at the rooftops of the buildings in Ordina Liturgical Town after going through the Evergaol there. They can burst fire 3 arrows at a time from a very long distance and do so very frequently. Some ride a Direwolf.",
      atk: "5",
      def: "0",
      effect: " ",
      main_card: false,
    },
    {
      id: "d489a18f-0e01-4420-b530-492e5be1f4ef",
      name: "ANCESTRAL FOLLOWER",
      number: 10,
      category: "range",
      image_url:
        "https://firebasestorage.googleapis.com/v0/b/card-game-18c32.appspot.com/o/ANCESTRAL%20FOLLOWER-min.png?alt=media&token=70666faf-9bc7-4721-912d-4dc547a53773",
      description:
        "Ancestral Follower is an Enemy in Elden Ring. Ancestral Followers are brawny tribesmen versed in distinctive spiritual arts. These spectral bull-headed warriors seemingly come out of thin air or can be found chanting at braziers around Siofra River. These warriors attack with a variety of weapons - some wield a large axe, some a scythe, and others can swap between a hand axe and a longbow. A corporeal variation of this enemy can be found in Nokron, Eternal City.",
      atk: "4",
      def: "0",
      effect: " ",
      main_card: false,
    },
    {
      id: "23a377ab-8209-4b95-8ab8-6728cf3fae12",
      name: "FALLEN HAWKS SOLDIER",
      number: 11,
      category: "range",
      image_url:
        "https://firebasestorage.googleapis.com/v0/b/card-game-18c32.appspot.com/o/FALLEN%20HAWKS%20SOLDIER-min.png?alt=media&token=de4ee9e6-43f5-432b-be4a-0cbfbc0cee8a",
      description:
        "Fallen Hawks Soldiers are gaunt humanoids with bloodied hands and feet. They wield a variety of weapons that include Bows equipped with Spiritflame Arrows, Greatshields, Swords and Torches.",
      atk: "3",
      def: "0",
      effect: " ",
      main_card: false,
    },
    {
      id: "13b158cc-7438-4425-bf61-8cb9ea4a62e8",
      name: "EXILE SOLDIER",
      number: 12,
      category: "range",
      image_url:
        "https://firebasestorage.googleapis.com/v0/b/card-game-18c32.appspot.com/o/EXILE%20SOLDIER-min.png?alt=media&token=5bb49e7b-030a-4c6b-89b4-f9253f9e45fc",
      description:
        "Exile Soldier is a Humanoid Enemy in Elden Ring. Exile Soldiers defend the inside areas of their castles and forts by equipping a broad array of armament.",
      atk: "2",
      def: "0",
      effect: " ",
      main_card: false,
    },
    {
      id: "c25f614f-b219-47d9-8385-de78d0ee152e",
      name: "REDMANE KNIGHT",
      number: 13,
      category: "range",
      image_url:
        "https://firebasestorage.googleapis.com/v0/b/card-game-18c32.appspot.com/o/Redmane%20Knight-min.png?alt=media&token=43bfa95a-18a4-4b33-a52d-1d50c62d9f09",
      description:
        "The Redmane Knight is a Humanoid Enemy in Elden Ring who serves under the regime of General Radahn. Redmane Knights are encountered within the region of Caelid, equipped with their signature Redmane Knight Set.",
      atk: "6",
      def: "0",
      effect: " ",
      main_card: false,
    },
    {
      id: "24bfb821-4ddc-43c1-af4f-307a655c522a",
      name: "GLINTSTONE SORCERER",
      number: 14,
      category: "mage",
      image_url:
        "https://firebasestorage.googleapis.com/v0/b/card-game-18c32.appspot.com/o/GLINTSTONE%20SORCERER.png?alt=media&token=4deaf210-6c38-4c92-ad03-bf7f1c05550b",
      description:
        "Glintstone Sorcerer is a Humanoid Enemy in Elden Ring. Glintstone Sorcerers are scholars of the Olivinus and Karolos Conspectus at the Raya Lucaria Academy, who have mastered the use of sorcery. These Raya Lucaria sorcerers wear a stone crown that obscures their identities, together with a distinctive Raya Lucarian Robe.",
      atk: "2",
      def: "0",
      effect: " ",
      main_card: false,
    },
    {
      id: "170b5e22-e416-4418-b1f8-4e96b79555e9",
      name: "RANNI THE WITCH",
      number: 15,
      category: "mage",
      image_url:
        "https://firebasestorage.googleapis.com/v0/b/card-game-18c32.appspot.com/o/RANNI%20THE%20WITCH.png?alt=media&token=b0dad50b-520c-42a3-8141-0c5430990eac",
      description:
        "Ranni the Witch is an NPC in Elden Ring. Ranni the Witch is a mysterious figure who first introduces herself as Renna. Upon meeting her again at Three Sisters, she reveals her true name and eventually will recruit you into her servitude, sending you off in search of a hidden treasure. This page covers vital information for Ranni's questline for Elden Ring.",
      atk: "6",
      def: "0",
      effect: " ",
      main_card: false,
    },
    {
      id: "c1021269-00bb-4312-b373-305f6f332016",
      name: "PRECEPTOR SELUVIS",
      number: 16,
      category: "mage",
      image_url:
        "https://firebasestorage.googleapis.com/v0/b/card-game-18c32.appspot.com/o/PRECEPTOR%20SELUVIS.png?alt=media&token=b267fd31-06d4-40c8-ae6b-5da93e2c156a",
      description:
        "Preceptor Seluvis is an NPC in Elden Ring. Seluvis is a pompous sorcerer in service to Ranni the Witch. Seluvis Questline is important for players looking to make Magic Builds, so make sure to read all the Seluvis Questline steps below including a potential lockout due to your choices. Seluvis is first encountered in spectral form at Ranni's Rise in the Three Sisters sub-region of Liurnia of the Lakes.",
      atk: "4",
      def: "0",
      effect: " ",
      main_card: false,
    },
    {
      id: "af5de615-0863-45a0-81e3-6e5731abbd6d",
      name: "LORETTA, KNIGHT OF THE HALIGTREE",
      number: 17,
      category: "mage",
      image_url:
        "https://firebasestorage.googleapis.com/v0/b/card-game-18c32.appspot.com/o/LORETTA%2C%20KNIGHT%20OF%20THE%20HALIGTREE.png?alt=media&token=7abc56c5-b6f3-417d-a9ee-fa0e6417921f",
      description:
        "Loretta, Knight of the Haligtree is a Greater Foe Boss in Elden Ring. This proud knight was previously in service to the Carian royal family. This is an optional boss as players don't need to defeat her to advance in Elden Ring, though they do need to defeat her to reach Elphael, Brace of the Haligtree and face Malenia, Blade of Miquella.",
      atk: "5",
      def: "0",
      effect: " ",
      main_card: false,
    },
    {
      id: "8b290af7-f222-4db5-ab97-12accd22b763",
      name: "SORCERESS SELLEN",
      number: 18,
      category: "mage",
      image_url:
        "https://firebasestorage.googleapis.com/v0/b/card-game-18c32.appspot.com/o/SORCERESS%20SELLEN-min.png?alt=media&token=91f250ee-e3e0-4207-a0d1-411f87af3f1b",
      description:
        "Sorceress Sellen is a Merchant and NPC in Elden Ring. She can be found inside the Waypoint Ruins, far east from where you first arrive in Limgrave. She can teach you Sorceries. She can also be made available as an NPC Summon for specific battles.",
      atk: "4",
      def: "0",
      effect: " ",
      main_card: false,
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
