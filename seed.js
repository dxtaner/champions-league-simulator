const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

require("dotenv").config();
const mongoose = require("mongoose");
const Team = require("./models/Team");

const teams = [
  { name: "Real Madrid", country: "Spain", rating: 95 },
  { name: "Manchester City", country: "England", rating: 94 },
  { name: "Bayern Munich", country: "Germany", rating: 93 },
  { name: "Liverpool", country: "England", rating: 92 },
  { name: "Barcelona", country: "Spain", rating: 92 },
  { name: "Paris Saint-Germain", country: "France", rating: 91 },
  { name: "Arsenal", country: "England", rating: 90 },
  { name: "Inter Milan", country: "Italy", rating: 89 },
  { name: "Atletico Madrid", country: "Spain", rating: 88 },
  { name: "Borussia Dortmund", country: "Germany", rating: 87 },
  { name: "Juventus", country: "Italy", rating: 87 },
  { name: "AC Milan", country: "Italy", rating: 86 },
  { name: "Chelsea", country: "England", rating: 85 },
  { name: "Bayer Leverkusen", country: "Germany", rating: 85 },
  { name: "Napoli", country: "Italy", rating: 84 },
  { name: "Benfica", country: "Portugal", rating: 83 },
  { name: "Sporting CP", country: "Portugal", rating: 82 },
  { name: "Porto", country: "Portugal", rating: 82 },
  { name: "Ajax", country: "Netherlands", rating: 81 },
  { name: "Slavia Prague", country: "Czech Republic", rating: 76 },
  { name: "RB Leipzig", country: "Germany", rating: 81 },
  { name: "Tottenham", country: "England", rating: 80 },
  { name: "Manchester United", country: "England", rating: 80 },
  { name: "Atalanta", country: "Italy", rating: 80 },
  { name: "Monaco", country: "France", rating: 79 },
  { name: "Marseille", country: "France", rating: 78 },
  { name: "Galatasaray", country: "Turkey", rating: 78 },
  { name: "Fenerbahce", country: "Turkey", rating: 77 },
  { name: "Celtic", country: "Scotland", rating: 76 },
  { name: "PSV", country: "Netherlands", rating: 76 },
  { name: "Feyenoord", country: "Netherlands", rating: 75 },
  { name: "Club Brugge", country: "Belgium", rating: 75 },
  { name: "Shakhtar Donetsk", country: "Ukraine", rating: 74 },
  { name: "Dinamo Zagreb", country: "Croatia", rating: 73 },
  { name: "Red Bull Salzburg", country: "Austria", rating: 73 },
  { name: "Young Boys", country: "Switzerland", rating: 71 },
];

const seedTeams = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI .env dosyasında bulunamadı!");
    }

    console.log("MongoDB'ye bağlanılıyor...");
    await mongoose.connect(process.env.MONGO_URI, {
      family: 4,
      serverSelectionTimeoutMS: 10000,
    });
    console.log("MongoDB Bağlantısı Başarılı.");

    await Team.deleteMany();
    await Team.insertMany(teams);

    console.log(`${teams.length} teams inserted successfully.`);
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Seed Hatası:", error.message);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
};

seedTeams();
