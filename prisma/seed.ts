import { PrismaClient, QuestionType } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

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

const trailsData: Trail[] = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "trails.json"), "utf-8")
);

async function main() {
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

main()
  .catch((e) => {
    console.error(e);
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
