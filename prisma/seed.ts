import { PrismaClient, QuestionType } from "@prisma/client";
import { faker } from "@faker-js/faker";
import * as path from "path";
import * as fs from "fs";
import { startOfWeek } from "../src/utils/weekDate";

const prisma = new PrismaClient();

interface Answer {
  text: string;
  pairId?: number;
  order?: number;
}

interface Question {
  text: string;
  type: keyof typeof QuestionType;
  correctAnswer?: string;
  answers: Answer[];
}

interface Lesson {
  name: string;
  questions: Question[];
}

interface Topic {
  name: string;
  slug: string;
  description: string;
  lessons: Lesson[];
}

interface Module {
  name: string;
  description: string;
  topics: Topic[];
}

interface Trail {
  name: string;
  slug: string;
  description: string;
  tags: string;
  modules: Module[];
}

interface Mission {
  title: string;
  description: string;
  goalType: "COMPLETE_LESSONS" | "PERFECT_SCORE_LESSONS" | "WEEKLY_STREAK";
  goalValue: number;
  rewardXp: number;
  frequency: "DAILY" | "WEEKLY";
}

async function createTrails() {
  const trailsData: Trail[] = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, "trails.json"), "utf-8")
  );

  for (const trailData of trailsData) {
    const trail = await prisma.trail.create({
      data: {
        name: trailData.name,
        slug: trailData.slug,
        description: trailData.description,
        tags: trailData.tags,
        modules: {
          create: trailData.modules.map((moduleData) => ({
            name: moduleData.name,
            description: moduleData.description,
            topics: {
              create: moduleData.topics.map((topicData) => ({
                name: topicData.name,
                slug: topicData.slug,
                description: topicData.description,
                lessons: {
                  create: topicData.lessons.map((lessonData) => ({
                    name: lessonData.name,
                    questions: {
                      create: lessonData.questions.map((questionData) => ({
                        text: questionData.text,
                        type: QuestionType[questionData.type],
                        xp: 50,
                        correctAnswer: questionData.correctAnswer ?? null,
                        answers: {
                          create: questionData.answers.map((answerData) => ({
                            text: answerData.text ?? null,
                            order: answerData.order ?? null,
                            pairId: answerData.pairId ?? null,
                          })),
                        },
                      })),
                    },
                  })),
                },
              })),
            },
          })),
        },
      },
    });
    console.log(`Trilha "${trail.name}" criada com sucesso!`);
  }
}

async function createMissions() {
  const missionsData: Mission[] = [
    {
      title: "Sabe-Tudo",
      description: "Complete uma lição sem errar nenhuma questão.",
      goalType: "PERFECT_SCORE_LESSONS",
      goalValue: 1,
      frequency: "DAILY",
      rewardXp: 100,
    },
    {
      title: "A todo vapor",
      description: "Complete 3 lições",
      goalType: "COMPLETE_LESSONS",
      goalValue: 3,
      frequency: "DAILY",
      rewardXp: 150,
    },
    {
      title: "Mantenha uma sequência de 5 dias",
      description: "Estude pelo menos uma lição por 5 dias consecutivos.",
      goalType: "WEEKLY_STREAK",
      goalValue: 5,
      rewardXp: 200,
      frequency: "WEEKLY",
    },
  ];

  for (const missionData of missionsData) {
    await prisma.mission.create({
      data: {
        title: missionData.title,
        description: missionData.description,
        goalType: missionData.goalType,
        goalValue: missionData.goalValue,
        rewardXp: missionData.rewardXp,
        frequency: missionData.frequency,
      },
    });
  }
}

async function createUsers() {
  for (var i = 0; i < 5; i++) {
    const randomXp = Math.floor(Math.random() * (2000 / 10 + 1)) * 10;
    const randomStreak = Math.floor(Math.random() * 50);

    await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        username: faker.internet.username(),
        email: faker.internet.email(),
        image: faker.image.avatar(),
        totalXp: randomXp,
        streak: randomStreak,
      },
    });
  }

  const users = await prisma.user.findMany();
  const weekStart = startOfWeek(new Date());

  // Create fake leaderboard
  for (const user of users) {
    await prisma.leaderboard.create({
      data: {
        userId: user.id,
        xpEarned: user.totalXp,
        weekStart: weekStart,
      },
    });
  }
}

async function main() {
  await createTrails();
  await createMissions();
  await createUsers();
}

main()
  .catch((e) => {
    console.error(e);
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
