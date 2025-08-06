# Google Sheets 연동 설정 가이드

## 1. Google Cloud Console 설정

### Google Cloud 프로젝트 생성

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. Google Sheets API 활성화
   - API 및 서비스 > 라이브러리 > "Google Sheets API" 검색 > 사용 설정

### 서비스 계정 생성

1. IAM 및 관리 > 서비스 계정 > 서비스 계정 만들기
2. 서비스 계정 이름 입력 (예: `boru-bot-sheets`)
3. 역할은 선택하지 않고 완료
4. 생성된 서비스 계정 클릭 > 키 탭 > 키 추가 > JSON 키 다운로드

## 2. Google Sheets 설정

### 스프레드시트 생성

1. [Google Sheets](https://sheets.google.com) 에서 새 스프레드시트 생성
2. 스프레드시트 URL에서 ID 복사 (예: `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`)

### 시트 구조 설정

각 직업별로 새 시트를 생성하고 다음과 같은 구조로 설정:

**픽토맨서 시트:**

```
A열: 타입    | B열: 링크명  | C열: URL
최종        | 최종         | https://xivgear.app/?page=sl%7Cc48f85d8-9b93-4f96-bfc4-1e0e30e98a8c
PROG       | PROG        | https://xivgear.app/?page=sl%7Cd968ecc8-019a-4ea4-976e-083f0b8b8df3
절 에덴     | 절 에덴      | https://xivgear.app/?page=sl%7C6e51083b-3b75-4236-9036-c992ab490368
```

**암흑기사 시트:**

```
A열: 타입      | B열: 링크명        | C열: URL
BiS 2.50     | BiS 2.50         | https://xivgear.app/?page=bis|drk|current&onlySetIndex=0
BiS 2.46     | BiS 2.46         | https://xivgear.app/?page=bis|drk|current&onlySetIndex=1
PROG         | Prog 2.50        | https://xivgear.app/?page=bis|drk|prog&onlySetIndex=0
```

**무도가 시트:**

```
A열: 타입    | B열: 링크명  | C열: URL
최종        | 최종         | https://bit.ly/7-20-DNC-Bis
절 에덴     | 절 에덴      | https://xivgear.app/?page=sl|744768db-304a-4003-8bec-9592902c242d
```

### 공유 설정

1. 스프레드시트 우상단 "공유" 버튼 클릭
2. 서비스 계정 이메일 주소 추가 (JSON 키 파일의 `client_email` 값)
3. 권한을 "뷰어"로 설정

## 3. 환경 변수 설정

`.env` 파일을 생성하고 다음 값들을 설정:

```env
# Discord Bot Token
DISCORD_TOKEN=your_discord_bot_token_here

# Google Sheets API 설정
GOOGLE_SHEET_ID=your_google_sheet_id_here
GOOGLE_PROJECT_ID=your_google_project_id
GOOGLE_PRIVATE_KEY_ID=your_private_key_id
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key_content_here\n-----END PRIVATE KEY-----"
GOOGLE_CLIENT_EMAIL=your_service_account_email@your_project.iam.gserviceaccount.com
GOOGLE_CLIENT_ID=your_client_id
```

### JSON 키 파일에서 값 찾기

다운로드한 JSON 키 파일에서 다음 값들을 복사:

- `project_id` → `GOOGLE_PROJECT_ID`
- `private_key_id` → `GOOGLE_PRIVATE_KEY_ID`
- `private_key` → `GOOGLE_PRIVATE_KEY` (따옴표 포함)
- `client_email` → `GOOGLE_CLIENT_EMAIL`
- `client_id` → `GOOGLE_CLIENT_ID`

## 4. 봇 실행

```bash
npm start
```

## 5. 새 직업 추가하기

1. 스프레드시트에 새 시트 생성 (직업명으로 명명)
2. A, B, C 열에 타입, 링크명, URL 형식으로 데이터 입력
3. Discord 봇 코드에서 해당 직업 명령어 추가
4. 봇 재시작

이제 스프레드시트의 내용을 수정하면 봇의 응답도 자동으로 업데이트됩니다!
