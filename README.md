# Micro-Frontend with React, Vue, Angular + OAuth Login

## 📁 Repository Structure

This system consists of **4 separate repositories**:

```
micro-frontend-ecosystem/
├── shell-app/                    # Webpack Module Federation Container + Auth
├── products-mfe-react/          # React + Webpack Module Federation
├── cart-mfe-vue/                # Vue 3 + Webpack Module Federation
└── user-mfe-angular/            # Angular + Module Federation
```

## 🏗️ Repository 1: Shell Application + Auth

**Repository Name:** `shell-app`  
**Tech:** Webpack 5 Module Federation + Google OAuth

### Directory Structure
```
shell-app/
├── public/
│   └── index.html
├── src/
│   ├── auth/
│   │   ├── authService.js
│   │   └── Login.js
│   ├── App.js
│   └── index.js
├── webpack.config.js
├── .gitignore
├── package.json
└── README.md

# Shell Application

Container application with Google OAuth authentication.

## Setup
```bash
npm install
npm start
```

## Google OAuth Setup (Optional)

1. Go to https://console.cloud.google.com/
2. Create a new project
3. Enable Google Sign-In API
4. Create OAuth 2.0 Client ID
5. Add authorized origin: http://localhost:3000
6. Copy Client ID to src/auth/authService.js (line 18)

**Note:** App works with Demo login without OAuth!

Runs on http://localhost:3000
```
