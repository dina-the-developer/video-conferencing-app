# Video Conferencing App like Zoom
Developing enterprise-ready video conferencing app using Next.js, Stream API, and Tailwind CSS. For the authentication I am using custom API using 
Express.js with MongoDB. 

## Table of Contents
 1. Introduction
 2. Tech Stack
 3. Features
 4. Quick Start
 5. Assets
 6. More

## Introduction

Built with latest Next.js and TypeScript, this project is a something similar to Zoom Video Conferencing application. It enables the user to securely login, create, schedule and record meetings. Also, helps user to manage participants and share screen with them. 

If you using this code for your test project or trying to understand it. Please let me know if you need any help regarding this. I'll try my best to help you!

## Tech Stack 
- Next.js
- TypeScript
- Authentication API using Express.js, JWT with MongoDB.
- Shadcn UI components
- Stream.io API for streaming audio and video
- Tailwind CSS


## Features

- Authentication: Implements authentication and authorization features using custom authentication Express.js API, allowing users to securely log in via email and password method, while ensuring appropriate access levels and permissions within the platform.

- New Meeting: Quickly start a new meeting, configuring camera and microphone settings before joining.

- Meeting Controls: Participants have full control over meeting aspects, including recording, emoji reactions, screen sharing, muting/unmuting, sound adjustments, grid layout, participant list view, and individual participant management (pinning, muting, unmuting, blocking, allowing video share).

- Exit Meeting: Participants can leave a meeting, or creators can end it for all attendees.

- Schedule Future Meetings: Input meeting details (date, time) to schedule future meetings, accessible on the 'Upcoming Meetings' page for sharing the link or immediate start.

- Past Meetings List: Access a list of previously held meetings, including details and metadata.

- View Recorded Meetings: Access recordings of past meetings for review or reference.

- Personal Room: Users have a personal room with a unique meeting link for instant meetings, shareable with others.

- Join Meetings via Link: Easily join meetings created by others by providing a link.

- Secure Real-time Functionality: All interactions within the platform are secure and occur in real-time, maintaining user privacy and data integrity.

- Responsive Design: Follows responsive design principles to ensure optimal user experience across devices, adapting seamlessly to different screen sizes and resolutions.

and many more, including code architecture and reusability.

url: https://video-conferencing-app-peach.vercel.app

## Authentication

API for handling user authentication using secure Node.js and MongoDB backend with JWT Authentication and Authorization.

Codebase for the authentication api available here - https://github.com/dina-the-developer/authentication

### API Tech stack
- Node.js
- Express.js
- JWT Token
- MongoDB

API endpoint - <a href="https://authentication-pi-sand.vercel.app/" target="_blank">https://authentication-pi-sand.vercel.app/</a>

## Quick Start

Follow these steps to set up the project locally on your machine.

<b>Prerequisites</b>

Make sure you have the following installed on your machine:

<a href="https://git-scm.com/" target="_blank">Git</a>
<a href="https://nodejs.org/en" target="_blank">Node.js</a>
<a href="https://www.npmjs.com/" target="_blank">npm</a> (Node Package Manager)

<b>Cloning the Repository</b>

`git clone https://github.com/adrianhajdin/zoom-clone.git`
`cd zoom-clone`

<b>Installation</b>

Install the project dependencies using npm:

`npm install`

<b>Set Up Environment Variables</b>

Create a new file named .env in the root of your project and add the following content:

`
NEXT_PUBLIC_STREAM_API_KEY=
STREAM_API_SECRET=
COOKIE_SECRET=
`

Replace the placeholder values with your actual Clerk & getstream credentials. You can obtain these credentials by signing up on the Clerk website and <a href="getstream.io" target="_blank">getstream</a> website

<b>Running the Project</b>

`npm run dev`

Open http://localhost:3000 in your browser to view the project.


Demo Credentials:
 Username: test@test.com
 password: test@123

Hope you enjoy this web app. Please let me know if you have any questions or suggestions!!!

