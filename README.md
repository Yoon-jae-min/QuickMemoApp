# ⚡ QuickMemo

> **바로 켜서, 바로 적는 메모**  
> 화면을 가득 채우지 않는 팝업 메모장으로, 할 일이나 생각을 빠르게 기록하세요.

---

## 📱 소개

QuickMemo는 **전체 화면이 아닌 작은 팝업**으로 떠서, 다른 앱을 쓰다가도 잠깐 켜서 메모할 수 있는 앱입니다.

- 홈 화면이 그대로 보이는 **투명 배경** 위에 메모창만 표시됩니다.
- 팝업 **바깥을 누르면** 자동으로 임시 저장 후 앱이 종료됩니다.
- 다시 열면 **임시 저장된 내용**이 그대로 복원됩니다.

바쁠 때도 부담 없이 켜서 쓰고, 끄면 자연스럽게 사라지는 메모 경험을 목표로 했습니다.

---

## ✨ 주요 기능

| 기능 | 설명 |
|------|------|
| **팝업 메모** | 전체 화면 대신 작은 메모창만 표시. 뒤에 보이는 화면을 가리지 않습니다. |
| **저장** | 입력한 내용을 메모로 저장. 저장된 메모는 목록에서 확인할 수 있습니다. |
| **목록** | 저장된 메모를 시간순으로 보기. 삭제도 목록에서 바로 가능합니다. |
| **임시 저장** | 저장 버튼 없이 바깥을 눌러 닫아도, 그때 쓰던 내용이 자동으로 임시 저장됩니다. |
| **전체 삭제** | 저장된 메모를 한 번에 모두 삭제 (확인 후 실행). |
| **설정** | 앱 정보와 사용 방법 안내. |

---

## 🚀 설치 및 실행

### 요구 사항

- **Node.js** ≥ 20  
- **React Native** 개발 환경 (Android Studio / Xcode, JDK 등)  
- Android 에뮬레이터 또는 실기기 (USB 디버깅 또는 같은 Wi‑Fi)

### 설치

```bash
cd QuickMemo
npm install
```

### 실행

**Metro 번들러 실행 (별도 터미널)**

```bash
npm start
```

**앱 실행**

```bash
npm run android
```

실기기 USB 연결 시, 한 번 실행해 두면 좋습니다:

```bash
adb reverse tcp:8081 tcp:8081
```

---

## 📂 프로젝트 구조

```
QuickMemo/
├── App.tsx                    # 앱 진입점, 배경 터치·백/홈 시 임시 저장
├── src/
│   ├── constants/
│   │   └── index.ts           # 색상, 스토리지 키, 제한값
│   ├── utils/
│   │   └── formatDate.ts      # 상대 시간 포맷 (방금 전, n분 전 등)
│   ├── components/
│   │   ├── BottomSheet.tsx    # 공통 바텀시트 모달 (목록·설정)
│   │   ├── MemoPopup/         # 메모 입력 팝업
│   │   │   ├── index.tsx
│   │   │   └── styles.ts
│   │   ├── MemoList/          # 저장된 메모 목록
│   │   │   ├── index.tsx
│   │   │   ├── MemoListItem.tsx
│   │   │   └── styles.ts
│   │   └── Settings.tsx       # 설정 화면
│   ├── services/
│   │   └── storage.ts         # 메모·임시 저장 (AsyncStorage)
│   └── types/
│       └── index.ts           # Memo 등 타입 정의
├── android/                   # Android 네이티브 (아이콘, 테마 등)
└── package.json
```

---

## 🛠 기술 스택

- **React Native** 0.83  
- **TypeScript**  
- **AsyncStorage** — 로컬 메모·임시 저장  
- **Android** — 투명 테마, 팝업 형태 UI

---

## 📄 라이선스

Private
