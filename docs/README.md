# 🤖 보루 디스코드 봇

리팩토링된 보루 디스코드 봇입니다.

## 📁 프로젝트 구조

```
boru-bot/
├── src/                    # 소스 코드
│   ├── commands/           # 명령어 모듈
│   │   ├── slash/         # 슬래시 명령어
│   │   │   ├── jobs/      # 직업별 명령어
│   │   │   ├── hello.js   # 인사 명령어
│   │   │   └── utilities.js # 유틸리티 명령어
│   │   └── text/          # 텍스트 명령어
│   │       ├── choose.js  # !골라줘 명령어
│   │       └── legacy.js  # 기존 명령어들
│   ├── services/          # 비즈니스 로직
│   │   ├── discordService.js
│   │   ├── googleSheetsService.js
│   │   └── httpService.js
│   ├── handlers/          # 이벤트 및 명령어 핸들링
│   │   ├── commandHandler.js
│   │   ├── messageHandler.js
│   │   └── eventHandler.js
│   ├── middlewares/       # 미들웨어
│   │   ├── cooldown.js
│   │   ├── rateLimit.js
│   │   └── validation.js
│   ├── utils/             # 유틸리티
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   └── logger.js
│   └── index.js           # 메인 진입점
├── config/                # 설정 파일
│   ├── discord.js
│   ├── google.js
│   └── server.js
├── scripts/               # 스크립트
│   └── deploy-commands.js
├── docs/                  # 문서
└── tests/                 # 테스트
```

## 🚀 실행 방법

```bash
# 개발 모드
npm run dev

# 프로덕션 모드
npm start

# 명령어 배포
npm run deploy
```

## ✨ 주요 개선사항

1. **모듈화**: 각 기능별로 파일 분리
2. **확장성**: 새로운 명령어/기능 추가 용이
3. **유지보수**: 코드 위치 파악 쉬움
4. **에러 핸들링**: 중앙화된 에러 처리
5. **로깅**: 구조화된 로깅 시스템
