# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Node.js Express backend service built with Express generator. The project serves as a backend for managing Claude Code conversation scheduling and token usage synchronization from client machines.

## Development Commands

### Start the server
```bash
npm start
```
This runs the server using `node ./bin/www` on port 3000 (configurable via PORT environment variable).

### Install dependencies
```bash
npm install
```

## Architecture

### Core Structure
- **app.js**: Main Express application setup with middleware configuration
- **bin/www**: Server startup script that creates HTTP server and handles port configuration
- **routes/**: Contains route definitions
  - `index.js`: Root route handler
  - `users.js`: User-related routes
- **public/**: Static assets (CSS, client-side JavaScript, images)

### Key Dependencies
- **Express 4.16.1**: Web framework
- **Morgan**: HTTP request logging middleware  
- **Cookie-parser**: Cookie parsing middleware
- **Debug**: Debugging utility with namespace support

### Application Flow
The application follows standard Express generator structure:
1. Server starts via `bin/www` which imports the Express app
2. `app.js` configures middleware stack and mounts route handlers
3. Routes are modularized in separate files under `routes/`
4. Static files served from `public/` directory

### Port Configuration
Server runs on port 3000 by default, configurable via `PORT` environment variable. The startup script includes proper error handling for port conflicts and permission issues.

### Current Implementation Status
The project appears to be in early development stage with basic Express scaffolding in place. Routes currently return placeholder responses and will need implementation for the Claude Code conversation scheduling and token synchronization features.