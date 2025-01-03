import { createProject, getProject } from "@/db/queries/project";
import { createUser, getUserByEmail } from "@/db/queries/user";
import { hashPassword } from "@/utils/utils";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const { name, email, password, project } = await req.json()

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return NextResponse.json(
      { error: 'An user with this email already exists or the email was invalid.' }, 
      { status: 400 }
    );
  }

  // Create a new team
  if (project) {

    const nameCollisions = await getProject(project);

    if (nameCollisions) {
      return NextResponse.json(
        { error: 'A project with this name already exists in our database.' },
        { status: 400 }
      );
    }
  }

  const user = await createUser({
    name,
    email,
    password: await hashPassword(password),
  });

  if (project) {

    await createProject({
      user_id: user.id,
      name: project,
    });

    // await sendWelcomeEmail(name, email, project);
  }

  return NextResponse.json(user,{ status: 201 });
};