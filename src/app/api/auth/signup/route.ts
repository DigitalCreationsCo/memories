import { createProject, getProject } from "@/db/queries/project";
import { createUser, getUserByEmail } from "@/db/queries/user";
import { hashPassword } from "@/utils/utils";
import { NextApiRequest, NextApiResponse } from "next";

export const POST = async (req: NextApiRequest, res: NextApiResponse) => {
  const { name, email, password, project } = req.body;

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return res.status(400).json({
      error: {
        message:
          'An user with this email already exists or the email was invalid.',
      },
    });
  }

  // Create a new team
  if (project) {

    const nameCollisions = await getProject(project);

    if (nameCollisions) {
      return res.status(400).json({
        error: {
          message: 'A project with this name already exists in our database.',
        },
      });
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

  return res.status(201).json({ data: user });
};