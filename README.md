# 보루 Discord Bot

TypeScript와 Discord.js v14를 사용한 한국어 Discord 봇입니다.

## 기능

### 기본 명령어

- `!안녕` - 봇이 인사합니다
- `!명령어` - 사용 가능한 명령어 목록을 보여줍니다
- `!핑` - 봇의 레이턴시를 확인합니다

### 슬래시 명령어

- `/안녕` - 봇이 인사합니다
- `/명령어` - 명령어 목록 확인
- `/핑` - 핑 확인
- `/픽토맨서` - 픽토맨서 7.2 BIS 정보
- `/암흑기사` - 암흑기사 7.2 Gearsets 정보
- `/무도가` - 무도가 7.2 BIS 정보

### Google Sheets 연동

- 스프레드시트에서 직업별 장비 정보를 동적으로 불러옴
- 스프레드시트 수정 시 봇 응답 자동 업데이트

## 설정 방법

### 1. Discord Bot 생성

1. [Discord Developer Portal](https://discord.com/developers/applications)에 접속
2. "New Application" 클릭하여 새 애플리케이션 생성
3. 왼쪽 메뉴에서 "Bot" 선택
4. "Add Bot" 클릭
5. "Token" 섹션에서 "Copy" 클릭하여 토큰 복사

### 2. 봇 권한 설정

1. 왼쪽 메뉴에서 "OAuth2" > "URL Generator" 선택
2. Scopes에서 "bot" 선택
3. Bot Permissions에서 다음 권한들 선택:
   - Send Messages
   - Read Message History
   - Use Slash Commands
4. 생성된 URL로 봇을 서버에 초대

### 3. Google Sheets 연동 설정 (선택사항)

Google Sheets에서 동적으로 정보를 불러오려면:

1. [google-sheets-setup.md](./google-sheets-setup.md) 가이드 참조
2. Google Cloud Console에서 서비스 계정 생성
3. Google Sheets API 활성화
4. 스프레드시트 생성 및 권한 설정
5. .env 파일에 Google API 키 정보 추가

### 4. 로컬 실행

```bash
# 의존성 설치
npm install

# 환경변수 설정
# .env 파일을 생성하고 필요한 환경변수들을 설정

# TypeScript 타입 체크
npm run type-check

# TypeScript 빌드
npm run build

# 슬래시 명령어 등록
npm run deploy

# 개발 모드 실행 (TypeScript 직접 실행)
npm run dev

# 개발 모드 실행 (파일 변경 감지)
npm run dev:watch

# 프로덕션 모드 실행 (빌드 후 실행)
npm start
```

### 5. Render에 배포

1. GitHub에 코드 푸시
2. [Render](https://render.com) 계정 생성
3. "New" > "Web Service" 선택
4. GitHub 저장소 연결
5. 환경변수 설정:
   - `DISCORD_TOKEN`: Discord 봇 토큰
   - Google Sheets 연동을 사용하는 경우 추가 환경변수:
     - `GOOGLE_SHEET_ID`
     - `GOOGLE_PROJECT_ID`
     - `GOOGLE_PRIVATE_KEY_ID`
     - `GOOGLE_PRIVATE_KEY`
     - `GOOGLE_CLIENT_EMAIL`
     - `GOOGLE_CLIENT_ID`
6. "Create Web Service" 클릭

## 프로젝트 구조

```
boru-bot/
├── index.ts                   # 메인 진입점
├── src/                       # 소스 코드
│   ├── index.ts              # 메인 봇 파일
│   ├── services/             # 서비스 계층
│   │   ├── discordService.ts
│   │   ├── googleSheetsService.ts
│   │   └── httpService.ts
│   ├── handlers/             # 이벤트 핸들러
│   │   ├── commandHandler.ts
│   │   ├── eventHandler.ts
│   │   └── messageHandler.ts
│   ├── commands/             # 명령어
│   │   ├── slash/           # 슬래시 명령어
│   │   └── text/            # 텍스트 명령어
│   ├── middlewares/          # 미들웨어
│   │   ├── cooldown.ts
│   │   ├── rateLimit.ts
│   │   └── validation.ts
│   └── utils/               # 유틸리티
│       ├── constants.ts
│       ├── helpers.ts
│       └── logger.ts
├── config/                   # 설정 파일
│   ├── discord.ts
│   ├── google.ts
│   └── server.ts
├── scripts/                  # 스크립트
│   └── deploy-commands.ts   # 슬래시 명령어 등록
├── dist/                     # 빌드 출력 (생성됨)
├── tsconfig.json            # TypeScript 설정
├── package.json             # 프로젝트 설정
├── render.yaml              # Render 배포 설정
└── README.md                # 프로젝트 문서
```

## 환경변수

### 필수 환경변수

- `DISCORD_TOKEN`: Discord 봇 토큰

### 선택적 환경변수 (Google Sheets 연동)

- `GOOGLE_SHEET_ID`: Google 스프레드시트 ID
- `GOOGLE_PROJECT_ID`: Google Cloud 프로젝트 ID
- `GOOGLE_PRIVATE_KEY_ID`: 서비스 계정 Private Key ID
- `GOOGLE_PRIVATE_KEY`: 서비스 계정 Private Key
- `GOOGLE_CLIENT_EMAIL`: 서비스 계정 이메일
- `GOOGLE_CLIENT_ID`: 서비스 계정 Client ID

### 기타

- `PORT`: HTTP 서버 포트 (기본값: 3000)

## 기술 스택

- **TypeScript** - 타입 안전성과 개발자 경험 향상
- **Node.js** - 런타임 환경
- **Discord.js v14** - Discord API 래퍼
- **Express.js** - HTTP 서버
- **dotenv** - 환경변수 관리
- **googleapis** - Google Sheets API
- **express-rate-limit** - 요청 제한
- **ts-node** - TypeScript 직접 실행
- **nodemon** - 개발 시 자동 재시작

## TypeScript 변환 이점

- **타입 안전성**: 컴파일 타임에 타입 에러 검출
- **IDE 지원**: 자동완성, 리팩토링, 네비게이션 개선
- **코드 품질**: 인터페이스와 타입 정의로 코드 구조 명확화
- **유지보수성**: 대규모 코드베이스에서 안전한 리팩토링
- **개발 생산성**: 타입 추론과 IntelliSense로 개발 속도 향상
