# Splitwise MERN app - setup

## Important security step

The previously uploaded ZIP contained a populated backend `.env` file. Treat those credentials as exposed. Before running this project, rotate the MongoDB database user's password in MongoDB Atlas and create a new long random JWT secret. Do not reuse the exposed values.

## Backend

1. Open a terminal in `backend`.
2. Run `npm install`.
3. Copy `.env.example` to `.env`.
4. Set your own values in `backend/.env`:

   ```env
   PORT=5000
   MONGO_URI=your_new_mongodb_connection_string
   JWT_SECRET=your_new_long_random_secret
   ```

5. Run `npm run dev`.

The backend should be available at `http://localhost:5000`.

## Frontend

1. Open a second terminal in `frontend`.
2. Run `npm install`.
3. Optional: copy `.env.example` to `.env` and set `VITE_API_URL=http://localhost:5000`.
4. Run `npm run dev`.

Open the Vite URL printed in the terminal (usually `http://localhost:5173`).

## What's connected

- Register and login call `/api/auth/register` and `/api/auth/login`.
- The JWT is stored in browser localStorage and sent as a Bearer token for protected requests.
- Dashboard and Group load the signed-in user's group through `GET /api/group`.
- Group changes are saved to MongoDB through `PUT /api/group`.
- The backend stores one group per user account for this single-group version.
- Existing browser data under `splitwise_group_data` is imported into the first account that opens the Group page if that account has no saved group yet.

This version intentionally does not implement shared-group invitations or multiple group membership.
