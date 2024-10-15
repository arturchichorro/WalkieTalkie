# Walkie-Talkie App

This project is a walkie-talkie app built in just one day for a job interview. Here's the challenge I got:

> Your challenge is to design and build a walkie talkie solution, leveraging your strengths
and demonstrating your creativity. The assignment is intentionally open-ended to allow
you to take the initiative and show us how you shine in your area of expertise.

The app allows users to communicate via audio, simulating a traditional walkie-talkie experience. 

Check out the demo video: 
[Walkie-Talkie Demo](https://www.youtube.com/watch?v=341omJyjMc8)
Also if you want, check out the [blog post](https://bolota.eu/posts/11_walkietalkie) I wrote about this project.

## Tech Stack
- **Frontend**: React Native and Expo for building a mobile-friendly interface.
- **Backend**: Express.js and Socket.io for handling real-time communication.

## To-Do List
- **Audio Transmission**: Implement audio to be broadcast to all devices in realtime while the person is speaking (currently not fully real-time, as the audio is only sent when recording ends).
- **Multiple Channels**: Introduce different channels, similar to how walkie-talkies use various frequencies.
- **Button Interaction**: Fix issues with the hold button, which can bug out if the click is too fast.
- **Speaker Identification**: Add a way to identify who is speaking during conversations.
- **Mobile Widget**: Create a widget for quick access on mobile devices.

## Running the App Locally
To run the Walkie-Talkie App on your local machine:

1. Clone this repository.
2. To use the server, navigate to the server directory, install dependencies, and start the server:
```bash
cd server
npm install
npm start
```
3. To start the frontend, navigate to the client directory, install dependencies, and start the app:
```bash
cd client
npm install
npm start
```
4. Press 'w' to use it in web, and use the Expo Go app to scan the QR code to use it on your phone.