Feedback Collection System (MERN Stack)

A multi-organisation feedback collection system built with MongoDB, Express, React (Vite + Tailwind CSS + Framer Motion), and Node.js.
Features Implemented
 - On registration, a user provides their organisation name. If that organisation doesn't exist yet, it's created automatically and that user becomes **its** admin. If it already exists, the user joins it as a regular user.
 - Manage Users page (admin only) — promote a regular user to Admin, or demote an Admin back to a regular user, **scoped to their own organisation only**
- Admin Dashboard (scoped to the admin only):
  - Export all feedback as CSV

## Folder Structure
feedback-collection-system/
├── backend/     -> Express + MongoDB +Nodejs
└── frontend/    -> React app (Vite, Tailwind CSS, Framer Motion)
 
## Usage
1. Register a new account and enter your  organisation's name. The first person to register a given
   orgainsation automatically becomes that college's Admin.
2. Register/login as a normal user (same  name) to submit feedback.
3. Log in as the Admin to see that   Admin Dashboard: view stats, change feedback status,
   delete feedback, export CSV  
4. As Admin, open "Manage Users" to promote another user from your organisation to Admin (or demote one
   back). You can't change your own role from this screen, to avoid accidentally locking yourself out.

## Why there's no "select role" option on the Register form
Letting users choose their own role on the registration form would be a security flaw — anyone could
submit `role: "admin"` directly to the API and grant themselves full access. Role is decided by the
**server**, never trusted from client input:
- The first user to register a given  organisation automatically becomes the Admin.
- Every subsequent admin action (like promoting someone else) goes through backend routes protected
  by an `adminOnly` middleware AND a same-organisation check, so an admin can only manage their own space.

## Tools Used
- VS Code
- MongoDB Compass 
- Postman  
- Tailwind CSS 
- Framer Motion (animations)


 