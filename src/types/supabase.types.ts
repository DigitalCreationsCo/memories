import { Album } from "./album.types"
import { MediaType } from "./media.types"
import { Project } from "./project.types"
import { User } from "./user.types"

export type Database = {
  public: {
    Tables: {
      users: {
        Row: User
      },
      projects: {
        Row: Project
      },
      albums: {
        Row: Album
      },
      media: {
        Row: MediaType
      },
    }
  }
} 