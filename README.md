# Ubuntu Care - AI-Powered Healthcare Mobile App 🏥

![Ubuntu Care Banner](https://img.shields.io/badge/Hackathon-Winner-brightgreen)
![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![First Place](https://img.shields.io/badge/1st_Place-700_Teams-gold)

## 🏆 Hackathon Achievement
**First Place Winner** out of **700+ participants** at the **Momentum x Monkey & River Hackathon** Read Here for more info (https://monkeyandriver.com/event/hackathon-2025-recap/)

## 📱 About The App

Ubuntu Care is an innovative AI-powered healthcare application designed to bridge the healthcare gap for underprivileged communities. The app leverages cutting-edge technology to provide accessible medical assistance to those who need it most.

**Ubuntu Philosophy:** "I am because we are" - This app embodies the spirit of community and shared humanity in healthcare.

## ✨ Key Features

### 🩺 **AI-Powered Diagnostics**
- **Cough Detection**: Advanced AI algorithms analyze cough patterns to identify potential respiratory issues
- **Blood Pressure Monitoring**: Uses smartphone flashlight and camera to measure blood pressure non-invasively
- **Symptom Checker**: Intelligent symptom assessment and preliminary diagnosis

### 🌍 **Accessibility Features**
- **Local Language Translation**: Real-time translation of medical information into local dialects
- **Low-Data Mode**: Optimized for areas with limited internet connectivity
- **Offline Functionality**: Core features available without internet access

### 🚨 **Emergency Services**
- Emergency contact integration
- Nearest healthcare facility locator
- Quick access to telemedicine services

## 🛠️ Technical Implementation

**Note:** This repository contains **only the React Native mobile application** that I developed. The complete project with all components and backend services is available in the main repository:

**[Main Project Repository](https://github.com/ctrl-alt-explore/ubuntucare-mobileapp)**

### **My Contribution (React Native Mobile App):**
- Built the entire mobile application using React Native
- Implemented the user interface and navigation flow
- Integrated AI services for cough detection and blood pressure monitoring
- Developed the local language translation interface
- Created responsive designs for various screen sizes
- Implemented offline data storage and synchronization

### **Tech Stack (Mobile App):**
- **Framework**: React Native
- **State Management**: React Context API
- **Navigation**: React Navigation
- **Native Features**: Camera API, Flashlight Control, Audio Processing
- **Storage**: AsyncStorage for local data persistence
- **HTTP Client**: Axios for API communication

### **Full System Architecture:**
- **Backend**: Python/Flask (AI services)
- **Machine Learning**: TensorFlow/PyTorch for cough analysis
- **Database**: PostgreSQL for user data
- **Cloud Services**: AWS for deployment
- **Computer Vision**: OpenCV for blood pressure measurement

## 📲 App Screenshots

*(Screenshots would be added here)*


|  ![WhatsApp Image 2025-12-29 at 12 56 15 PM](https://github.com/user-attachments/assets/49b4648f-93cc-40c5-9f74-216f46852d05)
![WhatsApp Image 2025-12-29 at 12 56 17 PM](https://github.com/user-attachments/assets/606eaf3a-6e6b-4833-8d7a-93ae2c5d5629) ![WhatsApp Image 2025-12-29 at 12 56 15 PM](https://github.com/user-attachments/assets/902392ab-617b-4835-9104-11a1bee41e4c) ![WhatsApp Image 2025-12-29 at 12 56 16 PM](https://github.com/user-attachments/assets/5809924a-9f70-4b3c-bcdb-d5a3f2320aae) ![WhatsApp Image 2025-12-29 at 12 56 16 PM (1)](https://github.com/user-attachments/assets/1109f65e-a4d6-44f1-9afc-35b73891820c) ![WhatsApp Image 2025-12-29 at 12 56 17 PM](https://github.com/user-attachments/assets/72e89252-8381-400d-9083-c80c8a5936ef) ![WhatsApp Image 2025-12-29 at 12 56 18 PM](https://github.com/user-attachments/assets/849e87b9-8e05-4992-851b-7f85f1b4be67)







## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- React Native CLI or Expo CLI
- Android Studio / Xcode (for emulators)
- Git

### Installation Steps

```bash
# Clone the repository
git clone https://github.com/your-username/ubuntu-care-mobile.git

# Navigate to project directory
cd ubuntu-care-mobile

# Install dependencies
npm install

# For iOS (Mac only)
cd ios && pod install && cd ..

# Run the app
npx react-native run-android
# or
npx react-native run-ios
```

### Environment Setup
Create a `.env` file in the root directory:
```env
API_BASE_URL=your_api_endpoint
TRANSLATION_API_KEY=your_translation_key
AI_SERVICE_ENDPOINT=your_ai_service_url
```

## 🏗️ Project Structure

```
ubuntu-care-mobile/
├── src/
│   ├── components/     # Reusable UI components
│   ├── screens/        # App screens
│   ├── navigation/     # Navigation configuration
│   ├── services/       # API and external services
│   ├── utils/          # Helper functions
│   └── assets/         # Images, fonts, etc.
```

## 🤝 Team Collaboration

This project was developed by an interdisciplinary team of 5 members:

1. **Shawn Chareka** (Me) - Mobile App Development (React Native)
2. **View sakhileln's**  - Backend (Java)
3. **Nqobile Nkiwane** -  AI translation services (Javascript)
4. **Twarisani_Nxumalo** - Machine Learning Models (Python)
5. **Tshegofatso Mkhabela** - UI/UX Design & Research 

### **Complete Project Repository:**
All components of Ubuntu Care (backend, AI models, web dashboard) are available in our main repository:
🔗 **[https://github.com/ctrl-alt-explore/ubuntucare-mobileapp](https://github.com/ctrl-alt-explore/ubuntucare-mobileapp)**

## 🎯 Future Enhancements

1. **Telemedicine Integration**: Video consultations with healthcare professionals
2. **Medication Tracker**: Smart reminders and adherence monitoring
3. **Community Health**: Local health alerts and community support features
4. **Wearable Integration**: Connect with fitness trackers and smart watches
5. **Expanded Language Support**: More regional dialects and languages

## 📚 Learnings & Challenges

### **Technical Challenges Overcome:**
- Implementing real-time audio processing for cough analysis
- Creating accurate blood pressure measurement using only smartphone hardware
- Building a responsive UI that works on low-end devices
- Managing offline data synchronization in areas with poor connectivity

### **Key Takeaways:**
- Importance of user-centered design in healthcare applications
- Balancing technical complexity with user simplicity
- The power of AI in democratizing healthcare access
- Team collaboration across different technical domains

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Momentum x Monkey & River Hackathon** organizers
- **Our mentors** for guidance throughout the hackathon
- **The Ubuntu philosophy** that inspired our approach to inclusive healthcare
- **All 700+ participants** who made the hackathon a great learning experience

---

**Built with ❤️ for communities in need | First Place Winner 🏆**

*"Healthcare is a human right, not a privilege"*
