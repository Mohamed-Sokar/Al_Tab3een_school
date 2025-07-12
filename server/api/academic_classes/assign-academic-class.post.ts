import { defineEventHandler, readBody, createError } from "h3";
import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);
  const body: AssignAcademicClassBody = await readBody(event);
  const classesData: any[] = [];

  interface AssignAcademicClassBody {
    academicClassesIds: number[];
    teacherId: string;
  }

  const { academicClassesIds, teacherId } = body;

  if (!Array.isArray(academicClassesIds) || !teacherId) {
    throw createError({
      statusCode: 400,
      message: "academicClassesIds array and teacherId are required",
    });
  }

  for (const classId of academicClassesIds) {
    const { error, data } = await client
      .from("teachers_academic_classes")
      .insert({
        teacher_id: teacherId,
        academic_class_id: classId,
      })
      .select();
    classesData.push(data);

    if (error) {
      throw createError({ statusCode: 500, message: error.message });
    }
  }

  return classesData;
});
