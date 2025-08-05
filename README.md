#  SpamApp

A mobile application built with **React Native (TypeScript)** for detecting and handling spam messages , Spam Linksand Fraud Payments. This app integrates **4 AI-powered models** deployed on **Microsoft Azure** for enhanced spam detection, classification, and response handling.

---

##  Features

-  Detect spam messages in real-time.
-  Scan and classify messages using AI.
-  Block spam numbers or alert the user.
-  Backend AI model APIs hosted on Microsoft Azure.
-  4 integrated AI models:
  1. Spam classification
  2. Link phishing detection
  3. Fraud Payment detection

---

##  Tech Stack

| Layer            | Tech                      |
|------------------|---------------------------|
| Frontend         | React Native, TypeScript  |
| Backend APIs     | Python-based AI Models (hosted on Azure) |
| State Management | React Context API         |
| Styling          | Native components         |
| Build Tool       | Metro bundler             |
| Testing          | Jest                      |

---

##  Project Structure

```
SPAMAPP/
├── android/            # Android native code
├── ios/                # iOS native code
├── src/
│   ├── assets/         # Fonts, images, etc.
│   ├── components/     # Reusable UI components
│   ├── context/        # Global state management
│   ├── screens/        # Application screens
│   ├── services/       # API service logic
│   ├── utils/          # Helper functions
│   └── types/          # TypeScript types/interfaces
├── __tests__/          # Unit tests
├── App.tsx             # Main App entry point
├── index.js            # App bootstrap
```

---

##  Setup & Installation

### 1. Prerequisites

- Node.js >= 16.x
- Yarn or npm
- Android Studio / Xcode
- React Native CLI
- Azure APIs setup and accessible

### 2. Clone Repository

```bash
git clone https://github.com/a-sksingh113/Spam-_Detector_App.git
cd spamapp
```

### 3. Install Dependencies

```bash
npm install
# or
yarn install
```

### 4. Configure `.env` File

Create a `.env` file at the root with your Azure API endpoints:

```env
SPAM_CLASSIFIER_API=your deployed api
Spam_Links_DETECTOR_API=your deployed api
Banksim_Dataset_Model=your deployed api
Ulb_Dataset_Model=your deployed api
```

### 5. Run the App

```bash
# Android
npx react-native run-android

# iOS
npx react-native run-ios
```

---

##  Azure AI Model APIs

| Model                |                             | Function |
|---------------------|---------------------------------------------|----------|
| Spam Classifier     |                         | Classify message as spam/ham |
| Phishing Detector   |                         | Classify Spam Links|
| Fraud_Payment_Detection_from _Banksim_dataset |                    | Detect Fraudulent transactions from Banksim dataset |
| Fraud_Payment_Detection_from_Ulb_Dataset |                       | Detect Fraudulent transactions from Ulb dataset |

Each API receives a `POST` request with message content and returns a prediction with confidence.

---

##  Running Tests

```bash
npm test
# or
yarn test
```

---

##  Build & Release

```bash
# Android
cd android
./gradlew assembleRelease

# iOS
npx react-native run-ios --configuration Release
```

---

##  Tools & Configs

- `babel.config.js` – Babel setup for React Native
- `.eslintrc.js` – Linting rules
- `.prettierrc.js` – Prettier formatting
- `tsconfig.json` – TypeScript settings
- `metro.config.js` – Custom bundler config

---

##  Author

**Satish Kumar Singh**  
[LinkedIn](https://www.linkedin.com/in/satish-singh-8b1786273) | [GitHub](https://github.com/a-sksingh113)

---

##  License

This project is licensed under the MIT License.