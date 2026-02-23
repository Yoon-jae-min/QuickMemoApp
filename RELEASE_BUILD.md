# QuickMemo — 릴리즈 APK 만들어서 핸드폰에 설치하기

실제 사용할 앱(릴리즈 버전)을 만들어서 핸드폰에 넣는 방법입니다.

---

## 1. 릴리즈용 서명 키(keystore) 만들기 (한 번만 하면 됨)

서명 키는 앱을 “이 개발자가 만든 앱”이라고 증명하는 용도입니다. **한 번 만들면 잃어버리지 말고 백업해 두세요.** 나중에 앱을 업데이트할 때 같은 키로 서명해야 합니다.

### 1-1. 키 저장 위치 정하기

예: `QuickMemo/android/app/quickmemo-release.keystore`  
(프로젝트 안에 두거나, 다른 안전한 폴더에 둬도 됩니다. 경로만 기억하면 됩니다.)

### 1-2. keytool로 keystore 생성

**Windows (CMD 또는 PowerShell):**

```cmd
cd C:\Users\androidJM\Desktop\Project\Apps\QuickMemo\android\app
keytool -genkeypair -v -storetype PKCS12 -keystore quickmemo-release.keystore -alias quickmemo -keyalg RSA -keysize 2048 -validity 10000
```

실행하면 아래 항목을 **직접 입력**합니다.

- **키스토어 비밀번호**: 원하는 비밀번호 (예: `mypassword123`) — **꼭 기억/백업**
- **이름과 성**: 본인 이름 또는 팀명
- **조직 단위**: 부서 (없으면 그냥 Enter)
- **조직**: 회사/팀 이름 (없으면 Enter)
- **구/군/시**: 지역
- **시/도**: 시/도
- **국가 코드**: KR
- **맞으면 yes 입력**

`quickmemo-release.keystore` 파일이 생성되면 1단계는 끝입니다.

---

## 2. build.gradle에 릴리즈 서명 설정하기

비밀번호를 build.gradle에 직접 쓰지 않고, `gradle.properties`에 넣는 방식을 권장합니다.

### 2-1. gradle.properties에 비밀번호 넣기

**파일 위치:** `QuickMemo/android/gradle.properties`

**맨 아래에 추가** (실제 비밀번호로 바꾸세요):

```properties
QUICKMEMO_STORE_FILE=quickmemo-release.keystore
QUICKMEMO_STORE_PASSWORD=여기에_키스토어_비밀번호
QUICKMEMO_KEY_ALIAS=quickmemo
QUICKMEMO_KEY_PASSWORD=여기에_키_비밀번호
```

- **키스토어 비밀번호**: keystore 만들 때 **맨 처음** 입력한 비밀번호.
- **키 비밀번호**: keytool에서 "Enter key password (RETURN if same as keystore password)" 나왔을 때 **엔터만 눌렀다면** 키스토어 비밀번호와 **같은 값**을 넣으면 됩니다. 따로 입력했다면 그때 쓴 비밀번호.

### 2-2. build.gradle에서 release 서명 사용하기

**파일 위치:** `QuickMemo/android/app/build.gradle`

**signingConfigs { } 안에** `debug { ... }` 다음에 **release** 블록을 추가합니다:

```groovy
signingConfigs {
    debug {
        storeFile file('debug.keystore')
        storePassword 'android'
        keyAlias 'androiddebugkey'
        keyPassword 'android'
    }
    release {
        storeFile file(QUICKMEMO_STORE_FILE)
        storePassword QUICKMEMO_STORE_PASSWORD
        keyAlias QUICKMEMO_KEY_ALIAS
        keyPassword QUICKMEMO_KEY_PASSWORD
    }
}
```

그리고 **buildTypes { } 안의 release { }** 에서 `signingConfig`를 **debug가 아니라 release**로 바꿉니다:

```groovy
release {
    signingConfig signingConfigs.release   // 여기만 release로 변경
    minifyEnabled enableProguardInReleaseBuilds
    proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
}
```

keystore 파일을 `android/app` 밑에 뒀다면 `QUICKMEMO_STORE_FILE=quickmemo-release.keystore` 만 써도 됩니다. 다른 폴더에 뒀다면 전체 경로를 넣거나, `android/app`으로 복사해 두고 이렇게 쓰면 됩니다.

---

## 3. 릴리즈 APK 빌드하기

### 3-1. 터미널에서 android 폴더로 이동

```cmd
cd C:\Users\androidJM\Desktop\Project\Apps\QuickMemo\android
```

### 3-2. 릴리즈 빌드 실행

```cmd
gradlew.bat assembleRelease
```

처음이면 의존성 다운로드 때문에 시간이 조금 걸릴 수 있습니다.

### 3-3. APK 위치

빌드가 성공하면 APK 위치는 아래와 같습니다.

```
QuickMemo\android\app\build\outputs\apk\release\app-release.apk
```

이 파일이 “실제 사용할 앱” 한 개입니다.

---

## 4. 핸드폰에 APK 설치하기

### 4-1. APK를 핸드폰으로 복사

- **USB**: 휴대폰을 PC에 연결한 뒤 `app-release.apk`를 내부 저장소(예: Download 폴더)로 복사
- **카카오톡/이메일/클라우드**: `app-release.apk`를 본인에게 보내고, 핸드폰에서 받아서 저장

### 4-2. 핸드폰에서 설치

1. 파일 관리자(또는 다운로드 앱)에서 `app-release.apk` 찾기
2. 파일 탭해서 설치 시작
3. **“알 수 없는 앱 설치”** 허용이 필요하면:  
   설정 → 보안(또는 앱) → “알 수 없는 앱 설치” 또는 “이 출처 허용” 켜기
4. 설치 완료 후 “열기” 또는 홈 화면에서 QuickMemo 실행

이후에는 일반 앱처럼 사용하면 됩니다. Metro나 PC 연결 없이도 동작합니다.

---

## 요약 체크리스트

1. [ ] `keytool`로 `quickmemo-release.keystore` 생성 (비밀번호 백업)
2. [ ] `android/gradle.properties`에 `QUICKMEMO_*` 네 개 추가
3. [ ] `android/app/build.gradle`에 `signingConfigs.release` 추가 후 `release { signingConfig signingConfigs.release }` 로 변경
4. [ ] `android` 폴더에서 `gradlew.bat assembleRelease` 실행
5. [ ] `app-release.apk`를 핸드폰으로 복사 후 설치

---

## 문제 해결

- **“Keystore was tampered with, or password was incorrect”**  
  → `gradle.properties`의 비밀번호가 keystore 만들 때 쓴 비밀번호와 같은지 확인하세요.

- **“release` signing config missing”**  
  → `signingConfigs { release { ... } }` 를 추가했는지, `buildTypes.release`에서 `signingConfig signingConfigs.release` 로 바꿨는지 확인하세요.

- **keytool을 찾을 수 없음**  
  → JDK가 설치된 경로의 `bin` 폴더가 PATH에 있어야 합니다. Android Studio에 포함된 JDK를 쓰는 경우, 보통 `C:\Program Files\Android\Android Studio\jbr\bin` 에 `keytool`이 있습니다.
