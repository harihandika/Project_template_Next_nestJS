Project Structure:

/frontend

- Next.js app
- app/
- components/
- features/

/backend

- NestJS app
- src/
  - modules/
  - common/
  - config/

/prisma

- schema.prisma

/docs for notes if needed

Rules:

- Frontend dan backend dipisah
- Gunakan REST API dari NestJS
- Business logic hanya di backend
- Frontend hanya untuk UI & state
- Gunakan modular architecture di NestJS
- Use DTOs, services, controllers, guards, and strategies in backend
- Keep code clean and reusable
