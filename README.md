# 보루 Discord Bot

Discord.js v14를 사용한 간단한 한국어 Discord 봇입니다.

## 기능

- `!안녕` - 봇이 인사합니다
- `!명령어` - 사용 가능한 명령어 목록을 보여줍니다
- `!핑` - 봇의 레이턴시를 확인합니다

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

### 3. 로컬 실행

```bash
# 의존성 설치
npm install

# 환경변수 설정
cp .env.example .env
# .env 파일에서 DISCORD_TOKEN을 실제 토큰으로 수정

# 개발 모드 실행
npm run dev

# 프로덕션 모드 실행
npm start
```

### 4. Render에 배포

1. GitHub에 코드 푸시
2. [Render](https://render.com) 계정 생성
3. "New" > "Web Service" 선택
4. GitHub 저장소 연결
5. 환경변수 설정:
   - `DISCORD_TOKEN`: Discord 봇 토큰
6. "Create Web Service" 클릭

## 프로젝트 구조

```
boru-bot/
├── index.js          # 메인 봇 파일
├── package.json      # 프로젝트 설정
├── render.yaml       # Render 배포 설정
├── .env.example      # 환경변수 예시
├── .gitignore        # Git 무시 파일
└── README.md         # 프로젝트 문서
```

## 환경변수

- `DISCORD_TOKEN`: Discord 봇 토큰 (필수)
- `PORT`: HTTP 서버 포트 (기본값: 3000)

## 기술 스택

- Node.js
- Discord.js v14
- Express.js
- dotenv